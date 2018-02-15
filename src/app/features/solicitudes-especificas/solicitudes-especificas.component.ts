import { Component, OnInit } from '@angular/core';
import { MainComponent } from '../../commons/main-component/main-component.component';

@Component({
  selector: 'app-solicitudes-especificas',
  templateUrl: './solicitudes-especificas.component.html',
  styleUrls: ['./solicitudes-especificas.component.css']
})
export class SolicitudesEspecificasComponent extends MainComponent {

  url = this._globals.getBaseUrl() + "/SIGA/Dispatcher.do?proceso=5";

  ngOnInit() {
  }

}
