import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '../../../../node_modules/@angular/forms';
import { ButtonModule } from '../../../../node_modules/primeng/button';
import { ConfirmDialogModule, GrowlModule, DropdownModule } from 'primeng/primeng';
import { ConfirmDialogComponent } from './dialog.component';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from "primeng/checkbox";
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