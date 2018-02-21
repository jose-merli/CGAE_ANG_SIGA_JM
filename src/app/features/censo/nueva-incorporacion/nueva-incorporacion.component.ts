import { Component, OnInit } from '@angular/core';
import { MainComponent } from '../../../commons/main-component/main-component.component';

@Component({
  selector: 'app-nueva-incorporacion',
  templateUrl: './nueva-incorporacion.component.html',
  styleUrls: ['./nueva-incorporacion.component.scss']
})
export class NuevaIncorporacionComponent extends MainComponent {

  url = this._globals.getBaseUrl() + "/SIGA/Dispatcher.do?proceso=47";

  ngOnInit() {
  }

}
