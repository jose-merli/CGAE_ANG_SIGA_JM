import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { routingSjcs } from './sjcs-routing.module';
import { MaestrosModule } from './maestros/maestros.module';
import { JusticiablesModule } from './justiciables/justiciables.module';
import { GuardiaModule } from './guardia/guardia.module';
import { OficioModule } from './oficio/oficio.module';
import { EJGModule } from './ejg/ejg.module';
import { ConfirmDialogModule, DropdownModule, GrowlModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from "primeng/checkbox";
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MaestrosModule,
    OficioModule,
    JusticiablesModule,
    GuardiaModule,
    ConfirmDialogModule,
    TableModule,
    GrowlModule,
    CheckboxModule,
    DropdownModule,
    routingSjcs,

    EJGModule,
    routingSjcs
  ],
  providers: []
})
export class SjcsModule { }
