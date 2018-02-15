import { Component, OnInit } from '@angular/core';
import { MainComponent } from '../../commons/main-component/main-component.component'

@Component({
  selector: 'app-solicitudes-incorporacion',
  templateUrl: './solicitudes-incorporacion.component.html',
  styleUrls: ['./solicitudes-incorporacion.component.css']
})
export class SolicitudesIncorporacionComponent extends MainComponent{

  url = this._globals.getBaseUrl() + "/SIGA/Dispatcher.do?proceso=3";
  ngOnInit() {
  }

}
