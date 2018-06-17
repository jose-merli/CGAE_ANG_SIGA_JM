import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-comunica-remesa-envio',
  templateUrl: './comunica-remesa-envio.component.html',
  styleUrls: ['./comunica-remesa-envio.component.scss'],

})
export class ComunicaRemesaEnvioComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("comunicaRemesaEnvio");
  }

  ngOnInit() {
  }




}
