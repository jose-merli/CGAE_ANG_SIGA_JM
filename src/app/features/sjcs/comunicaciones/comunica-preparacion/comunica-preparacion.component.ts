import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-comunica-preparacion',
  templateUrl: './comunica-preparacion.component.html',
  styleUrls: ['./comunica-preparacion.component.scss'],

})
export class ComunicaPreparacionComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("comunicaPreparacion");
  }

  ngOnInit() {
  }




}
