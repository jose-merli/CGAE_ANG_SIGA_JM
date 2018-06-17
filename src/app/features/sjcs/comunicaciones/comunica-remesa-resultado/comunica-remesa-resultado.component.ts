import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-comunica-remesa-resultado',
  templateUrl: './comunica-remesa-resultado.component.html',
  styleUrls: ['./comunica-remesa-resultado.component.scss'],

})
export class ComunicaRemesaResultadoComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("comunicaRemesaResultado");
  }

  ngOnInit() {
  }




}
