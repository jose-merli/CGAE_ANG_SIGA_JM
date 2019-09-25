import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../_guards/auth.guards';
import { GestionZonasComponent } from './gestion-zonas/gestion-zonas.component';
import { FichaGrupoZonaComponent } from './gestion-zonas/ficha-grupo-zona/ficha-grupo-zona.component';
import { BusquedaJuzgadosComponent } from './juzgados/busqueda-juzgados.component';
import { GestionJuzgadosComponent } from './juzgados/gestion-juzgados/gestion-juzgados.component';
import { BusquedaAreasComponent } from './areas/busqueda-areas.component';
import { GestionAreasComponent } from './areas/edicion-areas/gestion-areas.component';
import { FundamentosCalificacionComponent } from './fundamentos-calificacion/fundamentos-calificacion.component';
import { GestionFundamentosCalificacionComponent } from './fundamentos-calificacion/gestion-fundamentos-calificacion/gestion-fundamentos-calificacion.component';

const routesMaestros: Routes = [
  {
    path: "zonasYsubzonas",
    component: GestionZonasComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "fichaGrupoZonas",
    component: FichaGrupoZonaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "mantenimientoJuzgados",
    component: BusquedaJuzgadosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "gestionJuzgados",
    component: GestionJuzgadosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "gestionFundamentos",
    component: GestionFundamentosCalificacionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "fichaGrupoAreas",
    component: GestionAreasComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "areasYMaterias",
    component: BusquedaAreasComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "fundamentosCalificacion",
    component: FundamentosCalificacionComponent,
    canActivate: [AuthGuard]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routesMaestros)],
  exports: [RouterModule]
})
export class MaestrosRoutingModule { }
export const routingMaestros = RouterModule.forChild(routesMaestros);
