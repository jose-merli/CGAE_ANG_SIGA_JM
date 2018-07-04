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
  codigoPostalValido: boolean = false;
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
  registroEditable: String;
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
    this.getDatosContactos();
    this.getComboProvincia();
    // this.getComboPoblacion();
    this.getComboPais();
    this.getComboTipoDireccion();
    console.log(this.body.idPais);
    this.registroEditable = sessionStorage.getItem("editar");
    if (sessionStorage.getItem("direccion") != null) {
      this.body = JSON.parse(sessionStorage.getItem("direccion"));
    }
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
  onChangePais(event) {
    console.log(this.body.idPais);
  }
  onChangeProvincia(event) {
    this.getComboPoblacion();
  }
  onChangeOtherProvincia(event) {
    console.log(event);
  }
  // autogenerarProvinciaPoblacion() {
  //   if (this.isValidCodigoPostal() && this.body.codigoPostal.length == 5) {
  //     this.recuperarProvinciaPoblacion();
  //     this.codigoPostalValido = true;
  //   } else {
  //     this.body.idProvincia = "";
  //     this.comboPoblacion = [];
  //     this.selectedPoblacion = "";
  //   }
  // }

  // recuperarProvinciaPoblacion() {
  //   this.sigaServices.post("direcciones_codigoPostal", this.body).subscribe(
  //     data => {
  //       //this.bodyCodigoPostalSearch = JSON.parse(data["body"]);
  //       //this.bodyCodigoPostal = this.bodyCodigoPostalSearch.datosDireccionesItem[0];

  //       this.bodyCodigoPostal = new DatosDireccionesCodigoPostalItem();
  //       // Esto es teórico
  //       this.bodyCodigoPostal.provincia = "LAS PALMAS";
  //     },
  //     error => {
  //       this.bodyCodigoPostalSearch = JSON.parse(error["error"]);
  //       this.showFail(
  //         JSON.stringify(this.bodyCodigoPostalSearch.error.message)
  //       );
  //     }
  //   );
  // }

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
