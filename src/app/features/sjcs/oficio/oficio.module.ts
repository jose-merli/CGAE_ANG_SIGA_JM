import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenubarModule } from 'primeng/menubar';

import { GestionTurnosModule } from '../oficio/turnos/turnos.module';
import { OficioRoutingModule, routingOficio } from './oficio-routing.module';

@NgModule({
        declarations: [],
        imports: [
                OficioRoutingModule,
                CommonModule,
                MenubarModule,
                GestionTurnosModule,
                routingOficio
        ],

        providers: []
})
export class OficioModule { }
