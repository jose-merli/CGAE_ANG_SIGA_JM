import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'


@Component({
  selector: 'app-nueva-consulta-experta',
  templateUrl: './nueva-consulta-experta.component.html',
  styleUrls: ['./nueva-consulta-experta.component.scss'],

})
export class NuevaConsultaExpertaComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("nuevaConsultaExperta");
  }

  ngOnInit() {
  }




}
