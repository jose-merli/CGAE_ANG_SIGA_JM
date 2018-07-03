import { Component, OnInit } from "@angular/core";

import { Location } from "@angular/common";

import { ConfirmationService, Message } from "primeng/components/common/api";

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
  openFicha: boolean = false;
  progressSpinner: boolean = false;
  codigoPostalValido: boolean = false;
  formValido: boolean = false;

  isEditable: boolean = false;
  nuevo: boolean = false;

  msgs: Message[];
  usuarioBody: any[];
  comboPais: any[] = [];
  comboPoblacion: any[] = [];
  comboTipoDireccion: any[] = [];
  comboTipoContacto: any[] = [];
  comboDirecciones: any[] = [];

  selectedPais: any = {};
  selectedPoblacion: any = {};
  selectedTipoDireccion: any = {};
  selectedTipoContacto: any = {};

  registroEditable: String;
  idDireccion: String;
  idPersona: String;

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
    if (sessionStorage.getItem("direccion") != null) {
      this.body = JSON.parse(sessionStorage.getItem("direccion"));
    }
    this.idPersona = this.usuarioBody[0].idPersona;
    this.idDireccion = sessionStorage.getItem("idDireccion");
    // Combo de identificación
    this.sigaServices.get("integrantes_provincias").subscribe(
      n => {
        this.comboDirecciones = n.combooItems;
      },
      error => {}
    );
    this.registroEditable = sessionStorage.getItem("editar");

    if (this.registroEditable == "true") {
      // editar
      this.cargarModoEdicion();
    } else {
      // nuevo
      this.cargarModoNuevoRegistro();
    }
  }

  // ---------------------------------------------------------
  datosPrueba() {
    this.body.codigoPostal = "35200";
    this.body.tipoDireccion = "despacho";
    return this.body;
  }
  // ------------------------------------------------------------

  abrirFicha() {
    this.openFicha = !this.openFicha;
  }

  cargarDatos() {
    this.progressSpinner = false;
    this.body.idPersona = this.idPersona;
    this.body.idDireccion = this.idDireccion;

    this.sigaServices
      .postPaginado("direcciones_search", "?numPagina=1", this.body)
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.bodySearch = JSON.parse(data["body"]);

          // Hay que pasarle esto --> this.body = this.bodySearch.datosDireccionesItem[0];
          this.body = this.datosPrueba();

          this.rellenarComboPais();
          this.rellenarComboPoblacion();
        },
        error => {
          this.bodySearch = JSON.parse(error["error"]);
          this.showFail(JSON.stringify(this.bodySearch.error.message));
          console.log(error);
          this.progressSpinner = false;
        }
      );
  }

  cargarModoEdicion() {
    this.cargarDatos();
    this.isEditable = false;
    this.nuevo = false;
  }

  cargarModoNuevoRegistro() {
    // this.body.fechaModificacion = null;
    this.nuevo = true;

    this.rellenarComboPais();
    this.rellenarComboPoblacion();
  }

  rellenarComboPais() {
    this.sigaServices.get("direcciones_comboPais").subscribe(
      data => {
        // Hay que pasar esto --> this.comboPais = data.combooItems;

        this.comboPais.push({ label: "España", value: "1" });
        this.comboPais.push({ label: "Francia", value: "2" });
        this.comboPais.push({ label: "Italia", value: "3" });
        this.comboPais.push({ label: "Alemania", value: "4" });

        if (this.registroEditable == "true" && this.body != null) {
          // quizás sobre lo de body != null
          var combo = this.filtrarItemsCombo(this.comboPais, this.body.idPais);

          this.selectedPais = combo[0];
        } else {
          this.selectedPais = this.comboPais[3]; // Aquí sería el índice de España
        }
      },
      error => {
        this.bodySearch = JSON.parse(error["error"]);
        this.showFail(JSON.stringify(this.bodySearch.error.message));
      }
    );
  }

  onChangePais(event) {
    this.selectedPais = event.value;
    console.log("País", this.selectedPais);
  }

  rellenarComboPoblacion() {
    this.sigaServices.get("direcciones_comboPoblacion").subscribe(
      data => {
        // Hay que pasar esto -->  this.comboPoblacion = data.combooItems;

        this.comboPoblacion.push({ label: "Telde", value: "1" });
        this.comboPoblacion.push({ label: "Vecindario", value: "2" });

        this.selectedPoblacion = this.comboPoblacion[0];

        if (this.body != null) {
          var combo = this.filtrarItemsCombo(
            this.comboPoblacion,
            this.body.idPoblacion
          );

          this.selectedPoblacion = combo[0];
        }
      },
      error => {
        this.bodySearch = JSON.parse(error["error"]);
        this.showFail(JSON.stringify(this.bodySearch.error.message));
      }
    );
  }

  filtrarItemsCombo(combo, buscarElemento) {
    return combo.filter(function(obj) {
      return obj.value == buscarElemento;
    });
  }

  onChangePoblacion(event) {
    this.selectedPoblacion = event.value;
    console.log("Población", this.selectedPoblacion);
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

  autogenerarProvinciaPoblacion() {
    if (this.isValidCodigoPostal() && this.body.codigoPostal.length == 5) {
      this.recuperarProvinciaPoblacion();
      this.codigoPostalValido = true;
    } else {
      this.body.idProvincia = "";
      this.comboPoblacion = [];
      this.selectedPoblacion = "";
    }
  }

  recuperarProvinciaPoblacion() {
    this.sigaServices.post("direcciones_codigoPostal", this.body).subscribe(
      data => {
        //this.bodyCodigoPostalSearch = JSON.parse(data["body"]);
        //this.bodyCodigoPostal = this.bodyCodigoPostalSearch.datosDireccionesItem[0];

        this.bodyCodigoPostal = new DatosDireccionesCodigoPostalItem();
        // Esto es teórico
        this.bodyCodigoPostal.provincia = "LAS PALMAS";
      },
      error => {
        this.bodyCodigoPostalSearch = JSON.parse(error["error"]);
        this.showFail(
          JSON.stringify(this.bodyCodigoPostalSearch.error.message)
        );
      }
    );
  }

  validarFormulario(dato) {
    if (this.validarCodigoPostal()) {
      this.formValido = true;

      this.confirmarInsercion(dato);
    } else {
      this.formValido = false;
    }
  }

  confirmarInsercion(dato) {
    let mess = this.translateService.instant("messages.deleteConfirmation");
    let icon = "fa fa-info";

    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        this.insertarRegistro(dato);
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

  insertarRegistro(dato) {}

  restablecer() {}

  duplicarRegistro() {}

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
