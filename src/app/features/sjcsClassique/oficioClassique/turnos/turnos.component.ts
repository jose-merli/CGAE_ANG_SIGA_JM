import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-turnos-classique',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.scss'],

})
export class TurnosClassiqueComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("turnos");
  }

  ngOnInit() {
  }




}
