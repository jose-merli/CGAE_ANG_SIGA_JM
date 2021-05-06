import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-tramos-lec',
  templateUrl: './tramos-lec.component.html',
  styleUrls: ['./tramos-lec.component.scss'],

})
export class TramosLECComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("tramosLEC");
  }

  ngOnInit() {
  }




}
