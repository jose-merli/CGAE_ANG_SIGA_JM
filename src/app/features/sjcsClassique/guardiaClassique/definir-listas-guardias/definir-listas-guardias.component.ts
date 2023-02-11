import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-definir-listas-guardias-classique',
  templateUrl: './definir-listas-guardias.component.html',
  styleUrls: ['./definir-listas-guardias.component.scss'],

})
export class DefinirListasGuardiasClassiqueComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("definirListasGuardias");
  }

  ngOnInit() {
  }




}
