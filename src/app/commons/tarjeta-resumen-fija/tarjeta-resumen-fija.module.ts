import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule, ConfirmDialogModule, DropdownModule, GrowlModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { TarjetaResumenFijaComponent } from './tarjeta-resumen-fija.component';
import { PipeTranslationModule } from '../translate/pipe-translation.module';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from "primeng/checkbox";
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        PipeTranslationModule,
        CalendarModule,
        ConfirmDialogModule,
        TableModule,
        GrowlModule,
        CheckboxModule,
        DropdownModule],
    declarations: [
        TarjetaResumenFijaComponent,
    ],
    exports: [
        TarjetaResumenFijaComponent
    ]
})
export class TarjetaResumenFijaModule { }
