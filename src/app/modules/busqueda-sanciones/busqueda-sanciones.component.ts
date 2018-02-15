import { Component, OnInit } from '@angular/core';
import { MainComponent } from '../../commons/main-component/main-component.component'

@Component({
  selector: 'app-busqueda-sanciones',
  templateUrl: './busqueda-sanciones.component.html',
  styleUrls: ['./busqueda-sanciones.component.css']
})
export class BusquedaSancionesComponent extends MainComponent{

  url = this._globals.getBaseUrl() + "/SIGA/Dispatcher.do?proceso=566";

  ngOnInit() {
  }

}
