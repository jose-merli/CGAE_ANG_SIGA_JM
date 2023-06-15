import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../_guards/auth.guards';
import { GestionZonasComponent } from './gestion-zonas/gestion-zonas.component';
import { FichaGrupoZonaComponent } from './gestion-zonas/ficha-grupo-zona/ficha-grupo-zona.component';
import { BusquedaJuzgadosComponent } from './juzgados/busqueda-juzgados.component';
import { GestionJuzgadosComponent } from './juzgados/gestion-juzgados/gestion-juzgados.component';
import { BusquedaAreasComponent } from './areas/busqueda-areas.component';
import { GestionAreasComponent } from './areas/edicion-areas/gestion-areas.component';
import { MaestrosModulosComponent } from './maestros-modulos/busqueda-modulosybasesdecompensacion.component';
import { GestionModulosYBasesComponent } from './maestros-modulos/edicion-modulos/gestion-modulosybasesdecompensacion.component';
import { FundamentosCalificacionComponent } from './fundamentos-calificacion/fundamentos-calificacion.component';
import { GestionFundamentosCalificacionComponent } from './fundamentos-calificacion/gestion-fundamentos-calificacion/gestion-fundamentos-calificacion.component';
import { GestionCostesfijosComponent } from './costes-fijos/gestion-costesfijos/gestion-costesfijos.component';
import { PartidasComponent } from './partidas/partidas.component';
import { BusquedaFundamentosresolucionComponent } from './fundamentos-resolucion/busqueda-fundamentosresolucion/busqueda-fundamentosresolucion.component';
import { GestionFundamentosresolucionComponent } from './fundamentos-resolucion/busqueda-fundamentosresolucion/gestion-fundamentosresolucion/gestion-fundamentosresolucion.component';
import { BusquedaPrisionesComponent } from './prisiones/busqueda-prisiones/busqueda-prisiones.component';
import { GestionPrisionesComponent } from './prisiones/gestion-prisiones/gestion-prisiones.component';
import { ComisariasComponent } from './comisarias/comisarias/comisarias.component';
import { GestionComisariasComponent } from './comisarias/comisarias/gestion-comisarias/gestion-comisarias.component';
import { BusquedaCalendarioAgendaLaboralComponent } from './calendario-laboral-agenda/busqueda-calendario-agenda-laboral/busqueda-calendario-agenda-laboral.component';
import { TiposAsistenciaComponent } from './tiposAsistencia/tiposAsistencia.component';
import { BusquedaProcuradoresComponent } from './procuradores/busqueda-procuradores/busqueda-procuradores.component';
import { GestionProcuradoresComponent } from './procuradores/busqueda-procuradores/gestion-procuradores/gestion-procuradores.component';
import { GestionDocumentacionejgComponent } from './documentacion-ejg/gestion-documentacionejg/gestion-documentacionejg.component';
import { TiposActuacionComponent } from './tiposActuacion/tiposActuacion.component';
import { DestinatariosRetencionesComponent } from './destinatarios-retenciones/destinatarios-retenciones.component';
import { BusquedaProcedimientosComponent } from './procedimientos/busqueda-procedimientos/busqueda-procedimientos.component';
import { RetencionesIRPFComponent } from './retenciones-IRPF/retenciones-IRPF.component';
import { DocumentacionEJGComponent } from './documentacion-ejg/documentacion-ejg.component';
import { PartidosJudicialesComponent } from './partidos-judiciales/partidas-judiciales.component';

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
    path: "tiposAsistencia",
    component: TiposAsistenciaComponent,
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
    path: "gestionModulos",
    component: GestionModulosYBasesComponent,
    canActivate: [AuthGuard]
  }, {
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
    path: "mantenimientoComisarias",
    component: ComisariasComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "gestionComisarias",
    component: GestionComisariasComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "gestionPrisiones",
    component: GestionPrisionesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "calendarioLaboralAgenda",
    component: BusquedaCalendarioAgendaLaboralComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "gestionProcuradores",
    component: GestionProcuradoresComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "mantenimientoprocuradores",
    component: BusquedaProcuradoresComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "documentacionEJG",
    component: DocumentacionEJGComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "gestiondocumentacionejg",
    component: GestionDocumentacionejgComponent,
    canActivate: [AuthGuard]
  }, {
    path: "tiposActuacion",
    component: TiposActuacionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "destinatariosRetenciones",
    component: DestinatariosRetencionesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "procedimientos",
    component: BusquedaProcedimientosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "retencionesIRPF",
    component: RetencionesIRPFComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "partidosJudiciales",
    component: PartidosJudicialesComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routesMaestros)],
  exports: [RouterModule]
})
export class MaestrosRoutingModule { }
export const routingMaestros = RouterModule.forChild(routesMaestros);
