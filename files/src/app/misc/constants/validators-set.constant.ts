import { ValidatorFn, Validators } from '@angular/forms';
import { CustomValidators } from '@misc/custom-validators';

export interface IValidatorsSet {
  EMAIL: ValidatorFn;
  PASSWORD: ValidatorFn;
  PHONE: ValidatorFn;
  URL: ValidatorFn;
  NAME: ValidatorFn;
}

export const VALIDATORS_SET: IValidatorsSet = Object.freeze({
  EMAIL: Validators.compose([Validators.email, CustomValidators.fullEmail]) as ValidatorFn,
  PASSWORD: Validators.compose([Validators.minLength(8), Validators.maxLength(30), CustomValidators.password]) as ValidatorFn,
  PHONE: Validators.compose([CustomValidators.phone]) as ValidatorFn,
  URL: Validators.compose([CustomValidators.url]) as ValidatorFn,
  NAME: Validators.compose([Validators.maxLength(90), CustomValidators.validName]) as ValidatorFn
});
