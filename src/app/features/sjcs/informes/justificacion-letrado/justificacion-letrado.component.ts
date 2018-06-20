import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-justificacion-letrado',
  templateUrl: './justificacion-letrado.component.html',
  styleUrls: ['./justificacion-letrado.component.scss'],

})
export class JustificacionLetradoComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("justificacionLetrado");
  }

  ngOnInit() {
  }




}
