import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiSelectModule } from "primeng/multiselect";
import { MenubarModule } from 'primeng/menubar';
import { routingOficio } from './oficio-routing.module';
import { GestionTurnosModule } from './turnos/turnos.module';
import { GestionInscripcionesModule } from './inscripciones/inscripciones.module';
import { GestionCargasMasivasOficioModule } from './cargas-masivas-oficio/cargas-masivas-oficio.module';
// import { GestionTurnosModule } from '../oficio/turnos/turnos.module';
import { GestionBajasTemporalesModule } from './bajas-temporales/bajas-temporales.module';
import { GrowlModule } from 'primeng/growl';
import { PipeTranslationModule } from '../../../commons/translate/pipe-translation.module';

//DESGINACIONES

import { FechaModule } from '../../../commons/fecha/fecha.module';

import { ButtonModule, CheckboxModule, RadioButtonModule, DropdownModule, InputTextModule, ConfirmDialogModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material';
import { BusquedaColegiadoExpressModule } from '../../../commons/busqueda-colegiado-express/busqueda-colegiado-express.module';
import {FormularioBusquedaComponent} from './cargas-masivas-oficio/formulario-busqueda/formulario-busqueda.component';

import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/primeng';
import { TablaResultadoMixDAService } from '../../../commons/tabla-resultado-mix/tabla-resultado-mix-da.service';
import { SaltosCompensacionesOficioModule } from './saltos-compensaciones-oficio/saltos-compensaciones-oficio.module';




//import { DesignacionesComponent } from './designaciones/designaciones.component';


@NgModule({
        declarations: [],
        imports: [
                TooltipModule,
                TableModule,
                CommonModule,
                MenubarModule,
                routingOficio,
                GestionTurnosModule,
                GestionInscripcionesModule,
                GestionCargasMasivasOficioModule,
                GestionBajasTemporalesModule,
                GrowlModule,
                RadioButtonModule,
                DropdownModule, 
                InputTextModule,
                ConfirmDialogModule,
                PipeTranslationModule,
                ButtonModule,
                FormsModule,
                MatExpansionModule,
                BusquedaColegiadoExpressModule,
                CheckboxModule,
                FechaModule,
                MultiSelectModule,
                SaltosCompensacionesOficioModule,
        ],

        providers: [
                TablaResultadoMixDAService
        ]
})
export class OficioModule { }
