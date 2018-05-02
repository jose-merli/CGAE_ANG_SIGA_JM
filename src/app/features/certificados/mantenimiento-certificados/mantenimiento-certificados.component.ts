import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'


@Component({
  selector: 'app-mantenimiento-certificados',
  templateUrl: './mantenimiento-certificados.component.html',
  styleUrls: ['./mantenimiento-certificados.component.scss'],

})
export class MantenimientoCertificadosComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("mantenimientoCertificados");
  }

  ngOnInit() {
  }




}
