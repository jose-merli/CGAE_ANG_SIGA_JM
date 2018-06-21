import { Component, OnInit } from "@angular/core";

import { Location } from "@angular/common";

@Component({
  selector: "app-consultar-datos-bancarios",
  templateUrl: "./consultar-datos-bancarios.component.html",
  styleUrls: ["./consultar-datos-bancarios.component.scss"]
})
export class ConsultarDatosBancariosComponent implements OnInit {
  fichasPosibles: any[];

  constructor(private location: Location) {}

  ngOnInit() {
    this.fichasPosibles = [
      {
        key: "datosCuentaBancaria",
        activa: false
      },
      {
        key: "datosMandatos",
        activa: false
      },
      {
        key: "listadoFicherosAnexos",
        activa: false
      }
    ];
  }

  backTo() {
    this.location.back();
  }
}
