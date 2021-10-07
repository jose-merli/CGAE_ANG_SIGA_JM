import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectorComponent } from './selector.component';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule, ConfirmDialogModule, GrowlModule } from 'primeng/primeng';
import { PipeTranslationModule } from '../translate/pipe-translation.module';
import { FormsModule } from '@angular/forms';
import {DropdownModule} from 'primeng/dropdown';
import { TableModule } from 'primeng/table';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CalendarModule,
    ButtonModule,
    PipeTranslationModule,
    DropdownModule,
    ConfirmDialogModule,
    TableModule,
    GrowlModule
  ],
  declarations: [
    SelectorComponent

  ],
  exports: [
    SelectorComponent
  ]
})
export class SelectorModule { }
