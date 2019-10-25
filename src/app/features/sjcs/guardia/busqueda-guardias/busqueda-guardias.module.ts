import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuscadorGuardiaComponent } from './buscador-guardia/buscador-guardia.component';
import { FiltrosGuardiaComponent } from './buscador-guardia/filtros-guardia/filtros-guardia.component';
import { TablaGuardiasComponent } from './buscador-guardia/tabla-guardias/tabla-guardias.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [BuscadorGuardiaComponent, FiltrosGuardiaComponent, TablaGuardiasComponent]
})
export class BusquedaGuardiasModule { }
