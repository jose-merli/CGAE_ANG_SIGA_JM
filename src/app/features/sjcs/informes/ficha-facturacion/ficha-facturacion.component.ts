import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-ficha-facturacion',
  templateUrl: './ficha-facturacion.component.html',
  styleUrls: ['./ficha-facturacion.component.scss'],

})
export class FichaFacturacionComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("fichaFacturacion");
  }

  ngOnInit() {
  }




}
