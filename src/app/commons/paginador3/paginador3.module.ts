import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule, InputTextModule, DropdownModule, PaginatorModule, CheckboxModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { PipeTranslationModule } from '../translate/pipe-translation.module';
import { Paginador3Component } from './paginador3.component';


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
    Paginador3Component

  ],
  exports: [
    Paginador3Component
  ]
})
export class Paginador3Module { }
