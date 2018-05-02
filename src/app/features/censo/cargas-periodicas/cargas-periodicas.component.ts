import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'

@Component({
  selector: 'app-cargas-periodicas',
  templateUrl: './cargas-periodicas.component.html',
  styleUrls: ['./cargas-periodicas.component.scss']
})
export class CargasPeriodicasComponent {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("cargasPeriodicas");
  }

  ngOnInit() {
  }

}
