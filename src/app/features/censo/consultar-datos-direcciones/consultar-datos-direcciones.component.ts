import { Component, OnInit } from "@angular/core";

import { Location } from "@angular/common";

import { ConfirmationService, Message } from "primeng/components/common/api";
import { ComboItem } from "./../../../../app/models/ComboItem";
import { TranslateService } from "../../../commons/translate/translation.service";
import { SigaServices } from "./../../../_services/siga.service";

import { DatosDireccionesItem } from "./../../../../app/models/DatosDireccionesItem";
import { DatosDireccionesObject } from "./../../../../app/models/DatosDireccionesObject";

import { DatosDireccionesCodigoPostalItem } from "./../../../../app/models/DatosDireccionesCodigoPostalItem";
import { DatosDireccionesCodigoPostalObject } from "./../../../../app/models/DatosDireccionesCodigoPostalObject";

@Component({
  selector: "app-consultar-datos-direcciones",
  templateUrl: "./consultar-datos-direcciones.component.html",
  styleUrls: ["./consultar-datos-direcciones.component.scss"]
})
export class ConsultarDatosDireccionesComponent implements OnInit {
  openFicha: boolean = true;
  progressSpinner: boolean = false;
  codigoPostalValido: boolean = true;
  isDisabledPoblacion: boolean = true;
  isDisabledProvincia: boolean = true;
  isDisabledCodigoPostal: boolean = true;
  formValido: boolean = false;
  textFilter: String;
  isEditable: boolean = false;
  nuevo: boolean = false;
  datosContacto: any[];
  msgs: Message[];
  columnasDirecciones: any = [];
  usuarioBody: any[];
  comboPais: any[];
  comboPoblacion: any[];
  comboTipoDireccion: any[];
  comboTipoContacto: any[];
  comboProvincia: any[];
  checkOtraProvincia: boolean = false;
  paisSeleccionado: any;
  provinciaSelecionada: String;
  registroEditable: boolean = false;
  idDireccion: String;
  idPersona: String;
  textSelected: String = "{0} etiquetas seleccionadas";
  body: DatosDireccionesItem = new DatosDireccionesItem();
  bodySearch: DatosDireccionesObject = new DatosDireccionesObject();

  bodyCodigoPostal: DatosDireccionesCodigoPostalItem = new DatosDireccionesCodigoPostalItem();
  bodyCodigoPostalSearch: DatosDireccionesCodigoPostalObject = new DatosDireccionesCodigoPostalObject();

  constructor(
    private location: Location,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService,
    private sigaServices: SigaServices
  ) {}

  ngOnInit() {
    this.usuarioBody = JSON.parse(sessionStorage.getItem("usuarioBody"));
    this.textFilter = "Elegir";
    this.getComboProvincia();
    this.getComboPais();
    this.getComboTipoDireccion();
    console.log(this.body.idPais);
    this.registroEditable = JSON.parse(
      sessionStorage.getItem("editarDireccion")
    );
    if (this.registroEditable) {
      this.nuevo = false;
    } else {
      this.nuevo = true;
    }
    if (sessionStorage.getItem("direccion") != null) {
      this.body = JSON.parse(sessionStorage.getItem("direccion"));
      this.body.idPersona = this.usuarioBody[0].idPersona;
      this.provinciaSelecionada = this.body.idProvincia;
      if (
        this.body.idPoblacion == null ||
        this.body.idPoblacion == "" ||
        this.body.idPoblacion == undefined
      ) {
        this.isDisabledPoblacion = true;
      } else {
        this.isDisabledPoblacion = false;
      }
      this.onChangePais();

      this.isDisabledProvincia = true;
    }
    this.getDatosContactos();
  }
  getDatosContactos() {
    this.columnasDirecciones = [
      {
        field: "tipo",
        header: "Tipo"
      },
      {
        field: "valor",
        header: "administracion.parametrosGenerales.literal.valor"
      }
    ];
    this.datosContacto = [
      {
        tipo: "Telefono",
        valor: this.body.telefono
      },
      {
        tipo: "Fax",
        valor: this.body.fax
      },
      {
        tipo: "Móvil",
        valor: this.body.movil
      },
      {
        tipo: "Correo-Electrónico",
        valor: this.body.correoElectronico
      },
      {
        tipo: "Página Web",
        valor: this.body.paginaWeb
      }
    ];
  }
  getComboProvincia() {
    // Combo de identificación
    this.sigaServices.get("integrantes_provincias").subscribe(
      n => {
        this.comboProvincia = n.combooItems;
      },
      error => {},
      () => {
        if (this.body.idProvincia != null) {
          this.getComboPoblacion();
        }
      }
    );
  }
  getComboPoblacion() {
    this.progressSpinner = true;
    this.sigaServices
      .getParam(
        "direcciones_comboPoblacion",
        "?idProvincia=" + this.body.idProvincia
      )
      .subscribe(
        n => {
          this.comboPoblacion = n.combooItems;
        },
        error => {},
        () => {
          // this.isDisabledPoblacion = false;
          this.progressSpinner = false;
        }
      );
  }
  getComboPais() {
    this.sigaServices.get("direcciones_comboPais").subscribe(
      n => {
        this.comboPais = n.combooItems;
      },
      error => {},
      () => {
        this.paisSeleccionado = this.comboPais.find(
          item => item.value == this.body.idPais
        );
        console.log(this.paisSeleccionado);
      }
    );
  }
  getComboTipoDireccion() {
    this.sigaServices.get("direcciones_comboTipoDireccion").subscribe(
      n => {
        this.comboTipoDireccion = n.combooItems;
      },
      error => {}
    );
  }

