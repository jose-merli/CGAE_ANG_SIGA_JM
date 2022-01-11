import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule, ConfirmDialogModule, DropdownModule, GrowlModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { PipeTranslationModule } from '../translate/pipe-translation.module';
import { TarjetaComponent } from './tarjeta.component';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from "primeng/checkbox";
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        PipeTranslationModule,
        CalendarModule,
        RouterModule,
        ConfirmDialogModule,
        TableModule,
        GrowlModule,
        CheckboxModule,
        DropdownModule
    ],
    declarations: [
        TarjetaComponent,
    ],
    exports: [
        TarjetaComponent
    ]
})
export class TarjetaModule { }
