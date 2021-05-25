import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export function ArrayLengthValidatorFn(min: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value || control.value.length === 0) {
      return {ArrayLength: 'value undefined'};
    }
    const isArray = Array.isArray(control.value);
    if (!isArray) {
      return {ArrayLenth: 'value require array'};
    }
    if (control.value.length < min) {
      return {ArrayLength: 'min length requrirement not meet'};
    }
    return null;
  };
}
