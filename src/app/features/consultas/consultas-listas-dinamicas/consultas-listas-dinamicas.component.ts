import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'


@Component({
  selector: 'app-consultas-listas-dinamicas',
  templateUrl: './consultas-listas-dinamicas.component.html',
  styleUrls: ['./consultas-listas-dinamicas.component.scss'],

})
export class ConsultasListasDinamicasComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("consultasListasDinamicas");
  }

  ngOnInit() {
  }




}
