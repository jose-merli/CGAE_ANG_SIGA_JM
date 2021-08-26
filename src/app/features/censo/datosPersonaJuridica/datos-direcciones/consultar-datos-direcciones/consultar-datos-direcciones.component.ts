import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";

import { Location, DatePipe } from "@angular/common";

import { Message, ConfirmationService } from "primeng/components/common/api";
import { SigaServices } from "./../../../../../_services/siga.service";

import { DatosDireccionesItem } from "./../../../../../../app/models/DatosDireccionesItem";
import { DatosDireccionesObject } from "./../../../../../../app/models/DatosDireccionesObject";
import { Dropdown } from "primeng/dropdown";

import { DatosDireccionesCodigoPostalItem } from "./../../../../../../app/models/DatosDireccionesCodigoPostalItem";
import { DatosDireccionesCodigoPostalObject } from "./../../../../../../app/models/DatosDireccionesCodigoPostalObject";
import { TranslateService } from "../../../../../commons/translate";
import { Browser } from "../../../../../../../node_modules/protractor";
import { Checkbox } from "../../../../../../../node_modules/primeng/primeng";
import { findIndex } from 'rxjs/operators';
import { CommonsService } from '../../../../../_services/commons.service';
import { MultiSelect } from 'primeng/multiselect';

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
  fechaModificacion: String;
  isEditable: boolean = false;
  nuevo: boolean = false;
  datosContacto: any[];
  msgs: Message[];
  fichaMisDatos: boolean = false;
  columnasDirecciones: any = [];
  isLetrado: boolean = true;
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
  tipoCambioAuditoria: String;
  idDireccion: String;
  idPersona: String;
  textSelected: String = "{0} etiquetas seleccionadas";
  body: DatosDireccionesItem = new DatosDireccionesItem();
  checkBody: DatosDireccionesItem = new DatosDireccionesItem();
  bodySearch: DatosDireccionesObject = new DatosDireccionesObject();
  historyDisable: boolean = false;
  bodyCodigoPostal: DatosDireccionesCodigoPostalItem = new DatosDireccionesCodigoPostalItem();
  bodyCodigoPostalSearch: DatosDireccionesCodigoPostalObject = new DatosDireccionesCodigoPostalObject();
  disableCheck: boolean = false;
  poblacionExtranjera: boolean = false;
  displayAuditoria: boolean = false;
  showGuardarAuditoria: boolean = false;
  ocultarMotivo: boolean = undefined;
  resultadosPoblaciones: any;
  instituciones: any;
  tooltipFechaMod: any;
  poblacionBuscada: any;
  permisos: boolean = true; //true

  permisoTarjeta: string = "2";
  migaPan: string = "";

  valorResidencia: string = "1";
  valorDespacho: string = "2";
  valorCensoWeb: string = "3";
  valorPublica: string = "4";
  valorGuiaJudicial: string = "5";
  valorGuardia: string = "6";
  valorRevista: string = "7";
  valorFacturacion: string = "8";
  valorTraspaso: string = "9";
  valorPreferenteEmail: string = "10";
  valorPreferenteCorreo: string = "11";
  valorPreferenteSMS: string = "12";
  valorPreferenteFax: string = "13";

  datosDirecciones: DatosDireccionesItem[] = [];
  tiposChangeSelected: any = [];
  tiposChangeUnSelected: any = [];
  tiposDirSelected: any = [];

  unSelectedTipoDir: boolean = false;

  isColegiadoEjerciente: boolean = false;
  isNoColegiado: boolean = false;
  edicionEmail: boolean = false;
  emailValido: boolean = true;
  webValido: boolean = true;
  tlfValido: boolean = true;
  faxValido: boolean = true;
  mvlValido: boolean = true;
  @ViewChild('someDropdown') someDropdown: MultiSelect;
  resaltadoDatos: boolean = false

  constructor(
    private location: Location,
    private sigaServices: SigaServices,
    public datepipe: DatePipe,
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private commonsService: CommonsService

  ) { }

  @ViewChild("input2")
  dropdown: Dropdown;
  @ViewChild("provincia")
  checkbox: Checkbox;

  @ViewChild("mailto")
  mailto;
  ngOnInit() {
    this.resaltadoDatos=false;
    this.migaPan = sessionStorage.getItem("migaPan");

    if (JSON.parse(sessionStorage.getItem("situacionColegialesBody")) == "20") {
      this.isColegiadoEjerciente = true;
    }

    if (JSON.parse(sessionStorage.getItem("situacionColegialesBody")) == undefined) {
      this.isNoColegiado = true;
    }

    this.progressSpinner = true;
    if (sessionStorage.getItem("permisos")) {
      this.permisos = JSON.parse(sessionStorage.getItem("permisos"));
      this.historyDisable = !this.permisos;
    }

    if (sessionStorage.getItem("disabledAction") == "true") {
      this.historyDisable = true;
    } else {
      this.historyDisable = false;
    }

    if (sessionStorage.getItem("isLetrado")) {
      this.isLetrado = JSON.parse(sessionStorage.getItem("isLetrado"));
    }
    if (JSON.parse(sessionStorage.getItem("historicoDir")) == true) {
      this.historyDisable = true;
      this.disableCheck = true;
    }
    if (sessionStorage.getItem("fichaColegial")) {
      this.fichaMisDatos = true;
      sessionStorage.removeItem("fichaColegial");
    }
    sessionStorage.setItem("editarDirecciones", "true");
    this.usuarioBody = JSON.parse(sessionStorage.getItem("usuarioBody"));
    this.textFilter = "Elegir";
    this.getComboProvincia();
    this.getComboPais();

    this.getComboTipoDireccion();

    this.registroEditable = JSON.parse(
      sessionStorage.getItem("editarDireccion")
    );
    if (this.registroEditable) {
      this.nuevo = false;
    } else {
      this.nuevo = true;
      // CAMBIO INCIDENCIA DIRECCIONES
      // this.body = new DatosDireccionesItem();
      // this.body.idTipoDireccion = [];
      // if (JSON.parse(sessionStorage.getItem("numDirecciones")) == 0) {
      //   this.body.idTipoDireccion.push("3");
      //   this.body.idTipoDireccion.push("8");
      //   this.body.idTipoDireccion.push("9");
      //}
    }
    if (sessionStorage.getItem("direccion") != null) {
      this.body = JSON.parse(sessionStorage.getItem("direccion"));
      this.body.idPersona = this.usuarioBody[0].idPersona;
      this.provinciaSelecionada = this.body.idProvincia;
      if (this.body.otraProvincia == "1") {
        this.checkOtraProvincia = true;
        this.isDisabledProvincia = false;
        this.isDisabledPoblacion = true;
      } else {
        this.checkOtraProvincia = false;
      }

      if (
        this.body.idPoblacion !== null &&
        this.body.idPoblacion !== undefined
      ) {
        if (
          this.body.nombrePoblacion !== null &&
          this.body.nombrePoblacion !== undefined
        ) {
          if (this.checkOtraProvincia) {
            this.comboPoblacion = [];
            this.comboPoblacion.push({
              label: this.body.nombrePoblacion,
              value: this.body.idPoblacion
            });
          } else {
            this.getComboPoblacion(this.body.nombrePoblacion.substring(0, 3));
          }
        }
        //else {

        //   this.getComboPoblacion("");
        // }
      }
      this.getDatosContactos();
      if (
        this.body.idPoblacion == null ||
        this.body.idPoblacion == "" ||
        this.body.idPoblacion == undefined
      ) {
        // this.isDisabledPoblacion = false;
      } else {
        if (this.historyDisable == true) {
          this.isDisabledPoblacion = true;
          this.disableCheck = true;
          this.isDisabledCodigoPostal = true;
        } else {
          // this.isDisabledPoblacion = false;
          // this.isDisabledCodigoPostal = false;
        }
      }
      if (
        this.body.fechaModificacion != null ||
        this.body.fechaModificacion != undefined
      ) {
        let dateSplit = this.body.fechaModificacion.toString().split("-");
        let a = dateSplit[0];
        let m = dateSplit[1];
        let dateSplit2 = dateSplit[2].split(" ");
        let d = dateSplit2[0];
        this.fechaModificacion = d + "/" + m + "/" + a;
        this.tooltipFechaMod =
          this.translateService.instant(
            "censo.datosDireccion.literal.fechaModificacion"
          ) +
          ": " +
          this.fechaModificacion;
        // this.showInfo('Fecha de modificación:' + this.fechaModificacion);
      }
      this.onChangePais();

      // this.isDisabledProvincia = true;
    } else {
      this.getDatosContactos();
    }
    if (this.body.idPais == "") {
      this.isDisabledCodigoPostal = this.historyDisable;
    }

    // obtener parametro para saber si se oculta la auditoria
    let parametro = {
      valor: "OCULTAR_MOTIVO_MODIFICACION"
    };

    this.sigaServices
      .post("busquedaPerJuridica_parametroColegio", parametro)
      .subscribe(
        data => {
          let parametroOcultarMotivo = JSON.parse(data.body);
          if (parametroOcultarMotivo.parametro == "S" || parametroOcultarMotivo.parametro == "s") {
            this.ocultarMotivo = true;
          } else if (parametroOcultarMotivo.parametro == "N" || parametroOcultarMotivo.parametro == "n") {
            this.ocultarMotivo = false;
          } else {
            this.ocultarMotivo = undefined;
          }
        },
        err => {
          console.log(err);
        }
      );
    this.checkBody = JSON.parse(JSON.stringify(this.body));
    // this.checkBody.idPais = "191";
    this.progressSpinner = false;

    if (sessionStorage.getItem("permisoTarjeta") != null) {
      this.permisoTarjeta = JSON.parse(sessionStorage.getItem("permisoTarjeta"));
      sessionStorage.removeItem("permisoTarjeta");
    }
    if (sessionStorage.getItem("direcciones") != null) {
      this.datosDirecciones = JSON.parse(sessionStorage.getItem("direcciones"));
    }
  }

  ngAfterViewChecked() {
    this.changeDetectorRef.detectChanges();
  }

  getDatosContactos() {
    this.columnasDirecciones = [
      {
        field: "tipo",
        header: "censo.consultaDatosGenerales.literal.tipoCliente"
      },
      {
        field: "valor",
        header: "administracion.parametrosGenerales.literal.valor"
      }
    ];
    this.generarTabla();
  }
  getComboProvincia() {
    // Combo de identificación
    this.sigaServices.get("integrantes_provincias").subscribe(
      n => {
        this.comboProvincia = n.combooItems;

        let sin = { label: "", value: "" };
        this.comboProvincia = [sin, ...this.comboProvincia]

        this.comboProvincia.map(e => {
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
        this.progressSpinner = false;
      }
    );
  }

  getLabelbyFilter(string): string {
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
    this.poblacionBuscada = this.getLabelbyFilter(filtro);

    this.sigaServices
      .getParam(
        "direcciones_comboPoblacion",
        "?idProvincia=" +
        this.body.idProvincia +
        "&filtro=" +
        this.poblacionBuscada
      )
      .subscribe(
        n => {
          this.comboPoblacion = n.combooItems;

          /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
    para poder filtrar el dato con o sin estos caracteres*/
          this.comboPoblacion.map(e => {
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
        error => {
          this.progressSpinner = false;

        }, () => {
          // this.isDisabledPoblacion = false;
          this.progressSpinner = false;

        }
      );
  }

  getLabelbyFilterArray(array) {
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

  getComboPoblacionInicial() {
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
        error => { },
        () => {
          // this.isDisabledPoblacion = false;
        }
      );
  }
  getComboPais() {
    this.sigaServices.get("direcciones_comboPais").subscribe(
      n => {
        this.comboPais = n.combooItems;
      },
      error => { },
      () => {
        // modo edicion
        if (this.body.idPais != undefined) {
          this.paisSeleccionado = this.comboPais.find(
            item => item.value == this.body.idPais
          );
          // modo creacion => pais España por defecto
        } else {
          this.body.idPais = this.comboPais[0].value;
          this.onChangePais();
        }
        this.progressSpinner = false;
      }
    );
  }
  getComboTipoDireccion() {
    this.sigaServices.get("direcciones_comboTipoDireccion").subscribe(
      n => {
        this.comboTipoDireccion = n.combooItems;
      },
      error => { }
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
    //Si se selecciona un pais extranjero
    if (this.body.idPais != "191") {
      this.provinciaSelecionada = "";
      this.body.idProvincia = "";
      this.body.idPoblacion = "";
      this.disableCheck = true;
      this.poblacionExtranjera = true;
      this.body.idPoblacion = "";
      this.isDisabledCodigoPostal = this.historyDisable;
      this.isDisabledPoblacion = true;
      this.body.idPoblacion = "";
      this.comboPoblacion = [];
      //Si se selecciona españa
    } else {
      this.disableCheck = this.historyDisable;
      this.poblacionExtranjera = false;
      this.onChangeCodigoPostal();
      if (this.historyDisable == true) {
        this.isDisabledCodigoPostal = true;
        this.isDisabledProvincia = true;
        this.disableCheck = true;
      } else {
        this.isDisabledCodigoPostal = false;
      }
      if (this.provinciaSelecionada != "" && this.provinciaSelecionada != undefined) {
        if (this.historyDisable == true) {
          this.isDisabledPoblacion = true;
        } else {
          // this.isDisabledPoblacion = false;
        }
      } else {
        this.isDisabledPoblacion = true;
        this.body.idPoblacion = "";
        this.comboPoblacion = [];
      }
    }
  }

  onChangeCodigoPostal() {
    if (this.body.idPais == "191") {
      if (
        this.isValidCodigoPostal() &&
        this.body.codigoPostal.length == 5 &&
        this.checkOtraProvincia != true
      ) {
        let value = this.body.codigoPostal.substring(0, 2);
        this.provinciaSelecionada = value;
        this.isDisabledPoblacion = false;
        if (value != this.body.idProvincia) {
          this.body.idProvincia = this.provinciaSelecionada;
          this.body.idPoblacion = "";
          this.body.nombrePoblacion = "";
          this.comboPoblacion = [];
          this.isDisabledProvincia = true;
          if (this.historyDisable == true) {
            this.isDisabledPoblacion = true;
            this.disableCheck = true;
          } else {
            this.isDisabledPoblacion = false;
          }
        }
        this.codigoPostalValido = true;
      } else {
        this.codigoPostalValido = false;
        this.isDisabledPoblacion = true;
        this.provinciaSelecionada = "";
      }
    }
  }
  onChangeProvincia() {
    this.body.idPoblacion = "";
    this.comboPoblacion = [];
  }
  onChangeOtherProvincia(event) {
    if (event) {
      this.isDisabledPoblacion = true;

      if (this.body.idPais == "191") {
        this.isDisabledProvincia = false;
      }
      //this.body.otraProvincia = "1";
      if (
        this.body.codigoPostal != null &&
        this.checkOtraProvincia == true &&
        ((this.body.idPoblacion == null &&
          this.body.idPoblacion == undefined) ||
          this.body.idPoblacion == "")
      ) {
        this.showFail(this.translateService.instant("censo.datosDirecciones.mensaje.seleccionar.poblacion"));
        this.isDisabledPoblacion = false;
        this.isDisabledProvincia = true;
        this.checkbox.checked = false;
      }
    } else {
      if (this.historyDisable == true) {
        this.isDisabledPoblacion = true;
        this.disableCheck = true;
      } else {
        if (
          this.body.idPais == "191" &&
          !this.historyDisable &&
          this.body.otraProvincia != "1"
        ) {
          this.isDisabledPoblacion = false;
        }
      }
      //this.body.idPoblacion = "";

      //this.provinciaSelecionada = "";
      this.isDisabledProvincia = true;
      this.onChangeCodigoPostal();
      this.body.otraProvincia = "0";
    }
  }

  guardar() {
    if (this.body.codigoPostal == null || this.body.codigoPostal == undefined) {
      this.showFail(this.translateService.instant("censo.datosDirecciones.mensaje.especificar.codigoPostal"));
    } else {

      if (this.isNoColegiado) {
        if (this.validateCamposObligatorios()) {
          this.serviceSaveDirection();
        }
      } else {
        if (
          this.comprobarDirecciones()
        ) {
          this.getMessageTipos();
        } else {
          if (this.validateCamposObligatorios()) {
            this.serviceSaveDirection();
          }
        }
      }
    }
  }

  validateCamposObligatorios() {

    let idFindTipoDirSMS = this.body.idTipoDireccion.findIndex(tipoDir => tipoDir == this.valorPreferenteSMS);
    let idFindTipoDirFax = this.body.idTipoDireccion.findIndex(tipoDir => tipoDir == this.valorPreferenteFax);
    let idFindTipoDirEmail = this.body.idTipoDireccion.findIndex(tipoDir => tipoDir == this.valorPreferenteEmail);
    let idFindTipoDirTel = this.body.idTipoDireccion.findIndex(tipoDir => tipoDir == this.valorGuardia);
    let idFindTipoDirCenso = this.body.idTipoDireccion.findIndex(tipoDir => tipoDir == this.valorCensoWeb);
    let idFindTipoDirFact = this.body.idTipoDireccion.findIndex(tipoDir => tipoDir == this.valorFacturacion);
    let idFindTipoDirDes = this.body.idTipoDireccion.findIndex(tipoDir => tipoDir == this.valorDespacho);
    let idFindTipoDirTras = this.body.idTipoDireccion.findIndex(tipoDir => tipoDir == this.valorTraspaso);
    let idFindTipoDirGuia = this.body.idTipoDireccion.findIndex(tipoDir => tipoDir == this.valorGuiaJudicial);
    let idFindTipoDirCorreo = this.body.idTipoDireccion.findIndex(tipoDir => tipoDir == this.valorPreferenteCorreo);

    if (idFindTipoDirSMS != -1 && (this.body.movil == undefined || this.body.movil == "")) {
      this.showInfo(this.translateService.instant("message.consultarDirecciones.campoObligatorio.preferenteSMS"));
      return false;
    } else if (idFindTipoDirFax != -1 && (this.body.fax == undefined || this.body.fax == "")) {
      this.showInfo(this.translateService.instant("message.consultarDirecciones.campoObligatorio.preferenteFax"));
      return false;
    } else if (idFindTipoDirEmail != -1 && (this.body.correoElectronico == undefined || this.body.correoElectronico == "")) {
      this.showInfo(this.translateService.instant("message.consultarDirecciones.campoObligatorio.preferenteEmail"));
      return false;
    } else if (idFindTipoDirTel != -1 && (this.body.telefono == undefined || this.body.telefono == "") && (this.body.movil == undefined || this.body.movil == "")) {
      this.showInfo(this.translateService.instant("message.consultarDirecciones.campoObligatorio.guardia"));
      return false;
    } else if (idFindTipoDirCenso != -1 || idFindTipoDirFact != -1 || idFindTipoDirDes != -1 || idFindTipoDirTras != -1 || idFindTipoDirGuia != -1 || idFindTipoDirCorreo != -1) {

      if (this.body.idPais == "191" && this.body.idPais != undefined) {
        if (this.body.domicilio == undefined || this.body.domicilio == "" || this.body.idPoblacion == undefined
          || this.body.idPoblacion == "" || this.body.codigoPostal == undefined || this.body.codigoPostal == ""
          || this.body.idProvincia == undefined || this.body.idProvincia == "") {
          this.showInfo(this.translateService.instant("message.consultarDirecciones.campoObligatorio.domicilioCompleto"));
          return false;
        } else {
          return true;
        }
      } else if (this.body.idPais != "191" && this.body.idPais != undefined) {
        if (this.body.domicilio == undefined || this.body.domicilio == "" || this.body.poblacionExtranjera == undefined ||
          this.body.poblacionExtranjera == "" || this.body.codigoPostal == undefined || this.body.codigoPostal == "") {
          this.showInfo(this.translateService.instant("message.consultarDirecciones.direccion.anadida.campoObligatorio.domicilioCompleto"));
          return false;
        } else {
          return true;
        }
      } else {
        this.showInfo(this.translateService.instant("message.consultarDirecciones.direccion.anadida.campoObligatorio.domicilioCompleto"));
        return false;
      }
    } else {
      return true;
    }
  }

  comprobarDirecciones() {
    this.tiposChangeSelected = [];
    this.tiposChangeUnSelected = [];

    this.tiposDirSelected.forEach(tipoSelected => {
      //¿Es única?
      if (tipoSelected == this.valorCensoWeb
        || tipoSelected == this.valorTraspaso
        || tipoSelected == this.valorFacturacion
        || tipoSelected == this.valorGuiaJudicial
        || tipoSelected == this.valorPreferenteCorreo
        || tipoSelected == this.valorPreferenteEmail
        || tipoSelected == this.valorPreferenteSMS
        || (tipoSelected == this.valorGuardia && this.isColegiadoEjerciente)) {

        if (!this.nuevo) {

          //¿Se ha eliminado de la lista?
          let idFindTipoDir = this.body.idTipoDireccion.findIndex(tipoDir => tipoDir == tipoSelected);

          let dir = this.datosDirecciones.find(dir => dir.idDireccion == this.body.idDireccion);
          let idFindTipoDirAntes;
          //¿Se encontraba antes?
          if (dir != undefined) {
            idFindTipoDirAntes = dir.idTipoDireccion.findIndex(tipoDir => tipoDir == tipoSelected);
          }

          //Si no se encuentra y se encontraba antes --> buscamos si se encuentra en otra direccion 
          if (idFindTipoDir == -1 && idFindTipoDirAntes != -1) {
            let encontrado = false;

            this.datosDirecciones.forEach(dir => {
              //Es en otra direccion
              if (dir.idDireccion != this.body.idDireccion) {
                //Si se encuentra en otra direccion indicamos que se ha encontrado...
                let tipoChange = dir.idTipoDireccion.find(tipoDir => tipoDir == tipoSelected);

                if (tipoChange != undefined) {
                  encontrado = true;
                }
              }
            });
            //... si no se encuentra pues lo añadimos a tiposChangeUnSelected indicando que no se puede eliminar porque es obligatoria y 
            //debe existir en otra dirección y no se puede eliminar
            if (!encontrado) {
              this.tiposChangeUnSelected.push(this.comboTipoDireccion.find(tipoDir => tipoDir.value == tipoSelected));
            }

          }

          //Si se encuentra en la actual buscamos si se encuentra en otra direccion
          if (idFindTipoDir != -1) {
            //¿Se encuentra en alguna dirección?
            this.datosDirecciones.forEach(dir => {
              if (dir.idDireccion != this.body.idDireccion) {
                let idFindTipo = dir.idTipoDireccion.findIndex(tipoDir => tipoDir == tipoSelected);

                //Si se encuentra guardamos en un array los tipos encontrados
                if (idFindTipo != -1) {
                  let tipoChange = this.comboTipoDireccion.find(combo => combo.value == tipoSelected);

                  if (tipoChange != undefined) {
                    this.tiposChangeSelected.push(tipoChange);
                  }
                }
              }
            });
          }

          //Direccion nueva
        } else {
          //¿Se encuentra seleccionada?
          let idFindTipoDir = this.body.idTipoDireccion.findIndex(tipoDir => tipoDir == tipoSelected);

          //Buscamos si se encuentra en otra direccion 
          if (this.nuevo && idFindTipoDir != -1) {
            this.datosDirecciones.forEach(dir => {
              let idFindTipo = dir.idTipoDireccion.findIndex(tipoDir => tipoDir == tipoSelected);

              //Si se encuentra guardamos en un array los tipos encontrados
              if (idFindTipo != -1) {
                let tipoChange = this.comboTipoDireccion.find(combo => combo.value == tipoSelected);

                if (tipoChange != undefined) {
                  this.tiposChangeSelected.push(tipoChange);
                }
              }
            });
          }

        }
      }

      //Si es ejerciente
      if (this.isColegiadoEjerciente) {
        //El tipo de direccion es despacho?
        if (tipoSelected == this.valorDespacho) {
          let cont = 0;
          //Se comprueba si esta en otra dirección que no es la actual
          this.datosDirecciones.forEach(dir => {

            if (dir.idDireccion != this.body.idDireccion) {
              let idFindTipo = dir.idTipoDireccion.findIndex(tipoDir => tipoDir == tipoSelected);

              //Si se encuentra, no hacemos nada porque no tenemos que añadirla a esta direccion 
              if (idFindTipo != -1) {
                cont = cont + 1;
              }
            }
          });

          //Si no se encuentra en ninguna otra direccion, se comprueba si se ha eliminado de la lista
          if (cont == 0) {
            //¿Se ha eliminado de la lista?
            let idFindTipoDir = this.body.idTipoDireccion.findIndex(tipoDir => tipoDir == tipoSelected);

            //Si no se encuentra se guarda para indicar que al menos debe estar una vez seleccionado
            if (idFindTipoDir == -1) {
              this.tiposChangeUnSelected.push(this.comboTipoDireccion.find(tipoDir => tipoDir.value == tipoSelected));
            }
          }

        }
      }
    });

    if (this.tiposChangeSelected.length > 0 || this.tiposChangeUnSelected.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  getMessageTipos() {
    let msg;

    if (this.tiposChangeUnSelected.length == 1) {
      msg = this.translateService.instant("message.consultarDirecciones.necesario.disponer.tipoDireccion") + this.tiposChangeUnSelected[0].label + this.translateService.instant("message.consultarDirecciones.antes.guardar");
      this.unSelectedTipoDir = true;
      this.showMessageTipos(msg);
    } else if (this.tiposChangeUnSelected.length > 1) {
      msg = this.translateService.instant("message.consultarDirecciones.necesario.disponer.tipoDireccion");

      for (const key in this.tiposChangeUnSelected) {
        let x = key;
        if (+x + 1 == +this.tiposChangeUnSelected.length) {
          msg += " y " + this.tiposChangeUnSelected[key].label;
        } else if (+x == +this.tiposChangeUnSelected.length - 2) {
          msg += this.tiposChangeUnSelected[key].label + " ";
        } else {
          msg += this.tiposChangeUnSelected[key].label + ", ";
        }
      }

      msg += this.translateService.instant("message.consultarDirecciones.antes.guardar");
      this.unSelectedTipoDir = true;
      this.showMessageTipos(msg);
    } else if (this.tiposChangeSelected.length == 1) {
      msg = this.translateService.instant("message.consultarDirecciones.desea.mover.tipoDireccion") + this.tiposChangeSelected[0].label + this.translateService.instant("message.consultarDirecciones.esta.direccion");
      this.unSelectedTipoDir = false;
      this.showMessageTipos(msg);
    } else {
      msg = this.translateService.instant("message.consultarDirecciones.desea.mover.tipoDireccion.plural");

      for (const key in this.tiposChangeSelected) {
        let x = key;
        if (+x + 1 == +this.tiposChangeSelected.length) {
          msg += " y " + this.tiposChangeSelected[key].label;
        } else if (+x == +this.tiposChangeSelected.length - 2) {
          msg += this.tiposChangeSelected[key].label + " ";
        } else {
          msg += this.tiposChangeSelected[key].label + ", ";
        }
      }

      msg += this.translateService.instant("message.consultarDirecciones.esta.direccion");
      this.unSelectedTipoDir = false;
      this.showMessageTipos(msg);
    }
  }

  showMessageTipos(msg) {
    let icon = "fa fa-edit";
    // this.tiposDirSelected = [];

    if (this.unSelectedTipoDir) {
      // this.body.idTipoDireccion = JSON.parse(JSON.stringify(this.checkBody)).idTipoDireccion;
      this.showInfo(msg);
    } else {

      this.confirmationService.confirm({
        message: msg,
        icon: icon,
        accept: () => {

          if (this.validateCamposObligatorios()) {
            this.serviceSaveDirection();
          }
        },
        reject: () => {
          // this.body.idTipoDireccion = JSON.parse(JSON.stringify(this.checkBody)).idTipoDireccion;
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
  }

  serviceSaveDirection() {
    this.progressSpinner = true;
    this.resaltadoDatos=false;

    // modo edicion
    if (this.registroEditable) {
      this.comprobarTablaDatosContactos();
      this.comprobarCheckProvincia();
      this.body.esColegiado = JSON.parse(
        sessionStorage.getItem("esColegiado")
      );

      let usuario = JSON.parse(
        sessionStorage.getItem("usuarioBody")
      );

      if (usuario.length == 1) {
        this.body.idPersona = usuario[0].idPersona;
      } else {
        this.body.idPersona = usuario;
      }

      this.body.idProvincia = this.provinciaSelecionada;
      this.sigaServices.post("direcciones_update", this.body).subscribe(
        data => {
          this.progressSpinner = false;
          this.body = JSON.parse(data["body"]);
          //this.showSuccessAddress();
        },
        error => {
          this.bodySearch = JSON.parse(error["error"]);
          if (this.bodySearch.error.message != null &&
            this.bodySearch.error.message != undefined) {
            this.showFail(this.bodySearch.error.message.toString());
          } else {
            this.showGenericFail();
          }
          console.log(error);
          this.progressSpinner = false;
        },
        () => {
          this.backTo();
        }
      );
    }
    // modo creacion
    else {
      this.comprobarTablaDatosContactos();
      this.comprobarCheckProvincia();
      this.body.idProvincia = this.provinciaSelecionada;
      this.body.esColegiado = JSON.parse(
        sessionStorage.getItem("esColegiado")
      );
      let usuario = JSON.parse(
        sessionStorage.getItem("usuarioBody")
      );
      if (usuario.length == 1) {
        this.body.idPersona = usuario[0].idPersona;
      } else {
        this.body.idPersona = usuario;
      }
      this.body.motivo = "registro creado";
      this.sigaServices.post("direcciones_insert", this.body).subscribe(
        data => {
          this.progressSpinner = false;
          this.body = JSON.parse(data["body"]);
          this.backTo();
        },
        error => {
          this.bodySearch = JSON.parse(error["error"]);
          if (this.bodySearch.error.message != null && this.bodySearch.error.message != undefined) {
            this.showFail(this.bodySearch.error.message.toString());
          } else {
            this.showGenericFail();
          }
          console.log(error);
          this.progressSpinner = false;
        },
        () => {
          // auditoria
          this.body.motivo = undefined;
          this.progressSpinner = false;
        }
      );
    }
  }

  duplicarRegistro() {
    let tipoDireccion = [];
    this.body.idTipoDireccion = [];
    this.body.idDireccion = null;
    this.nuevo = true;
    this.progressSpinner = true;
    this.comprobarTablaDatosContactos();
    this.comprobarCheckProvincia();
    this.body.esColegiado = JSON.parse(sessionStorage.getItem("esColegiado"));
    let usuario = JSON.parse(sessionStorage.getItem("usuarioBody"));
    this.body.idPersona = usuario[0].idPersona;
    this.sigaServices.post("direcciones_duplicate", this.body).subscribe(
      data => {
        this.body.idDireccion = JSON.parse(data["body"]).id;
        this.checkBody = JSON.parse(JSON.stringify(this.body));
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
      this.codigoPostalValido = true;
    } else {
      this.body.idProvincia = "";
    }
  }

  comprobarTablaDatosContactos() {
    if (
      this.datosContacto != null ||
      this.datosContacto != undefined
    ) {
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

  }

  guardarLetrado() {
    this.progressSpinner = true;
    this.resaltadoDatos=false;

    // modo edicion
    this.comprobarTablaDatosContactos();
    this.comprobarCheckProvincia();
    this.body.esColegiado = JSON.parse(sessionStorage.getItem("esColegiado"));
    this.body.idPersona = JSON.parse(sessionStorage.getItem("usuarioBody"))[0].idPersona;
    this.body.idProvincia = this.provinciaSelecionada;
    this.sigaServices
      .post("fichaDatosDirecciones_solicitudCreate", this.body)
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.body = JSON.parse(data["body"]);
          let err = JSON.parse(data["body"]);
          this.displayAuditoria = false;
          if (err.error.description != "") {
            sessionStorage.setItem("solimodifMensaje", err.error.description);
          }
          this.backTo();
        },
        error => {
          this.bodySearch = JSON.parse(error["error"]);
          this.showGenericFail();
          console.log(error);
          this.progressSpinner = false;
          this.displayAuditoria = false;
        }
      );
  }

  igualInicio() {
    if (JSON.stringify(this.body) == JSON.stringify(this.checkBody)) {
      return true;
    } else {
      return false;
    }
  }

  tipoDireccionDisable() {
    if (this.historyDisable) {
      return true;
    } else {
      if (this.isLetrado) {
        return true;
      } else {
        return false;
      }
    }
  }

  desactivaDuplicar() {
    if (this.historyDisable) {
      return true;
    } else {
      if (
       // this.codigoPostalValido && 
        !this.isLetrado) {
        return false;
      } else {
        return true;
      }
    }
  }

  desactivaGuardar() {
    this.validarCodigoPostal();
    this.comprobarTablaDatosContactos();
    if (this.historyDisable) {
      return true;
    } else {
      if (
        (this.codigoPostalValido || this.poblacionExtranjera) &&
        (this.body.idTipoDireccion != undefined || this.isLetrado) &&
        !this.igualInicio() && this.emailValido && this.tlfValido && this.mvlValido
        && this.faxValido && this.webValido
      ) {
        if (this.body.idTipoDireccion.length > 0) {
          if (this.body.poblacionExtranjera == undefined && this.body.poblacionExtranjera == null && this.poblacionExtranjera) {
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      } else {
        return true;
      }
    }
  }

  onChangeTipoDireccion(event) {

    let idFind = this.tiposDirSelected.findIndex(tipoDir => tipoDir == event.itemValue);

    if (idFind == -1) {
      this.tiposDirSelected.push(event.itemValue);
    }
  }

  showGenericFail() {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: this.translateService.instant("general.message.incorrect"),
      detail: this.translateService.instant(
        "general.message.error.realiza.accion"
      )
    });
  }

  styleObligatorio(evento){
    if(//this.resaltadoDatos && 
      (evento==undefined || evento==null || evento=="")){
      return this.commonsService.styleObligatorio(evento);
    }
  }

  muestraCamposObligatorios(){
    this.msgs = [{severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios')}];
    this.resaltadoDatos=true;
  }

  checkDatos(){
    if(!this.isLetrado){
      if(!this.desactivaGuardar()){
        this.comprobarAuditoria('noletrado');
      }else{
        if((this.body.codigoPostal==undefined || this.body.codigoPostal==null || this.body.codigoPostal==="") ||
        ((this.body.poblacionExtranjera==undefined || this.body.poblacionExtranjera==null || this.body.poblacionExtranjera==="") && this.poblacionExtranjera) ||
        (this.body.idTipoDireccion==undefined || this.body.idTipoDireccion==null || this.body.idTipoDireccion.length==0)){
          this.muestraCamposObligatorios();
        }else{
          if (!this.codigoPostalValido && this.body.idPais == "191") {
            this.showFail("El código postal debe tener 5 dígitos");
            return false;
          } else {
            this.comprobarAuditoria('noletrado');
          }
        }
      }
    }
    
    if(this.isLetrado){
      if(!this.desactivaGuardar()){
        this.comprobarAuditoria('letrado');
      }else{
        if((this.body.codigoPostal==undefined || this.body.codigoPostal==null || this.body.codigoPostal==="") ||
        ((this.body.poblacionExtranjera==undefined || this.body.poblacionExtranjera==null || this.body.poblacionExtranjera==="") && this.poblacionExtranjera) || 
        (this.body.idTipoDireccion==undefined || this.body.idTipoDireccion==null)){
          this.muestraCamposObligatorios();
        }else{
          if (!this.codigoPostalValido && this.body.idPais == "191") {
            this.showFail("El código postal debe tener 5 dígitos");
          } else {
            this.comprobarAuditoria('letrado');
          }
        }
      }
    }
  }

  comprobarAuditoria(tipoCambio) {
    // modo edicion

    if (this.isLetrado) {
      this.tipoCambioAuditoria = tipoCambio;

      if (!this.ocultarMotivo) {
        this.displayAuditoria = true;
      } else {
        this.guardarLetrado();
      }
    } else {
      if (this.registroEditable) {
        // mostrar la auditoria depende de un parámetro que varía según la institución
        this.body.motivo = undefined;
        if (this.ocultarMotivo) {
          if (tipoCambio == 'noletrado') {
            this.guardar();
          } else if (tipoCambio == 'letrado') {
            this.guardarLetrado();
          }
        } else {
          this.tipoCambioAuditoria = tipoCambio;
          this.displayAuditoria = true;
          this.showGuardarAuditoria = false;
        }
      }
      // modo creacion
      else {
        if (tipoCambio == 'noletrado') {
          this.guardar();
        } else if (tipoCambio == 'letrado') {
          this.guardarLetrado();
        }
      }
    }
  }

  cerrarAuditoria() {
    this.displayAuditoria = false;
  }

  comprobarCampoMotivo() {
    if (
      this.body.motivo != undefined &&
      this.body.motivo != "" &&
      this.body.motivo.trim() != ""
    ) {
      this.showGuardarAuditoria = true;
    } else {
      this.showGuardarAuditoria = false;
    }
  }

  generarTabla() {
    this.datosContacto = [
      {
        tipo: "Telefono",
        valor: this.body.telefono,
        longitud: 20
      },
      {
        tipo: "Fax",
        valor: this.body.fax,
        longitud: 20
      },
      {
        tipo: "Móvil",
        valor: this.body.movil,
        longitud: 20
      },
      {
        tipo: "Correo-Electrónico",
        valor: this.body.correoElectronico,
        longitud: 100
      },
      {
        tipo: "Página Web",
        valor: this.body.paginaWeb,
        longitud: 100
      }
    ];
  }

  restablecer() {

    this.emailValido = true;
    this.faxValido = true;
    this.mvlValido = true;
    this.tlfValido = true;
    this.webValido = true;
    this.resaltadoDatos=false;

    this.body.idPersona = this.usuarioBody[0].idPersona;
    this.body = JSON.parse(JSON.stringify(this.checkBody));
    if (this.body.idPais != "191") {
      this.poblacionExtranjera = true;
      this.provinciaSelecionada = undefined;
    } else {
      this.provinciaSelecionada = this.body.idProvincia;
      this.poblacionExtranjera = false;
      this.comboPoblacion = [];
      this.comboPoblacion.push({
        label: this.body.nombrePoblacion,
        value: this.body.idPoblacion
      });
    }

    this.generarTabla();
    this.onChangeCodigoPostal();
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

  showSuccessAddress() {
    this.msgs = [];
    this.msgs.push({
      severity: "success",
      summary: this.translateService.instant("general.message.correct"),
      detail: this.translateService.instant("general.message.accion.realizada")
    });
  }

  showInfo(mensaje: string) {
    this.displayAuditoria = false;
    this.msgs = [];
    this.msgs.push({ severity: "error", summary: this.translateService.instant("general.message.incorrect"), detail: mensaje });
  }

  backTo() {
    sessionStorage.removeItem("direccion");
    this.location.back();
  }

  buscarPoblacion(e) {
    if (e.target.value && e.target.value !== null) {
      if (e.target.value.length >= 3) {
        this.getComboPoblacion(e.target.value);

        this.resultadosPoblaciones = this.translateService.instant("censo.busquedaClientesAvanzada.literal.sinResultados");
      } else {
        this.comboPoblacion = [];
        this.resultadosPoblaciones = this.translateService.instant("censo.consultarDirecciones.mensaje.introducir.almenosTres");
      }
    } else {
      this.comboPoblacion = [];
      this.resultadosPoblaciones = this.translateService.instant("censo.busquedaClientesAvanzada.literal.sinResultados");
    }
  }

  ngOnDestroy() {
    //sessionStorage.removeItem("historicoDir");
  }
  clear() {
    this.msgs = [];
  }

  guardarAuditoria() {

    if (this.tipoCambioAuditoria == 'noletrado') {
      this.guardar();
    } else if (this.tipoCambioAuditoria == 'letrado') {
      this.guardarLetrado();
    }

  }

  openOutlook(dato) {
    let correo = dato.valor;
    let EMAIL_REGEX = /^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/;
    if (correo != undefined && correo != "" && EMAIL_REGEX.test(correo)) {
      let href = "mailto:" + correo;
      window.open(href, "_blank");
    }

  }

  changeEmail(value) {
    this.emailValido = this.commonsService.validateEmail(value.valor);
  }

  changeWeb(value) {
    this.webValido = this.commonsService.validateWeb(value.valor);
  }

  changeTelefono(value) {
    this.tlfValido = this.commonsService.validateTelefono(value.valor);
  }

  changeMovil(value) {
    this.mvlValido = this.commonsService.validateMovil(value.valor);
  }

  changeFax(value) {
    this.faxValido = this.commonsService.validateFax(value.valor);
  }


  editEmail() {
    if (this.edicionEmail)
      this.edicionEmail = false;
    else this.edicionEmail = true;
  }

  focusInputField() {
    setTimeout(() => {
      this.someDropdown.filterInputChild.nativeElement.focus();  
    }, 300);
  }
}
