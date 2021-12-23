import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-abonos-sjcs',
  templateUrl: './abonos-sjcs.component.html',
  styleUrls: ['./abonos-sjcs.component.scss'],

})
export class AbonosSCJSComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("busquedaRetencionesAplicadas");
  }

  ngOnInit() {
  }




}
