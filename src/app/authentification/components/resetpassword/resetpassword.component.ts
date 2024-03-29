import { CommonService } from '@app/shared/services/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ForgotPwdService } from '@app/authentification/services/forgot-pwd.service';
import { NotificationService } from '@app/services/notification.service';
import { CustomValidationService } from '@app/shared/services/custom-validation.service';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.scss'],
})
export class ResetpasswordComponent {
  hide = true;
  submitted = false;

  public form = this.fb.group(
    {
      password: [
        '',
        Validators.compose([
          Validators.required,
          this.custumValidator.patternValidator(),
        ]),
      ],
      confirm_password: ['', Validators.required],
      token: [false, Validators.required],
    },
    {
      validator: this.custumValidator.MatchPassword(
        'password',
        'confirm_password'
      ),
    }
  );

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private custumValidator: CustomValidationService,
    private forgetPwdService: ForgotPwdService,
    private notifs: NotificationService,
    public readonly common: CommonService,
    private translate: TranslateService
  ) {
    // const value = this.route.queryParamMap.subscribe(tokenValue => {
    // })
    this.form.patchValue({
      token: this.route.snapshot.queryParamMap.get('token'),
    });
  }

  async onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    try {
      const result = await this.forgetPwdService.resetPassword({
        newPass: this.form.controls.password.value,
        resetLink: this.form.controls.token.value,
      });
      if (result && result.message) {
        this.notifs.sucess(result.message);
        this.router.navigate(['/sign-in']);
      }
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        console.log('error', error);
      }
    }
  }
}
