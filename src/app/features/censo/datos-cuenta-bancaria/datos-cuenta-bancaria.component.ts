import { Component, OnInit } from "@angular/core";

import { ConfirmationService, Message } from "primeng/components/common/api";
import { TranslateService } from "../../../commons/translate/translation.service";

import { SelectItem } from "primeng/api";

import { DatosBancariosItem } from "./../../../../app/models/DatosBancariosItem";
import { DatosBancariosObject } from "./../../../../app/models/DatosBancariosObject";

import { SigaServices } from "./../../../_services/siga.service";

@Component({
  selector: "app-datos-cuenta-bancaria",
  templateUrl: "./datos-cuenta-bancaria.component.html",
  styleUrls: ["./datos-cuenta-bancaria.component.scss"]
})
export class DatosCuentaBancariaComponent implements OnInit {
  openFicha: boolean = false;
  progressSpinner: boolean = false;
  editar: boolean = false;
  formValido: boolean;
  ibanValido: boolean;
  titularValido: boolean;

  idCuenta: String;
  idPersona: String;
  nifTitular: String;
  titular: String;
  textFilter: String;
  textSelected: String = "{0} grupos seleccionados";
  registroEditable: String;

  msgs: Message[];
  usuarioBody: any[];
  tipoCuenta: any[] = [];
  selectedTipo: any[] = [];

  body: DatosBancariosItem = new DatosBancariosItem();
  bodySearch: DatosBancariosObject = new DatosBancariosObject();

  constructor(
    private sigaServices: SigaServices,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.textFilter = "Elegir";

    this.tipoCuenta = [
      { name: "Abono", code: "A" },
      { name: "Cargo", code: "C" },
      { name: "Cuenta SCJS", code: "S" }
    ];

    this.usuarioBody = JSON.parse(sessionStorage.getItem("usuarioBody"));
    this.idPersona = this.usuarioBody[0].idPersona;
    this.idCuenta = sessionStorage.getItem("idCuenta");
    this.registroEditable = sessionStorage.getItem("editar");

    if (this.registroEditable == "true") {
      this.cargarDatosCuentaBancaria();
    } else {
      this.body.titular = this.usuarioBody[0].denominacion;
      this.body.nifTitular = this.usuarioBody[0].nif;
    }
  }

  cargarDatosCuentaBancaria() {
    this.body.idPersona = this.idPersona;
    this.body.idCuenta = this.idCuenta;

    this.sigaServices
      .postPaginado("datosCuentaBancaria_search", "?numPagina=1", this.body)
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.bodySearch = JSON.parse(data["body"]);
          this.body = this.bodySearch.datosBancariosItem[0];

          this.rellenarComboTipoCuenta(this.body.tipoCuenta);

          console.log("fdfdf", this.selectedTipo);
        },
        error => {
          this.bodySearch = JSON.parse(error["error"]);
          this.showFail(JSON.stringify(this.bodySearch.error.description));
          console.log(error);
          this.progressSpinner = false;
        }
      );
  }

  rellenarComboTipoCuenta(body) {
    var salir = false;
    this.tipoCuenta.forEach(element1 => {
      body.forEach(element2 => {
        if (!salir && element1.code == element2) {
          this.selectedTipo.push(element1);
          salir = true;
        } else {
          salir = false;
        }
      });
    });
  }

  guardar() {
    this.sigaServices.post("datosCuentaBancaria_insert", this.body).subscribe(
      data => {
        this.progressSpinner = false;
        console.log(data);
      },
      error => {
        this.bodySearch = JSON.parse(error["error"]);
        this.showFail(JSON.stringify(this.bodySearch.error.description));
        console.log(error);
        this.progressSpinner = false;
      }
    );
  }

  restablecer() {
    let mess = this.translateService.instant("¿Desea restablecer los cambios?");
    let icon = "fa fa-info";

    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        this.cargarDatosCuentaBancaria();
      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            summary: "info",
            detail: this.translateService.instant(
              "general.message.accion.cancelada"
            )
          }
        ];
      }
    });
  }

  isValidIBAN(): boolean {
    return (
      this.body.iban &&
      typeof this.body.iban === "string" &&
      /ES\d{2}[ ]\d{4}[ ]\d{4}[ ]\d{4}[ ]\d{4}[ ]\d{4}|ES\d{22}/.test(
        this.body.iban
      )
    );
  }

  validarIban() {
    if (
      (this.body.iban != null || this.body.iban != undefined) &&
      this.isValidIBAN()
    ) {
      this.ibanValido = true;
    } else {
      this.ibanValido = false;
    }
  }

  validarTitular() {
    if (this.body.titular != "" || this.body.titular != undefined) {
      this.titularValido = true;
    } else {
      this.titularValido = false;
    }
  }

  validarFormulario() {
    if (this.validarIban() && this.validarTitular()) {
      this.formValido = true;
    } else {
      this.formValido = false;
    }

    //   (this.selectedTipo.length >= 1 &&
    //     (this.body.iban != null &&
    //       this.body.iban != undefined &&
    //       this.isValidIBAN()))
    // ) {
    //   this.habilitarGuardar = true;
    //   this.guardar();
    // } else {
    //   this.habilitarGuardar = false;
    // }
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
