import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-resumen-pagos',
  templateUrl: './resumen-pagos.component.html',
  styleUrls: ['./resumen-pagos.component.scss'],

})
export class ResumenPagosComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("resumenPagos");
  }

  ngOnInit() {
  }




}
