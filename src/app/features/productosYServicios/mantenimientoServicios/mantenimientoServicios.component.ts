import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'


@Component({
  selector: 'app-mantenimientoServicios',
  templateUrl: './mantenimientoServicios.component.html',
  styleUrls: ['./mantenimientoServicios.component.scss'],

})
export class MantenimientoServiciosComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("mantenimientoServicios");
  }

  ngOnInit() {
  }




}
