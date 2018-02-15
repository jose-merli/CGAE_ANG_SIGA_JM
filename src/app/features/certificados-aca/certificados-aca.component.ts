import { Component, OnInit } from '@angular/core';
import { MainComponent } from '../../commons/main-component/main-component.component'

@Component({
  selector: 'app-certificados-aca',
  templateUrl: './certificados-aca.component.html',
  styleUrls: ['./certificados-aca.component.css']
})
export class CertificadosAcaComponent extends MainComponent{

  url = this._globals.getBaseUrl() + "/SIGA/Dispatcher.do?proceso=130";

  ngOnInit() {
  }

}
