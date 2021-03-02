import { NgModule } from "../../../../../node_modules/@angular/core";
import { routingGuardia } from "./guardia-routing.module";
import { BusquedaGuardiasModule } from "./busqueda-guardias/busqueda-guardias.module";
import { TarjetaResumenFijaModule } from "../../../commons/tarjeta-resumen-fija/tarjeta-resumen-fija.module";
import { SaltosCompensacionesGuardiaModule } from "./saltos-compensaciones-guardia/saltos-compensaciones-guardia.module";
import { TablaResultadoOrderModule } from "../../../commons/tabla-resultado-order/tabla-resultado-order.module";
import { TablaResultadoOrderCGService } from "../../../commons/tabla-resultado-order/tabla-resultado-order-cg.service";

@NgModule({
    declarations: [],
    imports: [
        routingGuardia,
        BusquedaGuardiasModule,
        TarjetaResumenFijaModule,
        SaltosCompensacionesGuardiaModule,
        TablaResultadoOrderModule
    ],

    providers: [
        
		TablaResultadoOrderCGService,
    ]
})
export class GuardiaModule { }
