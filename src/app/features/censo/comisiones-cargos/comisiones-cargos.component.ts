import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'

@Component({
  selector: 'app-comisiones-cargos',
  templateUrl: './comisiones-cargos.component.html',
  styleUrls: ['./comisiones-cargos.component.scss']
})
export class ComisionesCargosComponent {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("comisionesCargos");
  }


  ngOnInit() {
  }

}
