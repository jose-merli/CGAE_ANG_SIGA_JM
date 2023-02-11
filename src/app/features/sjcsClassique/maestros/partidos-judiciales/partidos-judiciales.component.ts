import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-partidos-judiciales-classique',
  templateUrl: './partidos-judiciales.component.html',
  styleUrls: ['./partidos-judiciales.component.scss'],

})
export class PartidosJudicialesClassiqueComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("partidosJudiciales");
  }

  ngOnInit() {
  }




}
