import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { DataTableModule, PaginatorModule, InputTextModule, CheckboxModule, DropdownModule, ButtonModule, GrowlModule, ConfirmationService, MenubarModule } from 'primeng/primeng';
import { PipeTranslationModule } from '../translate/pipe-translation.module';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TreeTableComponent } from './tree-table.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CalendarModule,
    ButtonModule,
    PipeTranslationModule,
    TableModule,
    DropdownModule,
    CheckboxModule
  ],
  declarations: [
    TreeTableComponent
  ],
  exports: [
    TreeTableComponent
  ]
})
export class TreeTableModule { }
