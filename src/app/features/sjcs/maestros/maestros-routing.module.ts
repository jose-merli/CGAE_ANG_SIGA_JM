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
import { MaestrosModulosComponent } from './maestros-modulos/maestros-modulos.component';
import { GestionCostesfijosComponent } from './costes-fijos/gestion-costesfijos/gestion-costesfijos.component';
import { PartidasComponent } from './partidas/partidas.component';
import { BusquedaFundamentosresolucionComponent } from './fundamentos-resolucion/busqueda-fundamentosresolucion/busqueda-fundamentosresolucion.component';
import { GestionFundamentosresolucionComponent } from './fundamentos-resolucion/busqueda-fundamentosresolucion/gestion-fundamentosresolucion/gestion-fundamentosresolucion.component';
import { BusquedaPrisionesComponent } from './prisiones/busqueda-prisiones/busqueda-prisiones.component';
import { GestionPrisionesComponent } from './prisiones/gestion-prisiones/gestion-prisiones.component';

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
  },
  {
    path: "costesFijos",
    component: GestionCostesfijosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "fundamentosResolucion",
    component: BusquedaFundamentosresolucionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "gestionFundamentosResolucion",
    component: GestionFundamentosresolucionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "maestrosModulos",
    component: MaestrosModulosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "partidas",
    component: PartidasComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "mantenimientoPrisiones",
    component: BusquedaPrisionesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "gestionPrisiones",
    component: GestionPrisionesComponent,
    canActivate: [AuthGuard]
  }


];

@NgModule({
  imports: [RouterModule.forChild(routesMaestros)],
  exports: [RouterModule]
})
export class MaestrosRoutingModule { }
export const routingMaestros = RouterModule.forChild(routesMaestros);
