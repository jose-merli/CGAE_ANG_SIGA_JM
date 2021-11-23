import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberPipePipe } from './number-pipe.pipe';
import { ConfirmDialogModule, DropdownModule, GrowlModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from "primeng/checkbox";
@NgModule({
  imports: [
    CommonModule,
    ConfirmDialogModule,
    TableModule,
    GrowlModule,
    CheckboxModule,
    DropdownModule
  ],
  declarations: [
    NumberPipePipe
  ],
  exports: [
    NumberPipePipe
  ],
  providers: [

  ]
})
export class PipeNumberModule { }