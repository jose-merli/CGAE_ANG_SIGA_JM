import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'


@Component({
  selector: 'app-categoriasProducto',
  templateUrl: './categoriasProducto.component.html',
  styleUrls: ['./categoriasProducto.component.scss'],

})
export class CategoriasProductoComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("categoriasProducto");
  }

  ngOnInit() {
  }




}
