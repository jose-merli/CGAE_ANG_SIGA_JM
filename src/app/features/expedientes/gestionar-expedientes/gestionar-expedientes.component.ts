import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'


@Component({
  selector: 'app-gestionar-expedientes',
  templateUrl: './gestionar-expedientes.component.html',
  styleUrls: ['./gestionar-expedientes.component.scss'],

})
export class GestionarExpedientesComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("gestionarExpedientes");
  }

  ngOnInit() {
  }




}
