import { Component, OnInit } from '@angular/core';
import { MainComponent } from '../../../commons/main-component/main-component.component'

@Component({
  selector: 'app-search-colegiados',
  templateUrl: './search-colegiados.component.html',
  styleUrls: ['./search-colegiados.component.scss']
})
export class SearchColegiadosComponent extends MainComponent {

  url = this._globals.getBaseUrl() + "/SIGA/Dispatcher.do?proceso=1";
  ngOnInit() {

  }

}
