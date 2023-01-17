import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { routingFacturacionsjcs } from './facturacionsjcs-routing.module';
import { SpinnerModule } from '../../../../../node_modules/primeng/primeng';
import { MenubarModule } from 'primeng/menubar';

import { FacturacionesYPagosModule } from './facturaciones-pagos/facturaciones-pagos.module';
import { CartasFacturacionPagoModule } from './cartas-facturacion-pago/cartas-facturacion-pago.module';
import {MovimientosVariosModule} from './movimientos-varios/movimientos-varios.module';
import { GenerarImpreso190Component } from './generar-impreso190/generar-impreso190.component';


@NgModule({
        declarations: [
              //  FiltrosMovimientosVariosComponent
        ],
        imports: [
                CommonModule,
                routingFacturacionsjcs,
                FacturacionesYPagosModule,
                MenubarModule,
                SpinnerModule,
                CartasFacturacionPagoModule,
                MovimientosVariosModule,
                GenerarImpreso190Component
        ],

        providers: []
})
export class FacturacionSJCSModule { }
