import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-ficheros-devoluciones-classique',
  templateUrl: './ficheros-devoluciones.component.html',
  styleUrls: ['./ficheros-devoluciones.component.scss'],

})
export class FicherosDevolucionesClassiqueComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("ficherosDevoluciones");
  }

  ngOnInit() {
  }




}
