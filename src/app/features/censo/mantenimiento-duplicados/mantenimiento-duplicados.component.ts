import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'

@Component({
  selector: 'app-mantenimiento-duplicados',
  templateUrl: './mantenimiento-duplicados.component.html',
  styleUrls: ['./mantenimiento-duplicados.component.scss']
})
export class MantenimientoDuplicadosComponent {

  url;

  constructor(private sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("mantenimientoDuplicados");
  }

  ngOnInit() {
  }

}
