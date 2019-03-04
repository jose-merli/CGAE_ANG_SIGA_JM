import {
  Component,
  OnInit,
  ViewChild,
  HostListener,
  ChangeDetectorRef
} from "@angular/core";
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
import { ConfirmationService } from "primeng/api";
import { Location } from "@angular/common";
import { Message } from "primeng/components/common/api";
import { isNumeric } from "rxjs/util/isNumeric";

import { DropdownModule, Dropdown } from "primeng/dropdown";

export enum KEY_CODE {
  ENTER = 13
}

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
  checkSolicitudInicio: SolicitudIncorporacionItem = new SolicitudIncorporacionItem();
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
  estadoSolicitudSelected: String;
  tipoSolicitudSelected: String;
  tipoColegiacionSelected: String;
  msgs: Message[] = [];
  consulta: boolean = false;
  pendienteAprobacion: boolean = false;
  resultadosPoblaciones: String;
  modalidadDocumentacionSelected: String;
  tipoIdentificacionSelected: String;
  tratamientoSelected: String;
  estadoCivilSelected: String;
  paisSelected: String = "0";
  provinciaSelected: String;
  poblacionSelected: String;
  sexoSelected: String;
  selectedTipoCuenta: any[] = [];
  codigoPostalValido: boolean = false;
  numColegiadoDisponible: boolean;
  dniDisponible: boolean;
  vieneDeBusqueda: boolean = false;
  solicitarMutualidad: boolean = true;
  isLetrado: boolean = true;
  private DNI_LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE";

  constructor(
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private confirmationService: ConfirmationService,
    private location: Location,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  @ViewChild("poblacion")
  dropdown: Dropdown;

  ngOnInit() {
    if (sessionStorage.getItem("isLetrado")) {
      this.isLetrado = JSON.parse(sessionStorage.getItem("isLetrado"));
    }
    this.solicitudEditar = new SolicitudIncorporacionItem();
    this.progressSpinner = true;
    this.es = this.translateService.getCalendarLocale();
    this.cargarCombos();
    if (JSON.parse(sessionStorage.getItem("pendienteAprobacion")) == true) {
      this.pendienteAprobacion = true;
      sessionStorage.removeItem("pendienteAprobacion");
    }
    if (sessionStorage.getItem("consulta") == "true") {
      this.solicitudEditar = JSON.parse(
        sessionStorage.getItem("editedSolicitud")
      );
      this.checkSolicitudInicio = JSON.parse(
        sessionStorage.getItem("editedSolicitud")
      );
      this.consulta = true;
      this.tratarDatos();
    } else {
      this.consulta = false;

      if (sessionStorage.getItem("nuevaIncorporacion")) {
        let solicitudrecibida = JSON.parse(
          sessionStorage.getItem("nuevaIncorporacion")
        );

        this.solicitudEditar = JSON.parse(
          sessionStorage.getItem("nuevaIncorporacion")
        );
        this.checkSolicitudInicio = JSON.parse(
          sessionStorage.getItem("nuevaIncorporacion")
        );
      } else {
        this.solicitudEditar = JSON.parse(
          sessionStorage.getItem("editedSolicitud")
        );
        this.checkSolicitudInicio = JSON.parse(
          sessionStorage.getItem("editedSolicitud")
        );
        this.tratarDatos();
      }
      this.estadoSolicitudSelected = "20";
      this.vieneDeBusqueda = true;
      this.dniDisponible = false;
    }

    if (this.solicitudEditar.apellido2 != undefined) {
      this.solicitudEditar.apellidos = this.solicitudEditar.apellido1 + " " + this.solicitudEditar.apellido2;
    } else {
      this.solicitudEditar.apellidos = this.solicitudEditar.apellido1;
    }

    // Se añade cambio de que aparezca po defecto el nombre del colegiado como titular de los datos bancarios
    if (
      this.solicitudEditar.titular == null ||
      this.solicitudEditar.titular == undefined ||
      this.solicitudEditar.titular == ""
    ) {
      this.solicitudEditar.titular =
        this.solicitudEditar.nombre + " " + this.solicitudEditar.apellidos;
    }

    if (this.isValidIBAN()) {
      this.recuperarBicBanco();
      this.checkSolicitudInicio = JSON.parse(
        JSON.stringify(this.solicitudEditar)
      );
    }
    this.onChangeNColegiado(undefined);
    this.onChangeCodigoPostal();
    this.getComboPoblacion(this.solicitudEditar.nombrePoblacion.toString());
  }

  cargarCombos() {
    this.comboSexo = [
      { value: "", label: null },
      { value: "H", label: "Hombre" },
      { value: "M", label: "Mujer" }
    ];

    this.sigaServices.get("solicitudIncorporacion_tipoSolicitud").subscribe(
      result => {
        this.tiposSolicitud = result.combooItems;
        this.progressSpinner = false;
      },
      error => {
        console.log(error);
      }
    );

    this.sigaServices.get("solicitudIncorporacion_estadoSolicitud").subscribe(
      result => {
        this.estadosSolicitud = result.combooItems;
        this.progressSpinner = false;
      },
      error => {
        console.log(error);
      }
    );

    this.sigaServices.get("solicitudIncorporacion_tratamiento").subscribe(
      result => {
        this.tratamientos = result.combooItems;
        this.progressSpinner = false;
      },
      error => {
        console.log(error);
      }
    );

    this.sigaServices.get("solicitudIncorporacion_estadoCivil").subscribe(
      result => {
        this.estadoCivil = result.combooItems;
        this.progressSpinner = false;
      },
      error => {
        console.log(error);
      }
    );

    this.sigaServices.get("solicitudIncorporacion_pais").subscribe(
      result => {
        this.paises = result.combooItems;
        this.progressSpinner = false;
      },
      error => {
        console.log(error);
      }
    );

    this.sigaServices.get("fichaPersona_tipoIdentificacionCombo").subscribe(
      result => {
        this.tipoIdentificacion = result.combooItems;
        // 1: {label: "CIF", value: "20"}
        // 2: {label: "NIE", value: "40"}
        // 3: {label: "NIF", value: "10"}
        // 4: {label: "Otro", value: "50"}
        // 5: {label: "Pasaporte", value: "30"}
        this.tipoIdentificacion[5].label =
          this.tipoIdentificacion[5].label +
          " / " +
          this.tipoIdentificacion[4].label;
        this.progressSpinner = false;
      },
      error => {
        console.log(error);
      }
    );

    this.sigaServices.get("solicitudIncorporacion_tipoColegiacion").subscribe(
      result => {
        this.tipoColegiacion = result.combooItems;
        this.progressSpinner = false;
      },
      error => {
        console.log(error);
      }
    );

    this.sigaServices
      .get("solicitudIncorporacion_modalidadDocumentacion")
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
    if (this.solicitudEditar.nombrePoblacion != undefined) {
      this.getComboPoblacion(
        this.solicitudEditar.nombrePoblacion.substring(0, 3)
      );
    }
  }

  buscarPoblacion(e) {
    if (e.target.value && e.target.value !== null) {
      if (e.target.value.length >= 3) {
        this.getComboPoblacion(e.target.value);
        this.resultadosPoblaciones = "No hay resultados";
      } else {
        this.poblaciones = [];
        this.resultadosPoblaciones = "Debe introducir al menos 3 caracteres";
      }
    } else {
      this.poblaciones = [];
      this.resultadosPoblaciones = "No hay resultados";
    }
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
      if (this.solicitudEditar.abonoCargo == "T") {
        this.cargo = true;
        this.abono = true;
      } else {
        if (this.solicitudEditar.abonoCargo == "C") {
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
    this.estadoSolicitudSelected = this.solicitudEditar.idEstado;
    this.tipoSolicitudSelected = this.solicitudEditar.idTipo;
    this.tipoColegiacionSelected = this.solicitudEditar.idTipoColegiacion;
    this.modalidadDocumentacionSelected = this.solicitudEditar.idModalidadDocumentacion;
    this.tipoIdentificacionSelected = this.solicitudEditar.idTipoIdentificacion;
    this.tratamientoSelected = this.solicitudEditar.idTratamiento;
    this.estadoCivilSelected = this.solicitudEditar.idEstadoCivil;
    this.paisSelected = this.solicitudEditar.idPais;
    this.provinciaSelected = this.solicitudEditar.idProvincia;
    this.poblacionSelected = this.solicitudEditar.idPoblacion;
    this.sexoSelected = this.solicitudEditar.sexo;
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
    this.solicitudEditar.idPais = event.value;
    if (event.value.value != "191") {
      this.isValidCodigoPostal();
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

  autogenerarDatos() {
    if (this.isValidIBAN()) {
      this.recuperarBicBanco();
    } else {
      this.solicitudEditar.banco = "";
    }
  }

  onChangeNColegiado(event) {
    if (!this.isValidNumColegiado()) {
      if (event != undefined) {
        if (this.solicitudEditar != undefined && this.solicitudEditar.numColegiado != undefined) {
          event.currentTarget.value = this.solicitudEditar.numColegiado.substring(
            0,
            this.solicitudEditar.numColegiado.length - 1
          );
        }
      }
    } 
    // else {
    //   this.sigaServices
    //     .post("solicitudIncorporacion_searchNumColegiado", this.solicitudEditar)
    //     .subscribe(
    //       data => {
    //         let resultado = JSON.parse(data["body"]);
    //         if (resultado.numColegiado == "disponible") {
    //           this.numColegiadoDisponible = true;
    //         } else {
    //           this.numColegiadoDisponible = false;
    //         }
    //       },
    //       error => {
    //         let resultado = JSON.parse(error["error"]);
    //         this.showFail(resultado.error.message.toString());
    //       }
    //     );
    // }
  }

  onChangeNifCif() {
    this.compruebaDNI();
    if (this.checkIdentificacion(this.solicitudEditar.numeroIdentificacion)) {
      this.sigaServices
        .post("solicitudIncorporacion_searchNifExistente", this.solicitudEditar)
        .subscribe(
          data => {
            let resultado = JSON.parse(data["body"]);
            if (resultado.numeroIdentificacion == "disponible") {
              this.dniDisponible = true;
            } else {
              // let mess = this.translateService.instant("messages.deleteConfirmation");
              let mess =
                "Usuario ya existente, ¿desea cargar los datos de este usuario?";
              let icon = "fas fa-exclamation";

              this.confirmationService.confirm({
                message: mess,
                icon: icon,
                accept: () => {
                  this.solicitudEditar = resultado;
                  this.tipoIdentificacionSelected = this.solicitudEditar.idTipoIdentificacion;
                  this.tratamientoSelected = this.solicitudEditar.tratamiento;
                  this.estadoCivilSelected = this.solicitudEditar.idEstadoCivil;
                  this.sexoSelected = this.solicitudEditar.sexo;
                  this.solicitudEditar.fechaNacimiento = undefined;
                  this.dniDisponible = false;
                  this.vieneDeBusqueda = false;
                },
                reject: () => {
                  this.dniDisponible = undefined;
                  this.msgs = [
                    {
                      severity: "info",
                      summary: "Cancel",
                      detail: this.translateService.instant(
                        "general.message.accion.cancelada"
                      )
                    }
                  ];
                }
              });
            }
          },
          error => {
            let resultado = JSON.parse(error["error"]);
            this.showFailGenerico();
          }
        );
    } else {
      this.dniDisponible = undefined;
    }
  }
  showFailGenerico() {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Incorrecto",
      detail: this.translateService.instant(
        "general.message.error.realiza.accion"
      )
    });
  }
  recuperarBicBanco() {
    this.sigaServices
      .post("datosCuentaBancaria_BIC_BANCO", this.solicitudEditar)
      .subscribe(
        data => {
          let bodyBancoBicSearch = JSON.parse(data["body"]);
          let bodyBancoBic = bodyBancoBicSearch.bancoBicItem[0];

          this.solicitudEditar.banco = bodyBancoBic.banco;
          this.solicitudEditar.bic = bodyBancoBic.bic;
          this.checkSolicitudInicio.banco = bodyBancoBic.banco;
          this.checkSolicitudInicio.bic = bodyBancoBic.bic;
        },
        error => {
          // let bodyBancoBicSearch = JSON.parse(error["error"]);
          this.showFailGenerico();
        }
      );
  }

  deshabilitarDireccion(): boolean {
    if (this.solicitudEditar.idPais != "191" || !this.codigoPostalValido) {
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
    if (this.isGuardar()) {
      this.guardar(false);
    }

    this.sigaServices
        .post("solicitudIncorporacion_searchNumColegiado", this.solicitudEditar)
        .subscribe(
          data => {
            let resultado = JSON.parse(data["body"]);
            if (resultado.numColegiado == "disponible") {
              this.sigaServices
              .post(
                "solicitudIncorporacion_aprobarSolicitud",
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
                  this.location.back();
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
            } else {
              this.showFail("censo.solicitudIncorporacion.ficha.numColegiadoDuplicado");
            }
            this.progressSpinner = true;
          },
          error => {
            let resultado = JSON.parse(error["error"]);
            this.showFail(resultado.error.message.toString());
          }
        );


    this.progressSpinner = true;
   
  }

  denegarSolicitud() {
    this.progressSpinner = true;

    this.sigaServices
      .post(
        "solicitudIncorporacion_denegarSolicitud",
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
          this.location.back();
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

  onChangeCargo() {
    if (this.cargo == true && this.abono == true) {
      this.solicitudEditar.abonoCargo = "T";
    } else {
      if (this.cargo == true) {
        this.solicitudEditar.abonoCargo = "C";
      } else {
        this.solicitudEditar.abonoCargo = "A";
      }
    }
  }

  onChangeAbonoSJCS() {
    if (this.abonoJCS == true) {
      this.solicitudEditar.abonoJCS = "1";
    } else {
      this.solicitudEditar.abonoJCS = "0";
    }
  }

  guardar(back) {
    this.progressSpinner = true;

    this.solicitudEditar.idEstado = this.estadoSolicitudSelected;
    this.solicitudEditar.idTipo = this.tipoSolicitudSelected;
    this.solicitudEditar.tipoColegiacion = this.tipoColegiacionSelected;
    this.solicitudEditar.idModalidadDocumentacion = this.modalidadDocumentacionSelected;
    this.solicitudEditar.idTipoIdentificacion = this.tipoIdentificacionSelected;
    this.solicitudEditar.tratamiento = this.tratamientoSelected;
    this.solicitudEditar.idEstadoCivil = this.estadoCivilSelected;
    this.solicitudEditar.idPais = this.paisSelected;
    this.solicitudEditar.sexo = this.sexoSelected;
    if (this.paisSelected == "191") {
      this.solicitudEditar.idProvincia = this.provinciaSelected;
      this.solicitudEditar.idPoblacion = this.poblacionSelected;
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
      .post("solicitudIncorporacion_nuevaSolicitud", this.solicitudEditar)
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
          if (back == true) {
            sessionStorage.setItem("solicitudInsertadaConExito", "true");
            this.router.navigate(["/solicitudesIncorporacion"]);
          }
        },
        error => {
          this.progressSpinner = false;
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

  onChangeCodigoPostal() {
    if (this.solicitudEditar.idPais == "191") {
      if (
        this.isValidCodigoPostal() &&
        this.solicitudEditar.codigoPostal.length == 5
      ) {
        let value = this.solicitudEditar.codigoPostal.substring(0, 2);
        this.provinciaSelected = value;
        let isDisabledPoblacion = false;
        if (value != this.solicitudEditar.idProvincia) {
          this.solicitudEditar.idProvincia = this.provinciaSelected;
          this.solicitudEditar.idPoblacion = "";
          this.poblaciones = [];
        }
        this.codigoPostalValido = true;
      } else {
        this.codigoPostalValido = false;
      }
    }
  }

  isValidCodigoPostal(): boolean {
    return (
      this.solicitudEditar.codigoPostal &&
      typeof this.solicitudEditar.codigoPostal === "string" &&
      /^(?:0[1-9]\d{3}|[1-4]\d{4}|5[0-2]\d{3})$/.test(
        this.solicitudEditar.codigoPostal
      )
    );
  }

  isValidNumColegiado(): boolean {
    return (
      this.solicitudEditar.numColegiado &&
      typeof this.solicitudEditar.numColegiado === "string" &&
      /^[0-9]*$/.test(this.solicitudEditar.numColegiado)
    );
  }

  getLabelbyFilter(string) {
    /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
para poder filtrar el dato con o sin estos caracteres*/
    // array.map(e => {
    //   let accents =
    //     "ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž";
    //   let accentsOut =
    //     "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
    //   let i;
    //   let x;
    //   for (i = 0; i < e.label.length; i++) {
    //     if ((x = accents.indexOf(e.label[i])) != -1) {
    //       e.labelSinTilde = e.label.replace(e.label[i], accentsOut[x]);
    //       return e.labelSinTilde;
    //     }
    //   }
    // });

    /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
para poder filtrar el dato con o sin estos caracteres*/
    let labelSinTilde = string;
    let accents =
      "ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž";
    let accentsOut =
      "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
    let i;
    let x;
    for (i = 0; i < string.length; i++) {
      if ((x = accents.indexOf(string.charAt(i))) != -1) {
        labelSinTilde = string.replace(string.charAt(i), accentsOut[x]);
        return labelSinTilde;
      }
    }

    return labelSinTilde;
  }

  getComboPoblacion(filtro: string) {
    this.progressSpinner = true;
    let poblacionBuscada = this.getLabelbyFilter(filtro);
    this.sigaServices
      .getParam(
        "direcciones_comboPoblacion",
        "?idProvincia=" +
          this.solicitudEditar.idProvincia +
          "&filtro=" +
          poblacionBuscada
      )
      .subscribe(
        n => {
          this.poblaciones = n.combooItems;
          //this.getLabelbyFilter(this.poblaciones);
          //this.dropdown.filterViewChild.nativeElement.value = poblacionBuscada;

          this.poblaciones.map(e => {
            let accents =
              "ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž";
            let accentsOut =
              "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
            let i;
            let x;
            for (i = 0; i < e.label.length; i++) {
              if ((x = accents.indexOf(e.label[i])) != -1) {
                e.labelSinTilde = e.label.replace(e.label[i], accentsOut[x]);
                return e.labelSinTilde;
              }
            }
          });
        },
        error => {},
        () => {
          // this.isDisabledPoblacion = false;
          this.progressSpinner = false;
        }
      );
  }

  compruebaDNI() {
    // if (this.generalBody.nif.length > 8) {
    if (this.isValidDNI(this.solicitudEditar.numeroIdentificacion)) {
      this.solicitudEditar.idTipoIdentificacion = "10";
      this.tipoIdentificacionSelected = "10";
      return true;
    } else if (
      this.isValidPassport(this.solicitudEditar.numeroIdentificacion)
    ) {
      this.solicitudEditar.idTipoIdentificacion = "30";
      this.tipoIdentificacionSelected = "30";
      return true;
    } else if (this.isValidNIE(this.solicitudEditar.numeroIdentificacion)) {
      this.solicitudEditar.idTipoIdentificacion = "40";
      this.tipoIdentificacionSelected = "40";
      return true;
    } else if (this.isValidCIF(this.solicitudEditar.numeroIdentificacion)) {
      this.solicitudEditar.idTipoIdentificacion = "20";
      this.tipoIdentificacionSelected = "20";
      return true;
    } else if (
      this.solicitudEditar.numeroIdentificacion != undefined &&
      this.solicitudEditar.numeroIdentificacion != null &&
      this.solicitudEditar.numeroIdentificacion != ""
    ) {
      this.solicitudEditar.idTipoIdentificacion = "30";
      this.tipoIdentificacionSelected = "30";
      return true;
    } else {
      return false;
    }
    // 1: {label: "CIF", value: "20"}
    // 2: {label: "NIE", value: "40"}
    // 3: {label: "NIF", value: "10"}
    // 4: {label: "Otro", value: "50"}
    // 5: {label: "Pasaporte", value: "30"}
    // } else {
    //   this.generalBody.idTipoIdentificacion = "30";
    //   return false;
    // }
  }

  onChangeResidente() {
    if (this.residente == true) {
      this.solicitudEditar.residente = "1";
    } else {
      this.solicitudEditar.residente = "0";
    }
  }

  isGuardar(): boolean {
    this.solicitudEditar.idTratamiento = this.tratamientoSelected;
    this.solicitudEditar.idEstadoCivil = this.estadoCivilSelected;
    this.solicitudEditar.idPais = this.paisSelected;
    this.solicitudEditar.sexo = this.sexoSelected;
    this.solicitudEditar.idTipo = this.tipoSolicitudSelected;
    this.solicitudEditar.idTipoColegiacion = this.tipoColegiacionSelected;
    this.solicitudEditar.idModalidadDocumentacion = this.modalidadDocumentacionSelected;
    if (
      JSON.stringify(this.checkSolicitudInicio) !=
        JSON.stringify(this.solicitudEditar) &&
      !this.isLetrado
    ) {
      if (
        this.compruebaDNI() &&
        (this.isValidIBAN() ||
          this.solicitudEditar.iban == "" ||
          this.solicitudEditar.iban == undefined) &&
        // this.provinciaSelected != "" &&
        this.estadoSolicitudSelected != "" &&
        this.estadoSolicitudSelected != undefined &&
        this.solicitudEditar.fechaEstado != null &&
        this.solicitudEditar.fechaEstado != undefined &&
        this.solicitudEditar.fechaSolicitud != null &&
        this.solicitudEditar.fechaSolicitud != undefined &&
        this.tipoSolicitudSelected != "" &&
        this.tipoSolicitudSelected != undefined &&
        this.tipoColegiacionSelected != "" &&
        this.tipoColegiacionSelected != undefined &&
        this.modalidadDocumentacionSelected != "" &&
        this.modalidadDocumentacionSelected != undefined &&
        this.solicitudEditar.fechaIncorporacion != null &&
        this.solicitudEditar.fechaIncorporacion != undefined &&
        this.numColegiadoDisponible != false &&
        this.tipoIdentificacionSelected != "" &&
        this.tipoIdentificacionSelected != undefined &&
        this.solicitudEditar.numeroIdentificacion != null &&
        this.solicitudEditar.numeroIdentificacion != undefined &&
        this.tratamientoSelected != "" &&
        this.tratamientoSelected != undefined &&
        this.solicitudEditar.nombre != null &&
        this.solicitudEditar.nombre != undefined &&
        this.solicitudEditar.apellido1 != null &&
        this.solicitudEditar.apellido1 != undefined &&
        this.solicitudEditar.fechaNacimiento != null &&
        this.solicitudEditar.fechaNacimiento != undefined &&
        this.paisSelected != undefined &&
        this.solicitudEditar.domicilio != null &&
        this.solicitudEditar.domicilio != undefined &&
        this.isValidCodigoPostal() &&
        this.solicitudEditar.codigoPostal != null &&
        this.solicitudEditar.codigoPostal != undefined &&
        this.solicitudEditar.telefono1 != null &&
        this.solicitudEditar.telefono1 != undefined &&
        this.solicitudEditar.correoElectronico != null &&
        this.solicitudEditar.correoElectronico != undefined &&
        this.solicitudEditar.titular != null &&
        this.solicitudEditar.titular != undefined &&
        this.solicitudEditar.iban != null &&
        this.solicitudEditar.iban != undefined
      ) {
        return true;
      } else {
        return false;
      }
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

  isValidCIF(cif: String): boolean {
    return (
      cif &&
      typeof cif === "string" &&
      /^([ABCDEFGHJKLMNPQRSUVW])(\d{7})([0-9A-J])$/.test(cif)
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
    this.router.navigate(["/solicitudesIncorporacion"]);
  }

  irAlterMutua() {
    sessionStorage.setItem(
      "datosSolicitud",
      JSON.stringify(this.solicitudEditar)
    );
    this.router.navigate(["/alterMutua"]);
  }
  clear() {
    this.msgs = [];
  }

  showFail(mensaje: string) {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "",
      detail: this.translateService.instant(mensaje)
    });
  }

  showSuccess(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "success", summary: "", detail: mensaje });
  }

  showInfo(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "info", summary: "", detail: mensaje });
  }

  irPlanUniversal() {
    // Acceso a Web Service para saber si hay una solicitud de Mutualidad.
    this.progressSpinner = true;
    this.solicitudEditar.idPais = this.paisSelected;
    this.solicitudEditar.identificador = this.solicitudEditar.numeroIdentificacion;
    this.sigaServices
      .post("mutualidad_estadoMutualista", this.solicitudEditar)
      .subscribe(
        result => {
          let prueba = JSON.parse(result.body);
          if (prueba.valorRespuesta == "1") {
            this.solicitudEditar.idSolicitudMutualidad = prueba.idSolicitud;
            this.solicitudEditar.estadoMutualidad = prueba.valorRespuesta;
            this.solicitudEditar.tipoIdentificacion = this.tipoIdentificacionSelected;
            this.solicitudEditar.tipoSolicitud = this.tipoSolicitudSelected;
            sessionStorage.setItem(
              "solicitudEnviada",
              JSON.stringify(this.solicitudEditar)
            );
            this.progressSpinner = false;
            this.router.navigate(["/MutualidadAbogaciaPlanUniversal"]);
          } else {
            //  this.modoLectura = true;
            this.progressSpinner = false;
            this.showInfo(prueba.valorRespuesta);
          }
        },
        error => {
          console.log(error);
        }
      );
  }

  irSegAccidentes() {
    this.progressSpinner = true;
    this.solicitudEditar.idPais = this.paisSelected;
    this.solicitudEditar.identificador = this.solicitudEditar.numeroIdentificacion;
    this.sigaServices
      .post("mutualidad_estadoMutualista", this.solicitudEditar)
      .subscribe(
        result => {
          let prueba = JSON.parse(result.body);
          if (prueba.valorRespuesta == "1") {
            this.solicitudEditar.idSolicitudMutualidad = prueba.idSolicitud;
            this.solicitudEditar.estadoMutualidad = prueba.valorRespuesta;
            this.solicitudEditar.tipoIdentificacion = this.tipoIdentificacionSelected;
            this.solicitudEditar.tipoSolicitud = this.tipoSolicitudSelected;
            sessionStorage.setItem(
              "solicitudEnviada",
              JSON.stringify(this.solicitudEditar)
            );
            this.progressSpinner = false;
            this.router.navigate(["/mutualidadSeguroAccidentes"]);
          } else {
            //  this.modoLectura = true;
            this.progressSpinner = false;
            this.showInfo(prueba.valorRespuesta);
          }
        },
        error => {
          console.log(error);
        }
      );
  }


  irAlterMutuaReta() {
    sessionStorage.setItem(
      "datosSolicitud",
      JSON.stringify(this.solicitudEditar)
    );
    sessionStorage.setItem("tipoPropuesta", "RETA");
    this.router.navigate(["/alterMutuaReta"]);
  }

  irOfertas() {
    sessionStorage.setItem(
      "datosSolicitud",
      JSON.stringify(this.solicitudEditar)
    );
    sessionStorage.setItem("tipoPropuesta", "Ofertas");
    this.router.navigate(["/alterMutuaOfertas"]);
  }

  ngOnDestroy() {
    sessionStorage.removeItem("solicitudIncorporacion");
    sessionStorage.removeItem("nuevaIncorporacion");
  }

  fillFechaEstado(event) {
    this.solicitudEditar.fechaEstado = event;
  }

  fillFechaSolicitud(event) {
    this.solicitudEditar.fechaSolicitud = event;
  }

  fillFechaIncorporacion(event) {
    this.solicitudEditar.fechaIncorporacion = event;
  }

  fillFechaNacimiento(event) {
    this.solicitudEditar.fechaNacimiento = event;
  }

  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      if (this.isGuardar()) {
        this.guardar(true);
      }
    }
  }
}
