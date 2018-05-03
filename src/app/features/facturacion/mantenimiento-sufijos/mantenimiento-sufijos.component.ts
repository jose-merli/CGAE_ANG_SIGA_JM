import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'


@Component({
  selector: 'app-mantenimiento-sufijos',
  templateUrl: './mantenimiento-sufijos.component.html',
  styleUrls: ['./mantenimiento-sufijos.component.scss'],

})
export class MantenimientoSufijosComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("mantenimientoSufijos");
  }

  ngOnInit() {
  }




}
