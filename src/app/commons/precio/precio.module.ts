import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrecioComponent } from './precio.component';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/primeng';
import { PipeTranslationModule } from '../translate/pipe-translation.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CalendarModule,
    ButtonModule,
    PipeTranslationModule
  ],
  declarations: [
    PrecioComponent

  ],
  exports: [
    PrecioComponent
  ]
})
export class PrecioModule { }
