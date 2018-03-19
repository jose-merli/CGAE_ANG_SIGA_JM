import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service';


@Component({
  selector: 'app-search-colegiados',
  templateUrl: './search-colegiados.component.html',
  styleUrls: ['./search-colegiados.component.scss']
})
export class SearchColegiadosComponent {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("busquedaColegiados");
  }
  ngOnInit() {

  }

}
