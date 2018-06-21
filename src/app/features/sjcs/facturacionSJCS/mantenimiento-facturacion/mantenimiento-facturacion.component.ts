import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-mantenimiento-facturacion',
  templateUrl: './mantenimiento-facturacion.component.html',
  styleUrls: ['./mantenimiento-facturacion.component.scss'],

})
export class MantenimientoFacturacionComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("mantenimientoFacturacion");
  }

  ngOnInit() {
  }




}
