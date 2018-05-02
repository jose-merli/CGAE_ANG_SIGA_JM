import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'

@Component({
  selector: 'app-ficha-colegial',
  templateUrl: './ficha-colegial.component.html',
  styleUrls: ['./ficha-colegial.component.scss'],

})
export class FichaColegialComponent implements OnInit {



  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("fichaColegial");
  }

  ngOnInit() {
  }



}
