import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BusquedaColegiadoExpressComponent } from "./busqueda-colegiado-express.component";
import { InputTextModule, ButtonModule, GrowlModule } from "primeng/primeng";
import { PipeTranslationModule } from "../translate/pipe-translation.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PipeTranslationModule,
    InputTextModule,
    ButtonModule,
    GrowlModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [BusquedaColegiadoExpressComponent],
  exports: [BusquedaColegiadoExpressComponent]
})
export class BusquedaColegiadoExpressModule { }