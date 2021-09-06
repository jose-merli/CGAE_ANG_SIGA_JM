import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { routingSjcs } from './sjcs-routing.module';
import { MaestrosModule } from './maestros/maestros.module';
import { JusticiablesModule } from './justiciables/justiciables.module';
import { OficioModule } from './oficio/oficio.module';
import { EJGModule } from './ejg/ejg.module';
import { FichaRemesasComponent } from './remesas/ficha-remesas/ficha-remesas.component';
import { TarjetaDatosGeneralesComponent } from './remesas/ficha-remesas/tarjeta-datos-generales/tarjeta-datos-generales.component';
import { TarjetaEjgsComponent } from './remesas/ficha-remesas/tarjeta-ejgs/tarjeta-ejgs.component';

@NgModule({
  declarations: [FichaRemesasComponent, TarjetaDatosGeneralesComponent, TarjetaEjgsComponent],
  imports: [
    CommonModule,
    MaestrosModule,
    OficioModule,
    JusticiablesModule,
    EJGModule,
    routingSjcs
  ],
  providers: []
})
export class SjcsModule { }
