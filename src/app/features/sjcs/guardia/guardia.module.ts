import { NgModule } from "../../../../../node_modules/@angular/core";
import { routingGuardia } from "./guardia-routing.module";
import { BusquedaGuardiasModule } from "./busqueda-guardias/busqueda-guardias.module";
import { TarjetaResumenFijaModule } from "../../../commons/tarjeta-resumen-fija/tarjeta-resumen-fija.module";
import { SaltosCompensacionesGuardiaModule } from "./saltos-compensaciones-guardia/saltos-compensaciones-guardia.module";
import { TablaResultadoOrderModule } from "../../../commons/tabla-resultado-order/tabla-resultado-order.module";
import { TablaResultadoOrderCGService } from "../../../commons/tabla-resultado-order/tabla-resultado-order-cg.service";
import { GlobalGuardiasService } from "./guardiasGlobal.service";
import { BusquedaGuardiasIncompatibilidadesModule } from "./guardias-incompatibilidades/busqueda-guardias-incompatibilidades.module";
import { ProgramacionCalendariosModule } from "./programacionCalendarios/programacionCalendarios.module";
import { InscripcionesGuardiaModule } from "./guardias-inscripciones/guardias-inscripciones.module";

@NgModule({
    declarations: [],
    imports: [
        routingGuardia,
        BusquedaGuardiasModule,
        TarjetaResumenFijaModule,
        SaltosCompensacionesGuardiaModule,
        TablaResultadoOrderModule,
        BusquedaGuardiasIncompatibilidadesModule,
        ProgramacionCalendariosModule,
        InscripcionesGuardiaModule
    ],

    providers: [

        TablaResultadoOrderCGService,
        GlobalGuardiasService,
    ]
})
export class GuardiaModule { }
