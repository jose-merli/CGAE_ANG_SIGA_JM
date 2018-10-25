import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from "../../../../../../node_modules/@angular/forms";
import { Router } from "../../../../../../node_modules/@angular/router";
import { SigaServices } from "../../../../_services/siga.service";
import { TranslateService } from "../../../../commons/translate";
import { SolicitudIncorporacionItem } from "../../../../models/SolicitudIncorporacionItem";
import { Location } from "@angular/common";
import { Message } from "primeng/components/common/api";

@Component({
  selector: "app-nueva-incorporacion",
  templateUrl: "./nueva-incorporacion.component.html",
  styleUrls: ["./nueva-incorporacion.component.scss"]
})
export class NuevaIncorporacionComponent implements OnInit {
  existeImagen: any;
  fichaColegiacion: boolean = false;
  fichaSolicitud: boolean = false;
  fichaPersonal: boolean = false;
  fichaDireccion: boolean = false;
  fichaBancaria: boolean = false;
  es: any;
  solicitudEditar: SolicitudIncorporacionItem = new SolicitudIncorporacionItem();
  progressSpinner: boolean = false;
  comboSexo: any;
  tiposSolicitud: any[];
  estadosSolicitud: any[];
  tipoColegiacion: any[];
  tipoIdentificacion: any[];
  provincias: any[];
  poblaciones: any[];
  modalidadDocumentacion: any[];
  tipoCuenta: any[];
  paises: any[];
  tratamientos: any[];
  estadoCivil: any[];
  residente: boolean = false;
  abonoJCS: boolean = false;
  abono: boolean = false;
  cargo: boolean = false;
  formSolicitud: FormGroup;
  estadoSolicitudSelected: any;
  tipoSolicitudSelected: any;
  tipoColegiacionSelected: any;
  msgs: Message[] = [];
  consulta: boolean = false;

  modalidadDocumentacionSelected: any;
  tipoIdentificacionSelected: any;
  tratamientoSelected: any;
  estadoCivilSelected: any;
  paisSelected: any;
  provinciaSelected: any;
  poblacionSelected: any;
  sexoSelected: any;
  selectedTipoCuenta: any[] = [];

  private DNI_LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE";

  constructor(
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private location: Location,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this.progressSpinner = true;
    this.es = this.translateService.getCalendarLocale();
    this.cargarCombos();

    if (sessionStorage.getItem("consulta") == "true") {
      this.solicitudEditar = JSON.parse(
        sessionStorage.getItem("editedSolicitud")
      );
      console.log(this.solicitudEditar);

      this.consulta = true;
      this.tratarDatos();
    } else {
      this.consulta = false;
      this.estadoSolicitudSelected = { value: "20" };
    }
  }

  cargarCombos() {
    this.comboSexo = [
      { value: "", label: null },
      { value: "H", label: "Hombre" },
      { value: "M", label: "Mujer" }
    ];

    this.sigaServices.get("solicitudInciporporacion_tipoSolicitud").subscribe(
      result => {
        this.tiposSolicitud = result.combooItems;
        this.progressSpinner = false;
      },
      error => {
        console.log(error);
      }
    );

    this.sigaServices.get("solicitudInciporporacion_estadoSolicitud").subscribe(
      result => {
        this.estadosSolicitud = result.combooItems;
        this.progressSpinner = false;
      },
      error => {
        console.log(error);
      }
    );

    this.sigaServices.get("solicitudInciporporacion_tratamiento").subscribe(
      result => {
        this.tratamientos = result.combooItems;
        this.progressSpinner = false;
      },
      error => {
        console.log(error);
      }
    );

    this.sigaServices.get("solicitudInciporporacion_estadoCivil").subscribe(
      result => {
        this.estadoCivil = result.combooItems;
        this.progressSpinner = false;
      },
      error => {
        console.log(error);
      }
    );

    this.sigaServices.get("solicitudInciporporacion_pais").subscribe(
      result => {
        this.paises = result.combooItems;
        this.progressSpinner = false;
      },
      error => {
        console.log(error);
      }
    );

    this.sigaServices
      .get("solicitudInciporporacion_tipoIdentificacion")
      .subscribe(
        result => {
          this.tipoIdentificacion = result.combooItems;
          this.progressSpinner = false;
        },
        error => {
          console.log(error);
        }
      );

    this.sigaServices.get("solicitudInciporporacion_tipoColegiacion").subscribe(
      result => {
        this.tipoColegiacion = result.combooItems;
        this.progressSpinner = false;
      },
      error => {
        console.log(error);
      }
    );

    this.sigaServices
      .get("solicitudInciporporacion_modalidadDocumentacion")
      .subscribe(
        result => {
          this.modalidadDocumentacion = result.combooItems;
          this.progressSpinner = false;
        },
        error => {
          console.log(error);
        }
      );

    this.sigaServices.get("integrantes_provincias").subscribe(
      result => {
        this.provincias = result.combooItems;
        this.progressSpinner = false;
      },
      error => {
        console.log(error);
      }
    );
  }

