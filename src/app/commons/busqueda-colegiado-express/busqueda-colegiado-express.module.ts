import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CheckboxModule } from "primeng/checkbox";
import { ButtonModule, ConfirmDialogModule, DropdownModule, GrowlModule, InputTextModule } from 'primeng/primeng';
import { TableModule } from "primeng/table";
import { PipeTranslationModule } from "../translate/pipe-translation.module";
import { BusquedaColegiadoExpressComponent } from "./busqueda-colegiado-express.component";
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PipeTranslationModule,
    InputTextModule,
    ButtonModule,
    GrowlModule,
    FormsModule,
    ReactiveFormsModule,
    ConfirmDialogModule,
    TableModule,
    CheckboxModule,
    DropdownModule
  ],
  declarations: [BusquedaColegiadoExpressComponent],
  exports: [BusquedaColegiadoExpressComponent]
})
export class BusquedaColegiadoExpressModule { }