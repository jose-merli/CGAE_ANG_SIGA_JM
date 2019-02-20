import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  HostListener
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
import { Location } from "@angular/common";
import { DatosPlanUniversalItem } from "../../../../models/DatosPlanUniversalItem";
import { DatosSolicitudGratuitaObject } from "../../../../models/DatosSolicitudGratuitaObject";

import { SolicitudIncorporacionItem } from "../../../../models/SolicitudIncorporacionItem";
import { DatosSolicitudMutualidadItem } from "../../../../models/DatosSolicitudMutualidadItem";

import { DropdownModule, Dropdown } from "primeng/dropdown";

@Component({
  selector: "app-mutualidad-abogacia-plan-universal",
  templateUrl: "./mutualidad-abogacia-plan-universal.component.html",
  styleUrls: ["./mutualidad-abogacia-plan-universal.component.scss"]
})
export class MutualidadAbogaciaPlanUniversal implements OnInit {
  // mostrarEstadoSolicitud: boolean = false;
  progressSpinner: boolean = true;
  datosDireccion: boolean = false;
  datosBancarios: boolean = false;
  datosPoliza: boolean = false;
  paisSelected: any;
  body: DatosPlanUniversalItem = new DatosPlanUniversalItem();
  provinciaSelected: any;
  poblacionSelected: any;
  pagoSelected: any;
  provincias: any[];
  poblaciones: any[];
  paises: any[];
  comboPago: any[];
  datosUdFamiliar: boolean = false;
  msgs: any;
  existeImagen: any;
  es: any;
  estadoCivil: any[];
  sl: any;
  valorCheckUsuarioAutomatico: any;
  asistenciaSanitaria: any[];
  designacionBeneficiarios: any[];
  opcionesCoberturas: any[];
  ejerciente: any[];
  estadosCiviles: any[];
  formasPago: any[];
  sexos: any[];
  tiposDireccion: any[];
  tiposDomicilio: any[];
  tiposIdentificador: any[];
  fichaPersonal: boolean = false;
  fechaNacimiento: string;
  resultadosPoblaciones: string;
  codigoPostalValido: boolean;
  solicitud: SolicitudIncorporacionItem = new SolicitudIncorporacionItem();
  cedeDatos: boolean;
  modoLectura: boolean = false;
  paisDesc: any;
  provinciaDesc: any;
  poblacionDesc: any;
  constructor(
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private location: Location
  ) { }

  @ViewChild("poblacion") dropdown: Dropdown;

  ngOnInit() {
    this.progressSpinner = true;
    this.es = this.translateService.getCalendarLocale();
    this.solicitud = JSON.parse(sessionStorage.getItem("solicitudEnviada"));
    this.body = JSON.parse(sessionStorage.getItem("solicitudEnviada"));
    this.fechaNacimiento = this.transformaFecha(this.solicitud.fechaNacimiento);
    this.body.idCobertura = "1";
    this.body.idBeneficiario = 3;
    this.body.idAsistenciaSanitaria = "3";
    this.body.telefono = this.solicitud.telefono1;
    this.body.cuentaBancaria = this.solicitud.iban;
    this.pagoSelected = "12";
    // Buscamos en cen_solicitudMutualidad
    let mutualidadRequest = new DatosSolicitudMutualidadItem();
    mutualidadRequest.numeroidentificador = this.solicitud.numeroIdentificacion;
    this.sigaServices
      .post("mutualidad_searchSolicitud", mutualidadRequest)
      .subscribe(
        result => {
          let resultParsed = JSON.parse(result.body);
          if (
            resultParsed.idsolicitud != null &&
            resultParsed.idsolicitud != undefined
          ) {
            let solicitud = JSON.parse(result.body);
            let body = JSON.parse(result.body);
            solicitud.tipoIdentificacion = this.solicitud.tipoIdentificacion;
            solicitud.numeroIdentificacion = this.solicitud.numeroIdentificacion;
            solicitud.tratamiento = this.solicitud.tratamiento;
            solicitud.idEstadoCivil = this.solicitud.idEstadoCivil;
            solicitud.naturalDe = this.solicitud.naturalDe;
            solicitud.idpais = this.body.idPais;
            this.solicitud = solicitud;
            body.idpais = this.body.idPais;
            body.codigoPostal = this.body.codigoPostal;
            body.idPoblacion = this.body.idPoblacion;
            body.telefono = this.body.telefono;
            body.correoElectronico = this.body.correoElectronico;
            body.bic = this.body.bic;
            body.titular = this.body.titular;
            this.body = body;

            if (this.body.hijos == undefined) {
              this.body.hijos = [];
            }
            this.modoLectura = true;
          } else {
            // Acceso a Web Service para saber si hay una solicitud de Mutualidad.
            this.solicitud.idPais = "191";
            this.solicitud.identificador = this.solicitud.numeroIdentificacion;
            this.sigaServices
              .post("mutualidad_estadoMutualista", this.solicitud)
              .subscribe(
                result => {
                  let estadoMut = JSON.parse(result.body);
                  if ((estadoMut.idSolicitud = "0")) {
                    this.modoLectura = false;
                  } else {
                    this.modoLectura = true;
                  }
                  this.solicitud.idSolicitudMutualidad = estadoMut.idSolicitud;
                  this.solicitud.estadoMutualidad = estadoMut.valorRespuesta;
                },
                error => {
                  console.log(error);
                }
              );
          }
        },
        error => {
          console.log(error);
        },
        () => {
          this.paisSelected = this.solicitud.idPais;
          this.solicitud.duplicado = true;
          this.solicitud.idSolicitud = this.solicitud.idsolicitudincorporacion;
          this.sigaServices
            .post("mutualidad_estadoSolicitud", this.solicitud)
            .subscribe(
              result => {
                let prueba = JSON.parse(result.body);
                this.solicitud.idSolicitudMutualidad = prueba.idSolicitud;
                this.solicitud.estadoMutualidad = prueba.valorRespuesta;
                this.progressSpinner = false;
              },
              error => {
                console.log(error);
                this.progressSpinner = false;
              }
            );
        }
      );

    this.obtenerCuotaYCapObj();
    this.cargarCombos();
    this.onChangeCodigoPostal();
    this.provinciaSelected = this.body.idProvincia;
  }

