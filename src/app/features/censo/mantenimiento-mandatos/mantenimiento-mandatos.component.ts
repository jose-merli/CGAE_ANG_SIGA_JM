import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'

@Component({
  selector: 'app-mantenimiento-mandatos',
  templateUrl: './mantenimiento-mandatos.component.html',
  styleUrls: ['./mantenimiento-mandatos.component.scss']
})
export class MantenimientoMandatosComponent {

  url;

  constructor(private sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("mantenimientoMandatos");
  }

  ngOnInit() {
  }

}
