import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltrosGuardiaComponent } from './filtros-guardia/filtros-guardia.component';
import { TablaGuardiaComponent } from './tabla-guardia/tabla-guardia.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [FiltrosGuardiaComponent, TablaGuardiaComponent]
})
export class BusquedaGuardiasModule { }
