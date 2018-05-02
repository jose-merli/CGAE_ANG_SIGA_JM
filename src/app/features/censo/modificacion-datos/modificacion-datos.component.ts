import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'

@Component({
  selector: 'app-modificacion-datos',
  templateUrl: './modificacion-datos.component.html',
  styleUrls: ['./modificacion-datos.component.scss']
})
export class ModificacionDatosComponent {

  url;

  constructor(private sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("modificacionDatos");
  }

  ngOnInit() {
  }

}
