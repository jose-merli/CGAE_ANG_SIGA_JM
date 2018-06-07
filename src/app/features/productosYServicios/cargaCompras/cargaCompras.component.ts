import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'


@Component({
  selector: 'app-cargaCompras',
  templateUrl: './cargaCompras.component.html',
  styleUrls: ['./cargaCompras.component.scss'],

})
export class CargaComprasComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("cargaCompras");
  }

  ngOnInit() {
  }




}
