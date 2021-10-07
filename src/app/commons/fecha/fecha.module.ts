import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FechaComponent } from './fecha.component';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule, ConfirmDialogModule, GrowlModule } from 'primeng/primeng';
import { PipeTranslationModule } from '../translate/pipe-translation.module';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CalendarModule,
    ButtonModule,
    PipeTranslationModule,
    ConfirmDialogModule,
    TableModule,
    GrowlModule
  ],
  declarations: [
    FechaComponent

  ],
  exports: [
    FechaComponent
  ]
})
export class FechaModule { }
