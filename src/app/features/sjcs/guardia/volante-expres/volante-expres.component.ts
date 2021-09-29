import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-volante-expres',
  templateUrl: './volante-expres.component.html',
  styleUrls: ['./volante-expres.component.scss'],

})
export class VolanteExpresComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("volanteExpres");
  }

  ngOnInit() {
  }




}
