import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-informe-facturacion-personalizado',
  templateUrl: './informe-facturacion-personalizado.component.html',
  styleUrls: ['./informe-facturacion-personalizado.component.scss'],

})
export class InformeFacturacionPersonalizadoComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("informeFacturacionPersonalizado");
  }

  ngOnInit() {
  }




}
