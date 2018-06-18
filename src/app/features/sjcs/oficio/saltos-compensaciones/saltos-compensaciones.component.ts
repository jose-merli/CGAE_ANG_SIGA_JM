import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-saltos-compensaciones',
  templateUrl: './saltos-compensaciones.component.html',
  styleUrls: ['./saltos-compensaciones.component.scss'],

})
export class SaltosYCompensacionesComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("saltosYCompensaciones");
  }

  ngOnInit() {
  }




}
