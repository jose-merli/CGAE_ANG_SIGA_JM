import { Directive, OnInit, forwardRef } from "@angular/core";
import {
  NG_VALIDATORS,
  Validator,
  AbstractControl,
  Validators
} from "@angular/forms";

import { CustomValidators } from "./custom-validators";

export const DNI_VALIDATOR: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => DniValidator),
  multi: true
};

@Directive({
  selector: "[dni][formControlName],[dni][formControl],[dni][ngModel]",
  providers: [DNI_VALIDATOR]
})
export class DniValidator implements Validator {
  constructor(private validators: CustomValidators) {}

  validate(control: AbstractControl) {
    return this.validators.dni(control);
  }
}
