import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'


@Component({
  selector: 'app-solicitudCompraSubscripcion',
  templateUrl: './solicitudCompraSubscripcion.component.html',
  styleUrls: ['./solicitudCompraSubscripcion.component.scss'],

})
export class SolicitudCompraSubscripcionComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("solicitudCompraSubscripcion");
  }

  ngOnInit() {
  }




}
