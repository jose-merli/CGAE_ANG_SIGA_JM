import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-comunica-info-economica',
  templateUrl: './comunica-info-economica.component.html',
  styleUrls: ['./comunica-info-economica.component.scss'],

})
export class ComunicaInfoEconomicaComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("comunicaInfoEconomica");
  }

  ngOnInit() {
  }




}
