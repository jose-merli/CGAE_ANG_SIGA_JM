import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablaComponent } from './tabla.component';
import { CalendarModule } from 'primeng/calendar';
import { DataTableModule, PaginatorModule, InputTextModule, CheckboxModule, DropdownModule, ButtonModule, GrowlModule, ConfirmationService, MenubarModule, ConfirmDialogModule } from 'primeng/primeng';
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
    TableModule,
    DropdownModule,
    CheckboxModule,
    ConfirmDialogModule
  ],
  declarations: [
    TablaComponent
  ],
  exports: [
    TablaComponent
  ]
})
export class TablaModule { }
