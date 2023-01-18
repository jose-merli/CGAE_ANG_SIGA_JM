import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-movimientos-varios-classique',
  templateUrl: './movimientos-varios-classique.component.html',
  styleUrls: ['./movimientos-varios-classique.component.scss'],

})
export class MovimientosVariosComponentClassique implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("movimientosVarios");
  }

  ngOnInit() {
  }




}
