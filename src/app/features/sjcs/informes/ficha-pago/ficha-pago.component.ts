import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-ficha-pago',
  templateUrl: './ficha-pago.component.html',
  styleUrls: ['./ficha-pago.component.scss'],

})
export class FichaPagoComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("fichaPago");
  }

  ngOnInit() {
  }




}
