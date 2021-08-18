import { Pipe, PipeTransform } from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";

@Pipe({
  name: 'dateAgo',
  pure: true
})
export class DateAgoPipe implements PipeTransform {

  public language = '';

  constructor(public translate: TranslatePipe) {
    localStorage.getItem('language') ? this.language = localStorage.getItem('language') : this.language = 'en';
  }

  transform(value: any, args?: any): any {
    if (value) {
      const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);
      if (seconds < 5) return '0 ' + this.translate.transform('Notification.second');
      const intervals = {
        'year': 31536000,
        'month': 2592000,
        'week': 604800,
        'day': 86400,
        'hour': 3600,
        'minute': 60,
        'second': 1
      };
      let counter;
      for (const i in intervals) {
        counter = Math.floor(seconds / intervals[i]);
        if (counter > 0)
          if (counter === 1 || i === 'month') {
            return counter + ' ' + this.translate.transform('Notification.' + i); // singular (1 day ago)
          } else {
            return counter + ' ' + this.translate.transform('Notification.' + i) + 's'; // plural (2 days ago)
          }
      }
    }
    return value;
  }

}
