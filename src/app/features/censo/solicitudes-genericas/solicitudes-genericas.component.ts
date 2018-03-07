import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service';


@Component({
  selector: 'app-solicitudes-genericas',
  templateUrl: './solicitudes-genericas.component.html',
  styleUrls: ['./solicitudes-genericas.component.scss']
})
export class SolicitudesGenericasComponent {

  url;
  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("solicitudesGenericas");
  }
  ngOnInit() {
  }

}
