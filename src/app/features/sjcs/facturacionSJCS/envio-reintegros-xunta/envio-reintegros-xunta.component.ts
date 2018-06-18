import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-envio-reintegros-xunta',
  templateUrl: './envio-reintegros-xunta.component.html',
  styleUrls: ['./envio-reintegros-xunta.component.scss'],

})
export class EnvioReintegrosXuntaComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("envioReintegrosXunta");
  }

  ngOnInit() {
  }




}
