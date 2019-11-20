import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BusquedaColegiadoExpressComponent } from "./busqueda-colegiado-express.component";
import { InputTextModule, ButtonModule } from "primeng/primeng";
import { PipeTranslationModule } from "../translate/pipe-translation.module";
import { FormsModule } from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PipeTranslationModule,
    InputTextModule,
    ButtonModule
  ],
  declarations: [BusquedaColegiadoExpressComponent],
  exports: [BusquedaColegiadoExpressComponent]
})
export class BusquedaColegiadoExpressModule {}