  tratarDatos() {
    if (this.solicitudEditar.residente == "1") {
      this.residente = true;
    } else {
      this.residente = false;
    }

    if (this.solicitudEditar.abonoJCS == "1") {
      this.abonoJCS = true;
    } else {
      this.abonoJCS = false;
    }

    if (this.solicitudEditar.abonoCargo != null) {
      if (this.solicitudEditar.abonoCargo.indexOf("T") > 0) {
        this.cargo = true;
        this.abono = true;
      } else {
        if (this.solicitudEditar.abonoCargo.indexOf("C") > 0) {
          this.cargo = true;
        } else {
          this.abono = true;
        }
      }
    }

    this.solicitudEditar.fechaSolicitud = new Date(
      this.solicitudEditar.fechaSolicitud
    );
    this.solicitudEditar.fechaIncorporacion = new Date(
      this.solicitudEditar.fechaIncorporacion
    );
    this.solicitudEditar.fechaEstado = new Date(
      this.solicitudEditar.fechaEstado
    );
    this.solicitudEditar.fechaNacimiento = new Date(
      this.solicitudEditar.fechaNacimiento
    );

    this.sigaServices
      .getParam(
        "direcciones_comboPoblacion",
        "?idProvincia=" + this.solicitudEditar.idProvincia
      )
      .subscribe(
        result => {
          this.poblaciones = result.combooItems;
          this.progressSpinner = false;
        },
        error => {
          console.log(error);
        }
      );
    this.estadoSolicitudSelected = { value: this.solicitudEditar.idEstado };
    this.tipoSolicitudSelected = { value: this.solicitudEditar.idTipo };
    this.tipoColegiacionSelected = {
      value: this.solicitudEditar.idTipoColegiacion
    };
    this.modalidadDocumentacionSelected = {
      value: this.solicitudEditar.idModalidadDocumentacion
    };
    this.tipoIdentificacionSelected = {
      value: this.solicitudEditar.idTipoIdentificacion
    };
    this.tratamientoSelected = { value: this.solicitudEditar.idTratamiento };
    this.estadoCivilSelected = { value: this.solicitudEditar.idEstadoCivil };
    this.paisSelected = { value: this.solicitudEditar.idPais };
    this.provinciaSelected = { value: this.solicitudEditar.idProvincia };
    this.poblacionSelected = { value: this.solicitudEditar.idPoblacion };
    this.sexoSelected = { value: this.solicitudEditar.sexo };
  }

  onChangeProvincia(event) {
    this.sigaServices
      .getParam(
        "direcciones_comboPoblacion",
        "?idProvincia=" + event.value.value
      )
      .subscribe(
        result => {
          this.poblaciones = result.combooItems;
          this.progressSpinner = false;
          console.log(this.poblaciones);
        },
        error => {
          console.log(error);
        }
      );
  }

  onChangePais(event) {
    this.solicitudEditar.idPais = event.value.value;
    if (event.value.value != "191") {
      this.provinciaSelected = null;
      this.poblacionSelected = null;
      this.solicitudEditar.codigoPostal = null;
    }
  }

  isValidIBAN(): boolean {
    if (
      this.solicitudEditar.iban != null ||
      this.solicitudEditar.iban != undefined
    ) {
      this.solicitudEditar.iban = this.solicitudEditar.iban.replace(/\s/g, "");
      return (
        this.solicitudEditar.iban &&
        typeof this.solicitudEditar.iban === "string" &&
        // /ES\d{2}[ ]\d{4}[ ]\d{4}[ ]\d{4}[ ]\d{4}[ ]\d{4}|ES\d{22}/.test(
        ///[A-Z]{2}\d{22}?[\d]{0,2}/.test(this.body.iban)
        /^ES\d{22}$/.test(this.solicitudEditar.iban)
      );
    }
  }

  deshabilitarDireccion(): boolean {
    if (this.solicitudEditar.idPais != "191") {
      return true;
    } else {
      return false;
    }
  }

  rellenarComboTipoCuenta(body) {
    this.selectedTipoCuenta = [];
    var salir = false;
    this.tipoCuenta.forEach(element1 => {
      body.forEach(element2 => {
        if (!salir && element1.code == element2) {
          this.selectedTipoCuenta.push(element1);
          salir = true;
        } else {
          salir = false;
        }
      });
    });
  }

