
import { ThisReceiver } from "@angular/compiler";
import { TimeTester } from "./TimeTester";

//NOTE caching mechanisms dont apply to workers since they are
// instanciated on message
//UPDATE: well it can be done if we externalize the count per product cache
// although we still need to compute it again if there is a change in product
// so now it can be given a cache from instantiation or use the cache of the previous computation
export class ProductCombinationsManager {

  // This one is to optimize count combination since a lot of products share the same combination count
  // and computing the combination count for 2000 product occasionally takes up to 500ms
  combinationCountCache;
  products;
  productsWithCorrectedFacets;
  countperproductcache;
  totalcache;
  correctedSubcategories;
  correctedFacets;
  randomId;

  constructor(products, countPerProductCache = null, productsWithCorrectedFacets = null) {
    this.combinationCountCache = new Array(6).fill({}).map((x) => new Map<number, number>());
    this.products = products;
    this.countperproductcache = countPerProductCache;
    this.totalcache = 0;
    this.correctedSubcategories = false;
    this.correctedFacets = false;
    this.productsWithCorrectedFacets = productsWithCorrectedFacets;
    if (this.productsWithCorrectedFacets != null) this.correctedFacets = true;
    this.randomId = Math.floor(Math.random() * 1000);
  }

  getOriginalProducts() {
    return this.products;
  }

  getProductsWithCorrectedFacets() {
    return this.productsWithCorrectedFacets;
  }

  getCountPerProductCache() {
    return this.countperproductcache;
  }

  isProductsCached(products) {
    return this.products === products;
  }

  /* Source and docs: https://github.com/jsantirso/js-combinatorics
  * modified to return combinations like  [0,1,4] ...
  * length : length of the array to compute combinations for
  * process : callback for each possible combination (arg: the current combination), return false to stop
  * minCombLen : minimum combination length
  * maxCombLen : maximum combination length
  */
  processCombinations(length, process, minCombLen, maxCombLen) {
    var array = new Array(length).fill(0).map((_, k) => k);
    minCombLen = minCombLen;
    maxCombLen = maxCombLen || array.length;
    var arrayLen = array.length;
    for (var combLen = minCombLen; combLen <= maxCombLen; combLen++) {
      var pointers = [];
      for (var i = 0; i < combLen; i++) pointers.push(i);
      var finished = false;
      while (!finished) {
        var combination = [];
        for (var i = 0; i < combLen; i++) combination.push(array[pointers[i]]);
        if (process(combination) === false) return;
        if (combLen == 0) break; // first element
        for (var pointer = combLen - 1; pointer >= 0; pointer--) {
          if (pointers[pointer] < arrayLen - (combLen - pointer)) {
            pointers[pointer] += 1;
            for (var fixPointer = pointer + 1, i = 1; fixPointer < combLen; fixPointer++, i++) {
              pointers[fixPointer] = pointers[pointer] + i;
            }
            break;
          } else {
            if (!pointer) finished = true;
          }
        }
      }
    }
  }

  countFacets(product) {
    let facets = Object.keys(product).filter((x) => x && x.startsWith("Facet") && x.endsWith("Value") && product[x]);
    return facets.length;
  }

  // Source: https://gist.github.com/elquimista/df8b245eaf0ae50a0685a0451b1524f5
  // modified for cache
  countCombinations(m, n) {
    if (this.combinationCountCache[n].has(m)) {
      return this.combinationCountCache[n].get(m);
    }
    if (m < n) {
      return 0;
    } else if (m === n || n === 0) {
      return 1;
    } else {
      var c = 1, i;
      for (i = n + 1; i <= m; i++) {
        c *= i;
      }
      for (i = 2; i <= m - n; i++) {
        c /= i;
      }
      this.combinationCountCache[n].set(m, c);
      return c;
    }
  }

  countProductCombinations(product, minlength = 0, maxlength = 5) {
    let facetCount = this.countFacets(product);
    let categoriesCount = this.getAvailableCategoryFields(product).length;
    let count = 0;
    for (let i = minlength; i <= maxlength && i <= facetCount; i++) {
      count += this.countCombinations(facetCount, i);
    }
    return count * categoriesCount;
  }

  // basic query string
  countProductCombinationsQuery(product, query, minlength = 0, maxlength = 5) {
    // okay gotta find a workaround for this cause it is a bit slow
    if (!JSON.stringify(product).toLowerCase().includes(query)) return 0;
    let facetCount = this.countFacets(product);

    let categoriesCount = this.getAvailableCategoryFields(product).length;
    let count = 0;
    for (let i = minlength; i <= maxlength && i <= facetCount; i++) {
      count += this.countCombinations(facetCount, i);
    }
    return count * categoriesCount;
  }

