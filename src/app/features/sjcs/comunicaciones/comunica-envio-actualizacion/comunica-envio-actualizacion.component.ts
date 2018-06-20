import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-comunica-envio-actualizacion',
  templateUrl: './comunica-envio-actualizacion.component.html',
  styleUrls: ['./comunica-envio-actualizacion.component.scss'],

})
export class ComunicaEnvioActualizacionComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("comunicaEnvioActualizacion");
  }

  ngOnInit() {
  }




}
