import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from './translation.pipe';
import { TranslateService } from './translation.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    TranslatePipe
  ],
  exports: [
    TranslatePipe
  ],
  providers: [
    TranslateService
  ]
})
export class PipeTranslationModule { }