  onChangePais(event) {
    this.body.idPais = event.value;
    // this.paisDesc = event.label;

    if (event.value.value != "191") {
      this.isValidCodigoPostal();
      this.provinciaSelected = null;
      this.poblacionSelected = null;
      this.body.codigoPostal = null;
    }
  }

  isGuardar() {
    if (
      this.cedeDatos == true &&
      this.modoLectura == false &&
      (this.solicitud.estadoCivil || this.body.estadoCivil) &&
      this.body.idPais != "" &&
      this.body.idPais != undefined &&
      this.poblacionSelected != "" &&
      this.poblacionSelected != undefined &&
      this.body.domicilio != "" &&
      this.body.domicilio != undefined &&
      this.body.codigoPostal != "" &&
      this.body.codigoPostal != undefined &&
      this.body.idProvincia != "" &&
      this.body.idProvincia != undefined &&
      this.body.telefono != "" &&
      this.body.telefono != undefined &&
      this.body.correoElectronico != "" &&
      this.body.correoElectronico != undefined &&
      this.body.cuentaBancaria != "" &&
      this.body.cuentaBancaria != undefined &&
      this.body.titular != "" &&
      this.body.titular != undefined
    ) {
      return true;
    } else {
      return false;
    }
  }

  obtenerCuotaYCapObj() {
    this.body.hijos = [];
    // necesita int sexo;
    //  int cobertura;
    //  Date fechaNacimiento;
    // this.solicitud.sexo = this.body.sexo;
    let sexo = this.solicitud.sexo;
    if (this.solicitud.sexo == "H") {
      this.solicitud.sexo = "0";
    } else {
      this.solicitud.sexo = "1";
    }
    this.solicitud.cobertura = "1";
    this.sigaServices
      .post("mutualidad_obtenerCuotaYCapObjetivo", this.solicitud)
      .subscribe(
        result => {
          let prueba = JSON.parse(result.body);
          this.body.cuotaMensual = prueba.cuota;
          this.body.capitalObjetivo = prueba.capitalObjetivo;
        },
        error => {
          console.log(error);
        },
        () => {
          this.solicitud.sexo = sexo;
        }
      );
  }

