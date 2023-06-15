import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-solicitudes-turnos-classique',
  templateUrl: './solicitudes-turnos.component.html',
  styleUrls: ['./solicitudes-turnos.component.scss'],

})
export class GuardiasSolicitudesTurnosClassiqueComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("guardiasSolicitudesTurnos");
  }

  ngOnInit() {
  }




}
