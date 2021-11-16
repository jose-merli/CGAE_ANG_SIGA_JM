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
import { NoColegiadoItem } from "../../../../models/NoColegiadoItem";
import { DatosColegiadosItem } from "../../../../models/DatosColegiadosItem";
import { CommonsService } from "../../../../_services/commons.service";

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
  tipoIdentificacionSelected: String = "";
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
  isPoblacionExtranjera: boolean = false;
  poblacionExtranjeraSelected: string;
  noExistePersona: boolean = false;
  noEsColegiado: boolean = false;
  body;
  solicitante;
  resaltadoDatos: boolean = false;
  resaltadoDatosAprobar: boolean = false;
  resaltadoDatosBancos: boolean = false;
  editarExt: boolean = false;
  iban: String;
  ibanValido: boolean = true;
  bicValido: boolean;
  lengthCountryCode: Number = 0;
  bic: String;
  registroEditable: String;
  banco: String;
  editar: boolean = false;
  isSave: boolean = true;

  mailClicable: boolean = false;

  emailValido: boolean = true;
  tlf1Valido: boolean = true;
  tlf2Valido: boolean = true;
  fax1Valido: boolean = true;
  fax2Valido: boolean = true;
  mvlValido: boolean = true;

  numColegiadoDuplicado: boolean = false;
  bodyInicial;
  cargarDatos: boolean = false;
  veFicha: boolean = false;
  fechaActual: Date = new Date();
  private DNI_LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE";

  constructor(
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private confirmationService: ConfirmationService,
    private commonsService: CommonsService,
    private router: Router
  ) { }

  @ViewChild("poblacion")
  dropdown: Dropdown;

  ngOnInit() {
    this.resaltadoDatos = true;
    this.resaltadoDatosBancos = true;

    sessionStorage.removeItem("esNuevoNoColegiado");
    this.fechaActual = new Date();
    if (sessionStorage.getItem("isLetrado")) {
      this.isLetrado = JSON.parse(sessionStorage.getItem("isLetrado"));
    }
    this.solicitudEditar = new SolicitudIncorporacionItem();
    this.checkSolicitudInicio = new SolicitudIncorporacionItem();

    this.progressSpinner = true;
    this.es = this.translateService.getCalendarLocale();
    this.cargarCombos();
    if (JSON.parse(sessionStorage.getItem("pendienteAprobacion")) == true) {
      this.pendienteAprobacion = true;
    }
    if (sessionStorage.getItem("consulta") == "true") {
      this.solicitudEditar = JSON.parse(
        sessionStorage.getItem("editedSolicitud")
      );
      if (this.solicitudEditar.fechaIncorporacion != null)
        if (this.solicitudEditar.fechaIncorporacion.getDate == undefined && this.solicitudEditar.fechaIncorporacion != undefined) {
          this.solicitudEditar.fechaIncorporacion = new Date(this.solicitudEditar.fechaIncorporacion);
        }
      // if (this.solicitudEditar.fechaEstado != null)
      // if (this.solicitudEditar.fechaEstado.getDate == undefined && this.solicitudEditar.fechaEstado != undefined) {
      //   this.solicitudEditar.fechaEstado = new Date(this.solicitudEditar.fechaEstado);
      // }
      this.checkSolicitudInicio = JSON.parse(
        sessionStorage.getItem("editedSolicitud")
      );
      this.consulta = true;
      this.cargarDatos = true;
      this.tratarDatos();
    } else {
      this.consulta = false;

      if (sessionStorage.getItem("nuevaIncorporacion")) {
        let solicitudrecibida = JSON.parse(
          sessionStorage.getItem("nuevaIncorporacion")
        );

        this.solicitudEditar = new SolicitudIncorporacionItem();
        let nuevaIncorporacion = JSON.parse(
          sessionStorage.getItem("nuevaIncorporacion")
        );
        this.solicitudEditar.numeroIdentificacion = nuevaIncorporacion.numeroIdentificacion;
        this.solicitudEditar = JSON.parse(
          sessionStorage.getItem("nuevaIncorporacion")
        );

        if (this.solicitudEditar.fechaIncorporacion != null)
          if (this.solicitudEditar.fechaIncorporacion.getDate == undefined && this.solicitudEditar.fechaIncorporacion != undefined) {
            this.solicitudEditar.fechaIncorporacion = new Date(this.solicitudEditar.fechaIncorporacion);
          }
        if (this.solicitudEditar.fechaEstado != null)
          if (this.solicitudEditar.fechaEstado.getDate == undefined && this.solicitudEditar.fechaEstado != undefined) {
            this.solicitudEditar.fechaEstado = new Date(this.solicitudEditar.fechaEstado);
          }

        if (sessionStorage.getItem("solicitudIncorporacion") == "true") {
          this.solicitudEditar.numColegiado = "";
        }

        this.solicitudEditar.fechaSolicitud = new Date();
        this.sexoSelected = this.solicitudEditar.sexo;
        this.estadoCivilSelected = this.solicitudEditar.idEstadoCivil;
          
        this.provinciaSelected = this.solicitudEditar.idProvincia;
        this.poblacionSelected = this.solicitudEditar.idPoblacion;
//  this.tratamientoSelected = this.solicitudEditar.idTratamiento;

        this.checkSolicitudInicio = JSON.parse(
          sessionStorage.getItem("nuevaIncorporacion")
        );

        if (this.solicitudEditar.fechaNacimiento != undefined && this.solicitudEditar.fechaNacimiento != null) {
          let fecha = this.transformaFecha(this.solicitudEditar.fechaNacimiento);
          this.solicitudEditar.fechaNacimiento = fecha;
        }


        this.compruebaDNI();

        if (solicitudrecibida.idInstitucion != null && solicitudrecibida.idInstitucion != undefined
          && solicitudrecibida.idInstitucion != "") {
          this.noExistePersona = false;

          if (solicitudrecibida.numColegiado != null && solicitudrecibida.numColegiado != undefined
            && solicitudrecibida.numColegiado != "") {
            this.noEsColegiado = false;
          } else {
            this.noEsColegiado = true;
          }

        } else {
          this.noExistePersona = true;
        }

      } else {
        this.solicitudEditar = JSON.parse(
          sessionStorage.getItem("editedSolicitud")
        );
        this.checkSolicitudInicio = JSON.parse(
          sessionStorage.getItem("editedSolicitud")
        );
        if (this.solicitudEditar.fechaIncorporacion != null)
          if (this.solicitudEditar.fechaIncorporacion.getDate == undefined && this.solicitudEditar.fechaIncorporacion != undefined) {
            this.solicitudEditar.fechaIncorporacion = new Date(this.solicitudEditar.fechaIncorporacion);
          }
        if (this.solicitudEditar.fechaEstado != null)
          if (this.solicitudEditar.fechaEstado.getDate == undefined && this.solicitudEditar.fechaEstado != undefined) {
            this.solicitudEditar.fechaEstado = new Date(this.solicitudEditar.fechaEstado);
          }

        this.cargarDatos = true;
        this.tratarDatos();
      }
      this.estadoSolicitudSelected = "20";
      this.vieneDeBusqueda = true;
      this.dniDisponible = false;

    }

    if (new Date(this.solicitudEditar.fechaEstado) <= new Date())
      this.veFicha = true;

    if (this.solicitudEditar.apellido2 != undefined && this.solicitudEditar.apellido2 != null && this.solicitudEditar.apellido2 != "") {
      this.solicitudEditar.apellidos = this.solicitudEditar.apellido1 + " " + this.solicitudEditar.apellido2;
    } else {
      this.solicitudEditar.apellidos = this.solicitudEditar.apellido1;
    }

    // Se añade cambio de que aparezca po defecto el nombre del colegiado como titular de los datos bancarios
    if (this.pendienteAprobacion == true &&
      (this.solicitudEditar.titular == null ||
        this.solicitudEditar.titular == undefined ||
        this.solicitudEditar.titular == "")
    ) {

      if (this.solicitudEditar.nombre != undefined && this.solicitudEditar.nombre != null && this.solicitudEditar.nombre != ""
        && this.solicitudEditar.apellidos != undefined && this.solicitudEditar.apellidos != null && this.solicitudEditar.apellidos != "") {
        this.solicitudEditar.titular =
          this.solicitudEditar.nombre + " " + this.solicitudEditar.apellidos;
      }

    }

    if (this.solicitudEditar.iban != undefined && this.solicitudEditar.iban != "") {
      this.autogenerarDatos();
      this.checkSolicitudInicio = JSON.parse(
        JSON.stringify(this.solicitudEditar)
      );
    }
    this.onChangeNColegiado(undefined);
    this.onChangeCodigoPostal();
    if (this.solicitudEditar.nombrePoblacion != undefined) {
      this.getComboPoblacion(this.solicitudEditar.nombrePoblacion.toString());
    }

    this.cargarDatos = true;
    this.tratarDatos();

    if (this.solicitudEditar.fechaSolicitud == undefined || this.solicitudEditar.fechaSolicitud == null) {
      this.abreCierraFichaSolicitud();
    }
    if((this.solicitudEditar.tipoSolicitud == "" || this.solicitudEditar.tipoSolicitud == undefined || this.solicitudEditar.tipoSolicitud == null) ||
    (this.solicitudEditar.fechaEstado == undefined || this.solicitudEditar.fechaEstado == null) ||
    (this.solicitudEditar.fechaIncorporacion == undefined || this.solicitudEditar.fechaIncorporacion == null) ||
    (this.solicitudEditar.tipoColegiacion == "" || this.solicitudEditar.tipoColegiacion == undefined || this.solicitudEditar.tipoColegiacion == null) ||
    (this.solicitudEditar.modalidad == "" ||  this.solicitudEditar.modalidad == undefined ||this.solicitudEditar.modalidad == null)){
      this.abreCierraFichaColegiacion();
      // this.fichaColegiacion = false;
    }
    if((this.solicitudEditar.tipoIdentificacion == "" || this.solicitudEditar.tipoIdentificacion  == undefined || this.solicitudEditar.tipoIdentificacion  == null) ||
    (this.solicitudEditar.numeroIdentificacion == "" || this.solicitudEditar.numeroIdentificacion == undefined || this.solicitudEditar.numeroIdentificacion == null) ||
    (this.solicitudEditar.tratamiento == "" || this.solicitudEditar.tratamiento == undefined || this.solicitudEditar.tratamiento == null) ||
    (this.solicitudEditar.nombre == null || this.solicitudEditar.nombre == undefined || this.solicitudEditar.nombre == "") ||
    (this.solicitudEditar.apellido1 == null || this.solicitudEditar.apellido1 == "" || this.solicitudEditar.apellido1 == undefined) ||
    (this.solicitudEditar.fechaNacimiento == null || this.solicitudEditar.fechaNacimiento == undefined || this.solicitudEditar.fechaNacimiento == null)){
      this.abreCierraFichaPersonal();
    }
    if((this.solicitudEditar.pais == undefined || this.solicitudEditar.pais == null || this.solicitudEditar.pais == "") ||
      (this.solicitudEditar.domicilio == null || this.solicitudEditar.domicilio == "" || this.solicitudEditar.domicilio == undefined) ||
      (this.solicitudEditar.codigoPostal == null ||this.solicitudEditar.codigoPostal == undefined || this.solicitudEditar.codigoPostal == "") ||
      (this.solicitudEditar.telefono1 == null || this.solicitudEditar.telefono1 == "" || this.solicitudEditar.telefono1 == undefined) ||
      (this.solicitudEditar.correoElectronico == null || this.solicitudEditar.correoElectronico == undefined || this.solicitudEditar.correoElectronico == "")){
        this.abreCierraFichaDireccion();
    }

  }

  cargarCombos() {
    this.comboSexo = [
      { value: "H", label: "Hombre" },
      { value: "M", label: "Mujer" }
    ];

    this.sigaServices.get("solicitudIncorporacion_tipoSolicitud").subscribe(
      result => {
        this.tiposSolicitud = result.combooItems;
        this.arregloTildesCombo(this.tiposSolicitud);

      },
      error => {
        console.log(error);
      }
    );

    this.sigaServices.get("solicitudIncorporacion_estadoSolicitud").subscribe(
      result => {
        this.estadosSolicitud = result.combooItems;
        this.arregloTildesCombo(this.estadosSolicitud);
        if (this.consulta == false) {
          this.estadoSolicitudSelected = "20";
          let estado = this.estadosSolicitud.find(x => x.value == this.estadoSolicitudSelected);
          this.solicitudEditar.estadoSolicitud = estado.label;
        }

      },
      error => {
        console.log(error);
      }
    );

    this.sigaServices.get("solicitudIncorporacion_tratamiento").subscribe(
      result => {
        this.tratamientos = result.combooItems;
        this.arregloTildesCombo(this.tratamientos);
      },
      error => {
        console.log(error);
      }
    );

    this.sigaServices.get("solicitudIncorporacion_estadoCivil").subscribe(
      result => {
        this.estadoCivil = result.combooItems;
        this.arregloTildesCombo(this.estadoCivil);
      },
      error => {
        console.log(error);
      }
    );

    this.sigaServices.get("solicitudIncorporacion_pais").subscribe(
      result => {
        this.paises = result.combooItems;
        this.arregloTildesCombo(this.paises);

        if (this.solicitudEditar.idPais == undefined) {
          this.paisSelected = "191";
          let paisSpain = this.paises.find(x => x.value == "191");
          this.solicitudEditar.pais = paisSpain.label;
          this.bodyInicial.pais = paisSpain.label;
          this.bodyInicial.idPais = this.paisSelected;
          this.solicitudEditar.idPais = this.paisSelected;
        }else{
          this.paisSelected = this.solicitudEditar.idPais;
          let paisSpain = this.paises.find(x => x.value == this.solicitudEditar.idPais);
          this.solicitudEditar.pais = paisSpain.label;
          this.bodyInicial.pais = paisSpain.label;
          this.bodyInicial.idPais = this.paisSelected;
    
        } 

      },
      error => {
        console.log(error);
      }
    );

    this.sigaServices.get("fichaPersona_tipoIdentificacionCombo").subscribe(
      result => {
        this.tipoIdentificacion = result.combooItems;
        // 0: {label: "CIF", value: "20"}
        // 1: {label: "NIE", value: "40"}
        // 2: {label: "NIF", value: "10"}
        // 3: {label: "Otro", value: "50"}
        // 4: {label: "Pasaporte", value: "30"}
        this.arregloTildesCombo(this.tipoIdentificacion);
        this.tipoIdentificacion[4].label =
          this.tipoIdentificacion[4].label +
          " / " +
          this.tipoIdentificacion[3].label;
      },
      error => {
        console.log(error);
      }
    );

    this.sigaServices.get("solicitudIncorporacion_tipoColegiacion").subscribe(
      result => {
        this.tipoColegiacion = result.combooItems;
        this.arregloTildesCombo(this.tipoColegiacion);
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
          this.arregloTildesCombo(this.modalidadDocumentacion);
        },
        error => {
          console.log(error);
        }
      );

    this.sigaServices.get("integrantes_provincias").subscribe(
      result => {
        this.provincias = result.combooItems;
        this.arregloTildesCombo(this.provincias);
      },
      error => {
        console.log(error);
      }, () => {
        this.progressSpinner = false;
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

  tratarDatos() {
    this.bodyInicial = JSON.parse(JSON.stringify(this.solicitudEditar));

    if (this.cargarDatos && this.solicitudEditar.iban != undefined && this.solicitudEditar.iban != null && this.solicitudEditar.iban != "") {
      this.autogenerarDatos();
    }

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

    if (this.solicitudEditar.abonoCargo != null && this.solicitudEditar.abonoCargo != "") {
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

    if (this.bodyInicial.fechaSolicitud != undefined &&
      this.bodyInicial.fechaSolicitud != null) {
      this.bodyInicial.fechaSolicitud = new Date(
        this.bodyInicial.fechaSolicitud
      );
    }

    if (this.bodyInicial.fechaEstado != undefined &&
      this.bodyInicial.fechaEstado != null) {
      this.bodyInicial.fechaEstado = new Date(
        this.bodyInicial.fechaEstado
      );

      this.bodyInicial.fechaEstadoSolicitud = this.solicitudEditar.fechaEstado;
    }

    if (this.bodyInicial.fechaNacimiento != undefined &&
      this.bodyInicial.fechaNacimiento != null) {
      this.bodyInicial.fechaNacimiento = new Date(
        this.bodyInicial.fechaNacimiento
      );
    }

    if (this.bodyInicial.fechaIncorporacion != undefined &&
      this.bodyInicial.fechaIncorporacion != null) {
      this.bodyInicial.fechaIncorporacion = new Date(
        this.bodyInicial.fechaIncorporacion
      );
    }

    if (this.solicitudEditar.fechaSolicitud != undefined &&
      this.solicitudEditar.fechaSolicitud != null) {
      this.solicitudEditar.fechaSolicitud = new Date(
        this.solicitudEditar.fechaSolicitud
      );
    }

    if (this.solicitudEditar.fechaEstado != undefined &&
      this.solicitudEditar.fechaEstado != null) {
      this.solicitudEditar.fechaEstado = new Date(
        this.solicitudEditar.fechaEstado
      );

      this.solicitudEditar.fechaEstadoSolicitud = this.solicitudEditar.fechaEstado;
    }

    if (this.solicitudEditar.fechaNacimiento != undefined &&
      this.solicitudEditar.fechaNacimiento != null) {
      this.solicitudEditar.fechaNacimiento = new Date(
        this.solicitudEditar.fechaNacimiento
      );
    }

    if(this.bodyInicial.idEstado != undefined){
      this.estadoSolicitudSelected = this.bodyInicial.idEstado;
    }

    if (this.bodyInicial.apellidos != undefined &&
      this.bodyInicial.apellidos != null) {
      this.bodyInicial.apellidos = this.bodyInicial.apellidos.trim();
    }

    if (this.solicitudEditar.poblacionExtranjera == undefined) {
      this.bodyInicial.poblacionExtranjera = undefined;
    } else if (this.solicitudEditar.poblacionExtranjera == null) {
      this.bodyInicial.poblacionExtranjera = null;
    } else {
      this.bodyInicial.poblacionExtranjera = this.solicitudEditar.poblacionExtranjera;
    }

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
          console.log(this.poblaciones);
        },
        error => {
          console.log(error);
        }
      );
  }

  onChangePais(event) {
    this.solicitudEditar.idPais = event.value;
    if (event.value == "191") {
      this.isValidCodigoPostal();
      this.provinciaSelected = null;
      this.poblacionSelected = null;
      this.solicitudEditar.codigoPostal = null;
      this.poblacionExtranjeraSelected = undefined;
      this.isPoblacionExtranjera = false;
    } else {
      this.isPoblacionExtranjera = true;
      this.provinciaSelected = undefined;
      this.poblacionSelected = undefined;
    }
  }

  validarIban(): boolean {
    if (!this.isSave || (this.isSave && this.solicitudEditar.iban != null)) {
      if (
        ((this.solicitudEditar.iban != null ||
          this.solicitudEditar.iban != undefined ||
          this.solicitudEditar.iban != "") &&
          (this.isValidIBAN() || this.isValidIbanExt())) || this.solicitudEditar.iban == "" || this.solicitudEditar.iban == undefined
        || this.solicitudEditar.iban == null
      ) {
        this.ibanValido = true;
        return true;
      } else {
        this.ibanValido = true;
        return false;
      }
    } else {
      return true;
    }

  }

  isValidIBAN(): boolean {

    this.iban = this.solicitudEditar.iban;

    if (
      this.solicitudEditar.iban != null ||
      this.solicitudEditar.iban != undefined
    ) {
      this.solicitudEditar.iban = this.solicitudEditar.iban.replace(/\s/g, "");
      // return (
      //   this.solicitudEditar.iban &&
      //   typeof this.solicitudEditar.iban === "string" &&
      //   // /ES\d{2}[ ]\d{4}[ ]\d{4}[ ]\d{4}[ ]\d{4}[ ]\d{4}|ES\d{22}/.test(
      //   ///[A-Z]{2}\d{22}?[\d]{0,2}/.test(this.body.iban)
      //   /^ES\d{22}$/.test(this.solicitudEditar.iban)
      // );

      // IBAN ESPAÑOL
      if (this.solicitudEditar.iban.length != 24) {
        return false;
      }

      let firstLetters = this.solicitudEditar.iban.substring(0, 1);
      let secondfirstLetters = this.solicitudEditar.iban.substring(1, 2);
      let num1 = this.getnumIBAN(firstLetters);
      let num2 = this.getnumIBAN(secondfirstLetters);

      let isbanaux = String(num1) + String(num2) + this.solicitudEditar.iban.substring(2);
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

  // autogenerarDatos() {
  //   if (this.isValidIBAN()) {
  //     this.recuperarBicBanco();
  //   } else {
  //     this.solicitudEditar.banco = "";
  //   }
  // }

  autogenerarDatos() {

    //Si es una consulta los datos deben venir de la pantalla de busqueda
    if (this.consulta) {
      this.solicitudEditar.banco = this.solicitudEditar.nombreBanco;

      //Si no es una consulta que se genere
    } else {
      if (this.solicitudEditar.iban != undefined && this.solicitudEditar.iban != "") {
        this.iban = this.solicitudEditar.iban.trim();
        this.solicitudEditar.iban = this.iban;
      }

      if (this.solicitudEditar.iban != null && this.solicitudEditar.iban != "") {
        var ccountry = this.solicitudEditar.iban.substring(0, 2);
        if (ccountry == "ES") {
          this.editarExt = false;

          if (this.isValidIBAN()) {
            this.recuperarBicBanco();

            this.ibanValido = true;
          } else {
            this.solicitudEditar.banco = "";
            this.solicitudEditar.bic = "";

            this.ibanValido = true;
          }
        } else {
          this.checkIbanExt(ccountry);
        }
      } else {
        this.solicitudEditar.banco = "";
        this.solicitudEditar.bic = "";
        this.ibanValido = true;
      }
    }

    if (this.cargarDatos) {
      this.bodyInicial.bic = this.solicitudEditar.bic;
      this.bodyInicial.banco = this.solicitudEditar.nombreBanco;
      this.cargarDatos = false;
    }

  }

  checkIbanExt(ccountry) {
    this.sigaServices
      .post("datosCuentaBancaria_getLengthCodCountry", ccountry)
      .subscribe(
        data => {
          this.lengthCountryCode = JSON.parse(data["body"]);

        },
        error => {
          this.ibanValido = false;
          this.solicitudEditar.banco = "";
          this.solicitudEditar.bic = "";
        },
        () => {
          if (this.isValidIbanExt()) {
            this.ibanValido = true;
            // Habilitamos el BIC

            this.editarExt = true;

            if (this.solicitudEditar.bic == undefined) {
              // if (this.registroEditable == "false") {
              this.solicitudEditar.banco = "BANCO EXTRANJERO";
              // } else {
              // this.solicitudEditar.banco = "";
              // }
              this.solicitudEditar.bic = "";
            } else {
              if (this.iban.substring(0, 2) != "ES") {

                if (this.solicitudEditar.bic == undefined) {
                  this.solicitudEditar.bic = "";
                } else {
                  if (
                    this.solicitudEditar.bic.charAt(4) !=
                    this.iban.substring(0, 2).charAt(0) &&
                    this.solicitudEditar.bic.charAt(5) !=
                    this.iban.substring(0, 2).charAt(1)
                  ) {
                    this.solicitudEditar.bic = "";
                  }
                }
                // } else {
                //   this.body.bic = this.bic;
                // }

                // if (this.registroEditable == "false") {
                // this.solicitudEditar.bic = "";
                // }

                this.solicitudEditar.banco = "BANCO EXTRANJERO";
              } else {
                this.solicitudEditar.bic = this.bic;
                this.solicitudEditar.banco = this.banco;
                this.editarExt = false;
              }
            }
          } else {
            this.solicitudEditar.banco = "";
            this.solicitudEditar.bic = "";
            this.editarExt = false;
            this.ibanValido = false;
          }

          if (this.editarExt) {
            this.editar = true;
          } else {
            this.editar = false;
          }

          //sessionStorage.removeItem("bic");
        }
      );
  }

  isValidIbanExt(): boolean {
    if (this.solicitudEditar.iban != null && this.solicitudEditar.iban != undefined &&
      this.solicitudEditar.iban != "" && this.solicitudEditar.iban.length == this.lengthCountryCode) {
      return true;
    } else {
      return false;
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
      summary: this.translateService.instant("general.message.incorrect"),
      detail: this.translateService.instant(
        "general.message.error.realiza.accion"
      )
    });
  }

  // recuperarBicBanco() {
  //   this.sigaServices
  //     .post("datosCuentaBancaria_BIC_BANCO", this.solicitudEditar)
  //     .subscribe(
  //       data => {
  //         let bodyBancoBicSearch = JSON.parse(data["body"]);
  //         let bodyBancoBic = bodyBancoBicSearch.bancoBicItem[0];

  //         this.solicitudEditar.banco = bodyBancoBic.banco;
  //         this.solicitudEditar.bic = bodyBancoBic.bic;
  //         this.checkSolicitudInicio.banco = bodyBancoBic.banco;
  //         this.checkSolicitudInicio.bic = bodyBancoBic.bic;
  //       },
  //       error => {
  //         // let bodyBancoBicSearch = JSON.parse(error["error"]);
  //         this.showFailGenerico();
  //       }
  //     );
  // }

  recuperarBicBanco() {
    if (this.editarExt) {
      if (this.validarBIC()) {
        this.bicValido = true;
      } else {
        this.bicValido = false;
      }
    } else {
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


            this.iban = this.solicitudEditar.iban.replace(/\s/g, "");

            // this.editar = false;
          },
          error => {
            this.ibanValido = false;
            this.solicitudEditar.banco = "";
            this.solicitudEditar.bic = "";
            let bodyBancoBicSearch = JSON.parse(error["error"]);
            this.showFail(bodyBancoBicSearch.error.message.toString());
          }
        );
    }
  }

  validarBIC(): boolean {
    var ccountry = this.solicitudEditar.iban.substring(0, 2);
    if (
      this.solicitudEditar.bic != null &&
      this.solicitudEditar.bic != undefined &&
      this.solicitudEditar.bic != "" &&
      this.solicitudEditar.bic.length >= 8 &&
      this.solicitudEditar.bic.charAt(4) == ccountry.charAt(0) &&
      this.solicitudEditar.bic.charAt(5) == ccountry.charAt(1)
    ) {
      this.bicValido = true;
      return true;
    } else {
      this.bicValido = false;
      return false;
    }
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

  habilitaAceptar() {

    if (
      (this.solicitudEditar.iban != null &&
        this.solicitudEditar.iban != undefined &&
        this.solicitudEditar.iban != "") ||
      (this.solicitudEditar.bic != null &&
        this.solicitudEditar.bic != undefined &&
        this.solicitudEditar.bic != "") ||
      (this.cargo || this.abono || this.abonoJCS)
    ) {
      if (
        this.solicitudEditar.titular != null &&
        this.solicitudEditar.titular != undefined &&
        this.solicitudEditar.titular != "" &&
        this.solicitudEditar.titular.trim() &&
        this.solicitudEditar.iban != null &&
        this.solicitudEditar.iban != undefined &&
        this.solicitudEditar.iban != "" &&
        this.solicitudEditar.bic != null &&
        this.solicitudEditar.bic != undefined &&
        this.solicitudEditar.bic != "" &&
        (this.cargo || this.abono || this.abonoJCS)
      ) {
        if (this.validarIban()) {
          if (this.editarExt) {
            if (this.validarBIC()) {
              return true;
            } else {
              return false;
            }
          }
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  disabledAprobar() {

    if (this.solicitudEditar.idEstado != this.estadoSolicitudSelected
      || this.solicitudEditar.idTipo != this.tipoSolicitudSelected
      || this.solicitudEditar.idTipoColegiacion != this.tipoColegiacionSelected
      || this.solicitudEditar.idModalidadDocumentacion != this.modalidadDocumentacionSelected
      || this.solicitudEditar.idTipoIdentificacion != this.tipoIdentificacionSelected
      || this.solicitudEditar.idTratamiento != this.tratamientoSelected
      || this.solicitudEditar.idEstadoCivil != this.estadoCivilSelected
      || this.solicitudEditar.idPais != this.paisSelected
      || this.solicitudEditar.sexo != this.sexoSelected
      || this.solicitudEditar.idProvincia != this.provinciaSelected
      || this.solicitudEditar.idPoblacion != this.poblacionSelected
      || JSON.stringify(this.solicitudEditar) != JSON.stringify(this.bodyInicial)) {
      return true;
    } else {
      return false;
    }
  }

  validateAprobarSolitud() {
    if (this.solicitudEditar.fechaIncorporacion != undefined && this.solicitudEditar.fechaIncorporacion != null) {
      this.aprobarSolicitud();
    } else {
      this.showFailNotTraduce("Es necesario informar de la fecha de incorporación antes de aprobar. Rellénela y guarde");
    }
  }

  aprobarSolicitud() {
    if (this.habilitaAceptar()) {
      if (this.solicitudEditar.fechaIncorporacion != null &&
        this.solicitudEditar.fechaIncorporacion != undefined) {

        this.isSave = false;
        if (this.isGuardar() || this.numColegiadoDuplicado) {
          this.guardar(false);
        }

        this.progressSpinner = true;
        this.resaltadoDatos = false;
        this.resaltadoDatosAprobar = false;
        this.resaltadoDatosBancos = false;

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
                      sessionStorage.removeItem("editedSolicitud");

                      this.msgs = [
                        {
                          severity: "success",
                          summary: "Éxito",
                          detail: "Solicitud aprobada."
                        }
                      ];

                      this.solicitudEditar.idSolicitud = JSON.parse(result.body).id.split(",")[0];
                      this.solicitudEditar.idPersona = JSON.parse(result.body).id.split(",")[1];

                      if (new Date(this.solicitudEditar.fechaEstado) <= new Date()) {
                        this.veFicha = true;
                        this.searchSolicitante();
                      }
                      this.consulta = true;
                      this.pendienteAprobacion = false;
                      sessionStorage.setItem("pendienteAprobacion", "false");
                      this.solicitudEditar.idEstado = "50";
                      this.estadoSolicitudSelected = "50";
                      let estado = this.estadosSolicitud.find(x => x.value == this.estadoSolicitudSelected);
                      this.solicitudEditar.estadoSolicitud = estado.label;
                      let tipoSolicitud = this.tiposSolicitud.find(x => x.value == this.tipoSolicitudSelected);
                      this.solicitudEditar.tipoSolicitud = tipoSolicitud.label;
                      let modalidad = this.modalidadDocumentacion.find(x => x.value == this.modalidadDocumentacionSelected);
                      this.solicitudEditar.modalidad = modalidad.label;
                      sessionStorage.setItem("consulta", "true");
                      this.solicitudEditar.fechaEstadoSolicitud = new Date();
                      sessionStorage.setItem(
                        "editedSolicitud",
                        JSON.stringify(this.solicitudEditar)
                      );
                      this.checkSolicitudInicio = JSON.parse(sessionStorage.getItem("editedSolicitud"));

                      this.progressSpinner = false;
                      this.showSuccess(this.translateService.instant("general.message.accion.realizada"));
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
                this.numColegiadoDuplicado = true;
                this.progressSpinner = false;
              }

            },
            error => {
              let resultado = JSON.parse(error["error"]);
              this.showFail(resultado.error.message.toString());
              this.progressSpinner = false;
            }
          );

      } else {
        this.showFail("censo.alterMutua.literal.fechaIncorporacionObligatorio");

      }
    } else {
      this.showFail("censo.alterMutua.literal.datosBancariosObligatorios");
      this.muestraCamposObligatoriosBancos();
    }

  }

  searchSolicitante() {
    if (this.solicitudEditar.fechaEstado < this.fechaActual) {
      this.progressSpinner = true;

      this.body = new DatosColegiadosItem();
      this.body.idPersona = this.solicitudEditar.idPersona;
      sessionStorage.setItem("consulta", "true");

      if (this.solicitudEditar.idEstado == "50") {
        sessionStorage.setItem("solicitudAprobada", "true");
      }

      this.sigaServices
        .postPaginado(
          "busquedaColegiados_searchColegiadoFicha",
          "?numPagina=1",
          this.body
        )
        .subscribe(
          data => {
            this.progressSpinner = false;
            this.solicitante = JSON.parse(data["body"]).colegiadoItem[0];
            sessionStorage.setItem("personaBody", JSON.stringify(this.solicitante));
            sessionStorage.setItem("destinatarioCom", "true");
            sessionStorage.setItem("esColegiado", "true");
            sessionStorage.setItem("esNuevoNoColegiado", "false");
            this.router.navigate(["/fichaColegial"]);

          },
          err => {
            console.log(err);
            this.progressSpinner = false;
          },
          () => {
            this.progressSpinner = false;
          }
        );
    } else this.progressSpinner = false;
  }

  denegarSolicitud() {
    this.progressSpinner = true;
    this.resaltadoDatos = false;
    this.resaltadoDatosAprobar = false;
    this.resaltadoDatosBancos = false;

    this.sigaServices
      .post(
        "solicitudIncorporacion_denegarSolicitud",
        this.solicitudEditar.idSolicitud
      )
      .subscribe(
        result => {
          sessionStorage.removeItem("editedSolicitud");

          this.progressSpinner = false;
          this.msgs = [
            {
              severity: "success",
              summary: "Éxito",
              detail: "Solicitud denegada."
            }
          ];

          this.consulta = true;
          this.pendienteAprobacion = false;
          sessionStorage.setItem("pendienteAprobacion", "false");
          sessionStorage.setItem("consulta", "true");
          this.solicitudEditar.idEstado = "30";
          this.estadoSolicitudSelected = "30";
          let estado = this.estadosSolicitud.find(x => x.value == this.estadoSolicitudSelected);
          this.solicitudEditar.estadoSolicitud = estado.label;
          let tipoSolicitud = this.tiposSolicitud.find(x => x.value == this.tipoSolicitudSelected);
          this.solicitudEditar.tipoSolicitud = tipoSolicitud.label;
          let modalidad = this.modalidadDocumentacion.find(x => x.value == this.modalidadDocumentacionSelected);
          this.solicitudEditar.modalidad = modalidad.label;

          sessionStorage.setItem(
            "editedSolicitud",
            JSON.stringify(this.solicitudEditar)
          );
          this.checkSolicitudInicio = JSON.parse(sessionStorage.getItem("editedSolicitud"));

          this.showSuccess(this.translateService.instant("general.message.accion.realizada"));
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
      } else if (this.abono == true) {
        this.solicitudEditar.abonoCargo = "A";
      } else {
        this.solicitudEditar.abonoCargo = "";
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

  guardar(back) { //tipoSolicitudSelected, tipoColegiacionSelected, modalidadDocumentacionSelected, solicitudEditar.fechaEstado
    this.progressSpinner = true;
    this.resaltadoDatos = false;
    this.resaltadoDatosAprobar = false;
    this.resaltadoDatosBancos = false;
    this.numColegiadoDuplicado = false;

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
      } else if (this.abono == true) {
        this.solicitudEditar.abonoCargo = "A";
      } else {
        this.solicitudEditar.abonoCargo = "";
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

          this.tratarDatos();
          if (back == true) {
            this.progressSpinner = false;
          }

          this.solicitudEditar.idSolicitud = JSON.parse(result.body).id;

          this.showSuccess(this.translateService.instant("general.message.accion.realizada"));
          this.checkSolicitudInicio = JSON.parse(sessionStorage.getItem("editedSolicitud"));
          this.pendienteAprobacion = true;
          this.consulta = false;
          sessionStorage.setItem("pendienteAprobacion", "true");
          sessionStorage.setItem("consulta", "false");
          this.estadoSolicitudSelected = this.solicitudEditar.idEstado;
          let estado = this.estadosSolicitud.find(x => x.value == this.estadoSolicitudSelected);
          this.solicitudEditar.estadoSolicitud = estado.label;
          let tipoSolicitud = this.tiposSolicitud.find(x => x.value == this.tipoSolicitudSelected);
          this.solicitudEditar.tipoSolicitud = tipoSolicitud.label;
          let modalidad = this.modalidadDocumentacion.find(x => x.value == this.modalidadDocumentacionSelected);
          this.solicitudEditar.modalidad = modalidad.label;

          this.solicitudEditar.fechaEstadoSolicitud = new Date();

          sessionStorage.setItem(
            "editedSolicitud",
            JSON.stringify(this.solicitudEditar)
          );

          if (this.pendienteAprobacion == true &&
            (this.solicitudEditar.titular == null ||
              this.solicitudEditar.titular == undefined ||
              this.solicitudEditar.titular == "")
          ) {

            if (this.solicitudEditar.apellido2 != undefined && this.solicitudEditar.apellido2 != null && this.solicitudEditar.apellido2 != "") {
              this.solicitudEditar.apellidos = this.solicitudEditar.apellido1 + " " + this.solicitudEditar.apellido2;
            } else {
              this.solicitudEditar.apellidos = this.solicitudEditar.apellido1;
            }

            if (this.solicitudEditar.nombre != undefined && this.solicitudEditar.nombre != null && this.solicitudEditar.nombre != ""
              && this.solicitudEditar.apellidos != undefined && this.solicitudEditar.apellidos != null && this.solicitudEditar.apellidos != "") {
              this.solicitudEditar.titular =
                this.solicitudEditar.nombre + " " + this.solicitudEditar.apellidos;
            }

          }

          this.bodyInicial = JSON.parse(JSON.stringify(this.solicitudEditar));
          this.tratarDatos();

          if (back == true) {
            this.msgs = [
              {
                severity: "success",
                summary: "Éxito",
                detail: "Solicitud guardada correctamente."
              }
            ];
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
        error => { },
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
    if (this.isPoblacionExtranjera) {
      this.solicitudEditar.poblacionExtranjera = this.poblacionExtranjeraSelected;
    } else {
      this.solicitudEditar.poblacionExtranjera = undefined;
      this.solicitudEditar.idPoblacion = this.poblacionSelected;
      this.solicitudEditar.idProvincia = this.provinciaSelected;
    }

    if ( //tipoIdentificacionSelected, solicitudEditar.numeroIdentificacion,tratamientoSelected, solicitudEditar.nombre, solicitudEditar.apellido1

      !this.isLetrado
    ) {
      if (
        this.compruebaDNI() &&
        this.estadoSolicitudSelected != "" &&
        this.estadoSolicitudSelected != undefined &&
        this.tipoIdentificacionSelected != "" &&
        this.tipoIdentificacionSelected != undefined &&
        this.solicitudEditar.numeroIdentificacion != null &&
        this.solicitudEditar.numeroIdentificacion != "" &&
        this.solicitudEditar.numeroIdentificacion != undefined &&
        this.tratamientoSelected != "" &&
        this.tratamientoSelected != undefined &&   
        this.solicitudEditar.nombre != null &&
        this.solicitudEditar.nombre != undefined &&
        this.solicitudEditar.nombre != "" &&
        this.solicitudEditar.apellido1 != null &&
        this.solicitudEditar.apellido1 != "" &&
        this.solicitudEditar.apellido1 != undefined
        ) {

       /*  if (this.solicitudEditar.iban != "" &&
          this.solicitudEditar.iban != undefined && (this.validarIban() &&
            this.solicitudEditar.bic != "" &&
            this.solicitudEditar.bic != undefined &&
            this.solicitudEditar.titular != "" &&
            this.solicitudEditar.titular != undefined && this.solicitudEditar.titular.trim() != "")) {

          this.resaltadoDatos = true;
          return true;
        } else {
          if (this.solicitudEditar.iban == "" || this.solicitudEditar.iban == undefined) {
            this.resaltadoDatos = true;
            return true;
          } else {
            this.resaltadoDatos = false;
            return false;
          }
        } */
        this.resaltadoDatos = true;
        return true;
      } else {
        this.resaltadoDatos = false;
        return false;
      }
    } else {
      this.resaltadoDatos = false;
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
    if(((<HTMLInputElement>document.getElementById("mailNuevaIncorporacion")) != null) 
      && ((<HTMLInputElement>document.getElementById("mailNuevaIncorporacion")).value != '')
      && (this.commonsService.validateEmail(this.solicitudEditar.correoElectronico))
      && (this.consulta)){
        document.getElementById('mailNuevaIncorporacion').setAttribute('style', 'color: #0000EE');
        document.getElementById('mailNuevaIncorporacion').setAttribute('style', 'cursor:pointer !important');
        document.getElementById('mailHref').setAttribute('href', 'mailto:'+((<HTMLInputElement>document.getElementById("mailNuevaIncorporacion")).value));
      }
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
    sessionStorage.removeItem("consulta");
    sessionStorage.removeItem("pendienteAprobacion");
    let filtros = JSON.parse(sessionStorage.getItem("filtros"));

    if (filtros != null) {
      sessionStorage.setItem("filtrosSolicitudesIncorporacion", JSON.stringify(filtros));
    }

    this.router.navigate(["/solicitudesIncorporacion"]);
  }

  // irAlterMutua() {
  //   sessionStorage.setItem(
  //     "datosSolicitud",
  //     JSON.stringify(this.solicitudEditar)
  //   );
  //   this.router.navigate(["/alterMutua"]);
  // }

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

  showFailNotTraduce(mensaje: string) {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: this.translateService.instant("general.message.incorrect"),
      detail: mensaje
    });
  }

  showSuccess(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "success", summary: this.translateService.instant("general.message.correct"), detail: mensaje });
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

  fillFechaEstadoSolicitud(event) {
    this.solicitudEditar.fechaEstadoSolicitud = event;
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

  transformaFecha(fecha) {
    let splitDate = fecha.split("/");
    let arrayDate = splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0];
    fecha = new Date((arrayDate += "T00:00:00.001Z"));

    return fecha;
  }

  arregloTildesCombo(combo) {
    combo.map(e => {
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

  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      if (this.isGuardar()) {
        this.guardar(true);
      }
    }
  }

  changeEmail() {
    this.emailValido = this.commonsService.validateEmail(this.solicitudEditar.correoElectronico);
  }

  changeTelefono1() {
    this.tlf1Valido = this.commonsService.validateTelefono(this.solicitudEditar.telefono1);
  }

  changeTelefono2() {
    this.tlf2Valido = this.commonsService.validateTelefono(this.solicitudEditar.telefono2);
  }

  changeMovil() {
    this.mvlValido = this.commonsService.validateMovil(this.solicitudEditar.movil);
  }

  changeFax1() {
    this.fax1Valido = this.commonsService.validateFax(this.solicitudEditar.fax1);
  }

  changeFax2() {
    this.fax2Valido = this.commonsService.validateFax(this.solicitudEditar.fax2);
  }

  styleObligatorio(evento) {
    if (this.resaltadoDatos && (evento == undefined || evento == null || evento == "")) {
      return this.commonsService.styleObligatorio(evento);
    }
  }

  styleObligatorioTlf(evento) {
    if (this.resaltadoDatosAprobar && (this.solicitudEditar.telefono1 == undefined || this.solicitudEditar.telefono1 == "") && (this.solicitudEditar.movil == undefined || this.solicitudEditar.movil == "")) {
      return this.commonsService.styleObligatorio(evento);
    }
    
  }

  styleObligatorioAprobar(evento) {
    if (this.resaltadoDatosAprobar && (evento == undefined || evento == null || evento == "")) {
      return this.commonsService.styleObligatorio(evento);
    }
  }

  styleObligatorioBanco(evento) {
    if (this.resaltadoDatosBancos && (evento == undefined || evento == null || evento == "")) {
      return this.commonsService.styleObligatorio(evento);
    }
  }

  muestraCamposObligatorios() {
    this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios') }];
    this.resaltadoDatos = true;
  }

  muestraCamposObligatoriosAprobar() {
    this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios') }];
    this.resaltadoDatosAprobar = true;
  }

  muestraCamposObligatoriosBancos() {
    this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios') }];
    this.resaltadoDatosBancos = true;
  }

  checkDatos() {
    if (!this.consulta) {
      if (this.isGuardar()) {
        this.isSave = true;
        this.guardar(true);
      } else {
        this.muestraCamposObligatorios();
      } 
    }
  }

  checkDatosAprobar() {
    if(this.checkCamposObligatoriosAprobar()){
      if ((this.consulta || this.pendienteAprobacion) && (this.solicitudEditar.idEstado != '50' && this.solicitudEditar.idEstado != '30')) {
        if (!this.disabledAprobar()) {
          if (this.cargo == true || this.abono == true || this.abonoJCS == true) {
            if ((this.solicitudEditar.titular == "" || this.solicitudEditar.titular == undefined) || (this.solicitudEditar.iban == "" || this.solicitudEditar.iban == undefined) || (this.solicitudEditar.bic == "" || this.solicitudEditar.bic == undefined) || (this.solicitudEditar.banco == "" || this.solicitudEditar.banco == undefined)) {
              this.muestraCamposObligatoriosBancos();
            }
          }

          if (this.solicitudEditar.fechaIncorporacion == undefined) {
          //  if (this.solicitudEditar.fechaIncorporacion == undefined) {
            this.muestraCamposObligatoriosAprobar();
          }

          if (!this.resaltadoDatosAprobar && !this.resaltadoDatosBancos) {
            this.validateAprobarSolitud();
          }
        } else {
          this.validateAprobarSolitud();
        }
      }
    }else{
      this.muestraCamposObligatoriosAprobar();
    }
  }

  checkCamposObligatoriosAprobar(): boolean{
    if (
            !this.isLetrado
          ) {
            if (
              this.compruebaDNI() &&
              this.estadoSolicitudSelected != "" &&
              this.estadoSolicitudSelected != undefined &&
              this.solicitudEditar.fechaEstado != null &&
              this.solicitudEditar.fechaEstado != undefined &&
              this.solicitudEditar.fechaSolicitud != null &&
              this.solicitudEditar.fechaSolicitud != undefined &&
              this.tipoSolicitudSelected != "" &&
              this.tipoSolicitudSelected != undefined &&
              this.tipoColegiacionSelected != "" &&
              this.tipoColegiacionSelected != undefined &&
              this.modalidadDocumentacionSelected != "" &&
              this.modalidadDocumentacionSelected != undefined &&
              this.solicitudEditar.correoElectronico != null &&
              this.solicitudEditar.correoElectronico != undefined &&
              this.emailValido &&
              this.tipoIdentificacionSelected != "" &&
              this.tipoIdentificacionSelected != undefined &&
              this.solicitudEditar.numeroIdentificacion != null &&
              this.solicitudEditar.numeroIdentificacion != "" &&
              this.solicitudEditar.numeroIdentificacion != undefined &&
              this.tratamientoSelected != "" &&
              this.tratamientoSelected != undefined &&
              this.solicitudEditar.nombre != null &&
              this.solicitudEditar.nombre != undefined &&
              this.solicitudEditar.nombre != "" &&
              this.solicitudEditar.apellido1 != null &&
              this.solicitudEditar.apellido1 != "" &&
              this.solicitudEditar.apellido1 != undefined &&
              this.solicitudEditar.fechaNacimiento != null &&
              this.solicitudEditar.fechaNacimiento != undefined &&
              this.paisSelected != undefined &&
              this.solicitudEditar.domicilio != null &&
              this.solicitudEditar.domicilio != "" &&
              this.solicitudEditar.domicilio != undefined &&
              (this.isValidCodigoPostal() || this.isPoblacionExtranjera) &&
              this.solicitudEditar.codigoPostal != null &&
              this.solicitudEditar.codigoPostal != undefined &&
              this.solicitudEditar.codigoPostal != "" &&
              (
                (this.solicitudEditar.telefono1 != null &&
                  this.solicitudEditar.telefono1 != "" &&
                  this.solicitudEditar.telefono1 != undefined) || 
                (this.solicitudEditar.movil != null &&
                  this.solicitudEditar.movil != "" &&
                  this.solicitudEditar.movil != undefined)
              ) &&
              this.tlf1Valido && this.tlf2Valido && this.fax1Valido &&
              this.fax2Valido && this.mvlValido &&
              this.solicitudEditar.correoElectronico != null &&
              this.solicitudEditar.correoElectronico != undefined &&
              this.solicitudEditar.correoElectronico != ""
            ) {
              if (this.solicitudEditar.iban != "" &&
                this.solicitudEditar.iban != undefined && (this.validarIban() &&
                  this.solicitudEditar.bic != "" &&
                  this.solicitudEditar.bic != undefined &&
                  this.solicitudEditar.titular != "" &&
                  this.solicitudEditar.titular != undefined && this.solicitudEditar.titular.trim() != "")) {
                this.resaltadoDatosAprobar= true;
                return true;
              } else {
                if (this.solicitudEditar.iban == "" || this.solicitudEditar.iban == undefined) {
                  this.resaltadoDatosAprobar= true;
                  return true;
                } else {
                  this.resaltadoDatosAprobar= false;
                  return false;
                }
              }
            } else {
              this.resaltadoDatosAprobar= false;
              return false;
            }
          } else {
            this.resaltadoDatosAprobar= false;
            return false;
          }
  }
}
