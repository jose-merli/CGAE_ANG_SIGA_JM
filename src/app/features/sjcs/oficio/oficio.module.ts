import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenubarModule } from 'primeng/menubar';

import { GestionTurnosModule } from '../oficio/turnos/turnos.module';
import { routingOficio } from './oficio-routing.module';

@NgModule({
        declarations: [],
        imports: [
                CommonModule,
                MenubarModule,
                routingOficio,
                GestionTurnosModule],

        providers: []
})
export class OficioModule { }
