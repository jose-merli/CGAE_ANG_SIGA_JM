import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";

@Component({
  selector: "app-ficha-modelo-comunicaciones",
  templateUrl: "./ficha-modelo-comunicaciones.component.html",
  styleUrls: ["./ficha-modelo-comunicaciones.component.scss"]
})
export class FichaModeloComunicacionesComponent implements OnInit {
  idModelo: string;
  fichasPosibles: any[];
  filtrosModelos;

  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit() {
    this.idModelo = this.activatedRoute.snapshot.params["id"];

    if (sessionStorage.getItem("filtrosModelos")) {
      this.filtrosModelos = JSON.parse(sessionStorage.getItem("filtrosModelos"));
      sessionStorage.setItem("filtrosModelosModelos", JSON.stringify(this.filtrosModelos));
      sessionStorage.removeItem("filtrosModelos");
    }

    this.fichasPosibles = [
      {
        key: "generales",
        activa: true
      },
      {
        key: "perfiles",
        activa: false
      },
      {
        key: "informes",
        activa: false
      }/*
      {
        key: "comunicacion",
        activa: false
      }*/
    ];
  }

  backTo() {
    let filtros = JSON.parse(sessionStorage.getItem("filtrosModelosModelos"));
    sessionStorage.setItem("filtrosModelos", JSON.stringify(filtros));
    sessionStorage.removeItem("filtrosModelosModelos");
    this.location.back();
  }
}
