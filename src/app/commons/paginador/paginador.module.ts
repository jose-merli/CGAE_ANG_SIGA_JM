import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule, InputTextModule, DropdownModule, PaginatorModule } from 'primeng/primeng';
import { PipeTranslationModule } from '../translate/pipe-translation.module';
import { FormsModule } from '@angular/forms';
import { PaginadorComponent } from './paginador.component';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectorModule } from '../selector/selector.module';


@NgModule({
  imports: [
    CommonModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    CheckboxModule,
    FormsModule,
    PipeTranslationModule,
    SelectorModule,
    CheckboxModule,
    PaginatorModule
  ],
  declarations: [
    PaginadorComponent

  ],
  exports: [
    PaginadorComponent
  ]
})
export class PaginadorModule { }
