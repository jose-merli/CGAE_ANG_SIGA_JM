import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../_guards/auth.guards';
import { FacturacionesYPagosComponent } from './facturaciones-pagos/facturaciones-pagos.component';
import { GestionFacturacionComponent } from './facturaciones-pagos/gestion-facturacion/gestion-facturacion.component';
import { CartasFacturacionPagoComponent } from './cartas-facturacion-pago/cartas-facturacion-pago.component';
import { BusquedaGeneralSJCSComponent } from '../../../commons/busqueda-generalSJCS/busqueda-generalSJCS.component';
import { GestionPagosComponent } from './facturaciones-pagos/gestion-pagos/gestion-pagos.component';
import { RetencionesComponent } from './retenciones/retenciones.component';
import { FichaRetencionJudicialComponent } from './retenciones/ficha-retencion-judicial/ficha-retencion-judicial.component';
import { BaremosDeGuardiaComponent } from './baremos-de-guardia/baremos-de-guardia.component';
import { FichaCertificacionFacComponent } from './certificacion-fac/ficha-certificacion-fac/ficha-certificacion-fac.component';

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
    path: 'retenciones',
    component: RetencionesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "fichaRetencionJudicial",
    component: FichaRetencionJudicialComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'gestionGeneralSJCS',
    component: BusquedaGeneralSJCSComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'baremosDeGuardia',
    component: BaremosDeGuardiaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'fichaCertificacionFac',
    component: FichaCertificacionFacComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routesFacturacionsjcs)],
  exports: [RouterModule]
})
export class FacturacionsjcsRoutingModule { }
export const routingFacturacionsjcs = RouterModule.forChild(routesFacturacionsjcs);
