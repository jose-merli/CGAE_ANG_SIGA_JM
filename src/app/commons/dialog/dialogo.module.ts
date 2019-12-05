import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '../../../../node_modules/@angular/forms';
import { ButtonModule } from '../../../../node_modules/primeng/button';
import { ConfirmDialogModule } from 'primeng/primeng';
import { ConfirmDialogComponent } from './dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    ConfirmDialogModule
  ],
  declarations: [
    ConfirmDialogComponent

  ],
  exports: [
    ConfirmDialogComponent
  ]
})
export class DialogoModule { }
