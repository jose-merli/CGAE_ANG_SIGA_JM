import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'


@Component({
  selector: 'app-nuevo-expediente',
  templateUrl: './nuevo-expediente.component.html',
  styleUrls: ['./nuevo-expediente.component.scss'],

})
export class NuevoExpedienteComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("nuevoExpediente");
  }

  ngOnInit() {
  }




}
