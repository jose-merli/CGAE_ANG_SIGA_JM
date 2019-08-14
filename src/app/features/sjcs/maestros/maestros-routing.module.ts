import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../_guards/auth.guards';
import { GestionZonasComponent } from './gestion-zonas/gestion-zonas.component';
import { FichaGrupoZonaComponent } from './gestion-zonas/ficha-grupo-zona/ficha-grupo-zona.component';

const routesMaestros: Routes = [
  {
    path: "zonasYsubzonas",
    component: GestionZonasComponent,
    canActivate: [AuthGuard]
  }, {
    path: "fichaGrupoZonas",
    component: FichaGrupoZonaComponent,
    canActivate: [AuthGuard]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routesMaestros)],
  exports: [RouterModule]
})
export class MaestrosRoutingModule { }
export const routingMaestros = RouterModule.forChild(routesMaestros);
