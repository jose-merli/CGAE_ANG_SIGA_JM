import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-carta-factura-colegiado',
  templateUrl: './carta-factura-colegiado.component.html',
  styleUrls: ['./carta-factura-colegiado.component.scss'],

})
export class CartaFacturaColegiadoComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("cartaFacturaColegiado");
  }

  ngOnInit() {
  }




}
