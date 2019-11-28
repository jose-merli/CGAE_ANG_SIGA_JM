import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { routingFacturacionsjcs } from './facturacionsjcs-routing.module';
import { SpinnerModule } from '../../../../../node_modules/primeng/primeng';
import { MenubarModule } from 'primeng/menubar';

import { BusquedaFacturacionModule } from './busqueda-facturacion/busqueda-facturacion.module';

@NgModule({
        declarations: [],
        imports: [
                CommonModule,
                routingFacturacionsjcs,
                BusquedaFacturacionModule,
                MenubarModule,
                SpinnerModule
        ],

        providers: []
})
export class FacturacionSJCSModule { }
