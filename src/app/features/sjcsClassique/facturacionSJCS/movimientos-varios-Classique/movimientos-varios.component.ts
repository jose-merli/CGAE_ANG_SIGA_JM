import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-movimientos-varios-classique',
  templateUrl: './movimientos-varios.component.html',
  styleUrls: ['./movimientos-varios.component.scss'],

})
export class MovimientosVariosComponentClassique implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("movimientosVarios");
  }

  ngOnInit() {
  }




}
