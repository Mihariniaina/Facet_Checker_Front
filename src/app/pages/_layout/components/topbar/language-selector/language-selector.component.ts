import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { TranslationService } from '../../../../../modules/i18n/translation.service';
import { NotificationService } from '@app/services/notification.service';
import { AuthService } from "@app/authentification/services/auth.service";
import { Users } from "@app/models/users";
import { User } from "@app/classes/users";
import { CookieService } from "ngx-cookie-service";
import { ProfilesService } from '@app/user-spaces/profiles/services/profiles.service';

interface LanguageFlag {
  lang: string;
  name: string;
  flag: string;
  active?: boolean;
}

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss'],
})
export class LanguageSelectorComponent implements OnInit {
  language!: LanguageFlag;
  languages: LanguageFlag[] = [
    {
      lang: 'en',
      name: 'English',
      flag: './assets/media/svg/flags/260-united-kingdom.svg',
    },
    {
      lang: 'fr',
      name: 'French',
      flag: './assets/media/svg/flags/195-france.svg',
    },
  ];
  public userId;
  public userLanguage;
  public user: Users;
  public userImage;

  constructor(
    private translationService: TranslationService,
    private router: Router,
    private notifs: NotificationService,
    private cookieService: CookieService,
    private profileService: ProfilesService,
    private userService: AuthService
  ) {
    this.userId = cookieService.get('_id');
    this.userLanguage = cookieService.get('language');
    if (this.userLanguage) {
      this.translationService.setLanguageWithoutDB(this.userLanguage);
    }
    this.userService.currentUserSubject.pipe(
      map((user: User) => {
        if (user) {
          this.user = user,
          this.userImage = this.user.image
          if (this.user.language) {
            this.translationService.setLanguageWithoutDB(this.user.language);
          }
        }
      })
    ).subscribe();
  }

  ngOnInit() {
    /*this.setSelectedLanguage();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((event) => {
        this.setSelectedLanguage();
      });
    console.log(this.translationService.getSelectedLanguage());*/
    this.languages.forEach((l: LanguageFlag) => {
      if (l.lang === this.translationService.getSelectedLanguage()) {
        this.language = l;
      }
    });
  }

  setLanguageWithRefresh(lang: any) {
    this.setLanguage(lang);
    window.location.reload();
  }

  updateLanguage(lang) {
    this.setLanguage(lang);
  }

  setLanguage(lang) {
    this.languages.forEach((language: LanguageFlag) => {
      if (language.lang === lang) {
        language.active = true;
        this.language = language;
      } else {
        language.active = false;
      }
    });
    this.user.language = lang;
    const newUser = {
      ...this.user,
      image: this.userImage,
    } as Users;
    this.translationService.setLanguage(lang, this.userId)
      .subscribe((res: any) => {
        if (res && res.message) {
          this.profileService.checkUserInfo(newUser);
          this.notifs.sucess(res.message);
          this.cookieService.set(
            'language',
            lang,
            0.2,
            '/',
            undefined,
            false,
            'Strict'
          );
        }
      });
    this.notifs.language = lang;
  }

  setSelectedLanguage(): any {
    this.setLanguage(this.translationService.getSelectedLanguage());
  }
}
