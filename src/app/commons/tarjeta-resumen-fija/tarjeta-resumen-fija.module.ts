import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule, ConfirmDialogModule, GrowlModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { TarjetaResumenFijaComponent } from './tarjeta-resumen-fija.component';
import { PipeTranslationModule } from '../translate/pipe-translation.module';
import { TableModule } from 'primeng/table';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        PipeTranslationModule,
        CalendarModule,
        ConfirmDialogModule,
        TableModule,
        GrowlModule
    ],
    declarations: [
        TarjetaResumenFijaComponent,
    ],
    exports: [
        TarjetaResumenFijaComponent
    ]
})
export class TarjetaResumenFijaModule { }
