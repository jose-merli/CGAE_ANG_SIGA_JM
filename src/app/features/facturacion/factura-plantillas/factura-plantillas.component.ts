import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'


@Component({
  selector: 'app-factura-plantillas',
  templateUrl: './factura-plantillas.component.html',
  styleUrls: ['./factura-plantillas.component.scss'],

})
export class FacturaPlantillasComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("facturaPlantillas");
  }

  ngOnInit() {
  }




}
