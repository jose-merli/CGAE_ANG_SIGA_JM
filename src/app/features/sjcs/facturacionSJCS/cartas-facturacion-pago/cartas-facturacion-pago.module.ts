import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartasFacturacionPagoComponent } from './cartas-facturacion-pago.component';
import { FiltroCartasFacturacionPagoComponent } from './filtro-cartas-facturacion-pago/filtro-cartas-facturacion-pago.component';
import { TablaCartasFacturacionPagoComponent } from './tabla-cartas-facturacion-pago/tabla-cartas-facturacion-pago.component';
import { PipeTranslationModule } from '../../../../commons/translate/pipe-translation.module';
import { FormsModule } from '../../../../../../node_modules/@angular/forms';
import { InputTextModule, CheckboxModule, ConfirmDialogModule, ButtonModule, RadioButtonModule, DropdownModule, CalendarModule, DataTableModule, GrowlModule, MultiSelectModule } from '../../../../../../node_modules/primeng/primeng';
import { PipeNumberModule } from '../../../../commons/number-pipe/number-pipe.module';
import { TableModule } from '../../../../../../node_modules/primeng/table';
import { BusquedaColegiadoExpressModule } from '../../../../commons/busqueda-colegiado-express/busqueda-colegiado-express.module';

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
    BusquedaColegiadoExpressModule,
    MultiSelectModule,
  ],
  declarations: [CartasFacturacionPagoComponent, FiltroCartasFacturacionPagoComponent, TablaCartasFacturacionPagoComponent]
})
export class CartasFacturacionPagoModule { }
