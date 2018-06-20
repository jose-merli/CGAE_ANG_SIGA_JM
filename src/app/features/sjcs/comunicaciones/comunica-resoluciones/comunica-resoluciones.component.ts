import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-comunica-resoluciones',
  templateUrl: './comunica-resoluciones.component.html',
  styleUrls: ['./comunica-resoluciones.component.scss'],

})
export class ComunicaResolucionesComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("comunicaResoluciones");
  }

  ngOnInit() {
  }




}
