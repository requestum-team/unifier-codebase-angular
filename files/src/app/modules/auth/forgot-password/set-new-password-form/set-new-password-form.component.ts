import { Component, inject, Input, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { VALIDATORS_SET } from '@misc/constants/validators-set.constant';
import { Router } from '@angular/router';
import { CustomValidators } from '@misc/custom-validators';
import { UserApiService } from '@services/api/user-api/user-api.service';
import { AbstractFormComponent } from '@misc/abstracts/components/abstract-form.component';

@Component({
  selector: 'set-new-password-form',
  templateUrl: './set-new-password-form.component.html',
  styleUrls: ['./set-new-password-form.component.scss']
})
export class SetNewPasswordFormComponent extends AbstractFormComponent implements OnInit {
  private _userApi: UserApiService = inject(UserApiService);
  private _router: Router = inject(Router);
  @Input() token: string;

  onSubmit(): void {
    if (this.formGroup.invalid) {
      return;
    }

    const { password: plainPassword }: { password: string; repeatPassword: string } = this.formGroup.getRawValue();

    this._userApi.updatePassword(this.token, { plainPassword }, { skipErrorNotification: true }).subscribe(this.onSubscribeNext.bind(this));
  }

  onSubscribeNext(): void {
    this._router.navigate(['', 'auth', 'log-in']);
  }

  protected override _initForm(): void {
    this.formGroup = this._fb.group(
      {
        password: ['', [Validators.required, VALIDATORS_SET.PASSWORD]],
        repeatPassword: ['', [Validators.required, VALIDATORS_SET.PASSWORD]]
      },
      { validators: [CustomValidators.mustMatch('password', 'repeatPassword')] }
    );
  }
}