  // the query should be lower case in the calling function , small performance gain for lots of data
  facetCombinationsNotConcernedByQuery(product, lowerCaseQuery) {
    let facets = Object.keys(product).filter((x) => x && x.startsWith("Facet") && x.endsWith("Value") && product[x] && !product[x].toLowerCase().includes(lowerCaseQuery) && !lowerCaseQuery.includes(product[x].toLowerCase()));
    return facets;
  }

  // This is the function you want to call to get the inferlist for the list of products
  getPaginatedProductsCombinations(page = 0, perPage = 10) {
    let offset = perPage * page;
    //console.log("perpage2=", perPage)
    //console.log("page2=", page)
    //console.log("offset=", offset)
    return this.getProductsCombinations(perPage, offset);
  }

  // this function is kept separate from the paginated because the page conversion cannot handle taking all the combinations at once (count = -1)
  // there are other ways that slightly differ from this of implementing the paginated combination generation (like computing the categories and all beforehand)
  // but this one is by far the easiest to read, understand and modify
  // this algorithm can be optimized in some ways (at the cost of readability, and the performance difference is not that great )
  // EDIT : testing with  ~2200 products and 45 Facets, correcting subcategories, and facets take about 100ms each
  // while counting combinations take up to half a second which makes the UI hang there
  // to fix it combinations count will have a cache
  // and to fix thee UI freezing there either we will use a webworker,  or chunk the operations in chained promises allowing the UI refresh calls to stack in between

