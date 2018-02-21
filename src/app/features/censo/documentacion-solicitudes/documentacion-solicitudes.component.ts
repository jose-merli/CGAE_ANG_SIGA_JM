import { Component, OnInit } from '@angular/core';
import { MainComponent } from '../../../commons/main-component/main-component.component';

@Component({
  selector: 'app-documentacion-solicitudes',
  templateUrl: './documentacion-solicitudes.component.html',
  styleUrls: ['./documentacion-solicitudes.component.scss']
})
export class DocumentacionSolicitudesComponent extends MainComponent {

  url = this._globals.getBaseUrl() + "/SIGA/Dispatcher.do?proceso=10";

  ngOnInit() {
  }

}
