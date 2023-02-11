import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-guardias-saltos-compensaciones-classique',
  templateUrl: './guardias-saltos-compensaciones.component.html',
  styleUrls: ['./guardias-saltos-compensaciones.component.scss'],

})
export class GuardiasSaltosCompensacionesClassiqueComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("guardiasSaltosCompensaciones");
  }

  ngOnInit() {
  }




}
