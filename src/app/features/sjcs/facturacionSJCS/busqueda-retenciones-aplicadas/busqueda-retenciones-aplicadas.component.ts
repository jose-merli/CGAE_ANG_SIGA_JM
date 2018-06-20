import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-busqueda-retenciones-aplicadas',
  templateUrl: './busqueda-retenciones-aplicadas.component.html',
  styleUrls: ['./busqueda-retenciones-aplicadas.component.scss'],

})
export class BusquedaRetencionesAplicadasComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("busquedaRetencionesAplicadas");
  }

  ngOnInit() {
  }




}
