import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-mantenimiento-juzgados',
  templateUrl: './mantenimiento-juzgados.component.html',
  styleUrls: ['./mantenimiento-juzgados.component.scss'],

})
export class MantenimientoJuzgadosComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("mantenimientoJuzgados");
  }

  ngOnInit() {
  }




}
