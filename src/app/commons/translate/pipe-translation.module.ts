import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from './translation.pipe';
import { TranslateService } from './translation.service';
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