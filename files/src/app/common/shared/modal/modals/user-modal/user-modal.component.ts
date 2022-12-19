import { Component, inject, Input, OnInit } from '@angular/core';
import { IModalComponentContext, ModalComponent } from '@shared/modal/modal.component';
import { User } from '@models/classes/user/user.model';
import { AbstractFormComponent } from '@misc/abstracts/abstract-form.component';
import { Validators } from '@angular/forms';
import { UserRole } from '@models/enums/user-role.enum';
import { IOption } from '@models/interfaces/forms/option.interface';
import { VALIDATORS_SET } from '@misc/constants/validators-set.constant';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef } from '@angular/material/dialog';
import { difference } from '@misc/helpers/difference.function';

interface IFormValues {
  firstName: string;
  lastName: string;
  email: string;
  role?: UserRole;
}

@Component({
  selector: 'user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss']
})
export class UserModalComponent extends AbstractFormComponent implements OnInit {
  @Input() context: IModalComponentContext<User>;
  roleOptions: IOption[] = [];
  private readonly _AVAILABLE_ROLES: UserRole[] = [UserRole.admin];
  private _translate: TranslateService = inject(TranslateService);

  get user(): User | undefined {
    return this.context?.entity;
  }

  get defaultValues(): IFormValues {
    return {
      firstName: this.user?.firstName ?? '',
      lastName: this.user?.lastName ?? '',
      email: this.user?.email ?? '',
      role: this.user?.role
    };
  }

  get dialog(): MatDialogRef<ModalComponent<User>> | undefined {
    return this.context?.dialog;
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this._initOptions();
  }

  getModalResult(): IFormValues {
    return difference(this.formGroup.getRawValue(), this.defaultValues) as IFormValues;
  }

  onSubmit(): void {
    if (this.formGroup.invalid) {
      return;
    }

    this.dialog?.close(this.getModalResult());
  }

  protected _initForm(): void {
    this.formGroup = this._fb.group({
      firstName: this._fb.control(this.defaultValues?.firstName, Validators.compose([Validators.required, VALIDATORS_SET.NAME])),
      lastName: this._fb.control(this.defaultValues?.lastName, Validators.compose([Validators.required, VALIDATORS_SET.NAME])),
      email: this._fb.control(this.defaultValues?.email, Validators.compose([Validators.required, VALIDATORS_SET.EMAIL])),
      role: this._fb.control(this.defaultValues?.role)
    });
  }

  private _initOptions(): void {
    this.roleOptions = this._AVAILABLE_ROLES.map(
      (role: UserRole): IOption => ({ value: role, label: this._translate.instant(`SERVICE_ROLE.${role.toUpperCase()}`), disabled: false })
    );
  }
}
