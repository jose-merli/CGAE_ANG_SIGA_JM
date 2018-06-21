import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-guardias-bajas-temporales',
  templateUrl: './guardias-bajas-temporales.component.html',
  styleUrls: ['./guardias-bajas-temporales.component.scss'],

})
export class GuardiasBajasTemporalesComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("guardiasBajasTemporales");
  }

  ngOnInit() {
  }




}
