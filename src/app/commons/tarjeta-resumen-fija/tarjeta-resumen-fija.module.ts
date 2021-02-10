import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { TarjetaResumenFijaComponent } from './tarjeta-resumen-fija.component';
import { PipeTranslationModule } from '../translate/pipe-translation.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        PipeTranslationModule,
        CalendarModule,
    ],
    declarations: [
        TarjetaResumenFijaComponent,
    ],
    exports: [
        TarjetaResumenFijaComponent
    ]
})
export class TarjetaResumenFijaModule { }
