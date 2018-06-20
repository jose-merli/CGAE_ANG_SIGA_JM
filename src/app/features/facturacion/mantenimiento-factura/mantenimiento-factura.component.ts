import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'


@Component({
  selector: 'app-mantenimiento-factura',
  templateUrl: './mantenimiento-factura.component.html',
  styleUrls: ['./mantenimiento-factura.component.scss'],

})
export class MantenimientoFacturaComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("mantenimientoFactura");
  }

  ngOnInit() {
  }




}
