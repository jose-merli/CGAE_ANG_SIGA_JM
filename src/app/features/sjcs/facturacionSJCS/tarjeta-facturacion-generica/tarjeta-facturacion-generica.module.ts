import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TarjetaFacturacionGenericaComponent } from './tarjeta-facturacion-generica.component';
import { PipeTranslationModule } from '../../../../commons/translate/pipe-translation.module';
import { ButtonModule, CheckboxModule, ConfirmDialogModule, DropdownModule, GrowlModule, InputTextModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PipeTranslationModule,
    InputTextModule,
    ButtonModule,
    GrowlModule,
    FormsModule,
    ReactiveFormsModule,
    ConfirmDialogModule,
    TableModule,
    DropdownModule,
    CheckboxModule,
  ],
  exports: [
    TarjetaFacturacionGenericaComponent
  ],
  declarations: [
    TarjetaFacturacionGenericaComponent
  ]
})
export class TarjetaFacturacionGenericaModule { }
