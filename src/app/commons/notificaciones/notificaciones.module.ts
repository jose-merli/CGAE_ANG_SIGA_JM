/*** MODULOS ***/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { DataTableModule } from 'primeng/datatable';
import { MenubarModule } from 'primeng/menubar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ChipsModule } from 'primeng/chips';
import { RadioButtonModule } from 'primeng/radiobutton';
import { EditorModule } from 'primeng/editor';

/*** COMPONENTES ***/
import { NotificacionesComponent } from './notificaciones.component';

@NgModule({
  imports: [
    CommonModule,
    CalendarModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    CheckboxModule,
    ButtonModule,
    DataTableModule,
    MenubarModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    AutoCompleteModule,
    ConfirmDialogModule,
    TooltipModule,
    ChipsModule,
    RadioButtonModule,
    EditorModule
  ],
  declarations: [
    NotificacionesComponent,
  ],
  exports: [
    NotificacionesComponent,

  ],
  providers: [
  ]
})
export class NotificacionesModule { }