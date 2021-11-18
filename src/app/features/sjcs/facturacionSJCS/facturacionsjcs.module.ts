import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { routingFacturacionsjcs } from './facturacionsjcs-routing.module';
import { SpinnerModule } from '../../../../../node_modules/primeng/primeng';
import { MenubarModule } from 'primeng/menubar';

import { FacturacionesYPagosModule } from './facturaciones-pagos/facturaciones-pagos.module';
import { CartasFacturacionPagoModule } from './cartas-facturacion-pago/cartas-facturacion-pago.module';


@NgModule({
        declarations: [],
        imports: [
                CommonModule,
                routingFacturacionsjcs,
                FacturacionesYPagosModule,
                MenubarModule,
                SpinnerModule,
                CartasFacturacionPagoModule
        ],

        providers: []
})
export class FacturacionSJCSModule { }
