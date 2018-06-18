import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-solicitudes-turnos',
  templateUrl: './solicitudes-turnos.component.html',
  styleUrls: ['./solicitudes-turnos.component.scss'],

})
export class GuardiasSolicitudesTurnosComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("guardiasSolicitudesTurnos");
  }

  ngOnInit() {
  }




}
