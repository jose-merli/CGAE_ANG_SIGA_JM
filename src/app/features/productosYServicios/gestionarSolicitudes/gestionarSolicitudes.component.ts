import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'


@Component({
  selector: 'app-gestionarSolicitudes',
  templateUrl: './gestionarSolicitudes.component.html',
  styleUrls: ['./gestionarSolicitudes.component.scss'],

})
export class GestionarSolicitudesComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("gestionarSolicitudes");
  }

  ngOnInit() {
  }




}
