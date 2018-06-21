import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-comunica-carga',
  templateUrl: './comunica-carga.component.html',
  styleUrls: ['./comunica-carga.component.scss'],

})
export class ComunicaCargaComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("comunicaCarga");
  }

  ngOnInit() {
  }




}
