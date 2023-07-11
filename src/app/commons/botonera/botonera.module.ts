import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule, CheckboxModule, ConfirmDialogModule, DropdownModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { PipeTranslationModule } from '../translate/pipe-translation.module';
import { BotoneraComponent } from './botonera.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CalendarModule,
    ButtonModule,
    PipeTranslationModule,
    TableModule,
    DropdownModule,
    CheckboxModule,
    ConfirmDialogModule
  ],
  declarations: [
    BotoneraComponent
  ],
  exports: [
    BotoneraComponent
  ]
})
export class BotoneraModule { }
