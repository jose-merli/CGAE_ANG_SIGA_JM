import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'

@Component({
  selector: 'app-busqueda-sanciones',
  templateUrl: './busqueda-sanciones.component.html',
  styleUrls: ['./busqueda-sanciones.component.scss']
})
export class BusquedaSancionesComponent {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("busquedaSanciones");
  }

  ngOnInit() {
  }

}