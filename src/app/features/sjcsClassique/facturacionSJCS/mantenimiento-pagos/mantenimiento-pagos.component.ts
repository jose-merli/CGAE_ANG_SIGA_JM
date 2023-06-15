import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-mantenimiento-pagos',
  templateUrl: './mantenimiento-pagos.component.html',
  styleUrls: ['./mantenimiento-pagos.component.scss'],

})
export class MantenimientoPagosComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("mantenimientoPagos");
  }

  ngOnInit() {
  }




}
