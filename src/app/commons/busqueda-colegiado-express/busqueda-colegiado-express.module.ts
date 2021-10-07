import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BusquedaColegiadoExpressComponent } from "./busqueda-colegiado-express.component";
import { InputTextModule, ButtonModule, GrowlModule, ConfirmDialogModule } from "primeng/primeng";
import { PipeTranslationModule } from "../translate/pipe-translation.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TableModule } from "primeng/table";

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
    TableModule
  ],
  declarations: [BusquedaColegiadoExpressComponent],
  exports: [BusquedaColegiadoExpressComponent]
})
export class BusquedaColegiadoExpressModule { }