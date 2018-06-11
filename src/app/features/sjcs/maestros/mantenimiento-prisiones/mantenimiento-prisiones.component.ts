import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-mantenimiento-prisiones',
  templateUrl: './mantenimiento-prisiones.component.html',
  styleUrls: ['./mantenimiento-prisiones.component.scss'],

})
export class MantenimientoPrisionesComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("mantenimientoPrisiones");
  }

  ngOnInit() {
  }




}
