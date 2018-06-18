import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'


@Component({
  selector: 'app-ejg',
  templateUrl: './ejg.component.html',
  styleUrls: ['./ejg.component.scss'],

})
export class EJGComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("ejg");
  }

  ngOnInit() {
  }




}