  aprobarSolicitud() {
    this.progressSpinner = true;
    this.sigaServices
      .post(
        "solicitudInciporporacion_aprobarSolicitud",
        this.solicitudEditar.idSolicitud
      )
      .subscribe(
        result => {
          console.log(result);
          this.progressSpinner = false;
          this.msgs = [
            {
              severity: "success",
              summary: "Éxito",
              detail: "Solicitud aprobada."
            }
          ];
        },
        error => {
          console.log(error);
          this.msgs = [
            {
              severity: "error",
              summary: "Error",
              detail: "Error al aprobar la solicitud."
            }
          ];
          this.progressSpinner = false;
        }
      );
  }
  denegarSolicitud() {
    this.progressSpinner = true;

    this.sigaServices
      .post(
        "solicitudInciporporacion_denegarSolicitud",
        this.solicitudEditar.idSolicitud
      )
      .subscribe(
        result => {
          this.progressSpinner = false;
          this.msgs = [
            {
              severity: "success",
              summary: "Éxito",
              detail: "Solicitud denegada."
            }
          ];
        },
        error => {
          console.log(error);
          this.msgs = [
            {
              severity: "error",
              summary: "Error",
              detail: "Error al denegar la solicitud."
            }
          ];
          this.progressSpinner = false;
        }
      );
  }

  SolicitarCertificado() {
    //TODO
  }

  guardar() {
    this.progressSpinner = true;

    this.solicitudEditar.idEstado = this.estadoSolicitudSelected.value;
    this.solicitudEditar.idTipo = this.tipoSolicitudSelected.value;
    this.solicitudEditar.tipoColegiacion = this.tipoColegiacionSelected.value;
    this.solicitudEditar.idModalidadDocumentacion = this.modalidadDocumentacionSelected.value;
    this.solicitudEditar.idTipoIdentificacion = this.tipoIdentificacionSelected.value;
    this.solicitudEditar.tratamiento = this.tratamientoSelected.value;
    this.solicitudEditar.idEstadoCivil = this.estadoCivilSelected.value;
    this.solicitudEditar.idPais = this.paisSelected.value;
    if (this.paisSelected.value == "191") {
      this.solicitudEditar.idProvincia = this.provinciaSelected.value;
      this.solicitudEditar.idPoblacion = this.poblacionSelected.value;
    }

    if (this.residente == true) {
      this.solicitudEditar.residente = "1";
    } else {
      this.solicitudEditar.residente = "0";
    }

    if (this.cargo == true && this.abono == true) {
      this.solicitudEditar.abonoCargo = "T";
    } else {
      if (this.cargo == true) {
        this.solicitudEditar.abonoCargo = "C";
      } else {
        this.solicitudEditar.abonoCargo = "A";
      }
    }

    if (this.abonoJCS == true) {
      this.solicitudEditar.abonoJCS = "1";
    } else {
      this.solicitudEditar.abonoJCS = "0";
    }

    this.sigaServices
      .post("solicitudInciporporacion_nuevaSolicitud", this.solicitudEditar)
      .subscribe(
        result => {
          sessionStorage.removeItem("editedSolicitud");
          sessionStorage.setItem(
            "editedSolicitud",
            JSON.stringify(this.solicitudEditar)
          );
          this.tratarDatos();
          this.progressSpinner = false;
          this.msgs = [
            {
              severity: "success",
              summary: "Éxito",
              detail: "Solicitud guardada correctamente."
            }
          ];
        },
        error => {
          this.msgs = [
            {
              severity: "error",
              summary: "Error",
              detail: "Error al guardar la solicitud."
            }
          ];
        }
      );
  }

