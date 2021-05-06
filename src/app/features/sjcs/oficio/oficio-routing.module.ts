import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../_guards/auth.guards';
import { TurnosComponent } from './turnos/busqueda-turnos.component';
import { FichaTurnosComponent } from './turnos/ficha-turnos/ficha-turnos.component';
import { InscripcionesComponent } from './inscripciones/busqueda-inscripciones.component';
import { FichaInscripcionesComponent } from './inscripciones/ficha-inscripciones/ficha-inscripciones.component';
import { BajasTemporalesComponent } from './bajas-temporales/busqueda-bajas-temporales.component';
import { CargasMasivasOficioComponent } from './cargas-masivas-oficio/cargas-masivas-oficio.component';
import { FichaDesignacionesComponent } from './designaciones/ficha-designaciones/ficha-designaciones.component';
import { SaltosCompensacionesOficioComponent } from './saltos-compensaciones-oficio/saltos-compensaciones-oficio.component';
import { FichaActuacionComponent } from './designaciones/ficha-designaciones/detalle-tarjeta-actuaciones-designa/ficha-actuacion/ficha-actuacion.component';
import { FichaCambioLetradoComponent } from './designaciones/ficha-designaciones/detalle-tarjeta-letrados-designa/ficha-cambio-letrado/ficha-cambio-letrado.component';


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
  {
    path: "gestionInscripciones",
    component: FichaInscripcionesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "bajasTemporales",
    component: BajasTemporalesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "cargasMasivasOficio",
    component: CargasMasivasOficioComponent,
    canActivate: [AuthGuard]
  },
  {
		path: 'fichaDesignaciones',
		component: FichaDesignacionesComponent,
		canActivate: [ AuthGuard ]
	},
  {
		path: 'fichaCambioLetrado',
		component: FichaCambioLetradoComponent,
		canActivate: [ AuthGuard ]
	},
  {
    path: "saltosYCompensaciones",
    component: SaltosCompensacionesOficioComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "fichaActDesigna",
    component: FichaActuacionComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routesOficio)],
  exports: [RouterModule]
})
export class OficioRoutingModule { }
export const routingOficio = RouterModule.forChild(routesOficio);
