import { NgModule } from "../../../../../node_modules/@angular/core";
import { routingGuardia } from "./guardia-routing.module";
import { BusquedaGuardiasModule } from "./busqueda-guardias/busqueda-guardias.module";
import { TarjetaResumenFijaModule } from "../../../commons/tarjeta-resumen-fija/tarjeta-resumen-fija.module";

@NgModule({
    declarations: [],
    imports: [
        routingGuardia,
        BusquedaGuardiasModule,
        TarjetaResumenFijaModule,
    ],

    providers: []
})
export class GuardiaModule { }
