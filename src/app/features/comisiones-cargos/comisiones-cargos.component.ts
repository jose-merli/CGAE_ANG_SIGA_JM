import { Component, OnInit } from '@angular/core';
import { MainComponent } from '../../commons/main-component/main-component.component';

@Component({
  selector: 'app-comisiones-cargos',
  templateUrl: './comisiones-cargos.component.html',
  styleUrls: ['./comisiones-cargos.component.css']
})
export class ComisionesCargosComponent extends MainComponent {

  url = this._globals.getBaseUrl() + "/SIGA/Dispatcher.do?proceso=48";

  ngOnInit() {
  }

}
