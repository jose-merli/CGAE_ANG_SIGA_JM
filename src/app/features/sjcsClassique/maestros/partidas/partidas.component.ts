import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-partidas-classique',
  templateUrl: './partidas.component.html',
  styleUrls: ['./partidas.component.scss'],

})
export class PartidasClassiqueComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("partidas");
  }

  ngOnInit() {
  }




}