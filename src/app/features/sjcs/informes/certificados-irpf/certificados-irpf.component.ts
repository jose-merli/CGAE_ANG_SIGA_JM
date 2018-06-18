import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-certificados-irpf',
  templateUrl: './certificados-irpf.component.html',
  styleUrls: ['./certificados-irpf.component.scss'],

})
export class CertificadosIrpfComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("certificadosIrpf");
  }

  ngOnInit() {
  }




}
