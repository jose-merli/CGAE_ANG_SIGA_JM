import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../_guards/auth.guards';
import { FacturacionesYPagosComponent } from './facturaciones-pagos/facturaciones-pagos.component';
import { GestionFacturacionComponent } from './facturaciones-pagos/gestion-facturacion/gestion-facturacion.component';
import { CartasFacturacionPagoComponent } from './cartas-facturacion-pago/cartas-facturacion-pago.component';
import { BusquedaGeneralSJCSComponent } from '../../../commons/busqueda-generalSJCS/busqueda-generalSJCS.component';
import { GestionPagosComponent } from './facturaciones-pagos/gestion-pagos/gestion-pagos.component';
import {MovimientosVariosComponent} from './movimientos-varios/movimientos-varios.component';
import { FichaMovimientosVariosComponent } from './movimientos-varios/ficha-movimientos-varios/ficha-movimientos-varios.component';

const routesFacturacionsjcs: Routes = [
  {
    path: "facturacionesYPagos",
    component: FacturacionesYPagosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "fichaFacturacion",
    component: GestionFacturacionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "fichaPagos",
    component: GestionPagosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'cartaFacturacionPago',
    component: CartasFacturacionPagoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'gestionGeneralSJCS',
    component: BusquedaGeneralSJCSComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'movimientosVarios',
    component: MovimientosVariosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "fichaMovimientosVarios",
    component: FichaMovimientosVariosComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routesFacturacionsjcs)],
  exports: [RouterModule]
})
export class FacturacionsjcsRoutingModule { }
export const routingFacturacionsjcs = RouterModule.forChild(routesFacturacionsjcs);
