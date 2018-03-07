import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service';


@Component({
  selector: 'app-search-no-colegiados',
  templateUrl: './search-no-colegiados.component.html',
  styleUrls: ['./search-no-colegiados.component.scss']
})
export class SearchNoColegiadosComponent {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("busquedaNoColegiados");
  }
  ngOnInit() {
  }

}
