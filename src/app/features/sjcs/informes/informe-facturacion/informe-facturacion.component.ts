import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-informe-facturacion',
  templateUrl: './informe-facturacion.component.html',
  styleUrls: ['./informe-facturacion.component.scss'],

})
export class InformeFacturacionComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("informeFacturacion");
  }

  ngOnInit() {
  }




}
