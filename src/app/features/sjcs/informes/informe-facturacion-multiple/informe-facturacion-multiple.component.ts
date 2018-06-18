import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-informe-facturacion-multiple',
  templateUrl: './informe-facturacion-multiple.component.html',
  styleUrls: ['./informe-facturacion-multiple.component.scss'],

})
export class InformeFacturacionMultipleComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("informeFacturacionMultiple");
  }

  ngOnInit() {
  }




}
