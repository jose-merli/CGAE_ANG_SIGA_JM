import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'

@Component({
  selector: 'app-mantenimiento-grupos-fijos',
  templateUrl: './mantenimiento-grupos-fijos.component.html',
  styleUrls: ['./mantenimiento-grupos-fijos.component.scss']
})
export class MantenimientoGruposFijosComponent {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("mantenimientoGruposFijos");
  }

  ngOnInit() {
  }

}
