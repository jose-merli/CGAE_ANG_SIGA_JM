import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'


@Component({
  selector: 'app-definir-tipo-plantilla',
  templateUrl: './definir-tipo-plantilla.component.html',
  styleUrls: ['./definir-tipo-plantilla.component.scss'],

})
export class DefinirTipoPlantillaComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("definirTipoPlantilla");
  }

  ngOnInit() {
  }




}
