import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../_guards/auth.guards';
import { TurnosComponent } from './turnos/busqueda-turnos.component';
import { FichaTurnosComponent } from './turnos/ficha-turnos/ficha-turnos.component';
import { InscripcionesComponent } from './inscripciones/busqueda-inscripciones.component';


const routesOficio: Routes = [
  {
    path: "turnos",
    component: TurnosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "gestionTurnos",
    component: FichaTurnosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "inscripciones",
    component: InscripcionesComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routesOficio)],
  exports: [RouterModule]
})
export class OficioRoutingModule { }
export const routingOficio = RouterModule.forChild(routesOficio);
