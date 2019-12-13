import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenubarModule } from 'primeng/menubar';

import { routingOficio } from './oficio-routing.module';
import { GestionTurnosModule } from './turnos/turnos.module';
import { GestionInscripcionesModule } from './inscripciones/inscripciones.module';

@NgModule({
        declarations: [],
        imports: [
                CommonModule,
                MenubarModule,
                routingOficio,
                GestionTurnosModule,
                GestionInscripcionesModule
        ],

        providers: []
})
export class OficioModule { }
