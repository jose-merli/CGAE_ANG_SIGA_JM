import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-maestro-pj-classique',
  templateUrl: './maestro-pj.component.html',
  styleUrls: ['./maestro-pj.component.scss'],

})
export class MaestroPJClassiqueComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("maestroPJ");
  }

  ngOnInit() {
  }




}
