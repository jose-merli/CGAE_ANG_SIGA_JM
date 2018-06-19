import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-destinatarios-retenciones',
  templateUrl: './destinatarios-retenciones.component.html',
  styleUrls: ['./destinatarios-retenciones.component.scss'],

})
export class DestinatariosRetencionesComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("destinatariosRetenciones");
  }

  ngOnInit() {
  }




}