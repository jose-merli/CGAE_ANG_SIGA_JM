import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-guardias-centralita-classique',
  templateUrl: './guardias-centralita.component.html',
  styleUrls: ['./guardias-centralita.component.scss'],

})
export class GuardiasCentralitaClassiqueComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("guardiasAceptadasCentralita");
  }

  ngOnInit() {
  }




}