  getProductsCombinations(count = -1, offset = 0): any {
    // return [].concat(...products.map((product) => this.getCombinations(product,count,offset)));

    let products = this.products;

    //TIMER
    let timeTester = new TimeTester("Products Combinations");
    timeTester.start();

    if (products.length == 0) return [];

    timeTester.mark("Begin correctSubcategory");

    // Correct the products subcategories
    // this was not cached like the facets were because it doesnt take a lot of time
    // but if there are a lots of categories, or data , or data and categories then it is advisable to implement the same cache mechanics as with the facets
    if (!this.correctedSubcategories) {

      products = products.map((x) => this.correctSubcategory(x))
    }
    this.correctedSubcategories = true;

    timeTester.mark("End correctSubcategory");

    timeTester.mark("Begin correctFacets");
    //console.log({ correctedFacets: this.correctedFacets, pwcf: this.productsWithCorrectedFacets })
    if (!this.correctedFacets) {
      products = products.map((x) => this.correctFacets(x));
      this.productsWithCorrectedFacets = products;
    }
    this.correctedFacets = true;
    timeTester.mark("End correctFacets");

    // we reassign it back in case there were already facet corrected products
    products = this.productsWithCorrectedFacets;

    timeTester.mark("Begin count combinations");


    // EDIT: add caching mechanism for countproductcombinations for products
    let countperproduct = [];
    let total = 0;

    if (this.countperproductcache == null) {

      for (let [index, product] of products.entries()) {
        let currentcount = this.countProductCombinations(product);
        let lastcount = 0;
        if (index > 0) lastcount = countperproduct[index - 1].cumulativecount;
        countperproduct.push({ product, count: currentcount, cumulativecount: currentcount + lastcount });
        total += currentcount;
      }
      this.countperproductcache = countperproduct;
      this.totalcache = total;
    } else {
      countperproduct = this.countperproductcache;
      total = this.totalcache;
    }
    timeTester.mark("End count combinations");



    // in case count is -1 then we just take all the products
    if (count == -1) count = countperproduct[countperproduct.length - 1].cumulativecount;

    timeTester.mark("Begin filter product");

    //  we take only the concerned products for pagination purposes , we wont compute all the products combination cause we dont want to make the RAM explode
    // also if count is -1 then we just take them all , although using count = -1 is generally a bad idea if there's a lot of data
    let concernedProducts = countperproduct.filter((x) =>
    // just checking if ranges overlap
    {
      let startA = x.cumulativecount - x.count;
      let endA = x.cumulativecount;
      let startB = offset;
      let endB = offset + count;
      // A and B overlap if A starts inside B or B starts inside A
      return (startA <= startB && endA >= startB) || (startB <= startA && endB >= startA);
    }
    );

    timeTester.mark("End filter product");


    timeTester.mark("Begin map categories");

    // we add the relevant categories (used column names) to each product
    let concernedProductsWithCategories = concernedProducts.map((x) => ({ ...x, categories: this.getAvailableCategoryFields(x.product) }))

    timeTester.mark("End map categories");

    // this will store all the combinations
    let facetsCombinations = [];

    // this is the offset on all the combinations of all the products (including those not concerned)
    // at which the last combination should be taken
    let stopOffset = count + offset;
    // case count is -1
    if (stopOffset > countperproduct[countperproduct.length - 1].cumulativecount) stopOffset = countperproduct[countperproduct.length - 1].cumulativecount;


    // NOTE: we could have kept a counter to instead just compute combinations until we reach the expected amount
    // but that would imply a lot of changes that go until deep down
    // and make things even harder to understand unless we dont separate the functions
    // which will still make things harder to read
    // that is why instead we just compute offsets and counts for each category of each product
    // Update: the easiest way to think of this is like having an axis where the x coordinate is the number of combinations
    // and then we just need to compute the distance between the segments of categories of each product
    // so first the offset for the product relative to the list of products
    // then the offset for the category relative to the list of categories (or in this case the product since it has the list of categories)
    // which is why the code inside the two loops look almost identical
    productLoop: for (let productWithCategory of concernedProductsWithCategories) {
      // how much combinations are already there before this product's combinations start
      // which also happens to be the cumulative count of the product before
      // but we will recompute it to not confuse readers about where the number comes from
      let lastProductCumulativeCount = productWithCategory.cumulativecount - productWithCategory.count;

      // what is the offset on the product's combinations at which we start taking combinations
      let currentStartOffset = offset - lastProductCumulativeCount;
      // if the offset that is requested for all the products is in the combinations of the previous product
      // then it will be negative, in which case we can safely take the combinations starting from the first one of the product
      // so no offset
      if (currentStartOffset < 0) currentStartOffset = 0;

      // starting from the first combination, how many do we need to take before reaching the required count
      // this is also the count for this one particular product
      let currentStopOffset = stopOffset - lastProductCumulativeCount;

      // we dont need to compute the stopoffset in case it exceeds the count since the combinations will return anyway
      // but we will still compute it so that we can use it in the inner for loop for categories
      // and keep consistency between the two loops
      // thus making the concept easier to grasp
      if (currentStopOffset > productWithCategory.cumulativecount) currentStopOffset = productWithCategory.cumulativecount;

      // how many categories this product has
      let currentProductCategoriesCount = productWithCategory.categories.length;

      // how many combinations each category has (since there is an equal number of combinations possible for each category)
      let combinationsPerCategory = productWithCategory.count / currentProductCategoriesCount;


      // now we 'll deal with categories
      for (let [categoryIndex, category] of productWithCategory.categories.entries()) {
        // almost same logic except we deal with the product offsets
        // so instead of offseting according to the list of products , we just offset according to the list of categories (or the current product)
        // which means the first combination of the current product is 0 in offset
        // and the categoryIndex coincidentally happens to be how much categories were before this one
        let lastCategoryCumulativeCount = (categoryIndex * combinationsPerCategory);

        // what is the offset on the category combinations for this product at which we start taking combinations
        let currentCategoryStartOffset = currentStartOffset - lastCategoryCumulativeCount;
        //console.log({ currentCategoryStartOffset });
        if (currentCategoryStartOffset < 0) currentCategoryStartOffset = 0;

        // same logic than before
        let currentCategoryStopOffset = currentStopOffset - lastCategoryCumulativeCount;
        // we dont need to limit this anymore anyway
        // finally we get the combinations we need
        // but if it's not included we just skip it
        if (currentCategoryStopOffset <= 0) continue;
        //if(currentCategoryStopOffset>0)

        let combination = this.getCombinations(productWithCategory.product, category, currentCategoryStopOffset - currentCategoryStartOffset, currentCategoryStartOffset);


        // and we add it to the list of combinations we want
        // in case cariable name is misleading, combination is actually an array
        facetsCombinations = [...facetsCombinations, ...combination];
        if (facetsCombinations.length >= count) break productLoop;

      }


    }

    //TIMER
    timeTester.end();
    // timeTester.recap();
    total = total | 0;

    return { facetsCombinations, stats: { totalCombinationsCount: total } };
  }


  // count = -1 is all the combinations
  // it takes category as an argument so we can control the pagination from the calling funciton
  // because the combinations of facets are repeated for each category
  getCombinations(product, category, count = -1, offset = 0, minlength = 0, maxlength = 5) {

    //console.log({ product, category, count, offset });

    if (count == 0) {
      return [];
    }

    let combinations = [];
    let facetCount = this.countFacets(product);
    let counter = 0;
    if (maxlength > facetCount) maxlength = facetCount;
    this.processCombinations(facetCount, (combination) => {
      // this is the combinations callback, returning false from here will stop computing combinations

      //this is not a duplicate it was put here on purpose in case this function is still called even if there's none to be taken
      if (counter >= count + offset) return false;

      if (counter >= offset) combinations.push(combination);
      if (count == -1) return true;
      counter++;
      return counter < count + offset;
    },
      minlength, maxlength);

    // MAGIC lol
    let inferList = combinations.map((combination) => this.getInferListFromCombination(product, category, combination));

    // could be using array prototype flat but not supported in IE 11 so just in case fallback
    // also it is still spread because of the double map
    inferList = [].concat(...inferList);
    return inferList;
  }

