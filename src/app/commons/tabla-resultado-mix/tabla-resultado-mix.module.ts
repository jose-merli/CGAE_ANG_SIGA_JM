import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableModule, PaginatorModule, InputTextModule, DropdownModule, ButtonModule, CheckboxModule, GrowlModule, MultiSelectModule } from '../../../../node_modules/primeng/primeng';
import { FormsModule } from '../../../../node_modules/@angular/forms';
import { PipeTranslationModule } from '../translate/pipe-translation.module';
import { TableModule } from '../../../../node_modules/primeng/table';
import { TablaResultadoMixComponent } from './tabla-resultado-mix.component';
import { TablaResultadoMixIncompService } from './tabla-resultado-mix-incompatib.service';
import { MatSortModule } from '@angular/material';
import { PaginadorModule } from '../paginador/paginador.module';
import { FechaModule } from '../fecha/fecha.module';
import { SelectorModule } from '../selector/selector.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import {​ TooltipModule }​ from "primeng/tooltip";


@NgModule({
  imports: [
    CommonModule,
    DataTableModule,
    PaginatorModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    CheckboxModule,
    FormsModule,
    GrowlModule,
    PipeTranslationModule,
    SelectorModule,
    MatSortModule,
    FechaModule,
    PaginadorModule,
    MultiSelectModule,
    ConfirmDialogModule,
    TooltipModule,
    

  ],
  declarations: [TablaResultadoMixComponent],
  exports: [
    TablaResultadoMixComponent,
  ],
  providers: [TablaResultadoMixIncompService]
})
export class TablaResultadoMixModule { }
