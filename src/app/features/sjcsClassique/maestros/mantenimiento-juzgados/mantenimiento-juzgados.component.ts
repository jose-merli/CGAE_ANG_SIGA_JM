import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-mantenimiento-juzgados-classique',
  templateUrl: './mantenimiento-juzgados.component.html',
  styleUrls: ['./mantenimiento-juzgados.component.scss'],

})
export class MantenimientoJuzgadosClassiqueComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("mantenimientoJuzgados");
  }

  ngOnInit() {
  }




}
