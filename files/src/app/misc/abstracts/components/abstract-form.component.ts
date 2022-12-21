import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { InputType } from '@models/enums/input-type.enum';
import { IFormControlItem } from '@models/interfaces/forms/form-control-item.interface';
import { FormControlItemType } from '@models/enums/form-control-item.type';

export interface IFormControls {
  [key: string]: AbstractControl;
}

@Component({
  template: ''
})
export abstract class AbstractFormComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  readonly FormControlItemType: typeof FormControlItemType = FormControlItemType;
  readonly InputType: typeof InputType = InputType;
  protected _fb: FormBuilder = inject(FormBuilder);
  protected readonly _DESTROYED$: Subject<void> = new Subject();

  get form(): IFormControls | null {
    return this.formGroup?.controls;
  }

  ngOnInit(): void {
    this._initForm();
  }

  ngOnDestroy(): void {
    this._DESTROYED$.next();
    this._DESTROYED$.complete();
  }

  getGroup(name: string): FormGroup {
    return this._getItemFormGroup(name) as FormGroup;
  }

  getControl(name: string): FormControl {
    return this._getItemFormGroup(name) as FormControl;
  }

  getArray(name: string): FormArray {
    return this._getItemFormGroup(name) as FormArray;
  }

  setControlsArray(formControls: IFormControlItem[]): void {
    if (!formControls.length) {
      return;
    }

    formControls.forEach((itemControl: IFormControlItem): void => this.formGroup.addControl(itemControl.name, itemControl.control));
  }

  private _getItemFormGroup(name: string): AbstractControl {
    return this.formGroup.get(name) as AbstractControl;
  }

  protected abstract _initForm(): void;
}
