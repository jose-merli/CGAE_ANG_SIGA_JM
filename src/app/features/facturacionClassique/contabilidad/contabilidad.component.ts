import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'


@Component({
  selector: 'app-contabilidad-classique',
  templateUrl: './contabilidad.component.html',
  styleUrls: ['./contabilidad.component.scss'],

})
export class ContabilidadClassiqueComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("contabilidad");
  }

  ngOnInit() {
  }




}
