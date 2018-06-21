import { Component, OnInit } from "@angular/core";

import { DatosBancariosItem } from "./../../../../app/models/DatosBancariosItem";
import { DatosBancariosObject } from "./../../../../app/models/DatosBancariosObject";

@Component({
  selector: "app-datos-cuenta-bancaria",
  templateUrl: "./datos-cuenta-bancaria.component.html",
  styleUrls: ["./datos-cuenta-bancaria.component.scss"]
})
export class DatosCuentaBancariaComponent implements OnInit {
  openFicha: boolean = false;

  body: DatosBancariosItem = new DatosBancariosItem();
  bodySearch: DatosBancariosObject = new DatosBancariosObject();

  constructor() {}

  ngOnInit() {
    this.body = JSON.parse(sessionStorage.getItem("datos"));
    console.log("gjfgfg", this.body);
  }

  abrirFicha() {
    this.openFicha = !this.openFicha;
  }
}
