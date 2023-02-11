import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-retenciones-IRPF-classique',
  templateUrl: './retenciones-IRPF.component.html',
  styleUrls: ['./retenciones-IRPF.component.scss'],

})
export class RetencionesIRPFClassiqueComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("retencionesIRPF");
  }

  ngOnInit() {
  }




}
