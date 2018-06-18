import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-tiposAsistencia',
  templateUrl: './tiposAsistencia.component.html',
  styleUrls: ['./tiposAsistencia.component.scss'],

})
export class TiposAsistenciaComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("tiposAsistencia");
  }

  ngOnInit() {
  }




}
