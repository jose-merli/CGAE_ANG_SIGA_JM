import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'


@Component({
  selector: 'app-solicitud-certificados',
  templateUrl: './solicitud-certificados.component.html',
  styleUrls: ['./solicitud-certificados.component.scss'],

})
export class SolicitudCertificadosComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("solicitudCertificados");
  }

  ngOnInit() {
  }




}
