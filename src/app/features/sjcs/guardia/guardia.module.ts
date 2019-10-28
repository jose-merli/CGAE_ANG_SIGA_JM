import { NgModule } from "../../../../../node_modules/@angular/core";
import { routingGuardia } from "./guardia-routing.module";
import { BusquedaGuardiasModule } from "./busqueda-guardias/busqueda-guardias.module";

@NgModule({
    declarations: [],
    imports: [
        routingGuardia,
        BusquedaGuardiasModule,
    ],

    providers: []
})
export class GuardiaModule { }
