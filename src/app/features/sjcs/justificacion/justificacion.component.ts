import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'


@Component({
  selector: 'app-justificacion',
  templateUrl: './justificacion.component.html',
  styleUrls: ['./justificacion.component.scss'],

})
export class JustificacionComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("justificacion");
  }

  ngOnInit() {
  }




}
