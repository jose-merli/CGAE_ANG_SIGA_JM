import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-maestros-modulos',
  templateUrl: './maestros-modulos.component.html',
  styleUrls: ['./maestros-modulos.component.scss'],

})
export class MaestrosModulosComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("maestrosModulos");
  }

  ngOnInit() {
  }




}
