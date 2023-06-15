import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-areas-materias-classique',
  templateUrl: './areas-materias.component.html',
  styleUrls: ['./areas-materias.component.scss'],

})
export class AreasYMateriasClassiqueComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("areasYMaterias");
  }

  ngOnInit() {
  }




}
