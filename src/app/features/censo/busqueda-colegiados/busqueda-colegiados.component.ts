import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'


@Component({
  selector: 'app-busqueda-colegiados',
  templateUrl: './busqueda-colegiados.component.html',
  styleUrls: ['./busqueda-colegiados.component.scss'],

})
export class BusquedaColegiadosComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("busquedaColegiados");
  }

  ngOnInit() {
  }




}
