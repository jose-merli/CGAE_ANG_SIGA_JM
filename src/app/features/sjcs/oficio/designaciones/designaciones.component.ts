import { Component, OnInit, ViewChild } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service';
import { FiltroDesignacionesComponent } from './filtro-designaciones/filtro-designaciones.component';


@Component({
  selector: 'app-designaciones',
  templateUrl: './designaciones.component.html',
  styleUrls: ['./designaciones.component.scss'],

})
export class DesignacionesComponent implements OnInit {

  url;
  rutas = ['SJCS', 'Designaciones'];
  progressSpinner: boolean = false;
  muestraTablaJustificacion: boolean = false;

  @ViewChild(FiltroDesignacionesComponent) datosJustificacion;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("designaciones");
  }

  ngOnInit() {
  }

  showTablaJustificacion(event){
    this.muestraTablaJustificacion=event;
  }

}
