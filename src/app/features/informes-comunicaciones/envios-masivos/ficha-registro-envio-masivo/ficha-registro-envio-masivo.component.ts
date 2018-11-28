import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";

@Component({
  selector: 'app-ficha-registro-envio-masivo',
  templateUrl: './ficha-registro-envio-masivo.component.html',
  styleUrls: ['./ficha-registro-envio-masivo.component.scss']
})
export class FichaRegistroEnvioMasivoComponent implements OnInit {

  idModelo: string;
  fichasPosibles: any[];

  constructor(private activatedRoute: ActivatedRoute, private location: Location) { }

  ngOnInit() {
    this.idModelo = this.activatedRoute.snapshot.params["id"];

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

}
