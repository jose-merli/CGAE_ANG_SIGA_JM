import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-designaciones',
  templateUrl: './designaciones.component.html',
  styleUrls: ['./designaciones.component.scss'],

})
export class DesignacionesComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("designaciones");
  }

  ngOnInit() {
  }




}
