import { Component, OnInit } from '@angular/core';
import { MainComponent } from '../../commons/main-component/main-component.component'

@Component({
  selector: 'app-search-no-colegiados',
  templateUrl: './search-no-colegiados.component.html',
  styleUrls: ['./search-no-colegiados.component.css']
})
export class SearchNoColegiadosComponent extends MainComponent {

  url = this._globals.getBaseUrl() + "/SIGA/Dispatcher.do?proceso=2"

  ngOnInit() {
  }

}
