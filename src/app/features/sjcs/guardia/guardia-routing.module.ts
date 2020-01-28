import { BuscadorGuardiaComponent } from "./busqueda-guardias/buscador-guardia/buscador-guardia.component";
import { AuthGuard } from "../../../_guards/auth.guards";
import { NgModule } from "../../../../../node_modules/@angular/core";
import { RouterModule, Routes } from "../../../../../node_modules/@angular/router";
import { GestionGuardiaComponent } from "./busqueda-guardias/buscador-guardia/gestion-guardia/gestion-guardia.component";
import { SaltosCompensacionesGuardiaComponent } from "./saltos-compensaciones-guardia/saltos-compensaciones-guardia/saltos-compensaciones-guardia.component";

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
];

@NgModule({
    imports: [RouterModule.forChild(routesGuardia)],
    exports: [RouterModule]
})
export class MaestrosRoutingModule { }
export const routingGuardia = RouterModule.forChild(routesGuardia);
