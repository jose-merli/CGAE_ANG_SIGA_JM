import { BuscadorGuardiaComponent } from "./busqueda-guardias/buscador-guardia/buscador-guardia.component";
import { AuthGuard } from "../../../_guards/auth.guards";
import { NgModule } from "../../../../../node_modules/@angular/core";
import { RouterModule, Routes } from "../../../../../node_modules/@angular/router";
import { GestionGuardiaComponent } from "./busqueda-guardias/buscador-guardia/gestion-guardia/gestion-guardia.component";
import { SaltosCompensacionesGuardiaComponent } from "./saltos-compensaciones-guardia/saltos-compensaciones-guardia/saltos-compensaciones-guardia.component";
import { FichaProgramacionComponent } from "./programacionCalendarios/ficha-programacion/ficha-programacion.component";
import { AsistenciaExpresComponent } from "./guardias-asistencias/asistencia-expres/asistencia-expres.component";
import { FichaPreasistenciasComponent } from "./guardias-solicitudes-centralita/ficha-preasistencias/ficha-preasistencias.component";

import { GuardiasInscripcionesComponent } from "./guardias-inscripciones/guardias-inscripciones.component";


const routesGuardia: Routes = [
    {
        path: "guardias",
        component: BuscadorGuardiaComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "gestionGuardias",
        component: GestionGuardiaComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "guardiasSaltosCompensaciones",
        component: SaltosCompensacionesGuardiaComponent,
        canActivate: [AuthGuard]
    },

    {
        path: "fichaProgramacion",
        component: FichaProgramacionComponent,
        canActivate: [AuthGuard]
    },
    {
		path: 'guardiasAsistencias',
		component: AsistenciaExpresComponent,
		canActivate: [AuthGuard]
	},
    {
		path: 'fichaPreasistencia',
		component: FichaPreasistenciasComponent,
		canActivate: [AuthGuard]
	},

    {
        path: "inscripcionesGuardia",
        component: GuardiasInscripcionesComponent,
        canActivate: [AuthGuard]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routesGuardia)],
    exports: [RouterModule]
})
export class MaestrosRoutingModule { }
export const routingGuardia = RouterModule.forChild(routesGuardia);