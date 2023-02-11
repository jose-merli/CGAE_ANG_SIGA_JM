import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'


@Component({
  selector: 'app-series-factura-classique',
  templateUrl: './series-factura.component.html',
  styleUrls: ['./series-factura.component.scss'],

})
export class SeriesFacturaClassiqueComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("seriesFactura");
  }

  ngOnInit() {
  }




}
