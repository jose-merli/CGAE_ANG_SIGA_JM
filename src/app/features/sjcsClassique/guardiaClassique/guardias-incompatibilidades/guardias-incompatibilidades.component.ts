import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-guardias-incompatibilidades-classique',
  templateUrl: './guardias-incompatibilidades.component.html',
  styleUrls: ['./guardias-incompatibilidades.component.scss'],

})
export class GuardiasIncompatibilidadesClassiqueComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("guardiasIncompatibilidades");
  }

  ngOnInit() {
  }




}
