// Localization is based on '@ngx-translate/core';
// Please be familiar with official documentations first => https://github.com/ngx-translate/core

import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {AuthService} from "@app/authentification/services/auth.service";
import {Users} from "@app/models/users";
import {Observable} from "rxjs";
import {environment} from "@environments/environment";
import {map} from "rxjs/operators";
import {User} from "@app/classes/users";

export interface Locale {
  lang: string;
  data: any;
}

const LOCALIZATION_LOCAL_STORAGE_KEY = 'language';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  // Private properties
  private langIds: any = [];

  constructor(private translate: TranslateService,
              private cookieService: CookieService,
              private http: HttpClient) {
    // add new langIds to the list
    this.translate.addLangs(['en', 'fr']);
    // this language will be used as a fallback when a translation isn't found in the current language
    if (localStorage.getItem(LOCALIZATION_LOCAL_STORAGE_KEY)) {
      this.translate.setDefaultLang(localStorage.getItem(LOCALIZATION_LOCAL_STORAGE_KEY));
    }else {
      this.translate.setDefaultLang('en');
    }
  }

  public updateLanguageDB(lang: any, userId: any): Observable<{ message: any }> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.cookieService.get('SEMEWEE')}`
    );
    return this.http.post<{ message: string }>(
      `${environment.baseUrl}/user/updateLanguage`,
      {
        id: userId,
        language: lang
      },
      { headers: headers }
    );
  }

  loadTranslations(...args: Locale[]): void {
    const locales = [...args];

    locales.forEach((locale) => {
      // use setTranslation() with the third argument set to true
      // to append translations instead of replacing them
      this.translate.setTranslation(locale.lang, locale.data, true);

      this.langIds.push(locale.lang);
    });

    // add new languages to the list
    this.translate.addLangs(this.langIds);
  }

  setLanguage(lang, userID: any): Observable<{ message: any }> {
    if (lang) {
      this.translate.use(this.translate.getDefaultLang());
      this.translate.use(lang);
      localStorage.setItem(LOCALIZATION_LOCAL_STORAGE_KEY, lang);
      return this.updateLanguageDB(lang, userID);
    }
  }

  setLanguageWithoutDB(lang) {
    if (lang) {
      this.translate.use(this.translate.getDefaultLang());
      this.translate.use(lang);
      this.translate.setDefaultLang(lang);
      localStorage.setItem(LOCALIZATION_LOCAL_STORAGE_KEY, lang);
    }
  }

  /**
   * Returns selected language
   */
  getSelectedLanguage(): any {
    return (
      localStorage.getItem(LOCALIZATION_LOCAL_STORAGE_KEY) ||
      this.translate.getDefaultLang()
    );
  }
}
