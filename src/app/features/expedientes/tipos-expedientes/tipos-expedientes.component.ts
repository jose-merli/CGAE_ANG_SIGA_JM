import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'


@Component({
  selector: 'app-tipos-expedientes',
  templateUrl: './tipos-expedientes.component.html',
  styleUrls: ['./tipos-expedientes.component.scss'],

})
export class TiposExpedientesComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("tiposExpedientes");
  }

  ngOnInit() {
  }




}
