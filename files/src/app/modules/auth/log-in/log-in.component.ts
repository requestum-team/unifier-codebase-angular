import { Component, inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { VALIDATORS_SET } from '@misc/constants/validators-set.constant';
import { BooleanFieldType } from '@forms/base-boolean-field/base-boolean-field.component';
import { AbstractFormComponent } from '@misc/abstracts/components/abstract-form.component';
import { InitPathService } from '@services/init-path/init-path.service';

@Component({
  selector: 'log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent extends AbstractFormComponent implements OnInit {
  private _router: Router = inject(Router);
  private _auth: AuthService = inject(AuthService);
  private _initPath: InitPathService = inject(InitPathService);
  readonly BooleanFieldType: typeof BooleanFieldType = BooleanFieldType;

  onSubmit(): void {
    this.formGroup.markAllAsTouched();

    if (this.formGroup.invalid) {
      return;
    }

    const { username, password, shouldRemember }: { username: string; password: string; shouldRemember: boolean } =
      this.formGroup.getRawValue();

    this._auth.login({ username, password }, shouldRemember).subscribe((): void => {
      this._router.navigate(this._initPath.initialUrl).then((): void => this._initPath.clear());
    });
  }

  protected override _initForm(): void {
    this.formGroup = this._fb.group({
      username: new FormControl('', [Validators.required, VALIDATORS_SET.EMAIL]),
      password: new FormControl('', [Validators.required]),
      shouldRemember: new FormControl(false)
    });
  }
}
