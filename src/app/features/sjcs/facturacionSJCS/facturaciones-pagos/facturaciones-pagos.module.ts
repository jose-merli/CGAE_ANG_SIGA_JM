import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InputTextModule, ButtonModule, RadioButtonModule, DropdownModule, GrowlModule, CalendarModule, DataTableModule, CheckboxModule, ConfirmDialogModule, MultiSelectModule } from "primeng/primeng";
import { TableModule } from '../../../../../../node_modules/primeng/table';
import { PipeTranslationModule } from "../../../../commons/translate/pipe-translation.module";
import { FormsModule } from "@angular/forms";
import { FechaModule } from "../../../../commons/fecha/fecha.module";
import { PipeNumberModule } from '../../../../commons/number-pipe/number-pipe.module';
import { TooltipModule } from 'primeng/tooltip';
import { MatExpansionModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PipeTranslationModule,
    TooltipModule,
    InputTextModule,
    ConfirmDialogModule,
    CheckboxModule,
    ButtonModule,
    RadioButtonModule,
    DropdownModule,
    CalendarModule,
    PipeNumberModule,
    DataTableModule,
    GrowlModule,
    TableModule,
    FechaModule,
    MultiSelectModule,
    MatExpansionModule,
  ],
  declarations: [],
  exports: []
})
export class FacturacionesYPagosModule { }
