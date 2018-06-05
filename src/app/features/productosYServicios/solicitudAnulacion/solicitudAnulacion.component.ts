import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'


@Component({
  selector: 'app-solicitudAnulacion',
  templateUrl: './solicitudAnulacion.component.html',
  styleUrls: ['./solicitudAnulacion.component.scss'],

})
export class SolicitudAnulacionComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("solicitudAnulacion");
  }

  ngOnInit() {
  }




}
