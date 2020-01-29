import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/primeng';
//import { PipeTranslationModule } from '/../translate/pipe-translation.module';
import { FormsModule } from '@angular/forms';
import { TarjetaResumenFijaComponent } from './tarjeta-resumen-fija.component';
import { TranslatePipe } from '../translate'; //se ha cambiado el PipeTranslationModule por TranslatePipe. Verificar que el cambio es correcto

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        CalendarModule,
    ],
    declarations: [
        TarjetaResumenFijaComponent,
        TranslatePipe
    ],
    exports: [
        TarjetaResumenFijaComponent
    ]
})
export class TarjetaResumenFijaModule { }
