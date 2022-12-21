import { Component, inject } from '@angular/core';
import { AbstractFormComponent } from '@misc/abstracts/components/abstract-form.component';
import { Router } from '@angular/router';
import { UserApiService } from '@services/api/user-api/user-api.service';

@Component({
  selector: 'sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent extends AbstractFormComponent {
  private _userApi: UserApiService = inject(UserApiService);
  private _router: Router = inject(Router);

  onSubmit(): void {
    if (this.formGroup.invalid) {
      return;
    }

    this._userApi.createItem(this.formGroup.getRawValue()).subscribe((): Promise<boolean> => this._router.navigate(['']));
  }

  protected override _initForm(): void {
    this.formGroup = this._fb.group({});
  }
}
