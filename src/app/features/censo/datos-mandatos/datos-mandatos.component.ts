import { Component, OnInit } from "@angular/core";

import { Message } from "primeng/components/common/api";

import { DatosMandatosItem } from "./../../../../app/models/DatosMandatosItem";
import { DatosMandatosObject } from "./../../../../app/models/DatosMandatosObject";

import { SigaServices } from "./../../../_services/siga.service";

@Component({
  selector: "app-datos-mandatos",
  templateUrl: "./datos-mandatos.component.html",
  styleUrls: ["./datos-mandatos.component.scss"]
})
export class DatosMandatosComponent implements OnInit {
  openFicha: boolean = false;
  progressSpinner: boolean = false;

  idCuenta: String;
  idPersona: String;

  msgs: Message[];
  usuarioBody: any[];

  body: DatosMandatosItem = new DatosMandatosItem();
  bodySearch: DatosMandatosObject = new DatosMandatosObject();

  constructor(private sigaServices: SigaServices) {}

  ngOnInit() {
    this.usuarioBody = JSON.parse(sessionStorage.getItem("usuarioBody"));
    this.idPersona = this.usuarioBody[0].idPersona;
    this.idCuenta = sessionStorage.getItem("idCuenta");

    this.cargarDatosMandatos();
  }

  cargarDatosMandatos() {
    this.body.idPersona = this.idPersona;
    this.body.idCuenta = this.idCuenta;

    this.sigaServices
      .postPaginado("datosMandatos_search", "?numPagina=1", this.body)
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.bodySearch = JSON.parse(data["body"]);
          this.body = this.bodySearch.mandatosItem[0];
        },
        error => {
          this.bodySearch = JSON.parse(error["error"]);
          this.showFail(JSON.stringify(this.bodySearch.error.description));
          console.log(error);
          this.progressSpinner = false;
        }
      );
  }

  abrirFicha() {
    this.openFicha = !this.openFicha;
  }

  showFail(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "error", summary: "", detail: mensaje });
  }

  showSuccess(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "success", summary: "", detail: mensaje });
  }
}
