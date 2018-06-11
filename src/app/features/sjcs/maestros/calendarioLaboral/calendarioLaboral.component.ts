import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-calendarioLaboral',
  templateUrl: './calendarioLaboral.component.html',
  styleUrls: ['./calendarioLaboral.component.scss'],

})
export class CalendarioLaboralComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("calendarioLaboral");
  }

  ngOnInit() {
  }




}
