import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableModule, PaginatorModule, InputTextModule, DropdownModule, ButtonModule, CheckboxModule, GrowlModule, ConfirmDialogModule } from '../../../../node_modules/primeng/primeng';
import { FormsModule } from '../../../../node_modules/@angular/forms';
import { PipeTranslationModule } from '../translate/pipe-translation.module';
import { TableModule } from '../../../../node_modules/primeng/table';
import { TablaDinamicaColaGuardiaComponent } from './tabla-dinamica-cola-guardia.component';
import { TablaDinamicaModule } from '../tabla-dinamica/tabla-dinamica.module';

@NgModule({
  imports: [
    CommonModule,
    DataTableModule,
    PaginatorModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    CheckboxModule,
    FormsModule,
    GrowlModule,
    PipeTranslationModule,
    TableModule,
    TablaDinamicaModule,
    ConfirmDialogModule
  ],
  declarations: [TablaDinamicaColaGuardiaComponent],
  exports: [
    TablaDinamicaColaGuardiaComponent,
  ]
})
export class TablaDinamicaColaGuardiaModule { }
