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
// import { MenubarModule } from 'primeng/menubar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { DialogModule } from 'primeng/dialog';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ChipsModule } from 'primeng/chips';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FileUploadModule } from 'primeng/fileupload';

/*** COMPONENTES ***/
import { FichaColegialComponent } from './ficha-colegial.component';
import { DatosGeneralesComponent } from './datos-generales/datos-generales.component';
import { DatosColegialesComponent } from './datos-colegiales/datos-colegiales.component';
import { GrowlModule } from 'primeng/primeng';


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
    FormsModule,
    ReactiveFormsModule,
    AutoCompleteModule,
    ConfirmDialogModule,
    TooltipModule,
    ChipsModule,
    RadioButtonModule,
    FileUploadModule,
    GrowlModule
  ],
  declarations: [
    FichaColegialComponent,
    DatosGeneralesComponent,
    DatosColegialesComponent
  ],
  exports: [
    FichaColegialComponent

  ],
  providers: [
  ]
})
export class FichaColegialModule { }
