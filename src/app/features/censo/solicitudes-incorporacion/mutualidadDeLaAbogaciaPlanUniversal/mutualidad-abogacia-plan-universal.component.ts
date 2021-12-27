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
import { DatosDireccionesItem } from "../../../../models/DatosDireccionesItem";

import { SolicitudIncorporacionItem } from "../../../../models/SolicitudIncorporacionItem";
import { DatosSolicitudMutualidadItem } from "../../../../models/DatosSolicitudMutualidadItem";

import { DropdownModule, Dropdown } from "primeng/dropdown";
import { CommonsService } from "../../../../_services/commons.service";

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
  ibanValido: boolean;
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
  tratamientoDesc: any;
  comboTiposIdentificacion: any;
  naturalDesc: any;

  emailValido: boolean = true;
  tlfValido: boolean = true;
  mvlValido: boolean = true;

  constructor(
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private location: Location,
    private commonsService: CommonsService
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
    this.naturalDesc = this.solicitud.naturalDe;
    this.tratamientoDesc = this.solicitud.tratamiento;
    this.pagoSelected = "12";
    if (sessionStorage.getItem("direcciones")) {
      let direccion = JSON.parse(sessionStorage.getItem("direcciones"));
      this.body.idPais = direccion.idPais;
      this.paisSelected = direccion.idPais;
      this.solicitud.tratamiento = this.solicitud.tratamiento;
      this.body.domicilio = direccion.domicilio;
      this.body.codigoPostal = direccion.codigoPostal;
      this.body.nombrePoblacion = direccion.nombrePoblacion;
      this.body.pais = direccion.nombrePais;
      this.body.idPoblacion = direccion.idPoblacion;
      this.poblacionSelected = direccion.idPoblacion;
      this.body.telefono = direccion.telefono;
      this.body.movil = direccion.movil;
      this.body.correoElectronico = direccion.correoElectronico;
      this.body.idProvincia = direccion.idProvincia;
      this.getComboPoblacion(direccion.nombrePoblacion);
    } else {

      if (this.body.idPais != undefined && this.body.idPais != null) {
        this.paisSelected = this.body.idPais;
      }

      if (this.body.idPoblacion != undefined && this.body.idPoblacion != null) {
        this.poblacionSelected = this.body.idPoblacion;
      }
    }

    if (sessionStorage.getItem("cuentas")) {
      let cuenta = JSON.parse(sessionStorage.getItem("cuentas"));
      this.body.titular = cuenta.titular;
      this.body.iban = cuenta.iban;
      this.body.cuentaBancaria = cuenta.iban;
      this.body.dc = cuenta.iban.substring(12, 14);
      this.body.swift = cuenta.bic;
      this.body.bic = cuenta.bic;
      // this.body.digitoControl = cuenta.digitoControl;
    }

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
            this.solicitud = JSON.parse(result.body);
            this.body = JSON.parse(result.body);

            this.solicitud.idEstadoCivil = this.solicitud.idestadocivil;
            this.solicitud.numeroIdentificacion = this.solicitud.numeroidentificador;
            this.solicitud.idTratamiento = this.solicitud.idtratamiento;
            this.solicitud.tratamiento = this.tratamientoDesc;
            this.solicitud.naturalDe = this.naturalDesc;
            this.solicitud.idTipoIdentificacion = this.solicitud.idtipoidentificacion;
            this.cargarCombos();
            this.body.codigoPostal = this.body.codigopostal;
            this.body.telefono = this.body.telefono1;
            this.body.correoElectronico = this.body.correoelectronico;
            this.body.nombrePoblacion = this.body.poblacion;
            this.body.opcionCobertura = this.body.cobertura;

            this.body.numHijos = JSON.parse(this.body.numerohijos);
            this.body.hijos = [];
            this.body.hijos[0] = this.body.edadhijo1;
            this.body.hijos[1] = this.body.edadhijo2;
            this.body.hijos[2] = this.body.edadhijo3;
            this.body.hijos[3] = this.body.edadhijo4;
            this.body.hijos[4] = this.body.edadhijo5;
            this.body.fechaNacConyuge = this.body.fechanacimientoconyuge;

            this.recuperarBicBanco();

            this.modoLectura = true;
            this.cedeDatos = true;
          } else {
            // Acceso a Web Service para saber si hay una solicitud de Mutualidad.
            this.solicitud.idPais = "191";
            this.solicitud.identificador = this.solicitud.numeroIdentificacion;
            this.solicitud.idTipoIdentificacion = this.solicitud.tipoIdentificacion;
            this.cargarCombos();
            this.sigaServices
              .post("mutualidad_estadoMutualista", this.solicitud)
              .subscribe(
                result => {
                  let estadoMut = JSON.parse(result.body);
                  if ((estadoMut.idSolicitud = "0")) {
                    this.modoLectura = false;
                  } else {
                    this.modoLectura = true;
                    this.cedeDatos = true;
                  }
                  this.solicitud.idSolicitudMutualidad = estadoMut.idSolicitud;
                  this.solicitud.estadoMutualidad = estadoMut.valorRespuesta;
                },
                error => {
                  //console.log(error);
                }
              );
          }
        },
        error => {
          //console.log(error);
        },
        () => {
          // this.paisSelected = this.solicitud.idPais;
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
                //console.log(error);
                this.progressSpinner = false;
              }
            );
        }
      );

    this.obtenerCuotaYCapObj();
    this.onChangeCodigoPostal();
    if (this.body.titular == "" || this.body.titular == undefined) {
      this.body.titular = this.solicitud.nombre + " " + this.solicitud.apellido1 + " " + this.solicitud.apellido2;
    }
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
      this.solicitud.idEstadoCivil != undefined &&
      this.solicitud.idEstadoCivil != null &&
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
      this.body.titular != undefined &&
      this.tlfValido &&
      this.emailValido && this.mvlValido
    ) {
      return true;
    } else {
      return false;
    }
  }


  isValidIBAN(): boolean {
    this.body.iban = this.body.iban.replace(/\s/g, "");

    // IBAN ESPAÑOL
    if (this.body.iban.length != 24) {
      return false;
    }

    let firstLetters = this.body.iban.substring(0, 1);
    let secondfirstLetters = this.body.iban.substring(1, 2);
    let num1 = this.getnumIBAN(firstLetters);
    let num2 = this.getnumIBAN(secondfirstLetters);

    let isbanaux = String(num1) + String(num2) + this.body.iban.substring(2);
    // Se mueve los 6 primeros caracteres al final de la cadena.
    isbanaux = isbanaux.substring(6) + isbanaux.substring(0, 6);

    //Se calcula el resto, llamando a la función modulo97, definida más abajo
    let resto = this.modulo97(isbanaux);
    if (resto == "1") {
      return true;
    } else {
      return false;
    }
  }

  getnumIBAN(letter) {
    let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return letters.search(letter) + 10;
  }

  modulo97(iban) {
    var parts = Math.ceil(iban.length / 7);
    var remainer = "";

    for (var i = 1; i <= parts; i++) {
      remainer = String(
        parseFloat(remainer + iban.substr((i - 1) * 7, 7)) % 97
      );
    }

    return remainer;
  }
  validarIban(): boolean {
    if (
      (this.body.iban != null ||
        this.body.iban != undefined ||
        this.body.iban != "") &&
      (this.isValidIBAN() || this.isValidIbanExt())
    ) {
      this.ibanValido = true;
      return true;
    } else {
      this.ibanValido = false;
      return false;
    }
  }

  isValidIbanExt(): boolean {
    return true;
  }

  validarTitular(): boolean {
    if (this.body.titular.trim() != "" && this.body.titular != undefined) {
      return true;
    } else {
      return false;
    }
  }

  autogenerarDatos() {
    if (this.body.iban != null && this.body.iban != "") {
      var ccountry = this.body.iban.substring(0, 2);
      if (ccountry == "ES") {
        if (this.isValidIBAN()) {
          this.recuperarBicBanco();

          this.ibanValido = true;
        } else {
          this.body.bic = "";

          this.ibanValido = false;
        }
      }
    } else {
      this.body.bic = "";

      this.ibanValido = false;
    }
  }

  validarBIC(): boolean {
    var ccountry = this.body.iban.substring(0, 2);
    if (
      this.body.bic != null &&
      this.body.bic != undefined &&
      this.body.bic != "" &&
      this.body.bic.length == 11 &&
      this.body.bic.charAt(4) == ccountry.charAt(0) &&
      this.body.bic.charAt(5) == ccountry.charAt(1)
    ) {
      return true;
    } else {
      return false;
    }
  }

  recuperarBicBanco() {
    this.sigaServices
      .post("datosCuentaBancaria_BIC_BANCO", this.body)
      .subscribe(
        data => {
          let bodyBancoBicSearch = JSON.parse(data["body"]);
          let bodyBancoBic = bodyBancoBicSearch.bancoBicItem[0];

          this.body.bic = bodyBancoBic.bic;
          this.body.iban = this.body.iban.replace(/\s/g, "");

          // this.editar = false;
        },
        error => {
          let bodyBancoBicSearch = JSON.parse(error["error"]);
          this.showFailMensaje(bodyBancoBicSearch.error.message.toString());
          this.progressSpinner = false;
        }
      );
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
          //console.log(error);
          this.progressSpinner = false;
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
        //console.log(error);
      }
    );

    this.sigaServices.get("solicitudIncorporacion_estadoCivil").subscribe(
      result => {
        this.estadoCivil = result.combooItems;
      },
      error => {
        //console.log(error);
        this.progressSpinner = false;

      }
    );

    this.sigaServices.get("solicitudIncorporacion_pais").subscribe(
      result => {
        this.paises = result.combooItems;
        this.paisDesc = this.paises.find(
          item => item.value === this.paisSelected
        );
        // this.paisSelected = this.body.idpais
      },
      error => {
        //console.log(error);
        this.progressSpinner = false;

      }
    );

    this.sigaServices
      .get("solicitudIncorporacion_tipoIdentificacion")
      .subscribe(
        result => {
          this.comboTiposIdentificacion = result.combooItems;
          let tipo = this.comboTiposIdentificacion.find(x => x.value == this.solicitud.idTipoIdentificacion);
          this.solicitud.tipoIdentificacion = tipo.label;

        },
        error => {
          //console.log(error);
          this.progressSpinner = false;

        }
      );

    this.sigaServices.get("integrantes_provincias").subscribe(
      result => {
        this.provincias = result.combooItems;
        this.provinciaDesc = this.provincias.find(
          item => item.value === this.provinciaSelected
        );
      },
      error => {
        //console.log(error);
        this.progressSpinner = false;

      }
    );
  }

  getEstadoCivilDesc() {
    if (this.solicitud.idEstadoCivil != "undefined" && this.solicitud.idEstadoCivil != null) {
      let estCivil = this.estadoCivil.find(
        item => item.value === this.solicitud.idEstadoCivil
      );
      this.body.estadoCivil = estCivil.label;
    }
  }
  getComboPoblacion(filtro: string) {
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
        error => {
          this.progressSpinner = false;
        },
        () => {
          // this.isDisabledPoblacion = false;
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
        this.resultadosPoblaciones = this.translateService.instant("censo.busquedaClientesAvanzada.literal.sinResultados");
      } else {
        this.poblaciones = [];
        this.resultadosPoblaciones = this.translateService.instant("censo.consultarDirecciones.mensaje.introducir.almenosTres");
      }
    } else {
      this.poblaciones = [];
      this.resultadosPoblaciones = this.translateService.instant("censo.busquedaClientesAvanzada.literal.sinResultados");
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
        },
        error => {
          //console.log(error);
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
    solicitud.datosPersona.idAsistenciaSanitaria = this.body.idAsistenciaSanitaria;
    let asistencia = this.asistenciaSanitaria.find(x => x.value == this.body.idAsistenciaSanitaria);
    solicitud.datosPersona.asistenciaSanitaria = asistencia.label;

    this.paisDesc = this.paises.find(
      item => item.value === this.paisSelected
    );

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
    if (this.poblacionSelected != undefined) {
      let poblacion = this.poblaciones.find(x => x.value == this.poblacionSelected);
      solicitud.datosDireccion.poblacion = poblacion.label;
      solicitud.datosDireccion.idPoblacion = this.poblacionSelected;
    }

    this.provinciaDesc = this.provincias.find(
      item => item.value === this.provinciaSelected
    );

    solicitud.datosDireccion.provincia = this.provinciaDesc.label;
    solicitud.datosDireccion.idProvincia = this.provinciaDesc.value;
    solicitud.datosDireccion.pais = this.paisDesc.label;
    solicitud.datosDireccion.idPais = this.paisDesc.value;
    solicitud.datosDireccion.telefono = this.body.telefono;

    solicitud.datosBancarios = JSON.parse(JSON.stringify(this.body));
    solicitud.datosBancarios.iban = this.body.iban;
    solicitud.datosBancarios.nCuenta = this.body.iban.substring(14, 24);
    solicitud.datosBancarios.swift = this.solicitud.bic;
    solicitud.datosBancarios.dc = this.body.iban.substring(12, 14);
    solicitud.datosBancarios.oficina = this.body.iban.substring(8, 12);
    solicitud.datosBancarios.entidad = this.body.iban.substring(4, 8);
    solicitud.datosBancarios.titular = this.body.titular;
    let periodicidad = this.formasPago.find(x => x.value == this.pagoSelected);
    solicitud.datosBancarios.periodicidad = periodicidad.label;

    solicitud.datosBeneficiario = JSON.parse(JSON.stringify(this.body));
    solicitud.datosBeneficiario.idPoliza = this.body.idCobertura;
    solicitud.datosBeneficiario.idTipoBeneficiario = this.body.idBeneficiario;

    let bene = this.designacionBeneficiarios.find(x => x.value == this.body.idBeneficiario);
    solicitud.datosBeneficiario.beneficiario = bene.label;

    solicitud.datosPoliza = JSON.parse(JSON.stringify(this.body));
    solicitud.datosPoliza.formaPago = this.pagoSelected;
    solicitud.datosPoliza.idCobertura = this.body.idCobertura;
    let cobertura = this.opcionesCoberturas.find(x => x.value == this.body.idCobertura);
    solicitud.datosPoliza.opcionesCobertura = cobertura.label;
    solicitud.datosPoliza.idMutualista = this.body.idEstadoMutualista;
    solicitud.datosPoliza.cuotaMensual = this.body.cuotaMensual;
    solicitud.datosPoliza.capitalObjetivo = this.body.capitalObjetivo;



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
                  //console.log(error);
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
          //console.log(error);
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
      summary: this.translateService.instant("general.message.incorrect"),
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

  fillFechaNacimientoConyuge(event) {
    this.body.fechaNacConyuge = event;
  }

  ngOnDestroy() {
    sessionStorage.removeItem("direcciones");
    sessionStorage.removeItem("cuentas");
  }

  changeEmail() {
    this.emailValido = this.commonsService.validateEmail(this.body.correoElectronico);
  }

  changeTelefono() {
    this.tlfValido = this.commonsService.validateTelefono(this.body.telefono);
  }

  changeMovil() {
    this.mvlValido = this.commonsService.validateMovil(this.body.movil);
  }
}