  transformaFechaForBack(fecha) {
    let jsonDate = JSON.stringify(fecha);
    let rawDate = jsonDate.slice(1, -1);
    if (rawDate.length < 14) {
      let splitDate = rawDate.split("/");
      let arrayDate = splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0];
      fecha = new Date((arrayDate += "T00:00:00.001Z"));
    } else {
      fecha = new Date(fecha);
    }
    return fecha;
  }

  transformaFecha(fecha) {
    let jsonDate = JSON.stringify(fecha);
    let rawDate = jsonDate.slice(1, -1);
    if (rawDate.length < 14) {
      let splitDate = rawDate.split("-");
      let arrayDate = splitDate[2] + "/" + splitDate[1] + "/" + splitDate[0];
      return arrayDate;
    } else {
      rawDate = rawDate.slice(0, 10);
      let splitDate = rawDate.split("-");
      let arrayDate = splitDate[2] + "/" + splitDate[1] + "/" + splitDate[0];
      return arrayDate;
    }
  }

  abreCierraFichaPersonal() {
    this.fichaPersonal = !this.fichaPersonal;
  }

  cargarCombos() {
    this.sigaServices.post("mutualidad_getEnums", "").subscribe(
      result => {
        let prueba = JSON.parse(result.body);
        if (prueba.asistenciaSanitaria != null) {
          this.asistenciaSanitaria = prueba.asistenciaSanitaria.combooItems;
          this.designacionBeneficiarios =
            prueba.designacionBeneficiarios.combooItems;
          this.opcionesCoberturas = prueba.opcionesCoberturas.combooItems;
          this.ejerciente = prueba.ejerciente.combooItems;
          this.estadosCiviles = prueba.estadosCiviles.combooItems;
          this.formasPago = prueba.formasPago.combooItems;
          this.sexos = prueba.sexos.combooItems;
          this.tiposDireccion = prueba.tiposDireccion.combooItems;
          this.tiposDomicilio = prueba.tiposDomicilio.combooItems;
          this.tiposIdentificador = prueba.tiposIdentificador.combooItems;
        }
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
        this.paisDesc = this.paises.find(
          item => item.value === this.paisSelected
        );
      },
      error => {
        console.log(error);
      }
    );

    this.sigaServices
      .get("solicitudIncorporacion_tipoIdentificacion")
      .subscribe(
        result => {
          let tipos = result.combooItems;
          this.progressSpinner = false;
          let identificacion = tipos.find(
            item => item.value === this.solicitud.idTipoIdentificacion
          );
          this.solicitud.tipoIdentificacion = identificacion.label;
        },
        error => {
          console.log(error);
        }
      );

    this.sigaServices.get("integrantes_provincias").subscribe(
      result => {
        this.provincias = result.combooItems;
        this.progressSpinner = false;
        this.provinciaDesc = this.provincias.find(
          item => item.value === this.provinciaSelected
        );
      },
      error => {
        console.log(error);
      }
    );
  }

  getComboPoblacion(filtro: string) {
    this.progressSpinner = true;
    let poblacionBuscada = filtro;
    this.sigaServices
      .getParam(
        "direcciones_comboPoblacion",
        "?idProvincia=" + this.body.idProvincia + "&filtro=" + filtro
      )
      .subscribe(
        n => {
          this.poblaciones = n.combooItems;
          this.getLabelbyFilter(this.poblaciones);
          this.dropdown.filterViewChild.nativeElement.value = poblacionBuscada;
        },
        error => { },
        () => {
          // this.isDisabledPoblacion = false;
          this.progressSpinner = false;
        }
      );
  }

  isValidCodigoPostal(): boolean {
    return (
      this.body.codigoPostal &&
      typeof this.body.codigoPostal === "string" &&
      /^(?:0[1-9]\d{3}|[1-4]\d{4}|5[0-2]\d{3})$/.test(this.body.codigoPostal)
    );
  }

  onChangeCodigoPostal() {
    if (this.body.idPais == "191") {
      if (this.isValidCodigoPostal() && this.body.codigoPostal.length == 5) {
        let value = this.body.codigoPostal.substring(0, 2);
        this.provinciaSelected = value;
        let isDisabledPoblacion = false;
        if (value != this.body.idProvincia) {
          this.body.idProvincia = this.provinciaSelected;
          this.body.idPoblacion = "";
          this.poblaciones = [];
        }
        this.codigoPostalValido = true;
      } else {
        this.codigoPostalValido = false;
      }
    }
  }

  getLabelbyFilter(array) {
    /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
para poder filtrar el dato con o sin estos caracteres*/
    array.map(e => {
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
  obtenerProvinciaDesc(e) {
    this.provinciaDesc = e.label;
  }
  obtenerPoblacionDesc(e) {
    this.poblacionDesc = this.poblaciones.find(item => item.value === e.value);
  }
  deshabilitarDireccion(): boolean {
    if (this.paisSelected != "191") {
      return true;
    } else {
      return false;
    }
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

  guardar() {
    let solicitud = new DatosSolicitudGratuitaObject();

    solicitud.datosPersona = JSON.parse(JSON.stringify(this.solicitud));
    solicitud.datosPersona = JSON.parse(JSON.stringify(this.body));
    if (this.solicitud.apellido2 == null) {
      solicitud.datosPersona.apellido2 = "";
    }
    solicitud.datosPersona.tipoSolicitud = this.solicitud.tipoSolicitud;
    solicitud.datosPersona.edadesHijos = this.body.hijos;
    if (this.solicitud.idEstadoCivil) {
      solicitud.datosPersona.estadoCivil = this.solicitud.idEstadoCivil;
    } else {
      solicitud.datosPersona.estadoCivil = this.body.idEstadoCivil;
    }
    solicitud.datosPersona.ejerciente = this.solicitud.idEstado;
    solicitud.datosPersona.asistenciaSanitaria = this.body.idAsistenciaSanitaria;
    solicitud.datosPersona.nacionalidad = this.paisDesc.label;
    solicitud.datosPersona.NIF = this.solicitud.numeroIdentificacion;
    solicitud.datosPersona.tipoIdentificacion = this.solicitud.idTipoIdentificacion;
    solicitud.datosPersona.fechaNacimiento = this.transformaFechaForBack(
      this.fechaNacimiento
    );
    solicitud.datosDireccion = JSON.parse(JSON.stringify(this.body));
    solicitud.datosDireccion.cp = this.body.codigoPostal;
    solicitud.datosDireccion.direccion = this.body.domicilio;
    solicitud.datosDireccion.email = this.body.correoElectronico;
    solicitud.datosDireccion.movil = this.body.movil;
    solicitud.datosDireccion.num = this.body.telefono;
    solicitud.datosDireccion.poblacion = this.poblacionDesc.label;
    solicitud.datosDireccion.provincia = this.provinciaDesc.label;
    solicitud.datosDireccion.pais = this.paisDesc.label;
    solicitud.datosDireccion.telefono = this.body.telefono;

    solicitud.datosBancarios = JSON.parse(JSON.stringify(this.body));
    solicitud.datosBancarios.iban = this.body.iban;
    solicitud.datosBancarios.nCuenta = this.body.iban.substring(14, 24);
    solicitud.datosBancarios.swift = this.solicitud.bic;
    solicitud.datosBancarios.dc = this.solicitud.digitoControl;
    solicitud.datosBancarios.oficina = this.body.iban.substring(8, 12);
    solicitud.datosBancarios.entidad = this.body.iban.substring(4, 8);

    solicitud.datosBeneficiario = JSON.parse(JSON.stringify(this.body));
    solicitud.datosBeneficiario.idPoliza = this.body.idCobertura;
    solicitud.datosBeneficiario.idTipoBeneficiario = this.body.idBeneficiario;

    solicitud.datosPoliza = JSON.parse(JSON.stringify(this.body));
    solicitud.datosPoliza.formaPago = this.pagoSelected;
    solicitud.datosPoliza.opcionesCobertura = this.body.idCobertura;
    solicitud.datosPoliza.idMutualista = this.body.idEstadoMutualista;

    if (solicitud.datosPersona.sexo == "H") {
      solicitud.datosPersona.sexo = "1";
    } else {
      solicitud.datosPersona.sexo = "2";
    }
    this.progressSpinner = true;
    this.sigaServices
      .post("mutualidad_solicitudPolizaProfesional", solicitud)
      .subscribe(
        result => {
          let resultado = JSON.parse(result.body);
          if (resultado.pdf != null) {
            this.showSuccess();
            this.solicitud.duplicado = true;
            this.solicitud.idSolicitud = resultado.idSolicitud;
            this.sigaServices
              .post("mutualidad_estadoSolicitud", this.solicitud)
              .subscribe(
                result => {
                  let prueba = JSON.parse(result.body);
                  this.solicitud.idSolicitudMutualidad = prueba.idSolicitud;
                  this.solicitud.estadoMutualidad = prueba.valorRespuesta;
                  this.progressSpinner = false;
                },
                error => {
                  console.log(error);
                  this.progressSpinner = false;
                }
              );
            this.modoLectura = true;
          } else {
            this.showFailMensaje(resultado.valorRespuesta);
          }
          this.progressSpinner = false;
        },
        error => {
          console.log(error);
          this.showFailMensaje(error.valorRespuesta);
          this.progressSpinner = true;
        },
        () => { }
      );
  }

  showFailMensaje(mensaje: string) {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "",
      detail: mensaje
    });
  }

  showSuccess() {
    this.msgs = [];
    this.msgs.push({
      severity: "success",
      summary: this.translateService.instant("general.message.correct"),
      detail: this.translateService.instant("general.message.accion.realizada")
    });
  }

  showFail() {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Incorrecto",
      detail: this.translateService.instant(
        "general.message.error.realiza.accion"
      )
    });
  }

  // abreCierraEstadoSolicitud() {
  //   this.mostrarEstadoSolicitud = !this.mostrarEstadoSolicitud;
  // }
  abreCierraDatosDireccion() {
    this.datosDireccion = !this.datosDireccion;
  }

  abreCierraDatosBancarios() {
    this.datosBancarios = !this.datosBancarios;
  }

  abreCierraDatosPoliza() {
    this.datosPoliza = !this.datosPoliza;
  }

  abreCierraDatosUdFamiliar() {
    this.datosUdFamiliar = !this.datosUdFamiliar;
  }

  clear() {
    this.msgs = [];
  }

  backTo() {
    this.location.back();
  }
}
