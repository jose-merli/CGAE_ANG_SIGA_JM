import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'


@Component({
  selector: 'app-eliminar-factura',
  templateUrl: './eliminar-factura.component.html',
  styleUrls: ['./eliminar-factura.component.scss'],

})
export class EliminarFacturaComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("eliminarFactura");
  }

  ngOnInit() {
  }




}
