import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'


@Component({
  selector: 'app-generar-factura',
  templateUrl: './generar-factura.component.html',
  styleUrls: ['./generar-factura.component.scss'],

})
export class GenerarFacturaComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("generarFactura");
  }

  ngOnInit() {
  }




}
