import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZonaComponent } from './zona/zona.component';
import { GrupoZonaComponent } from './grupo-zona/grupo-zona.component';
import { FichaGrupoZonaComponent } from './ficha-grupo-zona.component';
import { PipeTranslationModule } from '../../../../../commons/translate/pipe-translation.module';
import { PaginatorModule, DataTableModule, InputTextModule, ButtonModule, DropdownModule, CheckboxModule, GrowlModule, MenubarModule } from '../../../../../../../node_modules/primeng/primeng';
import { FormsModule } from '../../../../../../../node_modules/@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';

@NgModule({
  imports: [
    CommonModule,
    PipeTranslationModule,
    DataTableModule,
    PaginatorModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    CheckboxModule,
    FormsModule,
    MultiSelectModule,
    GrowlModule,
    PipeTranslationModule,
    MenubarModule
  ],
  declarations: [
    FichaGrupoZonaComponent,
    GrupoZonaComponent,
    ZonaComponent
  ]
})
export class FichaGrupoZonaModule { }
