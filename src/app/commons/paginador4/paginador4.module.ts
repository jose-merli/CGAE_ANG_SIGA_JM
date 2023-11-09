import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule, InputTextModule, DropdownModule, PaginatorModule, CheckboxModule, ConfirmDialogModule, GrowlModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { PipeTranslationModule } from '../translate/pipe-translation.module';
import { Paginador4Component } from './paginador4.component';
import { TableModule } from 'primeng/table';


@NgModule({
  imports: [
    CommonModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    CheckboxModule,
    FormsModule,
    PipeTranslationModule,
    FormsModule,
    CheckboxModule,
    PaginatorModule,
    ConfirmDialogModule,
    TableModule,
    GrowlModule
  ],
  declarations: [
    Paginador4Component

  ],
  exports: [
    Paginador4Component
  ]
})
export class Paginador4Module { }
