import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-maestro-pj',
  templateUrl: './maestro-pj.component.html',
  styleUrls: ['./maestro-pj.component.scss'],

})
export class MaestroPJComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("maestroPJ");
  }

  ngOnInit() {
  }




}
