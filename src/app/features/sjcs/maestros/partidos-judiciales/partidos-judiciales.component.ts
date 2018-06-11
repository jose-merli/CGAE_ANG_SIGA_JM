import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-partidos-judiciales',
  templateUrl: './partidos-judiciales.component.html',
  styleUrls: ['./partidos-judiciales.component.scss'],

})
export class PartidosJudicialesComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("partidosJudiciales");
  }

  ngOnInit() {
  }




}
