import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'

@Component({
  selector: 'app-carga-etiquetas',
  templateUrl: './carga-etiquetas.component.html',
  styleUrls: ['./carga-etiquetas.component.scss']
})
export class CargaEtiquetasComponent {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("cargaEtiquetas");
  }

  ngOnInit() {
  }

}
