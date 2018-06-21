import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'


@Component({
  selector: 'app-ficheros-transferencia',
  templateUrl: './ficheros-transferencia.component.html',
  styleUrls: ['./ficheros-transferencia.component.scss'],

})
export class FicherosTransferenciaComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("ficherosTransferencia");
  }

  ngOnInit() {
  }




}
