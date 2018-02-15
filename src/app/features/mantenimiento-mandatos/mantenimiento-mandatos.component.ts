import { Component, OnInit } from '@angular/core';
import { MainComponent } from '../../commons/main-component/main-component.component';

@Component({
  selector: 'app-mantenimiento-mandatos',
  templateUrl: './mantenimiento-mandatos.component.html',
  styleUrls: ['./mantenimiento-mandatos.component.css']
})
export class MantenimientoMandatosComponent extends MainComponent{

  url = this._globals.getBaseUrl() + "/SIGA/Dispatcher.do?proceso=19";

  ngOnInit() {
  }

}
