import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'


@Component({
  selector: 'app-programar-factura',
  templateUrl: './programar-factura.component.html',
  styleUrls: ['./programar-factura.component.scss'],

})
export class ProgramarFacturaComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("programarFactura");
  }

  ngOnInit() {
  }




}
