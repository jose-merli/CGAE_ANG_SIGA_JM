import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-calendarioLaboral-classique',
  templateUrl: './calendarioLaboral.component.html',
  styleUrls: ['./calendarioLaboral.component.scss'],

})
export class CalendarioLaboralClassiqueComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("calendarioLaboral");
  }

  ngOnInit() {
  }




}
