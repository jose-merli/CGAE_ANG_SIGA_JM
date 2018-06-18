import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'


@Component({
  selector: 'app-bandeja-salida',
  templateUrl: './bandeja-salida.component.html',
  styleUrls: ['./bandeja-salida.component.scss'],

})
export class BandejaSalidaComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("bandejaSalida");
  }

  ngOnInit() {
  }




}
