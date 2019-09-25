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
    path: "fundamentosCalificacion",
    loadChildren: () => import('./maestros/maestros.module').then(m => m.MaestrosModule),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routesSjcs)],
  exports: [RouterModule]
})
export class SjcsRoutingModule { }
export const routingSjcs = RouterModule.forChild(routesSjcs);
