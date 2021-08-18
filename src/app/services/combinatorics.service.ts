import { ThisReceiver } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { timer } from 'rxjs';
import { map, max } from 'rxjs/operators';
import { ProductCombinationsManager } from './ProductCombinationsManager';
import  {TimeTester} from "./TimeTester";

@Injectable({
  providedIn: 'root'
})
//NOTE:  if you want to recompute the caches (after modifying products for example)  you need to provide a new product array instance
//TODO:  add a recompute flag 
export class CombinatoricsService {
  productCombinationsManager:ProductCombinationsManager;  
  // this has to be managed on this level since the worker doesnt last long in memory
  countPerProductCache = null;
  lastProducts = null;
  productsWithCorrectedFacets = null;

  constructor() { 
  }
  
  getPaginatedProductsCombinations(products, page = 0, perPage = 10){
    if(this.lastProducts != products){
      // no need to provide things since they are already in the instance if it is the same products instance
      this.productCombinationsManager = new ProductCombinationsManager(products);
    }
    let results = this.productCombinationsManager.getPaginatedProductsCombinations(page,perPage);
    this.countPerProductCache = this.productCombinationsManager.getCountPerProductCache();
    this.productsWithCorrectedFacets = this.productCombinationsManager.getProductsWithCorrectedFacets();
    this.lastProducts = products;
    return Promise.resolve(results);
  }

  getPaginatedProductsCombinationsUsingWorker(products, page = 0, perPage = 10){
    // TODO handle rejection
    // since there is no instance of the manager kept in memory 
    // we need to provide the manager with the countperproduct array everytime 
    return new Promise<any>((resolve,_) => {

      if (typeof Worker !== 'undefined') {
        // Create a new
        const worker = new Worker('./combinatorics.worker', { type: 'module' });
        worker.onmessage = ({ data }) => {
          let { cache_data, result} = data;
          this.countPerProductCache = cache_data.countPerProductCache;
          this.productsWithCorrectedFacets = cache_data.productsWithCorrectedFacets;
          this.lastProducts = products;
          resolve(result);
        };
        if(this.lastProducts != products){
          console.log("Different Products");
          worker.postMessage({cache_data:{countPerProductCache:null, productsWithCorrectedFacets: null},payload:{products,page,perPage}});
        } else {
          console.log("same Products");
          worker.postMessage({cache_data:{countPerProductCache: this.countPerProductCache, productsWithCorrectedFacets: this.productsWithCorrectedFacets},payload:{products,page,perPage}});
        }
      } else {
        console.log("Worker not supported, falling back to default");
        resolve(this.getPaginatedProductsCombinations(products,page,perPage));
      }
    })

  }

}
