import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'


@Component({
  selector: 'app-series-factura',
  templateUrl: './series-factura.component.html',
  styleUrls: ['./series-factura.component.scss'],

})
export class SeriesFacturaComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("seriesFactura");
  }

  ngOnInit() {
  }




}
