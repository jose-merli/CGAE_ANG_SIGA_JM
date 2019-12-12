import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../_guards/auth.guards';
import { FacturacionesYPagosComponent } from './facturaciones-pagos/facturaciones-pagos.component';
import { GestionFacturacionComponent } from './facturaciones-pagos/gestion-facturacion/gestion-facturacion.component';

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
];

@NgModule({
  imports: [RouterModule.forChild(routesFacturacionsjcs)],
  exports: [RouterModule]
})
export class FacturacionsjcsRoutingModule { }
export const routingFacturacionsjcs = RouterModule.forChild(routesFacturacionsjcs);
