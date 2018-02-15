import { Component, OnInit } from '@angular/core';
import { MainComponent } from '../../commons/main-component/main-component.component';

@Component({
  selector: 'app-mantenimiento-grupos-fijos',
  templateUrl: './mantenimiento-grupos-fijos.component.html',
  styleUrls: ['./mantenimiento-grupos-fijos.component.css']
})
export class MantenimientoGruposFijosComponent extends MainComponent{

  url = this._globals.getBaseUrl() + "/SIGA/Dispatcher.do?proceso=993";

  ngOnInit() {
  }

}
