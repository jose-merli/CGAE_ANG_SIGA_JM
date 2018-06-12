import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-mantenimiento-comisarias',
  templateUrl: './mantenimiento-comisarias.component.html',
  styleUrls: ['./mantenimiento-comisarias.component.scss'],

})
export class MantenimientoComisariasComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("mantenimientoComisarias");
  }

  ngOnInit() {
  }




}
