import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'


@Component({
  selector: 'app-recuperar-consultas',
  templateUrl: './recuperar-consultas.component.html',
  styleUrls: ['./recuperar-consultas.component.scss'],

})
export class RecuperarConsultasComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("recuperarConsultas");
  }

  ngOnInit() {
  }




}
