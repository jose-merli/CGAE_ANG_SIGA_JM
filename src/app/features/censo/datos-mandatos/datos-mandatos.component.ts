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
  editar: boolean = false;
  nuevo: boolean = false;

  idCuenta: String;
  idPersona: String;
  registroEditable: String;

  msgs: Message[];
  usuarioBody: any[];
  combooItemsProducto: any[] = [];
  combooItemsServicio: any[] = [];
  selectedEsquemaProducto: any[] = [];
  selectedEsquemaServicio: any[] = [];

  body: DatosMandatosItem = new DatosMandatosItem();
  bodySearch: DatosMandatosObject = new DatosMandatosObject();

  constructor(private sigaServices: SigaServices) {}

  ngOnInit() {
    this.usuarioBody = JSON.parse(sessionStorage.getItem("usuarioBody"));
    this.idPersona = this.usuarioBody[0].idPersona;
    this.idCuenta = sessionStorage.getItem("idCuenta");

    this.registroEditable = sessionStorage.getItem("editar");
    // if (this.registroEditable == "false") {
    //   this.rellenarComboEsquema();
    // } else {
    //   this.cargarDatosMandatos();
    // }

    if (this.registroEditable == "false") {
      this.nuevo = true;
      this.editar = false;
    } else {
      this.cargarDatosMandatos();
      this.nuevo = false;
    }
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

          this.rellenarComboEsquema();
        },
        error => {
          this.bodySearch = JSON.parse(error["error"]);
          this.showFail(JSON.stringify(this.bodySearch.error.description));
          console.log(error);
          this.progressSpinner = false;
        }
      );
  }

  rellenarComboEsquema() {
    this.sigaServices.get("datosMandatos_comboEsquema").subscribe(
      data => {
        this.combooItemsProducto = data.combooItems;
        this.combooItemsServicio = data.combooItems;

        this.selectedEsquemaProducto = this.combooItemsProducto[0];
        this.selectedEsquemaServicio = this.combooItemsServicio[0];

        // if (this.registroEditable == "true") {
        if (this.body != null) {
          console.log("combo", this.combooItemsProducto);
          var producto = this.filtrarItemsComboEsquema(
            this.combooItemsProducto,
            this.body.esquemaProducto
          );

          this.selectedEsquemaProducto = producto[0];

          var servicio = this.filtrarItemsComboEsquema(
            this.combooItemsServicio,
            this.body.esquemaServicio
          );
          this.selectedEsquemaServicio = servicio[0];
        }
        // }
      },
      error => {
        this.bodySearch = JSON.parse(error["error"]);
        this.showFail(JSON.stringify(this.bodySearch.error.description));
      }
    );
  }

  seleccionarCombo(body) {}

  filtrarItemsComboEsquema(comboEsquema, buscarElemento) {
    return comboEsquema.filter(function(obj) {
      return obj.value == buscarElemento;
    });
  }

  onChangeEsquemaProducto(e) {
    this.selectedEsquemaProducto = e.value;
  }

  onChangeEsquemaServicio(e) {
    this.selectedEsquemaServicio = e.value;
  }

  guardar() {
    console.log("Body a guardar", this.body);
    this.body.idPersona = this.idPersona;
    this.body.idCuenta = this.idCuenta;

    this.sigaServices.post("datosMandatos_insert", this.body).subscribe(
      data => {
        this.progressSpinner = false;
        this.body.status = data.status;
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
