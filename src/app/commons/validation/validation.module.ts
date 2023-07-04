import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DniValidator } from "./dni-validator.directive";
import { CustomValidators } from "./custom-validators";
import { ValidationService } from "./validation.service";
import { ConfirmDialogModule, GrowlModule, DropdownModule } from 'primeng/primeng';
import { TableModule } from "primeng/table";
import { CheckboxModule } from "primeng/checkbox";
@NgModule({
  imports: [CommonModule, ConfirmDialogModule, TableModule, GrowlModule, CheckboxModule, DropdownModule],
  declarations: [DniValidator],
  exports: [DniValidator],
  providers: [CustomValidators, ValidationService]
})
export class ValidationModule {}
