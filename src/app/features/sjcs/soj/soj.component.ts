import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'


@Component({
  selector: 'app-soj',
  templateUrl: './soj.component.html',
  styleUrls: ['./soj.component.scss'],

})
export class SOJComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("soj");
  }

  ngOnInit() {
  }




}
