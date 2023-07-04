import { Injectable } from "@angular/core";
import { AbstractControl } from "@angular/forms";

import { ValidationService } from "./validation.service";

@Injectable()
export class CustomValidators {
  constructor(private service: ValidationService) { }

  dni(control: AbstractControl): { [key: string]: boolean } {
    if (!control.value) return null;
    return this.service.isValidDNI(control.value) ? null : { dni: true };
  }
}
