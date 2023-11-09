
import { CommonModule } from '@angular/common';  
import { BrowserModule } from '@angular/platform-browser';
import { MatSortModule } from "@angular/material/sort";
import { FormsModule } from "@angular/forms";
import { CheckboxModule, DropdownModule, GrowlModule, ButtonModule, InputTextModule, PaginatorModule, DataTableModule, ConfirmDialogModule } from 'primeng/primeng';
import { PipeTranslationModule } from "../translate/pipe-translation.module";
import { NgModule } from '@angular/core';
import { TablaResultadoOrderComponent } from './tabla-resultado-order.component';
import { SelectorModule } from '../selector/selector.module';
import { FechaModule } from '../fecha/fecha.module';
import { Paginador4Module } from '../paginador4/paginador4.module';
import { TableModule } from 'primeng/table';
@NgModule({
    declarations: [TablaResultadoOrderComponent],
    imports: [
        CommonModule,
        DataTableModule,
        PaginatorModule,
        InputTextModule,
        ButtonModule,
        DropdownModule,
        CheckboxModule,
        FormsModule,
        GrowlModule,
        PipeTranslationModule,
        SelectorModule,
        MatSortModule,
        FormsModule,
        FechaModule,
        Paginador4Module,
        CheckboxModule,
        ConfirmDialogModule,
        TableModule
        
    ],

    providers: [],
	  exports: [
    TablaResultadoOrderComponent,
  ]
})
export class TablaResultadoOrderModule { }
