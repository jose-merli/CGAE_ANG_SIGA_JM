import { Component, OnInit } from "@angular/core";

import { Location } from "@angular/common";

import { ConfirmationService, Message } from "primeng/components/common/api";
import { TranslateService } from "../../../commons/translate/translation.service";

import { SelectItem } from "primeng/api";

import { DatosBancariosItem } from "./../../../../app/models/DatosBancariosItem";
import { DatosBancariosObject } from "./../../../../app/models/DatosBancariosObject";

import { BancoBicItem } from "./../../../../app/models/BancoBicItem";
import { BancoBicObject } from "./../../../../app/models/BancoBicObject";

import { DatosMandatosItem } from "./../../../../app/models/DatosMandatosItem";
import { DatosMandatosObject } from "./../../../../app/models/DatosMandatosObject";

import { SigaServices } from "./../../../_services/siga.service";

@Component({
  selector: "app-consultar-datos-bancarios",
  templateUrl: "./consultar-datos-bancarios.component.html",
  styleUrls: ["./consultar-datos-bancarios.component.scss"]
})
export class ConsultarDatosBancariosComponent implements OnInit {
  //fichasPosibles: any[];

  openFichaCuentaBancaria: boolean = false;
  openFichaDatosMandatos: boolean = false;
  progressSpinner: boolean = false;
  editar: boolean = false;
  editarMandato: boolean = false;
  formValido: boolean;
  ibanValido: boolean;
  titularValido: boolean;
  tipoCuentaSeleccionado: boolean;
  revisionCuentas: boolean = false;
  nuevo: boolean = false;
  check: boolean = false;

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
  combooItemsProducto: any[] = [];
  combooItemsServicio: any[] = [];
  selectedEsquemaProducto: any[] = [];
  selectedEsquemaServicio: any[] = [];

  body: DatosBancariosItem = new DatosBancariosItem();
  bodySearch: DatosBancariosObject = new DatosBancariosObject();

  bodyBancoBic: BancoBicItem = new BancoBicItem();
  bodyBancoBicSearch: BancoBicObject = new BancoBicObject();

  bodyDatosMandatos: DatosMandatosItem = new DatosMandatosItem();
  bodyDatosMandatosSearch: DatosMandatosObject = new DatosMandatosObject();

