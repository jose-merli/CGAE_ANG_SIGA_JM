import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'

@Component({
  selector: 'app-datosCV',
  templateUrl: './datosCV.component.html',
  styleUrls: ['./datosCV.component.scss']
})
export class DatosCVComponent {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("datosCV");
  }

  ngOnInit() {
  }

}
