import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-mantenimiento-prisiones-classique',
  templateUrl: './mantenimiento-prisiones.component.html',
  styleUrls: ['./mantenimiento-prisiones.component.scss'],

})
export class MantenimientoPrisionesClassiqueComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("mantenimientoPrisiones");
  }

  ngOnInit() {
  }




}
