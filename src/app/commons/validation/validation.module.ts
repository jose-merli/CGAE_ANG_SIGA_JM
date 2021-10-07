import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DniValidator } from "./dni-validator.directive";
import { CustomValidators } from "./custom-validators";
import { ValidationService } from "./validation.service";
import { ConfirmDialogModule, GrowlModule } from "primeng/primeng";
import { TableModule } from "primeng/table";

@NgModule({
  imports: [CommonModule, ConfirmDialogModule, TableModule, GrowlModule],
  declarations: [DniValidator],
  exports: [DniValidator],
  providers: [CustomValidators, ValidationService]
})
export class ValidationModule {}
