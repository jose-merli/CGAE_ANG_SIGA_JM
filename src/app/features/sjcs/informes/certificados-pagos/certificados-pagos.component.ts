import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-certificados-pagos',
  templateUrl: './certificados-pagos.component.html',
  styleUrls: ['./certificados-pagos.component.scss'],

})
export class CertificadosPagosComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("certificadosPagos");
  }

  ngOnInit() {
  }




}
