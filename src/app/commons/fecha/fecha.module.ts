import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from "primeng/checkbox";
import { ButtonModule, ConfirmDialogModule, DropdownModule, GrowlModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { PipeTranslationModule } from '../translate/pipe-translation.module';
import { FechaComponent } from './fecha.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CalendarModule,
    ButtonModule,
    PipeTranslationModule,
    ConfirmDialogModule,
    TableModule,
    GrowlModule,
    CheckboxModule,
    DropdownModule
  ],
  declarations: [
    FechaComponent

  ],
  exports: [
    FechaComponent
  ]
})
export class FechaModule { }
