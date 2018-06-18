import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'


@Component({
  selector: 'app-ficheros-adeudoss',
  templateUrl: './ficheros-adeudos.component.html',
  styleUrls: ['./ficheros-adeudos.component.scss'],

})
export class FicherosAdeudosComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("ficherosAdeudos");
  }

  ngOnInit() {
  }




}
