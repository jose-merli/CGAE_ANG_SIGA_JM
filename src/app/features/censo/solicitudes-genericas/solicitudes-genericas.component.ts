import { Component, OnInit } from '@angular/core';
import { MainComponent } from '../../../commons/main-component/main-component.component';

@Component({
  selector: 'app-solicitudes-genericas',
  templateUrl: './solicitudes-genericas.component.html',
  styleUrls: ['./solicitudes-genericas.component.scss']
})
export class SolicitudesGenericasComponent extends MainComponent {

  url = this._globals.getBaseUrl() + "/SIGA/Dispatcher.do?proceso=4";

  ngOnInit() {
  }

}
