import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReCapchaService } from '@app/services/re-capcha.service';
import { CommonService } from '@app/shared/services/common.service';
import { AuthService } from '../../services/auth.service';
import {TranslationService} from "@app/modules/i18n/translation.service";
import {NotificationService} from "@app/services/notification.service";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit, AfterViewInit {
  hide = true;
  @ViewChild('recaptch', { static: true }) public recaptch: ElementRef;

  public tentativePwd = 0;
  languageStored = localStorage.getItem('language');

  public loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    recaptcha: [''],
  });
  public readonly stayOn = this.fb.control(false);

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    public recaptcha: ReCapchaService,
    public common: CommonService,
    private translate: TranslationService,
    public notif: NotificationService
  ) { }

  get getemail() {
    return this.loginForm.controls.email;
  }
  get getpassword() {
    return this.loginForm.controls.password;
  }

  ngOnChanges(): void {
    this.common.hideSpinner();
  }

  ngOnInit(): void {
    this.recaptch.nativeElement.style.display = 'none';
  }

  ngAfterViewInit(): void { }

  public async onSubmit() {
    this.common.showSpinner('root');

    const { email, password }: { [key: string]: any } = this.loginForm.controls;
    try {
      const user = await this.authService.login({
        email: email.value,
        password: password.value,
      });

      if (user && user.token) {
        if (this.stayOn.value === true) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
        this.notif.userId = user._id;
        this.notif.getNotifsDB(user._id);
        this.common.hideSpinner();
        // this.notif.addNotifTopBar('Notification.Welcome', 'Notification.Created', new Date(), user._id);
        this.router.navigateByUrl('/user-space');
      } else if (user === undefined) {
        if (this.tentativePwd >= 2) {
          this.recaptch.nativeElement.style.display = 'block';
          this.loginForm.controls['recaptcha'].setValidators([
            Validators.required,
          ]);
          // this.loginForm.controls['recaptcha'].clearValidators();
          this.loginForm.controls['recaptcha'].updateValueAndValidity();
        }

        this.tentativePwd++;
        this.common.hideSpinner();
      }
    } catch (error) {
      this.common.hideSpinner();
      if (error instanceof HttpErrorResponse) {
        console.log('error ', error);
      }
      throw error;
    }
  }
}
