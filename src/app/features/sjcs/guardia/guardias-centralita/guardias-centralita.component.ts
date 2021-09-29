import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-guardias-centralita',
  templateUrl: './guardias-centralita.component.html',
  styleUrls: ['./guardias-centralita.component.scss'],

})
export class GuardiasCentralitaComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("guardiasAceptadasCentralita");
  }

  ngOnInit() {
  }




}
