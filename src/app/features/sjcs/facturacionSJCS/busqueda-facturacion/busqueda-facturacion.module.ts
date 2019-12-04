import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BusquedaFacturacionComponent } from "./busqueda-facturacion.component";
import { InputTextModule, ButtonModule, RadioButtonModule, DropdownModule, GrowlModule, CalendarModule, DataTableModule, CheckboxModule, ConfirmDialogModule } from "primeng/primeng";
import { TableModule } from '../../../../../../node_modules/primeng/table';
import { PipeTranslationModule } from "../../../../commons/translate/pipe-translation.module";
import { FormsModule } from "@angular/forms";
import { FiltroBusquedaFacturacionComponent } from './filtro-busqueda-facturacion/filtro-busqueda-facturacion.component';
import { TablaBusquedaFacturacionComponent } from './tabla-busqueda-facturacion/tabla-busqueda-facturacion.component';
import { FechaModule } from "../../../../commons/fecha/fecha.module";
import { PipeNumberModule } from '../../../../commons/number-pipe/number-pipe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PipeTranslationModule,
    InputTextModule,
    ConfirmDialogModule,
    CheckboxModule,
    ButtonModule,
    RadioButtonModule,
    DropdownModule,
    CalendarModule,
    PipeNumberModule,
    DataTableModule,
    GrowlModule, 
    TableModule,
    FechaModule
  ],
  declarations: [BusquedaFacturacionComponent, FiltroBusquedaFacturacionComponent, TablaBusquedaFacturacionComponent],
  exports: [BusquedaFacturacionComponent]
})
export class BusquedaFacturacionModule {}
