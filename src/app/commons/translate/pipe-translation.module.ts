import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from './translation.pipe';
import { TranslateService } from './translation.service';
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