  getAvailableCategoryFields(product) {
    let availableCategoryFields = [];

    //we're sorting it because the algorithm implies that the category order doesnt change over time like when reuploading the same file or something, in case it uses the order of object proeprty insertion
    let subcategoryKeys = Object.keys(product).filter((x) => x && x.startsWith("Subcategory") && product[x]).sort((a, b) => a.localeCompare(b));

    // if product.Category checks for "truthy" values (not null, not undefined, not NAN, not "" and not 0)
    if (product.Category) {
      availableCategoryFields.push("Category");
    }
    availableCategoryFields = [...availableCategoryFields, ...subcategoryKeys];
    return availableCategoryFields;
  }


  //NOTE this assumes that the Facet_x columns are sorted in alphabetical order in the original data
  // returns new product with the facets "rank" shifted so that there are no empty facet
  // example:
  // { facet1:"ram", facet1value:"2gb", facet2:"storagetype", facet2value:"", facet3:"size", facet3value:"250Gb" }
  // becomes
  // { facet1:"ram", facet1value:"2gb", facet2:"size", facet2value:"250Gb" }
  // doing this should be fine since the facets are computed per product
  correctFacets(product) {
    let newProduct = { ...product };
    // get all facet column names
    //let allFacets = Object.keys(product).filter((x) => x && x.startsWith("Facet") && !x.endsWith("Value")).sort((a,b) => a.localeCompare(b));
    let allFacets = Object.keys(product).filter((x) => x && x.startsWith("Facet") && !x.endsWith("Value"));

    // get all facet values column names
    //let allFacetsValues = Object.keys(product).filter((x) => x && x.startsWith("Facet") && x.endsWith("Value")).sort((a,b) => a.localeCompare(b));
    let allFacetsValues = Object.keys(product).filter((x) => x && x.startsWith("Facet") && x.endsWith("Value"));

    // get all used facet values column names
    let usedFacetsValues = allFacetsValues.map((v, k) => ({ value: v, index: k })).filter((x) => product[x.value] != "");
    // get all used facet column names

    if (usedFacetsValues.length == allFacetsValues.length) {
      return newProduct;
    }

    //let usedFacets = allFacets.filter((_,k) => usedFacetsValues.some((x) => x.index == k));
    let usedFacets = usedFacetsValues.map((v) => allFacets[v.index]);
    // clone the product


    // remove all the facets from the new product , can be simplified if the columns other than facets are fixed and known at the start
    allFacets.forEach((x) => delete newProduct[x]);
    allFacetsValues.forEach((x) => delete newProduct[x]);
    // add the facets back again with the correct name
    for (let i = 0; i < usedFacetsValues.length; i++) {
      newProduct[`Facet_${i + 1}`] = product[usedFacets[i]];
      newProduct[`Facet_${i + 1}_Value`] = product[usedFacetsValues[i].value];
    }
    return newProduct;
  }

  //this one is going to remove any subcategory that is empty form the object
  correctSubcategory(product) {
    let newProduct = { ...product };
    Object.keys(newProduct).filter((x) => x && x.startsWith("Subcategory") && !product[x]).forEach((x) => delete newProduct[x]);
    return newProduct;
  }


  // Actually this does not return a "list" but rather a single object that correspondsto one of the combinations
  getInferListFromCombination(product, category, combination) {
    let facetCount = this.countFacets(product);
    let properties = ["_1st_Property", "_2nd_Property", "_3rd_Property", "_4th_Property", "_5th_Property"];
    let lpmq = product[category];
    let combinedObject = {
      // TODO : fic fake fields and number of item with real data
      // idproduct : product.id ?? `${product.ID}_${product[category]}_${combination.join("_")}`,
      combination: `${combination.join("_")}`,
      idproduct: product.ID,
      idproject: product.project ?? "Projett_Test",
      Item_Type: product[category],
      // Property_Schema: "fake_property_Schema",
      List_Page_Main_Query: lpmq,
      List_Page_Label: lpmq,
      Number_of_Item: -1,
    }
    if (facetCount > 0) {

      // Merge all properties into single object
      let facetsArray = properties
        .map((v, i) => ({ [v]: product[`Facet_${combination[i] + 1}_Value`] ?? "" }))
      let facetsObject = facetsArray.reduce((last, current) => ({ ...last, ...current }), {});
      lpmq = lpmq + " " + facetsArray.map((v, i) => v[properties[i]]).join(" ");
      lpmq = lpmq.trim();
      combinedObject = { ...combinedObject, ...facetsObject, List_Page_Main_Query: lpmq, List_Page_Label: lpmq };
    }
    return combinedObject;
  }


}
