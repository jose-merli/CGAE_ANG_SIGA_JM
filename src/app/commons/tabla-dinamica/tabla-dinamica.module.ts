import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablaDinamicaComponent } from './tabla-dinamica/tabla-dinamica.component';
import { DataTableModule, PaginatorModule, InputTextModule, DropdownModule, ButtonModule, CheckboxModule, GrowlModule, ConfirmDialogModule } from '../../../../node_modules/primeng/primeng';
import { FormsModule } from '../../../../node_modules/@angular/forms';
import { PipeTranslationModule } from '../translate/pipe-translation.module';
import { TableModule } from '../../../../node_modules/primeng/table';

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
    ConfirmDialogModule

  ],
  declarations: [TablaDinamicaComponent],
  exports: [
    TablaDinamicaComponent,
  ]
})
export class TablaDinamicaModule { }
