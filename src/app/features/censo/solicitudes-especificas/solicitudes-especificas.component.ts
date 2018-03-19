import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service';


@Component({
  selector: 'app-solicitudes-especificas',
  templateUrl: './solicitudes-especificas.component.html',
  styleUrls: ['./solicitudes-especificas.component.scss']
})
export class SolicitudesEspecificasComponent {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("solicitudesEspecificas");
  }

  ngOnInit() {
  }

}
