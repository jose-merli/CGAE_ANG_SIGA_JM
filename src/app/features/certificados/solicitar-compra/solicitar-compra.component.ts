import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'


@Component({
  selector: 'app-solicitar-compra',
  templateUrl: './solicitar-compra.component.html',
  styleUrls: ['./solicitar-compra.component.scss'],

})
export class SolicitarCompraComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("solicitarCompra");
  }

  ngOnInit() {
  }




}
