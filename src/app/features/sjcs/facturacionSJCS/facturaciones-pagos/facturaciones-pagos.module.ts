import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FacturacionesYPagosComponent } from "./facturaciones-pagos.component";
import { InputTextModule, ButtonModule, RadioButtonModule, DropdownModule, GrowlModule, CalendarModule, DataTableModule, CheckboxModule, ConfirmDialogModule } from "primeng/primeng";
import { TableModule } from '../../../../../../node_modules/primeng/table';
import { PipeTranslationModule } from "../../../../commons/translate/pipe-translation.module";
import { FormsModule } from "@angular/forms";
import { FiltroBusquedaFacturacionComponent } from './filtro-busqueda-facturacion/filtro-busqueda-facturacion.component';
import { TablaBusquedaFacturacionComponent } from './tabla-busqueda-facturacion/tabla-busqueda-facturacion.component';
import { FechaModule } from "../../../../commons/fecha/fecha.module";
import { PipeNumberModule } from '../../../../commons/number-pipe/number-pipe.module';
import { GestionFacturacionComponent } from './gestion-facturacion/gestion-facturacion.component';
import { DatosFacturacionComponent } from './gestion-facturacion/datos-facturacion/datos-facturacion.component';
import { ConceptosFacturacionComponent } from './gestion-facturacion/conceptos-facturacion/conceptos-facturacion.component';
import { BaremosComponent } from './gestion-facturacion/baremos/baremos.component';
import { PagosComponent } from './gestion-facturacion/pagos/pagos.component';
import { CartasFacturacionComponent } from './gestion-facturacion/cartas-facturacion/cartas-facturacion.component';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PipeTranslationModule,
    TooltipModule,
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
  declarations: [FacturacionesYPagosComponent, FiltroBusquedaFacturacionComponent, TablaBusquedaFacturacionComponent, GestionFacturacionComponent, DatosFacturacionComponent, ConceptosFacturacionComponent, BaremosComponent, PagosComponent, CartasFacturacionComponent],
  exports: [FacturacionesYPagosComponent]
})
export class FacturacionesYPagosModule {}
