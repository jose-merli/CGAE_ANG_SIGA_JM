import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberPipePipe } from './number-pipe.pipe';
import { ConfirmDialogModule, GrowlModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';

@NgModule({
  imports: [
    CommonModule,
    ConfirmDialogModule,
    TableModule,
    GrowlModule
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