import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routesSjcs: Routes = [
  {
    path: "zonasYsubzonas",
    loadChildren: () => import('./maestros/maestros.module').then(m => m.MaestrosModule),
  },
  {
    path: "mantenimientoJuzgados",
    loadChildren: () => import('./maestros/maestros.module').then(m => m.MaestrosModule),
  },
  {
    path: "areasYMaterias",
    loadChildren: () => import('./maestros/maestros.module').then(m => m.MaestrosModule),
  },
  {
    path: "costesFijos",
    loadChildren: () => import('./maestros/maestros.module').then(m => m.MaestrosModule),
  },
  {
    path: "fundamentosCalificacion",
    loadChildren: () => import('./maestros/maestros.module').then(m => m.MaestrosModule),
  },
  {
    path: "fundamentosResolucion",
    loadChildren: () => import('./maestros/maestros.module').then(m => m.MaestrosModule),
  },
  {
    path: "maestrosModulos",
    loadChildren: () => import('./maestros/maestros.module').then(m => m.MaestrosModule),
  },
  {
    path: "mantenimientoPrisiones",
    loadChildren: () => import('./maestros/maestros.module').then(m => m.MaestrosModule),
  },
  {
    path: "partidosJudiciales",
    loadChildren: () => import('./maestros/maestros.module').then(m => m.MaestrosModule),
  },
  {
    path: "mantenimientoComisarias",
    loadChildren: () => import('./maestros/maestros.module').then(m => m.MaestrosModule),
  },
  {
    path: "calendarioLaboralAgenda",
    loadChildren: () => import('./maestros/maestros.module').then(m => m.MaestrosModule),
  },
  {
    path: "mantenimientoprocuradores",
    loadChildren: () => import('./maestros/maestros.module').then(m => m.MaestrosModule),
  },
  {
    path: "tiposActuacion",
    loadChildren: () => import('./maestros/maestros.module').then(m => m.MaestrosModule),
  },
  {
    path: "destinatariosRetenciones",
    loadChildren: () => import('./maestros/maestros.module').then(m => m.MaestrosModule),
  },
  {
    path: "procedimientos",
    loadChildren: () => import('./maestros/maestros.module').then(m => m.MaestrosModule),
  },
  {
    path: "documentacionEJG",
    loadChildren: () => import('./maestros/maestros.module').then(m => m.MaestrosModule),
  },
  {
    path: "justiciables",
    loadChildren: () => import('./justiciables/justiciables.module').then(m => m.JusticiablesModule),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routesSjcs)],
  exports: [RouterModule]
})
export class SjcsRoutingModule { }
export const routingSjcs = RouterModule.forChild(routesSjcs);
