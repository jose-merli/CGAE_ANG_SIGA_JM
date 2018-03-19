import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'

@Component({
  selector: 'app-documentacion-solicitudes',
  templateUrl: './documentacion-solicitudes.component.html',
  styleUrls: ['./documentacion-solicitudes.component.scss']
})
export class DocumentacionSolicitudesComponent {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("documentacionSolicitudes");
  }

  ngOnInit() {
  }

}