  constructor(
    private location: Location,
    private sigaServices: SigaServices,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    // this.fichasPosibles = [
    //   {
    //     key: "datosCuentaBancaria",
    //     activa: false
    //   },
    //   {
    //     key: "datosMandatos",
    //     activa: false
    //   },
    //   {
    //     key: "listadoFicherosAnexos",
    //     activa: false
    //   }
    // ];

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
      // editar
      this.cargarModoEdicion();
    } else {
      // nuevo
      this.cargarModoNuevoRegistro();
    }
  }

  cargarModoEdicion() {
    this.cargarDatosCuentaBancaria();
    this.editar = false;

    this.cargarDatosMandatos();
    this.nuevo = false;
  }

  cargarModoNuevoRegistro() {
    this.body.titular = this.usuarioBody[0].denominacion;
    this.body.nifTitular = this.usuarioBody[0].nif;

    this.nuevo = true;
    this.editar = false;
  }

  // Funciones datos cuenta bancaria
  cargarDatosCuentaBancaria() {
    this.body.idPersona = this.idPersona;
    this.body.idCuenta = this.idCuenta;
    //this.body.idCuenta = sessionStorage.getItem("idCuenta");

    console.log("eewe", this.body);

    this.sigaServices
      .postPaginado("datosCuentaBancaria_search", "?numPagina=1", this.body)
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.bodySearch = JSON.parse(data["body"]);
          this.body = this.bodySearch.datosBancariosItem[0];

          this.rellenarComboTipoCuenta(this.body.tipoCuenta);
        },
        error => {
          this.bodySearch = JSON.parse(error["error"]);
          this.showFail(JSON.stringify(this.bodySearch.error.message));
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

  guardarRegistro() {
    this.progressSpinner = true;

    this.body.revisionCuentas = this.revisionCuentas;
    this.body.idPersona = this.idPersona;

    this.getArrayTipoCuenta();

    console.log("ere", this.body);

    this.sigaServices.post("datosCuentaBancaria_insert", this.body).subscribe(
      data => {
        this.progressSpinner = false;
        this.body = JSON.parse(data["body"]);

        this.showSuccess("Se han guardado correctamente los datos");
      },
      error => {
        this.bodySearch = JSON.parse(error["error"]);
        this.showFail(JSON.stringify(this.bodySearch.error.message));
        console.log(error);
        this.progressSpinner = false;
      },
      () => {
        this.idCuenta = this.body.id;
        this.cargarModoEdicion();
      }
    );
  }

  editarRegistro() {
    this.progressSpinner = true;

    this.body.revisionCuentas = this.revisionCuentas;
    this.body.idPersona = this.idPersona;

    this.getArrayTipoCuenta();

    this.sigaServices.post("datosCuentaBancaria_update", this.body).subscribe(
      data => {
        this.progressSpinner = false;
        this.body.status = data.status;

        this.showSuccess("Se han guardado correctamente los datos");
      },
      error => {
        this.bodySearch = JSON.parse(error["error"]);
        this.showFail(JSON.stringify(this.bodySearch.error.message));
        console.log(error);
        this.progressSpinner = false;
      }
    );
  }

  getArrayTipoCuenta() {
    this.body.tipoCuenta = [];
    this.selectedTipo.forEach(element => {
      this.body.tipoCuenta.push(element.code);
    });
  }

  restablecer() {
    this.confirmationService.confirm({
      message: "¿Desea restablecer los datos?",
      icon: "fa fa-info",
      accept: () => {
        this.cargarDatosCuentaBancaria();
      }
    });
  }

  restablecerNuevo() {
    this.confirmationService.confirm({
      message: "¿Desea restablecer los datos?",
      icon: "fa fa-info",
      accept: () => {
        this.body.titular = this.usuarioBody[0].denominacion;
        this.body.nifTitular = this.usuarioBody[0].nif;
        this.body.iban = "";
        this.body.bic = "";
        this.body.banco = "";
        this.body.cuentaContable = "";
        this.textSelected = "";
        this.selectedTipo = [];

        this.nuevo = true;
        this.editar = false;
      }
    });
  }

  autogenerarDatos() {
    if (this.isValidIBAN() && this.body.iban.length == 24) {
      this.recuperarBicBanco();
      this.ibanValido = true;
    } else {
      this.body.banco = "";
      this.body.bic = "";
    }
  }

  recuperarBicBanco() {
    this.sigaServices
      .post("datosCuentaBancaria_BIC_BANCO", this.body)
      .subscribe(
        data => {
          console.log("data", data);
          this.bodyBancoBicSearch = JSON.parse(data["body"]);
          this.bodyBancoBic = this.bodyBancoBicSearch.bancoBicItem[0];

          this.body.banco = this.bodyBancoBic.banco;
          this.body.bic = this.bodyBancoBic.bic;

          console.log("bic", this.bodyBancoBic.bicEspanol);

          if (this.bodyBancoBic.bicEspanol == "1") {
            this.editar = false;
          } else {
            this.editar = true;
          }
        },
        error => {
          this.bodyBancoBicSearch = JSON.parse(error["error"]);
          this.showFail(JSON.stringify(this.bodyBancoBicSearch.error.message));
        }
      );
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
      this.isValidIBAN() &&
      this.body.iban.length == 24
    ) {
      this.ibanValido = true;
      return true;
    } else {
      this.ibanValido = false;
      return false;
    }
  }

  validarTitular() {
    if (this.body.titular.trim() != "" && this.body.titular != undefined) {
      this.titularValido = true;
      return true;
    } else {
      this.titularValido = false;
      return false;
    }
  }

  validarTipoCuenta() {
    if (this.selectedTipo.length >= 1) {
      this.tipoCuentaSeleccionado = true;
      return true;
    } else {
      this.tipoCuentaSeleccionado = false;
      return false;
    }
  }

  validarBIC() {
    if (this.body.bic.length) {
    }
  }

  validarCuentaCargo() {
    this.confirmationService.confirm({
      message: this.translateService.instant(
        "censo.tipoCuenta.cargo.confirmacionProcesoAltaCuentaCargos"
      ),
      icon: "fa fa-info",
      accept: () => {
        this.revisionCuentas = true;

        if (this.registroEditable == "false") {
          this.guardarRegistro();
        } else {
          this.editarRegistro();
        }
      },
      reject: () => {
        this.revisionCuentas = false;

        if (this.registroEditable == "false") {
          this.guardarRegistro();
        } else {
          this.editarRegistro();
        }
      }
    });
  }

  validarFormulario() {
    var revisionCuentas;
    if (
      this.validarIban() &&
      this.validarTitular() &&
      this.validarTipoCuenta()
    ) {
      this.formValido = true;

      this.getArrayTipoCuenta();
      if (this.body.tipoCuenta.indexOf("C") !== -1) {
        this.validarCuentaCargo();
      }
    } else {
      this.formValido = false;
    }
  }

  abrirFichaCuentaBancaria() {
    this.openFichaCuentaBancaria = !this.openFichaCuentaBancaria;
  }

  // Funciones datos datosMandatos

  cargarDatosMandatos() {
    this.bodyDatosMandatos.idPersona = this.idPersona;
    this.bodyDatosMandatos.idCuenta = this.idCuenta;

    this.sigaServices
      .postPaginado(
        "datosMandatos_search",
        "?numPagina=1",
        this.bodyDatosMandatos
      )
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.bodyDatosMandatosSearch = JSON.parse(data["body"]);
          this.bodyDatosMandatos = this.bodyDatosMandatosSearch.mandatosItem[0];

          this.rellenarComboEsquema();
        },
        error => {
          this.bodyDatosMandatosSearch = JSON.parse(error["error"]);
          this.showFail(
            JSON.stringify(this.bodyDatosMandatosSearch.error.message)
          );
          console.log(error);
          this.progressSpinner = false;
        }
      );
  }

  actualizarMandatos() {}

  rellenarComboEsquema() {
    this.sigaServices.get("datosMandatos_comboEsquema").subscribe(
      data => {
        this.combooItemsProducto = data.combooItems;
        this.combooItemsServicio = data.combooItems;

        this.selectedEsquemaProducto = this.combooItemsProducto[0];
        this.selectedEsquemaServicio = this.combooItemsServicio[0];

        if (this.body != null) {
          console.log("combo", this.combooItemsProducto);
          var producto = this.filtrarItemsComboEsquema(
            this.combooItemsProducto,
            this.bodyDatosMandatos.esquemaProducto
          );

          this.selectedEsquemaProducto = producto[0];

          var servicio = this.filtrarItemsComboEsquema(
            this.combooItemsServicio,
            this.bodyDatosMandatos.esquemaServicio
          );
          this.selectedEsquemaServicio = servicio[0];
        }
      },
      error => {
        this.bodySearch = JSON.parse(error["error"]);
        this.showFail(JSON.stringify(this.bodySearch.error.message));
      }
    );
  }

  filtrarItemsComboEsquema(comboEsquema, buscarElemento) {
    return comboEsquema.filter(function(obj) {
      return obj.value == buscarElemento;
    });
  }

  onChangeEsquemaProducto(e) {
    this.selectedEsquemaProducto = e.value;
    console.log("Seleccionado", this.selectedEsquemaProducto);
  }

  onChangeEsquemaServicio(e) {
    this.selectedEsquemaServicio = e.value;
  }

  guardar() {
    console.log("Body mandato a guardar", this.bodyDatosMandatos);
    this.bodyDatosMandatos.idPersona = this.idPersona;
    this.bodyDatosMandatos.idCuenta = this.idCuenta;

    this.sigaServices
      .post("datosMandatos_insert", this.bodyDatosMandatos)
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.bodyDatosMandatos.status = data.status;
        },
        error => {
          this.bodyDatosMandatosSearch = JSON.parse(error["error"]);
          this.showFail(
            JSON.stringify(this.bodyDatosMandatosSearch.error.message)
          );
          console.log(error);
          this.progressSpinner = false;
        }
      );
  }

  abrirFichaDatosMandatos() {
    this.openFichaDatosMandatos = !this.openFichaDatosMandatos;
  }

  // Métodos comunes

  showFail(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "error", summary: "", detail: mensaje });
  }

  showSuccess(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "success", summary: "", detail: mensaje });
  }

  showInfo(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "info", summary: "", detail: mensaje });
  }

  backTo() {
    this.location.back();
  }
}
