import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'


@Component({
  selector: 'app-gestion-actas-Classique',
  templateUrl: './gestion-actas.component.html',
  styleUrls: ['./gestion-actas.component.scss'],

})
export class GestionActasClassiqueComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("gestionActas");
  }

  ngOnInit() {
  }




}
