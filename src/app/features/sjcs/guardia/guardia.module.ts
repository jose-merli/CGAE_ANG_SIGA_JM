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
import { GuardiaColegiadoModule } from "./guardia-colegiado/guardia-colegiado.module";
import { GestionCargasMasivasGuardiaModule } from "./cargas-masivas-guardia/cargas-masivas-guardia.module";
import { TablaGuardiasComponent } from "./guardias-incompatibilidades/buscador-guardia-incompatibilidades/tabla-guardias/tabla-guardias.component";
import { ButtonModule, ConfirmDialogModule, DropdownModule, GrowlModule, InputTextModule } from "primeng/primeng";
import { TableModule } from "primeng/table";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PipeTranslationModule } from "../../../commons/translate/pipe-translation.module";
import {CheckboxModule} from 'primeng/primeng';
@NgModule({
    declarations: [TablaGuardiasComponent],
    imports: [
        routingGuardia,
        BusquedaGuardiasModule,
        TarjetaResumenFijaModule,
        SaltosCompensacionesGuardiaModule,
        TablaResultadoOrderModule,
        BusquedaGuardiasIncompatibilidadesModule,
        ProgramacionCalendariosModule,
        InscripcionesGuardiaModule,
        GuardiaColegiadoModule,
        GestionCargasMasivasGuardiaModule,
        GestionCargasMasivasGuardiaModule,
        CommonModule,
        FormsModule,
        PipeTranslationModule,
        InputTextModule,
        ButtonModule,
        GrowlModule,
        FormsModule,
        ReactiveFormsModule,
        ConfirmDialogModule,
        TableModule,
        DropdownModule,
        CheckboxModule
    ],

    providers: [

        TablaResultadoOrderCGService,
        GlobalGuardiasService,
    ]
})
export class GuardiaModule { }
