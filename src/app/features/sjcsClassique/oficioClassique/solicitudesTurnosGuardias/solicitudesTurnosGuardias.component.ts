import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-solicitudesTurnosGuardias-classique',
  templateUrl: './solicitudesTurnosGuardias.component.html',
  styleUrls: ['./solicitudesTurnosGuardias.component.scss'],

})
export class SolicitudesTurnosGuardiasClassiqueComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("solicitudesTurnosGuardias");
  }

  ngOnInit() {
  }




}
