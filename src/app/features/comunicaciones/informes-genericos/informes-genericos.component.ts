import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'


@Component({
  selector: 'app-informes-genericos',
  templateUrl: './informes-genericos.component.html',
  styleUrls: ['./informes-genericos.component.scss'],

})
export class InformesGenericosComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("informesGenericos");
  }

  ngOnInit() {
  }




}
