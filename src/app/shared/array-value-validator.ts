import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export function ArrayValueValidatorFn(requirements: object[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!Array.isArray(control.value)) {
      return {ArrayValue: 'value is not array'};
    }
    control.value.forEach(element => {
      if (requirements.indexOf(element) < 0) {
        return {ArrayValue: 'value not valid'};
      }
    });
    return null;
  };
}
