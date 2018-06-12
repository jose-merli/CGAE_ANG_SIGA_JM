import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-documentacion-ejg',
  templateUrl: './documentacion-ejg.component.html',
  styleUrls: ['./documentacion-ejg.component.scss'],

})
export class DocumentacionEJGComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("documentacionEJG");
  }

  ngOnInit() {
  }




}
