import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'


@Component({
  selector: 'app-cobros-recobros',
  templateUrl: './cobros-recobros.component.html',
  styleUrls: ['./cobros-recobros.component.scss'],

})
export class CobrosRecobrosComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("cobrosRecobros");
  }

  ngOnInit() {
  }




}