  abrirFicha() {
    this.openFicha = !this.openFicha;
  }

  isValidCodigoPostal(): boolean {
    return (
      this.body.codigoPostal &&
      typeof this.body.codigoPostal === "string" &&
      /^(?:0[1-9]\d{3}|[1-4]\d{4}|5[0-2]\d{3})$/.test(this.body.codigoPostal)
    );
  }

  validarCodigoPostal(): boolean {
    if (
      (this.body.codigoPostal != null || this.body.codigoPostal != undefined) &&
      this.isValidCodigoPostal() &&
      this.body.codigoPostal.length == 5
    ) {
      this.codigoPostalValido = true;
      return true;
    } else {
      this.codigoPostalValido = false;
      return false;
    }
  }
  onChangePais() {
    console.log(this.body.idPais);
    if (this.body.idPais != "191") {
      this.isDisabledCodigoPostal = true;
      this.body.codigoPostal = "";
      this.provinciaSelecionada = "";
      this.body.idProvincia = "";
      this.body.idPoblacion = "";
    } else {
      this.isDisabledCodigoPostal = false;
      this.body = JSON.parse(sessionStorage.getItem("direccion"));
      this.body.idPersona = this.usuarioBody[0].idPersona;
      this.provinciaSelecionada = this.body.idProvincia;
    }

    this.isDisabledProvincia = true;
  }
  onChangeCodigoPostal(event) {
    console.log(event);

    if (this.isValidCodigoPostal() && this.body.codigoPostal.length == 5) {
      // this.recuperarProvinciaPoblacion();
      let value = this.body.codigoPostal.substring(0, 2);
      this.provinciaSelecionada = value;
      if (value != this.body.idProvincia) {
        this.body.idProvincia = this.provinciaSelecionada;
        this.isDisabledProvincia = true;
        this.getComboPoblacion();
      }
      this.codigoPostalValido = true;
    } else {
      this.codigoPostalValido = false;
      // this.body.idProvincia = "";
    }
  }
  onChangeProvincia(event) {
    if (this.checkOtraProvincia == false) {
      this.getComboPoblacion();
    }
  }
  onChangeOtherProvincia(event) {
    if (event) {
      this.isDisabledPoblacion = true;
      this.isDisabledProvincia = false;
      this.body.otraProvincia = "1";
    } else {
      this.isDisabledPoblacion = false;
      this.isDisabledProvincia = true;
      this.onChangeCodigoPostal(event);
      this.body.otraProvincia = "0";
    }
    console.log(event);
  }
  guardar() {
    if (
      this.body.idTipoDireccion != null &&
      this.body.idTipoDireccion != undefined &&
      this.body.idTipoDireccion.length > 0
    ) {
      this.progressSpinner = true;
      if (this.registroEditable) {
        console.log(this.body);
        console.log(this.datosContacto);
        this.comprobarTablaDatosContactos();
        this.comprobarCheckProvincia();
        this.body.idProvincia = this.provinciaSelecionada;
        console.log(this.body);
        this.sigaServices.post("direcciones_update", this.body).subscribe(
          data => {
            this.progressSpinner = false;
            this.body = JSON.parse(data["body"]);
            this.backTo();
          },
          error => {
            this.bodySearch = JSON.parse(error["error"]);
            this.showFail(this.bodySearch.error.message.toString());
            console.log(error);
            this.progressSpinner = false;
          }
        );
      } else {
        console.log(this.body);
        console.log(this.datosContacto);
        this.comprobarTablaDatosContactos();
        this.comprobarCheckProvincia();
        this.body.idProvincia = this.provinciaSelecionada;
        console.log(this.body);
        this.sigaServices.post("direcciones_insert", this.body).subscribe(
          data => {
            this.progressSpinner = false;
            this.body = JSON.parse(data["body"]);
            this.backTo();
          },
          error => {
            this.bodySearch = JSON.parse(error["error"]);
            this.showFail(this.bodySearch.error.message.toString());
            console.log(error);
            this.progressSpinner = false;
          }
        );
      }
    } else {
      this.showFail("Debe de haber un tipo de Contacto seleccionado.");
    }
  }
  duplicarRegistro() {
    console.log(this.body);
    console.log(this.datosContacto);
    this.body.idDireccion = null;
    this.nuevo = false;
    this.comprobarTablaDatosContactos();
    this.comprobarCheckProvincia();
    console.log(this.body);
    this.sigaServices.post("direcciones_insert", this.body).subscribe(
      data => {
        this.progressSpinner = false;
      },
      error => {
        this.bodySearch = JSON.parse(error["error"]);
        this.showFail(this.bodySearch.error.message.toString());
        console.log(error);
        this.progressSpinner = false;
      }
    );
  }
  comprobarCheckProvincia() {
    if (this.checkOtraProvincia) {
      this.body.otraProvincia = "1";
    } else {
      this.body.otraProvincia = "0";
    }
  }
  autogenerarProvinciaPoblacion() {
    if (this.isValidCodigoPostal() && this.body.codigoPostal.length == 5) {
      // this.recuperarProvinciaPoblacion();
      this.codigoPostalValido = true;
    } else {
      this.body.idProvincia = "";
    }
  }
  comprobarTablaDatosContactos() {
    if (
      this.datosContacto[0].valor != null ||
      this.datosContacto[0].valor != undefined
    ) {
      if (this.datosContacto[0].valor != this.body.telefono) {
        this.body.telefono = this.datosContacto[0].valor;
      }
    }
    if (
      this.datosContacto[1].valor != null ||
      this.datosContacto[1].valor != undefined
    ) {
      if (this.datosContacto[1].valor != this.body.fax) {
        this.body.fax = this.datosContacto[1].valor;
      }
    }
    if (
      this.datosContacto[2].valor != null ||
      this.datosContacto[2].valor != undefined
    ) {
      if (this.datosContacto[2].valor != this.body.movil) {
        this.body.movil = this.datosContacto[2].valor;
      }
    }
    if (
      this.datosContacto[3].valor != null ||
      this.datosContacto[3].valor != undefined
    ) {
      if (this.datosContacto[3].valor != this.body.correoElectronico) {
        this.body.correoElectronico = this.datosContacto[3].valor;
      }
    }
    if (
      this.datosContacto[4].valor != null ||
      this.datosContacto[4].valor != undefined
    ) {
      if (this.datosContacto[4].valor != this.body.paginaWeb) {
        this.body.paginaWeb = this.datosContacto[4].valor;
      }
    }
  }

  restablecer() {
    if (sessionStorage.getItem("direccion") != null) {
      this.body = JSON.parse(sessionStorage.getItem("direccion"));
      this.body.idPersona = this.usuarioBody[0].idPersona;
      this.provinciaSelecionada = this.body.idProvincia;
      this.getDatosContactos();
    }
  }
  // Mensajes
  showFail(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "error", summary: "", detail: mensaje });
  }

  showSuccess(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "success", summary: "", detail: mensaje });
  }

  backTo() {
    this.location.back();
  }
}
