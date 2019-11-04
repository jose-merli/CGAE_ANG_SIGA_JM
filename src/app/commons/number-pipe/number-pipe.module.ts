import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberPipePipe } from './number-pipe.pipe';

@NgModule({
  imports: [
    CommonModule
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