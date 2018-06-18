import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-retenciones-IRPF',
  templateUrl: './retenciones-IRPF.component.html',
  styleUrls: ['./retenciones-IRPF.component.scss'],

})
export class RetencionesIRPFComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("retencionesIRPF");
  }

  ngOnInit() {
  }




}
