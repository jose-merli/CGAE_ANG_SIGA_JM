import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";

@Component({
  selector: 'app-ficha-registro-comunicacion',
  templateUrl: './ficha-registro-comunicacion.component.html',
  styleUrls: ['./ficha-registro-comunicacion.component.scss']
})
export class FichaRegistroComunicacionComponent implements OnInit {

  idModelo: string;
  fichasPosibles: any[];
  filtrosCom;

  constructor(private activatedRoute: ActivatedRoute, private location: Location) { }

  ngOnInit() {
    this.idModelo = this.activatedRoute.snapshot.params["id"];

    if (sessionStorage.getItem("filtrosCom")) {
      this.filtrosCom = JSON.parse(sessionStorage.getItem("filtrosCom"));
      sessionStorage.setItem("filtrosComCom", JSON.stringify(this.filtrosCom));
      sessionStorage.removeItem("filtrosCom");
    }

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
      },

    ];
  }

  backTo() {
    let filtros = JSON.parse(sessionStorage.getItem("filtrosComCom"));
    sessionStorage.setItem("filtrosCom", JSON.stringify(filtros));
    sessionStorage.removeItem("filtrosComCom");
    this.location.back();
  }

}
