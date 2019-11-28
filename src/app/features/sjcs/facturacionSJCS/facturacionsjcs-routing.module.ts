import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../_guards/auth.guards';
import { BusquedaFacturacionComponent } from './busqueda-facturacion/busqueda-facturacion.component';

const routesFacturacionsjcs: Routes = [
  {
    path: "facturacionesYPagos",
    component: BusquedaFacturacionComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routesFacturacionsjcs)],
  exports: [RouterModule]
})
export class FacturacionsjcsRoutingModule { }
export const routingFacturacionsjcs = RouterModule.forChild(routesFacturacionsjcs);
