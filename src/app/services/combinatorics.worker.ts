/// <reference lib="webworker" />

import { ProductCombinationsManager } from "./ProductCombinationsManager";


addEventListener('message', ({ data }) => {
  let { cache_data, payload } = data;
  let { products, page, perPage } = payload;
  let manager = new ProductCombinationsManager(products, cache_data.countPerProductCache, cache_data.productsWithCorrectedFacets);
  //console.log({data, manager});
  let result = manager.getPaginatedProductsCombinations(page, perPage);
  let countPerProductCache = manager.getCountPerProductCache();
  let productsWithCorrectedFacets = manager.getProductsWithCorrectedFacets();
  postMessage({ cache_data: { countPerProductCache, productsWithCorrectedFacets }, result });
});
