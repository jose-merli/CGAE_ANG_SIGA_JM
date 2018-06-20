import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-comunica-designaciones',
  templateUrl: './comunica-designaciones.component.html',
  styleUrls: ['./comunica-designaciones.component.scss'],

})
export class ComunicaDesignacionesComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("comunicaDesignaciones");
  }

  ngOnInit() {
  }




}
