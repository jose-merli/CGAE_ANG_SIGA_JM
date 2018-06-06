import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'


@Component({
  selector: 'app-mantenimientoProductos',
  templateUrl: './mantenimientoProductos.component.html',
  styleUrls: ['./mantenimientoProductos.component.scss'],

})
export class MantenimientoProductosComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("mantenimientoProductos");
  }

  ngOnInit() {
  }




}
