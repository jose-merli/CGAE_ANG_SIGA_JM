import { NgModule, LOCALE_ID, EventEmitter } from '@angular/core';
import { CommonModule, DatePipe, APP_BASE_HREF } from '@angular/common';

import { routingMaestros } from './maestros-routing.module';
import { GestionZonasModule } from './gestion-zonas/gestion-zonas.module';
import { GestionAreasModule } from './areas/gestion-areas.module';
import { GestionModulosModule } from './maestros-modulos/maestros-modulos.module';

import { MenubarModule } from 'primeng/menubar';
import { JuzgadosModule } from './juzgados/juzgados.module';
import { GestionCostesfijosModule } from './costes-fijos/gestion-costesfijos/gestion-costesfijos.module';
import { GestionPartidasComponent } from './partidas/partidas.module';
import { TablaPartidasComponent } from './partidas/gestion-partidas/gestion-partidaspresupuestarias.component';


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        routingMaestros,
        GestionZonasModule,
        MenubarModule,
        JuzgadosModule,
        GestionAreasModule,
        GestionCostesfijosModule,
        GestionModulosModule,
        GestionPartidasComponent
    ],

    providers: []
})
export class MaestrosModule { }
