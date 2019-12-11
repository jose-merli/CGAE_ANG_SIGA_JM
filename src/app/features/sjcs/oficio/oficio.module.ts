import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenubarModule } from 'primeng/menubar';

import { routingOficio } from './oficio-routing.module';
import { GestionTurnosModule } from './turnos/turnos.module';

@NgModule({
        declarations: [],
        imports: [
                CommonModule,
                MenubarModule,
                routingOficio,
                GestionTurnosModule
        ],

        providers: []
})
export class OficioModule { }
