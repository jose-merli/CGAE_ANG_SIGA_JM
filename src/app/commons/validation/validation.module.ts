import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DniValidator } from "./dni-validator.directive";
import { CustomValidators } from "./custom-validators";
import { ValidationService } from "./validation.service";

@NgModule({
  imports: [CommonModule],
  declarations: [DniValidator],
  exports: [DniValidator],
  providers: [CustomValidators, ValidationService]
})
export class ValidationModule {}
