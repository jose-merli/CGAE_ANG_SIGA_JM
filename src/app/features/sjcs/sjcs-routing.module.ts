import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routesSjcs)],
  exports: [RouterModule]
})
export class SjcsRoutingModule { }
export const routingSjcs = RouterModule.forChild(routesSjcs);
