import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-retenciones-judiciales',
  templateUrl: './retenciones-judiciales.component.html',
  styleUrls: ['./retenciones-judiciales.component.scss'],

})
export class RetencionesJudicialesComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("retencionesJudiciales");
  }

  ngOnInit() {
  }




}
