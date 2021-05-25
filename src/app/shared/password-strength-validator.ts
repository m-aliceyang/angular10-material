import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export function PasswordStrengthValidatorFn(minLength: number, strengthLevel: 1 | 2 | 3 | 4 | 5): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const wishlist = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz$@$!%*#?&';
    if (!control.value || control.value.length < minLength) {
      return {PasswordStrength: 'password is empty or not meet min length requirement'};
    }

    for (const s of control.value) {
      if (wishlist.indexOf(s) < 0) {
        return {PasswordStrength: 'password contains invalid character'};
      }
    }

    const regex = new Array();
    regex.push('[A-Z]');
    regex.push('[a-z]');
    regex.push('[0-9]');
    regex.push('[$@$!%*#?&]');

    let passed = 0;
    for (const r of regex) {
      if ((new RegExp(r)).test(control.value)) {
        passed++;
      }
    }

    if (passed > 2 && control.value.length > minLength) {
      passed++;
    }

    if (passed < strengthLevel) {
      return {PasswordStrength: 'password is not strength enouth'};
    }

    return null;
  };
}
