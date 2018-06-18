import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'


@Component({
  selector: 'app-previsiones-factura',
  templateUrl: './previsiones-factura.component.html',
  styleUrls: ['./previsiones-factura.component.scss'],

})
export class PrevisionesFacturaComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("previsionesFactura");
  }

  ngOnInit() {
  }




}
