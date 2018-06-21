import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-carta-pagos-colegiados',
  templateUrl: './carta-pagos-colegiados.component.html',
  styleUrls: ['./carta-pagos-colegiados.component.scss'],

})
export class CartaPagosColegiadosComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("cartaPagosColegiados");
  }

  ngOnInit() {
  }




}
