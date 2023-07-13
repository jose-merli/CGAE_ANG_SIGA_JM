import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CheckboxModule } from "primeng/checkbox";
import { ConfirmDialogModule, DropdownModule, GrowlModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { FormsModule } from '../../../../node_modules/@angular/forms';
import { ButtonModule } from '../../../../node_modules/primeng/button';
import { ConfirmDialogComponent } from './dialog.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    ConfirmDialogModule,
    TableModule,
    GrowlModule,
    CheckboxModule,
    DropdownModule
  ],
  declarations: [
    ConfirmDialogComponent

  ],
  exports: [
    ConfirmDialogComponent
  ]
})
export class DialogoModule { }