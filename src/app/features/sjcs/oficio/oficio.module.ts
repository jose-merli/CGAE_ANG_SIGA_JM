import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenubarModule } from 'primeng/menubar';

import { routingOficio } from './oficio-routing.module';
import { GestionTurnosModule } from './turnos/turnos.module';
import { GestionInscripcionesModule } from './inscripciones/inscripciones.module';
// import { GestionTurnosModule } from '../oficio/turnos/turnos.module';
import { OficioRoutingModule } from './oficio-routing.module';
import { GestionBajasTemporalesModule } from './bajas-temporales/bajas-temporales.module';
import { GrowlModule } from 'primeng/growl';

@NgModule({
        declarations: [],
        imports: [
                CommonModule,
                MenubarModule,
                routingOficio,
                GestionTurnosModule,
                GestionInscripcionesModule,
                GestionBajasTemporalesModule,
                GrowlModule

        ],

        providers: []
})
export class OficioModule { }
