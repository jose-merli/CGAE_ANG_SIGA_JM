import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'


@Component({
  selector: 'app-busqueda-letrados',
  templateUrl: './busqueda-letrados.component.html',
  styleUrls: ['./busqueda-letrados.component.scss'],

})
export class BusquedaLetradosComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("busquedaLetrados");
  }

  ngOnInit() {
  }




}
