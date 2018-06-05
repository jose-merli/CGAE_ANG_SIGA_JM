import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'


@Component({
  selector: 'app-categorias',
  templateUrl: './categoriasServicios.component.html',
  styleUrls: ['./categoriasServicios.component.scss'],

})
export class CategoriasServiciosComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("categoriasServicios");
  }

  ngOnInit() {
  }




}
