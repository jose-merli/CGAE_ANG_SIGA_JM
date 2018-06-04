import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'


@Component({
  selector: 'app-certificados-aca',
  templateUrl: './certificados-aca.component.html',
  styleUrls: ['./certificados-aca.component.scss'],

})
export class CertificadosAcaComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("certificados-aca");
  }

  ngOnInit() {
  }




}