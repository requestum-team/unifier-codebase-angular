import { Component, inject, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { VALIDATORS_SET } from '@misc/constants/validators-set.constant';
import { UserTokenAction } from '@models/enums/user-token-action.enum';
import { UserApiService } from '@services/api/user-api/user-api.service';
import { Router } from '@angular/router';
import { AbstractFormComponent } from '@misc/abstracts/abstract-form.component';

@Component({
  selector: 'reset-password-form',
  templateUrl: './reset-password-form.component.html',
  styleUrls: ['./reset-password-form.component.scss']
})
export class ResetPasswordFormComponent extends AbstractFormComponent implements OnInit {
  private _userApi: UserApiService = inject(UserApiService);
  private _router: Router = inject(Router);

  onSubmit(): void {
    if (this.formGroup.invalid) {
      return;
    }

    this._userApi
      .sendToken(this.form?.email.value, UserTokenAction.resetPassword, {}, { skipErrorNotification: true })
      .subscribe(this.onSubscribeNext.bind(this));
  }

  onSubscribeNext(): void {
    this._router.navigate(['', 'auth', 'log-in']);
  }

  protected override _initForm(): void {
    this.formGroup = this._fb.group({
      email: ['', [Validators.required, VALIDATORS_SET.EMAIL]]
    });
  }
}
