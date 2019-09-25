import { NgModule, LOCALE_ID, EventEmitter } from '@angular/core';
import { CommonModule, DatePipe, APP_BASE_HREF } from '@angular/common';

import { routingMaestros } from './maestros-routing.module';
import { GestionZonasModule } from './gestion-zonas/gestion-zonas.module';
import { GestionAreasModule } from './areas/gestion-areas.module';
import { MenubarModule } from 'primeng/menubar';
import { JuzgadosModule } from './juzgados/juzgados.module';
import { FundamentosCalificacionModule } from './fundamentos-calificacion/fundamentos-calificacion.module';


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        routingMaestros,
        GestionZonasModule,
        MenubarModule,
        JuzgadosModule,
        GestionAreasModule,
        FundamentosCalificacionModule
    ],

    providers: []
})
export class MaestrosModule { }
