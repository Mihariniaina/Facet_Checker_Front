import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LpNewvalidatorService {

  public interruptOperation$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  count = 1;

  constructor() { }
}
