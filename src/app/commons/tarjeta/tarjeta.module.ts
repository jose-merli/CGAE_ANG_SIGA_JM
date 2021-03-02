import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { PipeTranslationModule } from '../translate/pipe-translation.module';
import { TarjetaComponent } from './tarjeta.component';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        PipeTranslationModule,
        CalendarModule,
        RouterModule,
    ],
    declarations: [
        TarjetaComponent,
    ],
    exports: [
        TarjetaComponent
    ]
})
export class TarjetaModule { }