  isGuardar(): boolean {
    if (
      this.checkIdentificacion(this.solicitudEditar.numeroIdentificacion) &&
      this.isValidIBAN() &&
      this.estadoSolicitudSelected.label != "" &&
      this.estadoSolicitudSelected != undefined &&
      this.solicitudEditar.fechaEstado != null &&
      this.solicitudEditar.fechaEstado != undefined &&
      this.solicitudEditar.fechaSolicitud != null &&
      this.solicitudEditar.fechaSolicitud != undefined &&
      this.tipoSolicitudSelected.label != "" &&
      this.tipoSolicitudSelected != undefined &&
      this.tipoColegiacionSelected.label != "" &&
      this.tipoColegiacionSelected != undefined &&
      this.modalidadDocumentacionSelected.label != "" &&
      this.modalidadDocumentacionSelected != undefined &&
      this.solicitudEditar.fechaIncorporacion != null &&
      this.solicitudEditar.fechaIncorporacion != undefined &&
      this.solicitudEditar.numColegiado != null &&
      this.solicitudEditar.numColegiado != undefined &&
      this.tipoIdentificacionSelected.label != "" &&
      this.tipoIdentificacionSelected != undefined &&
      this.solicitudEditar.numeroIdentificacion != null &&
      this.solicitudEditar.numeroIdentificacion != undefined &&
      this.tratamientoSelected.label != "" &&
      this.tratamientoSelected != undefined &&
      this.solicitudEditar.nombre != null &&
      this.solicitudEditar.nombre != undefined &&
      this.solicitudEditar.apellido1 != null &&
      this.solicitudEditar.apellido1 != undefined &&
      this.solicitudEditar.apellido2 != null &&
      this.solicitudEditar.apellido2 != undefined &&
      this.sexoSelected.label != "" &&
      this.sexoSelected != undefined &&
      this.estadoCivilSelected.label != "" &&
      this.estadoCivilSelected != undefined &&
      this.solicitudEditar.naturalDe != null &&
      this.solicitudEditar.naturalDe != undefined &&
      this.solicitudEditar.fechaNacimiento != null &&
      this.solicitudEditar.fechaNacimiento != undefined &&
      this.paisSelected.label != "" &&
      this.paisSelected != undefined &&
      this.solicitudEditar.domicilio != null &&
      this.solicitudEditar.domicilio != undefined &&
      this.solicitudEditar.codigoPostal != null &&
      this.solicitudEditar.codigoPostal != undefined &&
      this.solicitudEditar.telefono1 != null &&
      this.solicitudEditar.telefono1 != undefined &&
      this.solicitudEditar.movil != null &&
      this.solicitudEditar.correoElectronico != null &&
      this.solicitudEditar.correoElectronico != undefined &&
      this.solicitudEditar.titular != null &&
      this.solicitudEditar.titular != undefined &&
      this.solicitudEditar.iban != null &&
      this.solicitudEditar.iban != undefined &&
      this.solicitudEditar.banco != null &&
      this.solicitudEditar.banco != undefined
    ) {
      return true;
    } else {
      return false;
    }
  }

  abreCierraFichaColegiacion() {
    this.fichaColegiacion = !this.fichaColegiacion;
  }
  abreCierraFichaSolicitud() {
    this.fichaSolicitud = !this.fichaSolicitud;
  }
  abreCierraFichaPersonal() {
    this.fichaPersonal = !this.fichaPersonal;
  }
  abreCierraFichaDireccion() {
    this.fichaDireccion = !this.fichaDireccion;
  }
  abreCierraFichaBancaria() {
    this.fichaBancaria = !this.fichaBancaria;
  }

  checkIdentificacion(doc: String) {
    if (doc && doc.length > 0 && doc != undefined) {
      if (doc.length == 10) {
        return this.isValidPassport(doc);
      } else {
        if (
          doc.substring(0, 1) == "1" ||
          doc.substring(0, 1) == "2" ||
          doc.substring(0, 1) == "3" ||
          doc.substring(0, 1) == "4" ||
          doc.substring(0, 1) == "5" ||
          doc.substring(0, 1) == "6" ||
          doc.substring(0, 1) == "7" ||
          doc.substring(0, 1) == "8" ||
          doc.substring(0, 1) == "9" ||
          doc.substring(0, 1) == "0"
        ) {
          return this.isValidDNI(doc);
        } else {
          return this.isValidNIE(doc);
        }
      }
    } else {
      return true;
    }
  }

  isValidPassport(dni: String): boolean {
    return (
      dni && typeof dni === "string" && /^[a-z]{3}[0-9]{6}[a-z]?$/i.test(dni)
    );
  }

  isValidNIE(nie: String): boolean {
    return (
      nie &&
      typeof nie === "string" &&
      /^[XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/i.test(nie)
    );
  }

  isValidDNI(dni: String): boolean {
    return (
      dni &&
      typeof dni === "string" &&
      /^[0-9]{8}([A-Za-z]{1})$/.test(dni) &&
      dni.substr(8, 9).toUpperCase() ===
      this.DNI_LETTERS.charAt(parseInt(dni.substr(0, 8), 10) % 23)
    );
  }

  backTo() {
    sessionStorage.removeItem("editedSolicitud");
    this.location.back();
  }

  irAlterMutua() {
    sessionStorage.setItem("datosSolicitud", JSON.stringify(this.solicitudEditar));
    this.router.navigate(["/alterMutua"]);
  }
  clear() {
    this.msgs = [];
  }

  irPlanUniversal() {
    this.router.navigate(["/MutualidadAbogaciaPlanUniversal"]);
  }
  irSegAccidentes() {
    //TODO: this.router.navigate(["/alterMutua"]);
  }
}
