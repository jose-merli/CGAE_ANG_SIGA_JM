import { NgModule } from "../../../../../node_modules/@angular/core";
import { BusquedaGuardiasModule } from "../../guardias/busqueda-guardias/busqueda-guardias.module";
import { routingGuardia } from "./guardia-routing.module";

@NgModule({
    declarations: [],
    imports: [
        BusquedaGuardiasModule,
        routingGuardia,
    ],

    providers: []
})
export class GuardiaModule { }
