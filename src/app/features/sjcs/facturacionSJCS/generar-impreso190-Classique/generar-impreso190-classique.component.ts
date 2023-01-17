import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-generar-impreso190',
  templateUrl: './generar-impreso190-classique.component.html',
  styleUrls: ['./generar-impreso190-classique.component.scss'],

})
export class GenerarImpreso190ComponentClassique implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("generarImpreso190");
  }

  ngOnInit() {
  }




}
