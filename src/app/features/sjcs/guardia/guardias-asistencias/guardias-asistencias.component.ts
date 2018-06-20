import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-guardias-asistencias',
  templateUrl: './guardias-asistencias.component.html',
  styleUrls: ['./guardias-asistencias.component.scss'],

})
export class GuardiasAsistenciasComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("guardiasAsistencias");
  }

  ngOnInit() {
  }




}
