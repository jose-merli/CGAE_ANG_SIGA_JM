import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { TranslateService } from "../../../../commons/translate/translation.service";

@Component({
  selector: 'app-ficha-registro-envio-masivo',
  templateUrl: './ficha-registro-envio-masivo.component.html',
  styleUrls: ['./ficha-registro-envio-masivo.component.scss']
})
export class FichaRegistroEnvioMasivoComponent implements OnInit {

  idModelo: string;
  fichasPosibles: any[];
  progressSpinner: boolean = false;

  constructor(private activatedRoute: ActivatedRoute, private location: Location, private translateService: TranslateService, ) { }

  ngOnInit() {


    this.fichasPosibles = [
      {
        key: "configuracion",
        activa: false
      },
      {
        key: "programacion",
        activa: false
      },
      {
        key: "destinatarios",
        activa: false
      },
      {
        key: "documentos",
        activa: false
      }
    ];
  }

  backTo() {
    this.location.back();
  }

  /*
  función para que no cargue primero las etiquetas de los idiomas*/

  isCargado(key) {
    if (key != this.translateService.instant(key)) {
      this.progressSpinner = false;
      return key
    } else {
      this.progressSpinner = true;
    }

  }

}
