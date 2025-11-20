import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class AuthValidators {

  // Validador para DNI peruano (8 dígitos numéricos)
  static peruvianDNI(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const dniPattern = /^\d{8}$/;
      return dniPattern.test(control.value) ? null : { invalidDni: true };
    };
  }

  // Validador para nombres completos (al menos dos palabras)
  static fullName(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const value = control.value.trim();
      return value.indexOf(' ') > 0 ? null : { invalidFullName: true };
    };
  }
}
