import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../_guards/auth.guards';
import { GestionJusticiablesComponent } from './gestion-justiciables/gestion-justiciables.component';
import { BusquedaJusticiablesComponent } from './busqueda-justiciables/busqueda-justiciables.component';

const routesJusticiables: Routes = [
  {
    path: "justiciables",
    component: BusquedaJusticiablesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "gestionJusticiables",
    component: GestionJusticiablesComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routesJusticiables)],
  exports: [RouterModule]
})
export class JusticiablesRoutingModule { }
export const routingJusticiables = RouterModule.forChild(routesJusticiables);
