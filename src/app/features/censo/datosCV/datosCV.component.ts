import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'

@Component({
  selector: 'app-datosCv',
  templateUrl: './datosCv.component.html',
  styleUrls: ['./datosCv.component.scss']
})
export class DatosCVComponent {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("datosCv");
  }

  ngOnInit() {
  }

}
