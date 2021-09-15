import { Component, OnInit, ViewChild } from '@angular/core';
import { TarjetaDatosGeneralesComponent } from './tarjeta-datos-generales/tarjeta-datos-generales.component';

@Component({
  selector: 'app-ficha-remesas',
  templateUrl: './ficha-remesas.component.html',
  styleUrls: ['./ficha-remesas.component.scss']
})
export class FichaRemesasComponent implements OnInit {

  @ViewChild(TarjetaDatosGeneralesComponent) tarjetaDatosGenerales: TarjetaDatosGeneralesComponent;
  progressSpinner: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  save(){
    if(this.tarjetaDatosGenerales.remesaTabla != null){

    }else if(this.tarjetaDatosGenerales.remesaItem != null){

      this.tarjetaDatosGenerales.listadoEstadosRemesa();
    }
  }

}
