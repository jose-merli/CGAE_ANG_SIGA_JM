import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-generar-impreso190-Classique',
  templateUrl: './generar-impreso190-Classique.component.html',
  styleUrls: ['./generar-impreso190-Classique.component.scss'],

})
export class GenerarImpreso190ClassiqueComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("generarImpreso190");
  }

  ngOnInit() {
  }




}
