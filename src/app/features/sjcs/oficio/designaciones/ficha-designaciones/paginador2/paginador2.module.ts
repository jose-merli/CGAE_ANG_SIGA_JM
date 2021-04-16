import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule, InputTextModule, DropdownModule, PaginatorModule, CheckboxModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { Paginador2Component } from './paginador2.component';
import { PipeTranslationModule } from '../../../../../../commons/translate/pipe-translation.module';


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
    PaginatorModule
  ],
  declarations: [
    Paginador2Component

  ],
  exports: [
    Paginador2Component
  ]
})
export class Paginador2Module { }
