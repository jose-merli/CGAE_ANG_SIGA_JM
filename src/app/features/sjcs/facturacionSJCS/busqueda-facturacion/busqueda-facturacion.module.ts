import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BusquedaFacturacionComponent } from "./busqueda-facturacion.component";
import { InputTextModule, ButtonModule, RadioButtonModule, DropdownModule, CalendarModule, DataTableModule } from "primeng/primeng";

import { PipeTranslationModule } from "../../../../commons/translate/pipe-translation.module";
import { FormsModule } from "@angular/forms";
import { FiltroBusquedaFacturacionComponent } from './filtro-busqueda-facturacion/filtro-busqueda-facturacion.component';
import { TablaBusquedaFacturacionComponent } from './tabla-busqueda-facturacion/tabla-busqueda-facturacion.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PipeTranslationModule,
    InputTextModule,
    ButtonModule,
    RadioButtonModule,
    DropdownModule,
    CalendarModule,
    DataTableModule
  ],
  declarations: [BusquedaFacturacionComponent, FiltroBusquedaFacturacionComponent, TablaBusquedaFacturacionComponent],
  exports: [BusquedaFacturacionComponent]
})
export class BusquedaFacturacionModule {}
