import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-previsiones',
  templateUrl: './previsiones.component.html',
  styleUrls: ['./previsiones.component.scss'],

})
export class PrevisionesComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("previsiones");
  }

  ngOnInit() {
  }




}
