import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'


@Component({
  selector: 'app-busqueda-no-colegiados',
  templateUrl: './busqueda-no-colegiados.component.html',
  styleUrls: ['./busqueda-no-colegiados.component.scss'],

})
export class BusquedaNoColegiadosComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("busquedaNoColegiados");
  }

  ngOnInit() {
  }




}
