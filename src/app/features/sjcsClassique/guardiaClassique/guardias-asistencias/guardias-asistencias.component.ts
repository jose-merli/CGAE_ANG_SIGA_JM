import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-guardias-asistencias-classique',
  templateUrl: './guardias-asistencias.component.html',
  styleUrls: ['./guardias-asistencias.component.scss'],

})
export class GuardiasAsistenciasClassiqueComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("guardiasAsistencias");
  }

  ngOnInit() {
  }




}
