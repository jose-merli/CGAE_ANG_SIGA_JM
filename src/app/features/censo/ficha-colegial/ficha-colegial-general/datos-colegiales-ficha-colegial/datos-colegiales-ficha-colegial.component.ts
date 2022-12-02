import { Component, OnInit, ChangeDetectorRef, Input, ViewChild, OnChanges, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { SigaServices } from '../../../../../_services/siga.service';
import { ConfirmationService, Message } from "primeng/components/common/api";
import { AuthenticationService } from '../../../../../_services/authentication.service';
import { TranslateService } from '../../../../../commons/translate/translation.service';
// import { DomSanitizer } from '@angular/platform-browser/src/platform-browser';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { cardService } from "./../../../../../_services/cardSearch.service";
import { Location } from "@angular/common";
import { ControlAccesoDto } from '../../../../../models/ControlAccesoDto';
import { FichaColegialColegialesItem } from '../../../../../models/FichaColegialColegialesItem';
import { esCalendar, catCalendar, euCalendar, glCalendar } from '../../../../../utils/calendar';
import { AutoComplete, Dialog, Calendar, DataTable } from 'primeng/primeng';
import { SolicitudIncorporacionItem } from '../../../../../models/SolicitudIncorporacionItem';
import { FichaColegialColegialesObject } from '../../../../../models/FichaColegialColegialesObject';
import { FichaColegialGeneralesItem } from '../../../../../models/FichaColegialGeneralesItem';
import { DatosDireccionesItem } from '../../../../../models/DatosDireccionesItem';
import { DatosDireccionesObject } from '../../../../../models/DatosDireccionesObject';
import { ComboEtiquetasItem } from '../../../../../models/ComboEtiquetasItem';
import * as moment from 'moment';
import { CommonsService } from '../../../../../_services/commons.service';

@Component({
  selector: 'app-datos-colegiales-ficha-colegial',
  templateUrl: './datos-colegiales-ficha-colegial.component.html',
  styleUrls: ['./datos-colegiales-ficha-colegial.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DatosColegialesFichaColegialComponent implements OnInit, OnChanges {
  tarjetaColegialesNum: string;
  activateNumColegiado: boolean = false;
  @Input() esColegiado: boolean = null;
  @Input() tarjetaColegiales;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  resaltadoDatosColegiales: boolean = false;

  colegialesBody: FichaColegialColegialesItem = new FichaColegialColegialesItem();
  openFicha: boolean = false;
  checkColegialesBody: FichaColegialColegialesItem = new FichaColegialColegialesItem();
  nuevoEstadoColegial: FichaColegialColegialesItem = new FichaColegialColegialesItem();
  solicitudEditar: SolicitudIncorporacionItem = new SolicitudIncorporacionItem();
  datePipeIncorporacion: boolean = false;
  datePipePresentacion: boolean = false;
  datePipeFechaJura: boolean = false;
  datePipeFechaTitulacion: boolean = false;
  fechaNacCambiada: boolean = false;
  yearRange: string;
  es: any = esCalendar;
  bodyDirecciones: DatosDireccionesItem;
  generalIdiomas: any[] = [];
  tieneTurnosGuardias: boolean = false;
  datosColegiales: any[] = [];
  activarGuardarColegiales: boolean = false;
  checkDatosColegiales: any[] = [];
  comboTipoSeguro: any[] = [];
  colegialesObject: FichaColegialColegialesObject = new FichaColegialColegialesObject();
  datosColegialesActual: any[] = [];
  datosColegialesInit: any[] = [];
  residente: String;
  selectAll: boolean = false;
  DescripcionDatosDireccion;
  etiquetasPersonaJuridicaSelecionados: ComboEtiquetasItem[] = [];
  updateItems: Map<String, ComboEtiquetasItem> = new Map<
    String,
    ComboEtiquetasItem
  >();
  createItems: Array<ComboEtiquetasItem> = new Array<ComboEtiquetasItem>();
  ocultarMotivo: boolean = undefined;

  colsColegiales;
  disabledToday: boolean = false;
  selectedItemColegiales: number = 10;
  filaEditable: boolean = false;
  selectedDatosColegiales;
  showMessageInscripcion;
  maxNumColegiado: string;
  fichasPosibles = [
    {
      key: "colegiales",
      activa: false
    },
  ];
  selectMultipleDirecciones: boolean = false;
  searchDireccionIdPersona = new DatosDireccionesObject();
  etiquetasPersonaJuridica: any[] = [];
  selectedItemDelete;

  displayDelete: boolean;
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
  idPersona;
  tipoIdentificacion: any[] = [];
  isColegiadoEjerciente: boolean = false;
  showGuardarAuditoria: boolean = false;
  @ViewChild("dialog")
  dialog: Dialog;
  displayAuditoria: boolean = false;
  numSelectedColegiales: number = 0;
  inscritoChange: boolean = false;
  activacionTarjeta: boolean = false;
  desactivarVolver: boolean = true;
  emptyLoadFichaColegial: boolean = false;
  activacionEditar: boolean = true;
  esNewColegiado: boolean = false;
  isCrearColegial: boolean = false;
  inscritoSeleccionado: String = "00";
  inscritoDisabled: boolean = false;
  isRestablecer: boolean = false;
  isEliminarEstadoColegial: boolean = false;
  inscrito: string;
  fechaMinimaEstadoColegial: Date;
  situacionPersona: String;
  fechaMinimaEstadoColegialMod: Date;
  rowsPerPage;
  progressSpinner: boolean = false;
  comboSituacion: any[] = [];
  information: boolean = false;
  icon: string;
  msgDir = "";
  generalEstadoCivil: any[] = [];

  comboSexo = [
    { label: "Hombre", value: "H" },
    { label: "Mujer", value: "M" }
  ];

  comboInscrito = [
    { label: "No", value: "0" },
    { label: "Si", value: "1" }
  ];

  comboResidente = [
    { label: "No", value: "0" },
    { label: "Si", value: "1" }
  ];

  datosDirecciones: DatosDireccionesItem[] = [];
  selectedDatosDirecciones;
  mostrarDatosDireccion: boolean = false;
  msgs: Message[];
  disableNumColegiado: boolean = true;
  checkGeneralBody: FichaColegialGeneralesItem = new FichaColegialGeneralesItem();
  generalBody: FichaColegialGeneralesItem = new FichaColegialGeneralesItem();
  generalTratamiento: any[] = [];
  tratamientoDesc: String;
  tipoCambioAuditoria: String;
  permisos: boolean = true;
  isLetrado: boolean;
  arrayAvisosColegios: any[] = [];

  @ViewChild("calendarFechaIncorporacion") calendarFechaIncorporacion: Calendar;
  fechaIncorporacionSelected: boolean = true;
  @ViewChild("calendarFechaPresentacion") calendarFechaPresentacion: Calendar;
  fechaPresentacionSelected: boolean = true;
  @ViewChild("calendarFechaJura") calendarFechaJura: Calendar;
  fechaJuraSelected: boolean = true;
  @ViewChild("calendarFechaTitulacion") calendarFechaTitulacion: Calendar;
  fechaTitulacionSelected: boolean = true;
  @ViewChild("tableColegiales")
  tableColegiales: DataTable;
  @Input() openColegia;

  @Input() datosTratamientos;


  constructor(private sigaServices: SigaServices,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private commonService: CommonsService, ) { }

  ngOnInit() {
    this.resaltadoDatosColegiales =true;
    if (
      sessionStorage.getItem("personaBody") != null &&
      sessionStorage.getItem("personaBody") != undefined &&
      JSON.parse(sessionStorage.getItem("esNuevoNoColegiado")) != true
    ) {
      this.generalBody = new FichaColegialGeneralesItem();
      this.generalBody = JSON.parse(sessionStorage.getItem("personaBody"));
      this.checkGeneralBody = new FichaColegialGeneralesItem();
      this.checkGeneralBody = JSON.parse(sessionStorage.getItem("personaBody"));
      this.colegialesBody = JSON.parse(sessionStorage.getItem("personaBody"));
      if (this.colegialesBody.situacionResidente == "0") this.colegialesBody.situacionResidente = "No";
      if (this.colegialesBody.situacionResidente == "1") this.colegialesBody.situacionResidente = "Si";

      this.getCols();


      this.tipoCambioAuditoria = null;
      // this.checkAcceso();
      this.onInitGenerales();

      this.checkColegialesBody = JSON.parse(JSON.stringify(this.colegialesBody));
      this.idPersona = this.generalBody.idPersona;

      this.onInitColegiales();
      this.getYearRange();
      this.getLenguage();
    } 
    if (JSON.parse(sessionStorage.getItem("esNuevoNoColegiado"))) {
      this.esNewColegiado = true;
      this.activacionEditar = false;
      this.emptyLoadFichaColegial = false;
      this.desactivarVolver = false;
      this.activacionTarjeta = false;

      // sessionStorage.removeItem("esNuevoNoColegiado");
      this.onInitGenerales();
    } else {
      this.activacionEditar = true;
      this.esNewColegiado = false;
      this.activacionTarjeta = true;
    }

    let parametro = {
      valor: "OCULTAR_MOTIVO_MODIFICACION"
    };
    // Esto preguntarselo a Fredi
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

       if (!this.esNewColegiado && this.generalBody.idPersona != null && this.generalBody.idPersona != undefined) {
        this.onInitDirecciones(); // Direcciones
      } 
    if((this.colegialesBody.numColegiado == null || this.colegialesBody.numColegiado == undefined || this.colegialesBody.numColegiado === "") ||
    (this.colegialesBody.incorporacion == null || this.colegialesBody.incorporacion == undefined) ||
    (this.colegialesBody.fechapresentacion == null || this.colegialesBody.fechapresentacion == undefined)){
      this.resaltadoDatosColegiales=true;
        this.abreCierraFicha('colegiales');
      }
  }

  ngOnChanges() {
    if (this.esColegiado != null) {
      if (this.esColegiado) {
        if (this.colegialesBody.situacion == "20") {
          this.isColegiadoEjerciente = true;
        } else {
          this.isColegiadoEjerciente = false;
        }
      }

      let migaPan = "";

      if (this.esColegiado) {
        migaPan = this.translateService.instant("menu.censo.fichaColegial");
      } else {
        migaPan = this.translateService.instant("menu.censo.fichaNoColegial");
      }

      sessionStorage.setItem("migaPan", migaPan);

      this.generalBody.colegiado = this.esColegiado;
      this.checkGeneralBody.colegiado = this.esColegiado;
    }
    if(this.tarjetaColegiales == "3" || this.tarjetaColegiales == "2"){
      
      if (
        sessionStorage.getItem("personaBody") != null &&
        sessionStorage.getItem("personaBody") != undefined &&
        JSON.parse(sessionStorage.getItem("esNuevoNoColegiado")) != true
      ) {
        this.generalBody = new FichaColegialGeneralesItem();
        this.generalBody = JSON.parse(sessionStorage.getItem("personaBody"));
        this.checkGeneralBody = new FichaColegialGeneralesItem();
        this.checkGeneralBody = JSON.parse(sessionStorage.getItem("personaBody"));
        this.colegialesBody = JSON.parse(sessionStorage.getItem("personaBody"));
        if (this.colegialesBody.situacionResidente == "0") this.colegialesBody.situacionResidente = "No";
        if (this.colegialesBody.situacionResidente == "1") this.colegialesBody.situacionResidente = "Si";
        this.residente = this.colegialesBody.situacionResidente;

        this.getCols();


        this.tipoCambioAuditoria = null;
        this.checkAcceso();
        this.onInitGenerales();

        this.checkColegialesBody = JSON.parse(JSON.stringify(this.colegialesBody));
        this.idPersona = this.generalBody.idPersona;

        this.getYearRange();
        this.getLenguage();
      }
      this.onInitColegiales();
      if (!this.esNewColegiado && this.generalBody.idPersona != null && this.generalBody.idPersona != undefined) {
        this.onInitDirecciones(); // Direcciones
      }

      if(this.tarjetaColegiales == "3"){
        this.permisos = true;
      }else{
        this.permisos = false;
      }
      this.getLetrado();

    }

    if (this.openColegia == true) {
      if (this.openFicha == false) {
        this.abreCierraFicha('colegiales')
      }
    }
  }


  onInitGenerales() {
    // this.activacionGuardarGenerales();
    this.etiquetasPersonaJuridicaSelecionados = this.generalBody.etiquetas;
    // this.checkGeneralBody.etiquetas = JSON.parse(JSON.stringify(this.generalBody.etiquetas));
    // if (!this.esNewColegiado) {
    //   this.obtenerEtiquetasPersonaJuridicaConcreta();
    //   this.getTopicsCourse();
    //   this.cargarImagen(this.idPersona);
    //   this.stringAComisiones();
    //   this.fechaNacimiento = this.generalBody.fechaNacimiento;
    //   this.fechaAlta = this.generalBody.fechaAlta;
    // }
    this.sigaServices.get("fichaPersona_tipoIdentificacionCombo").subscribe(
      n => {
        this.tipoIdentificacion = n.combooItems;
        // 0: {label: "CIF", value: "20"}
        // 1: {label: "NIE", value: "40"}
        // 2: {label: "NIF", value: "10"}
        // 3: {label: "Otro", value: "50"}
        // 4: {label: "Pasaporte", value: "30"}
        this.tipoIdentificacion[4].label =
          this.tipoIdentificacion[4].label +
          " / " +
          this.tipoIdentificacion[3].label;
      },
      err => {
        console.log(err);
      }
    );

    this.generalTratamiento = this.datosTratamientos;
    let tratamiento = this.generalTratamiento.find(
      item => item.value === this.generalBody.idTratamiento
    );
    if (tratamiento != undefined && tratamiento.label != undefined) {
      this.tratamientoDesc = tratamiento.label;
    }

    this.sigaServices.get("fichaColegialGenerales_estadoCivil").subscribe(
      n => {
        this.generalEstadoCivil = n.combooItems;
        this.arregloTildesCombo(this.generalEstadoCivil);
      },
      err => {
        console.log(err);
      }
    );

    this.sigaServices.get("etiquetas_lenguaje").subscribe(
      n => {
        this.generalIdiomas = n.combooItems;
        this.arregloTildesCombo(this.generalIdiomas);

      },
      err => {
        console.log(err);
      }
    );

    this.sigaServices.get("busquedaColegiados_situacion").subscribe(
      n => {
        this.comboSituacion = n.combooItems;
        this.arregloTildesCombo(this.comboSituacion);
        
        this.cambioEstadoResumen();
      },
      err => {
        console.log(err);
      }
    );

  }
  esFichaActiva(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    return fichaPosible.activa;
  }

  getFichaPosibleByKey(key): any {
    let fichaPosible = this.fichasPosibles.filter(elto => {
      return elto.key === key;
    });
    if (fichaPosible && fichaPosible.length) {
      return fichaPosible[0];
    }
    return {};
  }
  asignarPermisosTarjetas() {
    this.tarjetaColegiales = this.tarjetaColegialesNum;
  }

  abreCierraFicha(key) {
    if(!this.openFicha){
      this.resaltadoDatosColegiales=true;
    }
    let fichaPosible = this.getFichaPosibleByKey(key);

    if (
      key == "generales" &&
      !this.activacionTarjeta &&
      !this.emptyLoadFichaColegial
    ) {
      fichaPosible.activa = !fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    if (this.activacionTarjeta) {
      fichaPosible.activa = !fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    this.opened.emit(this.openFicha);
    this.idOpened.emit(key);
  }
  pasarFechas() {

    this.colegialesBody.incorporacionDate = this.arreglarFecha(
      this.colegialesBody.incorporacion
    );
    this.colegialesBody.fechapresentacionDate = this.arreglarFecha(
      this.colegialesBody.fechapresentacion
    );
    this.colegialesBody.fechaTitulacionDate = this.arreglarFecha(
      this.colegialesBody.fechaTitulacion
    );
    this.colegialesBody.fechaJuraDate = this.arreglarFecha(
      this.colegialesBody.fechaJura
    );

    // Tabla de colegiales
    if (this.isCrearColegial == true) {
      this.nuevoEstadoColegial.fechaEstado = this.arreglarFecha(
        this.nuevoEstadoColegial.fechaEstadoStr
      );
    }
  }
  arreglarFecha(fecha) {

    if (fecha != undefined && fecha != null) {
      let jsonDate = JSON.stringify(fecha);
      let rawDate = jsonDate.slice(1, -1);
      if (rawDate.length < 14) {
        let splitDate = rawDate.split("/");
        let arrayDate = splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0];
        fecha = new Date((arrayDate += "T00:00:00.001Z"));
      } else {
        fecha = new Date(rawDate);
      }
    }
    return fecha;
  }
  getLenguage() {
    this.sigaServices.get("usuario").subscribe(response => {
      let currentLang = response.usuarioItem[0].idLenguaje;

      switch (currentLang) {
        case "1":
          this.es = esCalendar;
          break;
        case "2":
          this.es = catCalendar;
          break;
        case "3":
          this.es = euCalendar;
          break;
        case "4":
          this.es = glCalendar;
          break;
        default:
          this.es = esCalendar;
          break;
      }
    });
  }
  getYearRange() {
    let today = new Date();
    let year = today.getFullYear();
    this.yearRange = (year - 80) + ":" + (year + 20);
  }
  activarPaginacionColegial() {
    if (!this.datosColegiales || this.datosColegiales.length == 0) return false;
    else return true;
  }

  inscritoAItem() {
    if (this.inscritoSeleccionado == "1") {
      this.solicitudEditar.idTipoColegiacion = "20";
      this.colegialesBody.comunitario = "1";
    } else {
      this.solicitudEditar.idTipoColegiacion = "10";
      this.colegialesBody.comunitario = "0";
    }
  }

  itemAInscrito() {
    if (this.colegialesBody.situacionResidente != undefined && this.colegialesBody.comunitario != undefined) {
      this.inscritoSeleccionado = this.colegialesBody.comunitario.toString();
    }

    if (this.colegialesBody.comunitario == "0") {
      this.inscritoDisabled = true;
    } else {
      this.inscritoDisabled = false;
    }
  }

  activarRestablecerColegiales() {
    if (
      JSON.stringify(this.checkColegialesBody) !=
      JSON.stringify(this.colegialesBody) || this.isCrearColegial == true || this.isRestablecer == true
    ) {
      this.isRestablecer = true;
      return true;
    } else {
      this.isRestablecer = false;
      return false;
    }
  }

  mostrarFechas() {
    if (JSON.stringify(this.colegialesBody.incorporacion) != undefined &&
      JSON.stringify(this.colegialesBody.incorporacion) != null && JSON.stringify(this.colegialesBody.incorporacion).length > 13) {
      this.datePipeIncorporacion = true;
    } else {
      this.datePipeIncorporacion = false;
    }
    if (JSON.stringify(this.colegialesBody.fechapresentacion) != undefined &&
      JSON.stringify(this.colegialesBody.fechapresentacion) != null && JSON.stringify(this.colegialesBody.fechapresentacion).length > 13) {
      this.datePipePresentacion = true;
    } else {
      this.datePipePresentacion = false;
    }
    if (JSON.stringify(this.colegialesBody.fechaJura) != undefined &&
      JSON.stringify(this.colegialesBody.fechaJura) != null && JSON.stringify(this.colegialesBody.fechaJura).length > 13) {
      this.datePipeFechaJura = true;
    } else {
      this.datePipeFechaJura = false;
    }
    if (JSON.stringify(this.colegialesBody.fechaTitulacion) != undefined &&
      JSON.stringify(this.colegialesBody.fechaTitulacion) != null && JSON.stringify(this.colegialesBody.fechaTitulacion).length > 13) {
      this.datePipeFechaTitulacion = true;
    } else {
      this.datePipeFechaTitulacion = false;
    }
  }

  activacionGuardarColegiales() {
    if (this.colegialesBody.situacionResidente == undefined && this.datosColegiales[0].situacionResidente != undefined)
      this.colegialesBody.situacionResidente = this.datosColegiales[0].situacionResidente
    this.inscritoAItem();
    this.mostrarFechas();
    if (
      JSON.stringify(this.checkColegialesBody) !=
      JSON.stringify(this.colegialesBody) &&
      this.colegialesBody.numColegiado != "" &&
      this.colegialesBody.situacionResidente != "" &&
      this.colegialesBody.situacionResidente != undefined &&
      this.colegialesBody.situacionResidente != "0" &&
      this.datosColegiales[0].idEstado != "" &&
      this.datosColegiales[0].idEstado != null &&
      this.colegialesBody.residenteInscrito != "" &&
      this.colegialesBody.incorporacion != null &&
      this.datosColegiales[0].fechaEstadoStr != null &&
      this.colegialesBody.fechapresentacion != null) {
        
      if (this.isCrearColegial == false) {
        this.activarGuardarColegiales = true;
      } else {
        if (this.nuevoEstadoColegial.situacion != "" && this.nuevoEstadoColegial.situacion != undefined &&
          this.nuevoEstadoColegial.situacionResidente != "" && this.nuevoEstadoColegial.situacionResidente != undefined &&
          this.nuevoEstadoColegial.fechaEstadoStr != "" && this.nuevoEstadoColegial.fechaEstadoStr != undefined) {

          this.activarGuardarColegiales = true;

        } else {
          if (JSON.stringify(this.datosColegiales) != JSON.stringify(this.checkDatosColegiales)) {
            this.activarGuardarColegiales = true;
          } else {
            this.activarGuardarColegiales = false;
          }
        }
      }
    } else {
      this.resaltadoDatosColegiales = true;
      if (this.isCrearColegial == false) {
        let colegialesSinEditar = JSON.parse(JSON.stringify(this.datosColegiales));
        colegialesSinEditar.forEach(element => {
          element.habilitarObs = false;
        });
        if (JSON.stringify(colegialesSinEditar) != JSON.stringify(this.checkDatosColegiales) && this.datosColegiales[0].fechaEstadoStr != null && this.datosColegiales[0].idEstado != "" && this.datosColegiales[0].idEstado != null && this.colegialesBody.situacionResidente != "0" &&
          this.colegialesBody.situacionResidente != undefined && this.colegialesBody.situacionResidente != "") {
          this.activarGuardarColegiales = true;
        } else {
          this.activarGuardarColegiales = false;
        }
      } else if (this.colegialesBody.numColegiado != "" &&
        this.colegialesBody.situacionResidente != "" &&
        this.colegialesBody.situacionResidente != undefined &&
        this.colegialesBody.situacionResidente != "0" &&
        this.colegialesBody.residenteInscrito != "" &&
        this.colegialesBody.incorporacion != null &&
        this.colegialesBody.fechapresentacion != null &&
        this.colegialesBody.fechaJura != null &&
        this.nuevoEstadoColegial.situacion != "" && this.nuevoEstadoColegial.situacion != undefined &&
        this.nuevoEstadoColegial.situacionResidente != "" && this.nuevoEstadoColegial.situacionResidente != undefined &&
        this.nuevoEstadoColegial.fechaEstadoStr != "" && this.nuevoEstadoColegial.fechaEstadoStr != undefined) {

        this.activarGuardarColegiales = true;

      } else {
        if (JSON.stringify(this.datosColegiales) != JSON.stringify(this.checkDatosColegiales) &&
          this.nuevoEstadoColegial.situacion != "" && this.nuevoEstadoColegial.situacion != undefined &&
          this.nuevoEstadoColegial.situacionResidente != "" && this.nuevoEstadoColegial.situacionResidente != undefined &&
          this.nuevoEstadoColegial.fechaEstadoStr != "" && this.nuevoEstadoColegial.fechaEstadoStr != undefined) {

          this.activarGuardarColegiales = true;
        } else {
          this.activarGuardarColegiales = false;
        }
      }
    }
  }
  onBlur(event) {
    event.currentTarget.value = "";
  }
  onInitColegiales() {
    this.itemAInscrito();
    this.sigaServices.get("fichaDatosColegiales_tipoSeguro").subscribe(
      n => {
        this.comboTipoSeguro = n.combooItems;
        this.arregloTildesCombo(this.comboTipoSeguro);

      },
      err => {
        console.log(err);
      }
    );
    this.searchColegiales();
    this.getInscritoInit();
    this.getSituacionPersona();
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
  searchColegiales() {
    this.isEliminarEstadoColegial = false;
    // fichaDatosColegiales_datosColegialesSearch
    this.sigaServices
      .postPaginado(
        "fichaDatosColegiales_datosColegialesSearch",
        "?numPagina=1",
        this.generalBody
      )
      .subscribe(
        data => {
          // this.datosColegiales = JSON.parse(data["body"]);
          // this.datosColegiales = this.datosColegiales.colegiadoItem;

          // this.datosColegiales = JSON.parse(data["body"]);
          this.colegialesObject = JSON.parse(data["body"]);
          this.datosColegiales = this.colegialesObject.colegiadoItem;
          sessionStorage.setItem("datosColDir", JSON.stringify(this.datosColegiales));
          this.datosColegiales.forEach(element => {
            if (element.situacionResidente == "0") {
              element.situacionResidente = "No";
            } else if (element.situacionResidente == "1") {
              element.situacionResidente == "Si";
            }
          });
          this.datosColegialesInit = JSON.parse(JSON.stringify(this.datosColegiales));

          if (this.datosColegiales.length > 0) {
            this.fechaMinimaEstadoColegial = this.sumarDia(JSON.parse(this.datosColegiales[0].fechaEstado));

            // Asignamos al primer registro la bandera de modificacion, ya que podremos modificar el último estado
            // Al traer la lista ordenada por fechaEstado desc, tendremos en la primera posición el último estado añadido
            for (let i in this.datosColegiales) {
              if (i == '0') {
                this.datosColegiales[i].isMod = true;
              } else {
                this.datosColegiales[i].isMod = false;
              }

              if (this.datosColegiales[i].situacionResidente == 'Si') {
                this.datosColegiales[i].idSituacionResidente = 1;
              } else {
                this.datosColegiales[i].idSituacionResidente = 0;
              }
            }

            if (this.datosColegiales.length > 1) {
              // Siempre podremos editar todos los campos del último estado insertado
              // Si tenemos mas de 1 estado en la tabla, la fecha minima a la que podemos modificar la fechaEstado del último estado será la del anterior estado
              this.fechaMinimaEstadoColegialMod = this.sumarDia(JSON.parse(this.datosColegiales[1].fechaEstado));
            }

          }

          this.datosColegiales.forEach(element => {
            element.habilitarObs = false;
          });
          this.checkDatosColegiales = JSON.parse(JSON.stringify(this.datosColegiales));
          this.cambioEstadoResumen();
        },
        err => {
          console.log(err);
        }, () => {
          if (this.generalBody.colegiado) {
            this.sigaServices
              .postPaginado(
                "fichaDatosColegiales_datosColegialesSearchActual",
                "?numPagina=1",
                this.generalBody
              )
              .subscribe(
                data => {
                  // this.datosColegiales = JSON.parse(data["body"]);
                  // this.datosColegiales = this.datosColegiales.colegiadoItem;

                  // this.datosColegiales = JSON.parse(data["body"]);
                  this.colegialesObject = JSON.parse(data["body"]);
                  this.datosColegialesActual = this.colegialesObject.colegiadoItem;
                  //this.estadoColegial = this.datosColegialesActual[0].estadoColegial;

                  if (this.datosColegiales[0].situacionResidente == "1" || this.datosColegiales[0].situacionResidente == "Si") {
                    this.residente = "Si";
                  } else {
                    this.residente = "No";
                  }
                }
              );
          }
        }
      );
  }
  getInscritoInit() {
    if (
      this.inscritoSeleccionado == "1"
    ) {
      this.inscrito = "Si";
      this.solicitudEditar.idTipoColegiacion = "20";
    } else {
      this.inscrito = "No";
      this.solicitudEditar.idTipoColegiacion = "10";

    }
  }
  numMutualistaCheck() {
    if (this.colegialesBody.nMutualista != "" && this.colegialesBody.nMutualista != undefined) {
      this.activacionGuardarColegiales();
      if (Number(this.colegialesBody.nMutualista)) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  guardarColegiales() {
    // Meter datos colegiales aquí para guardar y probar.
    //this.progressSpinner = true;
    this.inscritoAItem();
    this.pasarFechas();

    if (this.colegialesBody.numColegiado != this.checkColegialesBody.numColegiado) {
      if (!(this.colegialesBody.numColegiado == this.maxNumColegiado)) {
        this.solicitudEditar.numColegiado = this.colegialesBody.numColegiado;
        this.sigaServices
          .post("solicitudIncorporacion_searchNumColegiado", this.solicitudEditar)
          .subscribe(
            data => {
              let resultado = JSON.parse(data["body"]);
              if (resultado.numColegiado == "disponible") {
                this.comprobarDirecciones();
              } else {
                this.showFailNumColegiado("censo.solicitudIncorporacion.ficha.numColegiadoDuplicado");
                this.progressSpinner = false;
              }

              //this.colegialesBody.estadoColegial = this.comboSituacion.find(item => item.value === this.datosColegiales[0].situacion).label;

              if (this.datosColegiales[0].situacionResidente == "1" || this.datosColegiales[0].situacionResidente == "Si") {
                this.residente = "Si";
              } else {
                this.residente = "No";
              }
            },
            error => {
              let resultado = JSON.parse(error["error"]);
              this.showFailNumColegiado(resultado.error.message.toString());
              this.progressSpinner = false;
            },()=>{
              this.resaltadoDatosColegiales = false;
            }
          );
      } else {
        this.comprobarDirecciones();
      }
    } else {
      this.comprobarDirecciones();
    }
  }

  comprobarDirecciones() {
    //Si es un nuevo estado
    if (this.isCrearColegial == true) {

      this.colegialesBody.situacionResidente = this.nuevoEstadoColegial.situacionResidente;
      this.colegialesBody.fechaEstado = this.arreglarFecha(this.nuevoEstadoColegial.fechaEstadoStr);
      this.colegialesBody.fechaEstadoStr = JSON.stringify(this.nuevoEstadoColegial.fechaEstadoStr);
      this.colegialesBody.estadoColegial = this.comboSituacion.find(item => item.value === this.nuevoEstadoColegial.situacion).label;

      //Si el cambio es a ejerciente
      /*if (this.nuevoEstadoColegial.situacion == "20") {
        //Se comprueba si le falta alguna direccion
        //Si no le falta llamamos al servicio para guardar los cambios
        if (this.comprobarDireccion(true)) {
          this.callServiceGuardarColegiales();
          //Si falta se muestra un mensaje indicando que se creara esa direccion que falta automaticamente
        } else {

          if (!this.information) {
            this.callServiceShowMessageUpdate();
          } else {
            this.progressSpinner = false;
          }
        }
        //Cambio de situación de un ejerciente residente a no residente || --> AVISAR Y PREGUNTAR
      } else*/ 
      
      //Si el cambio pertenece de un colegiado "Ejerciente Residente -> Baja Colegial"
      if (this.datosColegialesInit[0].idEstado == "20" && (this.nuevoEstadoColegial.situacion == "30" || this.nuevoEstadoColegial.situacion == "60")
        && (this.datosColegialesInit[0].situacionResidente == "1" || this.datosColegialesInit[0].situacionResidente == "Si")) {  
        
        // console.log("+++++ [this.isCrearColegial == true] - CAMBIO DE EJERCIENTE RESIDENTE A BAJA COLEGIAL");

        // Que la persona no tenga otra colegiación en vigor como ejerciente no residente
        this.sigaServices
        .post(
          "fichaDatosColegiales_datosColegialesSearchHistor", this.generalBody
        )
        .subscribe(
          data => {

            let matchOtherEjerResi:Boolean = false;
            let colegialesObjectSpec = JSON.parse(data["body"]);
            let datosColegialesActualSpec = colegialesObjectSpec.colegiadoItem;

            datosColegialesActualSpec.forEach(datColActuIte => {
              if (datColActuIte.idEstado == "20"
                && (datColActuIte.situacionResidente == "0" || datColActuIte.situacionResidente == "No")) {
                  matchOtherEjerResi = true;
              }
            });
    
            if (matchOtherEjerResi) {     
              this.callServiceShowMessageAndIconCustomized(this.translateService.instant(
                "fichacolegial.cambiosituacion_ejer_res_bajacolegial.warning"), "fa fa-warning", "cambioSituacionColegiado");
            } else {
              this.callServiceGuardarColegiales();
            }

          });
      } else if (this.nuevoEstadoColegial.situacion == "20" && this.datosColegiales[1].idEstado == "20"
        && (this.datosColegialesInit[0].situacionResidente == "1" || this.datosColegialesInit[0].situacionResidente == "Si")
        && (this.nuevoEstadoColegial.situacionResidente == "0" || this.nuevoEstadoColegial.situacionResidente == "No")) {  
          // console.log("+++++ [this.isCrearColegial == true] - CAMBIO DE EJERCIENTE RESIDENTE A NO RESIDENTE");

          this.sigaServices.post("fichaDatosColegiales_datosColegialesSearchHistor", this.generalBody).subscribe(
            data => {
              let matchOtherEjerNoResi:Boolean = false;
              let colegialesObjectSpec = JSON.parse(data["body"]);
              let datosColegialesActualSpec = colegialesObjectSpec.colegiadoItem;

              datosColegialesActualSpec.forEach(datColActuIte => {
                if (datColActuIte.idEstado == "20"
                  && (datColActuIte.situacionResidente == "1" || datColActuIte.situacionResidente == "Si")) {
                    matchOtherEjerNoResi = true;
                }
              });
      
              if (!matchOtherEjerNoResi || (!matchOtherEjerNoResi && datosColegialesActualSpec.length < 1)) {           
                this.callServiceShowMessageAndIconCustomized(this.translateService.instant(
                  "fichacolegial.cambiosituacion_ejer_res_ejer_nores.warning"), "fa fa-warning", "cambioSituacionColegiado");
              } else {
                this.callServiceGuardarColegiales();
              }
            }
          );

        // Cambio de situación de un ejerciente no residente a residente || --> NO PERMITIR
      } else if (this.nuevoEstadoColegial.situacion == "20" && this.datosColegiales[1].idEstado == "20"
        && (this.datosColegialesInit[0].situacionResidente == "0" || this.datosColegialesInit[0].situacionResidente == "No")
        && (this.nuevoEstadoColegial.situacionResidente == "1" || this.nuevoEstadoColegial.situacionResidente == "Si")) {  
          // console.log("+++++ [this.isCrearColegial == true] - CAMBIO DE EJERCIENTE NO RESIDENTE A RESIDENTE");
          
          this.sigaServices.post("fichaDatosColegiales_datosColegialesSearchHistor", this.generalBody).subscribe(
            data => {
              let matchOtherEjerResi:Boolean = false;
              let colegialesObjectSpec = JSON.parse(data["body"]);
              let datosColegialesActualSpec = colegialesObjectSpec.colegiadoItem;

              datosColegialesActualSpec.forEach(datColActuIte => {
                if (datColActuIte.idEstado == "20"
                  && (datColActuIte.situacionResidente == "1" || datColActuIte.situacionResidente == "Si")) {
                    matchOtherEjerResi = true;
                }
              });
      
              if (matchOtherEjerResi) {

                this.msgs = [
                  {
                    severity: "error",
                    summary: this.translateService.instant("general.message.incorrect"),
                    detail: this.translateService.instant(
                      "fichacolegial.cambiosituacion_ejer-no-res_a_ejer-res.error"
                    )
                  }
                ];

              } else {
                this.callServiceGuardarColegiales();
              }
            }
          );



        // Cambio de situación de un ejerciente residente a no ejerciente || --> AVISAR Y PREGUNTAR     
      } else if (this.nuevoEstadoColegial.situacion == "10" && this.datosColegiales[1].idEstado == "20"
        && (this.datosColegialesInit[0].situacionResidente == "1" || this.datosColegialesInit[0].situacionResidente == "Si")) {  
          // console.log("+++++ [this.isCrearColegial == true] - CAMBIO DE EJERCIENTE RESIDENTE A NO EJERCIENTE");

          this.sigaServices.post("fichaDatosColegiales_datosColegialesSearchHistor", this.generalBody).subscribe(
            data => {
              let matchOtherEjerNoResi:Boolean = false;
              let colegialesObjectSpec = JSON.parse(data["body"]);
              let datosColegialesActualSpec = colegialesObjectSpec.colegiadoItem;

              datosColegialesActualSpec.forEach(datColActuIte => {
                if (datColActuIte.idEstado == "20"
                  && (datColActuIte.situacionResidente == "0" || datColActuIte.situacionResidente == "No")) {
                    matchOtherEjerNoResi = true;
                }
              });
      
              if (matchOtherEjerNoResi) {
                
                this.callServiceShowMessageAndIconCustomized(this.translateService.instant(
                  "fichacolegial.cambiosituacion_ejer_res_noejer.warning"), "fa fa-warning", "cambioSituacionColegiado");
              } else {
                this.callServiceGuardarColegiales();
              }
            }
          );

        // Cambio de situación de un ejerciente (residente o no) a Inhabilitación o Suspensión ejercicio || --> AVISAR A OTROS COLEGIOS 
      } else if ( (this.nuevoEstadoColegial.situacion == "40" || this.nuevoEstadoColegial.situacion == "50") 
        && this.datosColegiales[1].idEstado == "20") {  
          // console.log("+++++ [this.isCrearColegial == true] - CAMBIO DE EJERCIENTE A INHABILITACION / SUSPENSION EJERCICIO");

          this.sigaServices.post("fichaDatosColegiales_datosColegialesSearchHistor", this.generalBody).subscribe(
            data => {
              let colegialesObjectSpec = JSON.parse(data["body"]);
              let datosColegialesActualSpec = colegialesObjectSpec.colegiadoItem;

              datosColegialesActualSpec.forEach(datColActuIte => {
                if (datColActuIte.idEstado == "20") {
                    this.arrayAvisosColegios.push(datColActuIte.idInstitucion);
                }
              });

              if (this.arrayAvisosColegios.length > 0) {   
                this.callServiceSendMailsOtherCentres(this.translateService.instant(
                  "fichacolegial.cambiosituacion_ejer_ina_susp_envio_mail.info"), "fa fa-info", "cambioSituacionColegiado", this.arrayAvisosColegios);
                  this.arrayAvisosColegios = [];
              } else {
                this.callServiceGuardarColegiales();
              }
            }
          );


        // Cambio de situación de No ejerciente, Baja colegial, Inhabilitación o Suspensión de ejercicio a Ejerciente Residente || --> NO PERMITIR 
      } else if ( (this.nuevoEstadoColegial.situacion == "20" 
        && (this.nuevoEstadoColegial.situacionResidente == "1" || this.nuevoEstadoColegial.situacionResidente == "Si")) 
        && (this.datosColegiales[1].idEstado == "10" || this.datosColegiales[1].idEstado == "30" || this.datosColegiales[1].idEstado == "40" || this.datosColegiales[1].idEstado == "50")) {  
          // console.log("+++++ [this.isCrearColegial == true] - CAMBIO DE NO EJERCIENTE / BAJA COLEGIAL / INHABILITACION / SUSPENSION EJERCICIO A EJERCIENTE RESIDENTE");

          this.sigaServices.post("fichaDatosColegiales_datosColegialesSearchHistor", this.generalBody).subscribe(
            data => {
              let matchOtherEjerResi:Boolean = false;
              let colegialesObjectSpec = JSON.parse(data["body"]);
              let datosColegialesActualSpec = colegialesObjectSpec.colegiadoItem;

              datosColegialesActualSpec.forEach(datColActuIte => {
                if (datColActuIte.idEstado == "20"
                  && (datColActuIte.situacionResidente == "1" || datColActuIte.situacionResidente == "Si")) {
                    matchOtherEjerResi = true;
                }
              });
      
              if (matchOtherEjerResi) {

                this.msgs = [
                  {
                    severity: "error",
                    summary: this.translateService.instant("general.message.incorrect"),
                    detail: this.translateService.instant(
                      "fichacolegial.cambiosituacion_noejer-baja-inha-susp_ejer_res.error"
                    )
                  }
                ];

              } else {
                this.callServiceGuardarColegiales();
              }
            }
          );

        // Cambio de situación de No ejerciente, Baja colegial, Inhabilitación o Suspensión de ejercicio a Ejerciente no Residente || --> NO PERMITIR 
      } else if ( (this.nuevoEstadoColegial.situacion == "20"
        && (this.nuevoEstadoColegial.situacionResidente == "0" || this.nuevoEstadoColegial.situacionResidente == "No")) 
        && (this.datosColegiales[1].idEstado == "10" || this.datosColegiales[1].idEstado == "30" || this.datosColegiales[1].idEstado == "40" || this.datosColegiales[1].idEstado == "50")) {  
          // console.log("+++++ [this.isCrearColegial == true] - CAMBIO DE NO EJERCIENTE / BAJA COLEGIAL / INHABILITACION / SUSPENSION EJERCICIO A EJERCIENTE NO RESIDENTE");

          this.sigaServices.post("fichaDatosColegiales_datosColegialesSearchHistor", this.generalBody).subscribe(
            data => {
              let matchOtherEjerResi:Boolean = false;
              let colegialesObjectSpec = JSON.parse(data["body"]);
              let datosColegialesActualSpec = colegialesObjectSpec.colegiadoItem;

              datosColegialesActualSpec.forEach(datColActuIte => {
                if (datColActuIte.idEstado == "20"
                  && (datColActuIte.situacionResidente == "1" || datColActuIte.situacionResidente == "Si")) {
                    matchOtherEjerResi = true;
                }
              });
      
              if (!matchOtherEjerResi || (!matchOtherEjerResi && datosColegialesActualSpec.length < 1)) {

                this.msgs = [
                  {
                    severity: "error",
                    summary: this.translateService.instant("general.message.incorrect"),
                    detail: this.translateService.instant(
                      "fichacolegial.cambiosituacion_noejer-baja-inha-susp_ejer_nores.error"
                    )
                  }
                ];

              } else {
                this.callServiceGuardarColegiales();
              }
            }
          );

      } /* else if (this.nuevoEstadoColegial.situacion != "20" && this.datosColegiales[1].idEstado == "20") {
        //Se comprueba si le falta alguna direccion
        //Si no le falta llamamos al servicio para guardar los cambios
        if (this.comprobarDireccion(false)) {
          this.callServiceGuardarColegiales();
        } else {
          //Si falta se muestra un mensaje indicando que se creara esa direccion que falta automaticamente
          if (!this.information) {
            this.callServiceShowMessageUpdate();
          } else {
            this.progressSpinner = false;
          }
        }
      } */ else {
        this.callServiceGuardarColegiales();
      }

      //Si es una modificacion de estado
    } else {
      //Si el cambio pertenece de un colegiado "Ejerciente Residente -> Baja Colegial"
      if (this.datosColegialesInit[0].idEstado == "20" && (this.datosColegiales[0].idEstado == "30" || this.datosColegiales[0].idEstado == "60")
        && (this.datosColegialesInit[0].situacionResidente == "1" || this.datosColegialesInit[0].situacionResidente == "Si")) {       
          // console.log("+++++ [this.isCrearColegial == false] - CAMBIO DE EJERCIENTE RESIDENTE A BAJA COLEGIAL");
          
          // Que la persona no tenga otra colegiación en vigor como ejerciente no residente
          this.sigaServices
          .post(
            "fichaDatosColegiales_datosColegialesSearchHistor", this.generalBody
          )
          .subscribe(
            data => {
              let matchOtherEjerResi:Boolean = false;
              let colegialesObjectSpec = JSON.parse(data["body"]);
              let datosColegialesActualSpec = colegialesObjectSpec.colegiadoItem;

              datosColegialesActualSpec.forEach(datColActuIte => {
                if (datColActuIte.idEstado == "20"
                  && (datColActuIte.situacionResidente == "0" || datColActuIte.situacionResidente == "No")) {
                    matchOtherEjerResi = true;
                }
              });
      
              if (matchOtherEjerResi) {
                
                this.callServiceShowMessageAndIconCustomized(this.translateService.instant(
                  "fichacolegial.cambiosituacion_ejer_res_bajacolegial.warning"), "fa fa-warning", "cambioSituacionColegiado");
              } else {
                this.callServiceGuardarColegiales();
              }

            });

        //Si el cambio es a ejerciente Residente a No residente
      } else if (this.datosColegiales[0].idEstado == "20" && this.datosColegialesInit[0].idEstado == "20"
        && (this.datosColegialesInit[0].situacionResidente == "1" || this.datosColegialesInit[0].situacionResidente == "Si")
        && (this.datosColegiales[0].situacionResidente == "0" || this.datosColegiales[0].situacionResidente == "No")) {  
          // console.log("+++++ [this.isCrearColegial == false] - CAMBIO DE EJERCIENTE RESIDENTE A NO RESIDENTE");

          this.sigaServices.post("fichaDatosColegiales_datosColegialesSearchHistor", this.generalBody).subscribe(
            data => {
              let matchOtherEjerNoResi:Boolean = false;
              let colegialesObjectSpec = JSON.parse(data["body"]);
              let datosColegialesActualSpec = colegialesObjectSpec.colegiadoItem;

              datosColegialesActualSpec.forEach(datColActuIte => {
                if (datColActuIte.idEstado == "20"
                  && (datColActuIte.situacionResidente == "1" || datColActuIte.situacionResidente == "Si")) {
                    matchOtherEjerNoResi = true;
                }
              });
      
              if (!matchOtherEjerNoResi || (!matchOtherEjerNoResi && datosColegialesActualSpec.length < 1)) {               
                this.callServiceShowMessageAndIconCustomized(this.translateService.instant(
                  "fichacolegial.cambiosituacion_ejer_res_ejer_nores.warning"), "fa fa-warning", "cambioSituacionColegiado");
              } else {
                this.callServiceGuardarColegiales();
              }
            }
          );

        // Cambio de situación de un ejerciente no residente a residente || --> NO PERMITIR
      } else if (this.datosColegiales[0].idEstado == "20" && this.datosColegialesInit[0].idEstado == "20"
        && (this.datosColegialesInit[0].situacionResidente == "0" || this.datosColegialesInit[0].situacionResidente == "No")
        && (this.datosColegiales[0].situacionResidente == "1" || this.datosColegiales[0].situacionResidente == "Si")) {  
        
          // console.log("+++++ [this.isCrearColegial == false] - CAMBIO DE EJERCIENTE NO RESIDENTE A RESIDENTE");

          this.sigaServices.post("fichaDatosColegiales_datosColegialesSearchHistor", this.generalBody).subscribe(
            data => {
              let matchOtherEjerResi:Boolean = false;
              let colegialesObjectSpec = JSON.parse(data["body"]);
              let datosColegialesActualSpec = colegialesObjectSpec.colegiadoItem;

              datosColegialesActualSpec.forEach(datColActuIte => {
                if (datColActuIte.idEstado == "20"
                  && (datColActuIte.situacionResidente == "1" || datColActuIte.situacionResidente == "Si")) {
                    matchOtherEjerResi = true;
                }
              });
      
              if (matchOtherEjerResi) {

                this.msgs = [
                  {
                    severity: "error",
                    summary: this.translateService.instant("general.message.incorrect"),
                    detail: this.translateService.instant(
                      "fichacolegial.cambiosituacion_ejer-no-res_a_ejer-res.error"
                    )
                  }
                ];

              } else {
                this.callServiceGuardarColegiales();
              }
            }
          );

      // Cambio de situación de un ejerciente residente a no ejerciente || --> AVISAR Y PREGUNTAR     
      } else if (this.datosColegiales[0].idEstado == "10" && this.datosColegialesInit[0].idEstado == "20"
      && (this.datosColegialesInit[0].situacionResidente == "1" || this.datosColegialesInit[0].situacionResidente == "Si")) {  
        // console.log("+++++ [this.isCrearColegial == false] - CAMBIO DE EJERCIENTE RESIDENTE A NO EJERCIENTE");

        this.sigaServices.post("fichaDatosColegiales_datosColegialesSearchHistor", this.generalBody).subscribe(
          data => {
            let matchOtherEjerResi:Boolean = false;
            let colegialesObjectSpec = JSON.parse(data["body"]);
            let datosColegialesActualSpec = colegialesObjectSpec.colegiadoItem;

            datosColegialesActualSpec.forEach(datColActuIte => {
              if (datColActuIte.idEstado == "20"
                && (datColActuIte.situacionResidente == "0" || datColActuIte.situacionResidente == "No")) {
                  matchOtherEjerResi = true;
              }
            });
    
            if (matchOtherEjerResi) {             
              this.callServiceShowMessageAndIconCustomized(this.translateService.instant(
                "fichacolegial.cambiosituacion_ejer_res_noejer.warning"), "fa fa-warning", "cambioSituacionColegiado");
            } else {
              this.callServiceGuardarColegiales();
            }
          }
        );

      // Cambio de situación de un ejerciente (residente o no) a Inhabilitación o Suspensión ejercicio || --> AVISAR A OTROS COLEGIOS 
    } else if ( (this.datosColegiales[0].idEstado == "40" || this.datosColegiales[0].idEstado == "50") 
      && this.datosColegialesInit[0].idEstado == "20") {  
        // console.log("+++++ [this.isCrearColegial == false] - CAMBIO DE EJERCIENTE A INHABILITACION / SUSPENSION EJERCICIO");

        this.sigaServices.post("fichaDatosColegiales_datosColegialesSearchHistor", this.generalBody).subscribe(
          data => {
            let colegialesObjectSpec = JSON.parse(data["body"]);
            let datosColegialesActualSpec = colegialesObjectSpec.colegiadoItem;

            datosColegialesActualSpec.forEach(datColActuIte => {
              if (datColActuIte.idEstado == "20") {
                  this.arrayAvisosColegios.push(datColActuIte.idInstitucion);
              }
            });
    
            if (this.arrayAvisosColegios.length > 0) {
              this.callServiceSendMailsOtherCentres(this.translateService.instant(
                "fichacolegial.cambiosituacion_ejer_ina_susp_envio_mail.info"), "fa fa-info", "cambioSituacionColegiado", this.arrayAvisosColegios);
                this.arrayAvisosColegios = [];
            } else {
              this.callServiceGuardarColegiales();
            }
          }
        );

      // Cambio de situación de No ejerciente, Baja colegial, Inhabilitación o Suspensión de ejercicio a Ejerciente Residente || --> NO PERMITIR 
    } else if ( (this.datosColegiales[0].idEstado == "20" 
      && (this.datosColegiales[0].situacionResidente == "1" || this.datosColegiales[0].situacionResidente == "Si")) 
      && (this.datosColegialesInit[0].idEstado == "10" || this.datosColegialesInit[0].idEstado == "30" || this.datosColegialesInit[0].idEstado == "40" || this.datosColegialesInit[0].idEstado == "50")) {  
        // console.log("+++++ [this.isCrearColegial == false] - CAMBIO DE NO EJERCIENTE / BAJA COLEGIAL / INHABILITACION / SUSPENSION EJERCICIO A EJERCIENTE RESIDENTE");

          this.sigaServices.post("fichaDatosColegiales_datosColegialesSearchHistor", this.generalBody).subscribe(
            data => {
              let matchOtherEjerResi:Boolean = false;
              let colegialesObjectSpec = JSON.parse(data["body"]);
              let datosColegialesActualSpec = colegialesObjectSpec.colegiadoItem;

              datosColegialesActualSpec.forEach(datColActuIte => {
                if (datColActuIte.idEstado == "20"
                  && (datColActuIte.situacionResidente == "1" || datColActuIte.situacionResidente == "Si")) {
                    matchOtherEjerResi = true;
                }
              });
      
              if (matchOtherEjerResi) {

                this.msgs = [
                  {
                    severity: "error",
                    summary: this.translateService.instant("general.message.incorrect"),
                    detail: this.translateService.instant(
                      "fichacolegial.cambiosituacion_noejer-baja-inha-susp_ejer_res.error"
                    )
                  }
                ];

              } else {
                this.callServiceGuardarColegiales();
              }
            }
          );

      // Cambio de situación de No ejerciente, Baja colegial, Inhabilitación o Suspensión de ejercicio a Ejerciente no Residente || --> NO PERMITIR 
    } else if ( (this.datosColegiales[0].idEstado == "20"
      && (this.datosColegiales[0].situacionResidente == "0" || this.datosColegiales[0].situacionResidente == "No")) 
      && (this.datosColegialesInit[0].idEstado == "10" || this.datosColegialesInit[0].idEstado == "30" || this.datosColegialesInit[0].idEstado == "40" || this.datosColegialesInit[0].idEstado == "50")) {  
        // console.log("+++++ [this.isCrearColegial == false] - CAMBIO DE NO EJERCIENTE / BAJA COLEGIAL / INHABILITACION / SUSPENSION EJERCICIO A EJERCIENTE NO RESIDENTE");

          this.sigaServices.post("fichaDatosColegiales_datosColegialesSearchHistor", this.generalBody).subscribe(
            data => {
              let matchOtherEjerResi:Boolean = false;
              let colegialesObjectSpec = JSON.parse(data["body"]);
              let datosColegialesActualSpec = colegialesObjectSpec.colegiadoItem;

              datosColegialesActualSpec.forEach(datColActuIte => {
                if (datColActuIte.idEstado == "20"
                  && (datColActuIte.situacionResidente == "1" || datColActuIte.situacionResidente == "Si")) {
                    matchOtherEjerResi = true;
                }
              });
      
              if (!matchOtherEjerResi || (!matchOtherEjerResi && datosColegialesActualSpec.length < 1)) {
                this.msgs = [
                  {
                    severity: "error",
                    summary: this.translateService.instant("general.message.incorrect"),
                    detail: this.translateService.instant(
                      "fichacolegial.cambiosituacion_noejer-baja-inha-susp_ejer_nores.error"
                    )
                  }
                ];

              } else {
                this.callServiceGuardarColegiales();
              }
            }
          );
        } else if (this.datosColegiales[0].idEstado == "20" && this.datosColegialesInit[0].idEstado == "20"
          && (this.datosColegialesInit[0].situacionResidente != this.datosColegiales[0].situacionResidente)) {
          
          let matchOtherEjerNoResi = false, matchOtherEjerResi = false;
          this.sigaServices.post("fichaDatosColegiales_datosColegialesSearchHistor", this.generalBody).subscribe(
            data => {
              let colegialesObjectSpec = JSON.parse(data["body"]);
              let datosColegialesActualSpec = colegialesObjectSpec.colegiadoItem;

              datosColegialesActualSpec.forEach(datColActuIte => {
                if (datColActuIte.idEstado == "20"
                  && (datColActuIte.situacionResidente == "0" || datColActuIte.situacionResidente == "No")) {
                    matchOtherEjerNoResi = true;
                } else if(datColActuIte.idEstado == "20"
                && (datColActuIte.situacionResidente == "1" || datColActuIte.situacionResidente == "Si")) {
                  matchOtherEjerResi = true;
                }
              });
      
              if (matchOtherEjerNoResi) {

                this.msgs = [
                  {
                    severity: "error",
                    summary: this.translateService.instant("general.message.incorrect"),
                    detail: this.translateService.instant(
                      "fichacolegial.cambiosituacion_ejer-doble-resi.error"
                    )
                  }
                ];
              } else if (matchOtherEjerResi) {

                this.msgs = [
                  {
                    severity: "error",
                    summary: this.translateService.instant("general.message.incorrect"),
                    detail: this.translateService.instant(
                      "fichacolegial.cambiosituacion_ejer-sin-resi.error"
                    )
                  }
                ];

              } else {
                this.callServiceGuardarColegiales();
              }
            }
          );

      } else if (this.datosColegiales[0].idEstado == "20" && this.datosColegiales[0].idEstado != this.datosColegialesInit[0].idEstado) {
        //Se comprueba si le falta alguna direccion
        //Si no le falta llamamos al servicio para guardar los cambios
        if (this.comprobarDireccion(true)) {
          this.callServiceGuardarColegiales();
          //Si falta se muestra un mensaje indicando que se creara esa direccion que falta automaticamente
        } else {
          if (!this.information) {
            this.callServiceShowMessageUpdate();
          } else {
            this.progressSpinner = false;
          }
        }
        //Si el cambio es de ejerciente a no ejerciente
      } /*else if (this.datosColegiales[0].idEstado != "20" && this.datosColegiales[0].idEstado != this.datosColegialesInit[0].idEstado
        && this.datosColegialesInit[0].idEstado == "20") {
        //Se comprueba si le falta alguna direccion
        //Si no le falta llamamos al servicio para guardar los cambios
        if (this.comprobarDireccion(false)) {
          this.callServiceGuardarColegiales();
          //Si falta se muestra un mensaje indicando que se creara esa direccion que falta automaticamente
        } else {
          if (!this.information) {
            this.callServiceShowMessageUpdate();
          } else {
            this.progressSpinner = false;
          }
        }

       } */ else {
        this.callServiceGuardarColegiales();
      }
    }
    // if (this.nuevoEstadoColegial.situacionResidente == "1" || this.nuevoEstadoColegial.situacionResidente == "Si") {
    //   this.residente = "Si";
    // } else {
    //   this.residente = "No";
    // }
  }

  sendMailsOtherCentres(centresToSendMail: any[]) {
    
    this.sigaServices.post("fichaDatosColegiales_sendMailsOtherCentres", centresToSendMail).subscribe(
      data => {
        this.callServiceGuardarColegiales();
      }
    );

    
  }

  callServiceShowMessageAndIconCustomized(messageToShow, iconToShow, keyTagPConfirDialog) {
    this.progressSpinner = false;
    this.icon = iconToShow;
    let keyConfirmation = keyTagPConfirDialog;

    this.confirmationService.confirm({
      key: keyConfirmation,
      message: messageToShow,
      icon: this.icon,

      accept: () => {
        this.callServiceGuardarColegiales();
      },
      reject: () => {
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

  callServiceSendMailsOtherCentres(messageToShow, iconToShow, keyTagPConfirDialog, arrayAvisosColegios) {
    this.progressSpinner = false;
    this.icon = iconToShow;
    let keyConfirmation = keyTagPConfirDialog;
    
    this.confirmationService.confirm({
      key: keyConfirmation,
      message: messageToShow,
      icon: this.icon,

      accept: () => {
        this.sendMailsOtherCentres(arrayAvisosColegios);
      },
      reject: () => {
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

  callServiceShowMessageUpdate() {
    this.progressSpinner = false;
    this.icon = "fa fa-edit";
    let keyConfirmation = "direccionesColegiado";

    this.confirmationService.confirm({
      key: keyConfirmation,
      message: this.msgDir,
      icon: this.icon,

      accept: () => {
        this.callServiceGuardarColegiales();
      },
      reject: () => {
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

  callCancelAction() {
    this.displayDelete = false;
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
  confirmarEliminarEstadoColegial(selectedDatos) {
    let mess = this.translateService.instant("messages.deleteConfirmation");
    this.icon = "fa fa-trash-alt";
    let keyConfirmation = "deleteEstado";

    this.confirmationService.confirm({
      key: keyConfirmation,
      message: mess,
      icon: this.icon,
      accept: () => {

        this.eliminarEstadoColegial(selectedDatos);
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
  comprobarDireccion(isEjerciente) {

    let direcciones = [];
    this.msgDir = "";
    let tipos = [];

    //Obtenemos todos los tipos de direcciones del colegiado
    for (const key in this.datosDirecciones) {
      this.datosDirecciones[key].idTipoDireccion.forEach(tipoDir => {
        direcciones.push(tipoDir);
      });
    }

    //Se comprueba si estan los tipos obligatorios
    let idFindTipoDirEmail = direcciones.findIndex(tipoDir => tipoDir == this.valorPreferenteEmail);
    let idFindTipoDirGuardia = direcciones.findIndex(tipoDir => tipoDir == this.valorGuardia);
    let idFindTipoDirCenso = direcciones.findIndex(tipoDir => tipoDir == this.valorCensoWeb);
    let idFindTipoDirFact = direcciones.findIndex(tipoDir => tipoDir == this.valorFacturacion);
    let idFindTipoDirDes = direcciones.findIndex(tipoDir => tipoDir == this.valorDespacho);
    let idFindTipoDirTras = direcciones.findIndex(tipoDir => tipoDir == this.valorTraspaso);
    let idFindTipoDirGuia = direcciones.findIndex(tipoDir => tipoDir == this.valorGuiaJudicial);
    let idFindTipoDirCorreo = direcciones.findIndex(tipoDir => tipoDir == this.valorPreferenteCorreo);
    let idFindTipoDirSMS = direcciones.findIndex(tipoDir => tipoDir == this.valorPreferenteSMS);

    //Si no se encuentra, se añaden en un array los nombre de los tipos que faltan
    if (idFindTipoDirEmail == -1) {
      tipos.push("Preferente Email");
    }
    if (idFindTipoDirGuardia == -1) {
      tipos.push("Guardia");
    }
    if (idFindTipoDirFact == -1) {
      tipos.push("Facturación");
    }
    if (idFindTipoDirTras == -1) {
      tipos.push("Traspaso");
    }
    if (idFindTipoDirGuia == -1) {
      tipos.push("Guía Judicial");
    }
    if (idFindTipoDirCorreo == -1) {
      tipos.push("Preferente Correo");
    }
    if (idFindTipoDirSMS == -1) {
      tipos.push("Preferente SMS");
    }
    if (isEjerciente) {
      if (idFindTipoDirDes == -1) {
        tipos.push("Despacho");
      }
    }

    //Comprobamos si falta alguna dirección
    if (idFindTipoDirCenso == -1) {
      this.information = true;

      if (isEjerciente) {
        this.msgDir = this.translateService.instant("censo.consultarDirecciones.mensaje.introducir.direccion.pasarColegiado");
        return false;
      } else {
        this.msgDir = this.translateService.instant("censo.consultarDirecciones.mensaje.cambiar.situacion.pasarColegiado");
        return false;
      }
    } else {
      this.information = false;

      if (isEjerciente) {
        this.msgDir = this.translateService.instant("censo.consultarDirecciones.mensaje.finalizar.cambio.ejerciente");
      } else {
        this.msgDir = this.translateService.instant("censo.consultarDirecciones.mensaje.finalizar.cambio");
      }

      if (tipos.length == 0) {
        return true;
      } else if (tipos.length == 1) {
        this.msgDir += this.translateService.instant("censo.consultarDirecciones.mensaje.necesaria.direccion");
        this.msgDir += tipos[0];
        this.msgDir += this.translateService.instant("censo.consultarDirecciones.mensaje.asignar.automaticamente.tipoDireccion");
        this.msgDir += tipos[0];
        this.msgDir += this.translateService.instant("censo.consultarDirecciones.mensaje.actual.censoWeb.deseaContinuar");
        return false;
      } else if (tipos.length > 1) {

        this.msgDir += this.translateService.instant("censo.consultarDirecciones.mensaje.necesaria.direccion.plural");
        let msgTipos = "";
        for (const key in tipos) {
          let x = key;
          if (+x + 1 == + tipos.length) {
            msgTipos += " y " + tipos[key];
          } else if (+x + 1 == + tipos.length - 1) {
            msgTipos += tipos[key] + " ";
          } else {
            msgTipos += tipos[key] + ", ";
          }
        }

        this.msgDir += msgTipos;
        this.msgDir += this.translateService.instant("censo.consultarDirecciones.mensaje.asignar.automaticamente.tipoDireccion.plural");
        this.msgDir += msgTipos;
        this.msgDir += this.translateService.instant("censo.consultarDirecciones.mensaje.actual.censoWeb.deseaContinuar");
        return false;
      }
    }
  }
  searchDirecciones() {
    this.selectMultipleDirecciones = false;
    this.selectedDatosDirecciones = "";
    //this.progressSpinner = true;
    this.selectAll = false;
    if (this.idPersona != undefined && this.idPersona != null) {
      this.sigaServices
        .postPaginado(
          "fichaDatosDirecciones_datosDireccionesSearch",
          "?numPagina=1",
          this.bodyDirecciones
        )
        .subscribe(
          data => {
            this.searchDireccionIdPersona = JSON.parse(data["body"]);
            this.datosDirecciones = this.searchDireccionIdPersona.datosDireccionesItem;
            let contador = 0;
            this.datosDirecciones.forEach(element => {
              let numDespacho = element.idTipoDireccion.find(
                item => item == '2'
              );

              if (numDespacho != undefined) {
                contador = contador + 1;
              }
            });
            sessionStorage.setItem("numDespacho", JSON.stringify(contador));

            this.progressSpinner = false;
          },
          err => {
            console.log(err);
          },
          () => {
            if (this.datosDirecciones.length > 0) {
              this.mostrarDatosDireccion = true;
              for (let i = 0; i <= this.datosDirecciones.length - 1; i++) {
                this.DescripcionDatosDireccion = this.datosDirecciones[i];
              }
            }
          }
        );
    }
  }

  searchDireccionesHistoric() {
    this.bodyDirecciones.historico = true;
    this.searchDirecciones();
  }
  callServiceGuardarColegiales() {
     if (this.isCrearColegial == true) {
                let estadoCol = JSON.parse(JSON.stringify(this.nuevoEstadoColegial));
                this.nuevoEstadoColegial = JSON.parse(JSON.stringify(this.colegialesBody));
                this.nuevoEstadoColegial.idInstitucion = this.colegialesBody.idInstitucion;
                this.nuevoEstadoColegial.idPersona = this.colegialesBody.idPersona;
                this.nuevoEstadoColegial.fechaEstado = estadoCol.fechaEstado;
                this.nuevoEstadoColegial.observaciones = estadoCol.observaciones;
                if (this.nuevoEstadoColegial.observaciones == undefined) this.nuevoEstadoColegial.observaciones = "";
                this.nuevoEstadoColegial.situacion = estadoCol.situacion;
                this.nuevoEstadoColegial.situacionResidente = estadoCol.situacionResidente;
                }
                this.datosColegiales[0].idInstitucion = this.colegialesBody.idInstitucion;
                this.datosColegiales[0].idPersona = this.colegialesBody.idPersona;
                if (this.datosColegiales[0].observaciones == undefined) this.datosColegiales[0].observaciones = "";
                let update = {
                    colegiadoItemEstados:  this.datosColegiales,
                    colegiadoItem:this.colegialesBody,
                    nuevocolegiadoItem:this.nuevoEstadoColegial  
                  }
               
                  this.sigaServices
                  .post("fichaDatosColegiales_datosColegialesUpdateMasivo", update)
                  .subscribe(
                      data => {
                        this.nuevoEstadoColegial = new FichaColegialColegialesItem;
                        this.activarGuardarColegiales = false;
                  this.obtenerEtiquetasPersonaJuridicaConcreta();
                  this.progressSpinner = false;
                  this.isCrearColegial = false;
                  this.isRestablecer = false;
                  this.inscritoChange = false;
                  this.filaEditable = false;
                  this.numSelectedColegiales = 0;
                  this.cerrarAuditoria();
                  this.onInitColegiales();
                  this.searchDirecciones();

                  if (JSON.parse(data.body).error != null &&
                    JSON.parse(data.body).error != undefined &&
                    JSON.parse(data.body).error != "") {
                    let msg = JSON.parse(data.body).error.message;
                    this.showSuccessDetalle(msg);
                  } else {
                    this.showSuccess();

                  }

                  this.checkColegialesBody = JSON.parse(
                    JSON.stringify(this.colegialesBody)
                  );
 
        },
        error => {
          console.log(error);
          
          if (error != null && error != undefined) {
            if (JSON.parse(error.error).error != null && JSON.parse(error.error).error != "" && JSON.parse(error.error).error != undefined) {
              let msg = JSON.parse(error.error).error.message;
              this.showFailDetalle(msg);
            } else {
              this.showFail();
            }
        } else {
          this.showFail();
        }
        
          this.progressSpinner = false;
          this.isCrearColegial = false;
          this.isRestablecer = false;
          this.inscritoChange = false;
          this.activarGuardarColegiales = false;
          this.numSelectedColegiales = 0;
          this.filaEditable = false;
          this.restablecerColegiales();
          this.cerrarAuditoria();
        }
      );

      this.nuevoEstadoColegial.situacionResidente

      if (this.datosColegiales[0].situacionResidente == "1" || this.datosColegiales[0].situacionResidente == "Si") {
        this.residente = "Si";
      } else {
        if (this.nuevoEstadoColegial.situacionResidente == "1" || this.nuevoEstadoColegial.situacionResidente == "Si") {
          this.residente = "Si";
       } else {

          this.residente = "No";
        }
      }
  }


  getInscrito(event) {

    this.getInscritoInit();
    if (event != undefined) {
      this.inscritoChange = true;
      if (this.colegialesBody.comunitario == "1" && event == "0") {
        let parametro = {
          valor: "CONTADOR_UNICO_NCOLEGIADO_NCOMUNIT"
        };

        this.sigaServices
          .post("busquedaPerJuridica_parametroColegio", parametro)
          .subscribe(
            data => {
              let contador = JSON.parse(data.body);
              if (contador.parametro != "1") {
                this.sigaServices.get("fichaDatosColegiales_getNumColegiado").subscribe(response => {
                  this.maxNumColegiado = response.valor;
                  this.colegialesBody.numColegiado = response.valor;
                });
              }
            },
            err => {
              console.log(err);
            }
          );
      }
    }
  }
  getSituacionPersona() {
    // •	Situación:
    // o	‘Fallecido’ si está marcado como tal.
    // o	‘No colegiado’ en caso de no estar colegiado en ningún colegio.
    // o	‘Activo’ en caso de estar colegiado en algún colegio con estado ‘Ejerciente’ o ‘No ejerciente’.
    // o	‘De baja’ en cualquier otro caso.

    //     0: {label: "Baja Colegial", value: "30"}
    // 1: {label: "Baja Por Deceso", value: "60"}
    // 2: {label: "Ejerciente", value: "20"}
    // 3: {label: "Inhabilitación", value: "40"}
    // 4: {label: "No Ejerciente", value: "10"}
    // 5: {label: "Suspensión Ejercicio", value: "50"
    if (this.colegialesBody.situacion == "60") {
      this.situacionPersona = "Fallecido";
    } else if (
      this.colegialesBody.situacion == "20" ||
      this.colegialesBody.situacion == "10"
    ) {
      if (this.colegialesBody.comunitario == "1") {
        this.situacionPersona = "Abogado Inscrito";
      } else {
        this.situacionPersona = "Activo";
      }
    } else if (this.colegialesBody.situacion != undefined) {
      this.situacionPersona = "De baja";
    } else {
      this.situacionPersona = "No Colegiado";
    }
  }
  onChangeRowsPerPagesColegiales(event) {
    this.selectedItemColegiales = event.value;
    this.changeDetectorRef.detectChanges();
    this.tableColegiales.reset();
  }
  sumarDia(fechaInput) {
    let fecha = new Date(fechaInput);
    let one_day = 1000 * 60 * 60 * 24;
    let ayer = fecha.getMilliseconds() + one_day;
    fecha.setMilliseconds(ayer);
    return fecha;
  }
  restablecerColegiales() {
    this.selectedDatosColegiales = '';
    this.showMessageInscripcion = false;
    this.colegialesBody = JSON.parse(JSON.stringify(this.checkColegialesBody));
    this.colegialesBody.incorporacion = this.arreglarFecha(this.colegialesBody.incorporacion);
    this.colegialesBody.fechaJura = this.arreglarFecha(this.colegialesBody.fechaJura);
    this.colegialesBody.fechaTitulacion = this.arreglarFecha(this.colegialesBody.fechaTitulacion);
    this.colegialesBody.fechapresentacion = this.arreglarFecha(this.colegialesBody.fechapresentacion);
    this.resaltadoDatosColegiales = false;
    this.itemAInscrito();
    this.checkColegialesBody = new FichaColegialColegialesItem();
    this.nuevoEstadoColegial = new FichaColegialColegialesItem();
    this.checkColegialesBody = JSON.parse(JSON.stringify(this.colegialesBody));

    this.isCrearColegial = false;
    this.filaEditable = false;
    this.isEliminarEstadoColegial = false;
    this.isRestablecer = false;
    this.inscritoChange = false;

    this.activarGuardarColegiales = false;
    this.numSelectedColegiales = 0;
    this.searchColegiales();
  }

  onRowSelectColegiales(selectedDatos) {
    this.numSelectedColegiales = 1;
    this.datosColegiales.forEach(element => {
      element.habilitarObs = false;
    });
    if (!this.isCrearColegial) {
      if (selectedDatos.isMod == true) {
        this.filaEditable = true;
        this.isEliminarEstadoColegial = true;
      } else {
        this.filaEditable = false;
        this.isEliminarEstadoColegial = false;
        selectedDatos.habilitarObs = true;
      }
    }
  }
  disableEnableNumCol() {
    this.disableNumColegiado = !this.disableNumColegiado;
  }
  onlySpaces(str) {
    let i = 0;
    var ret;
    ret = true;
    while (i < str.length) {
      if (str[i] != " ") {
        ret = false;
      }
      i++;
    }
    return ret;
  }

  showFailDetalle(mensaje: string) {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: this.translateService.instant("general.message.incorrect"),
      detail: mensaje
    });
  }

  showSuccessDetalle(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "success", summary: this.translateService.instant("general.message.correct"), detail: mensaje });
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

  showInfo(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "info", summary: "", detail: mensaje });
  }
  nuevoColegial() {
    this.activarGuardarColegiales = false;
    this.datosColegiales = JSON.parse(JSON.stringify(this.checkDatosColegiales));
    this.showMessageInscripcion = true;
    this.selectedDatosColegiales = '';
    this.isCrearColegial = true;
    this.isRestablecer = true;

    let dummy = {
      fechaEstadoStr: "",
      estado: "",
      residente: "",
      observaciones: "",
      nuevoRegistro: true,
      isMod: true
    };

    this.datosColegiales = [dummy, ...this.datosColegiales];
    this.datosColegiales[1].isMod = false;

    let fechaHoy = new Date();
    let fecha = new Date(this.datosColegiales[1].fechaEstado);
    if (fecha.getDate() == fechaHoy.getDate() &&
      fecha.getMonth() == fechaHoy.getMonth() &&
      fecha.getFullYear() == fechaHoy.getFullYear()) {
      this.disabledToday = true;
    } else if (fecha > fechaHoy) {
      this.disabledToday = true;
    } else {
      this.disabledToday = false;
    }

    this.datosColegiales.forEach(element => {
      element.habilitarObs = false;
    });

  }

  cambioEstadoResumen(){

    if(this.comboSituacion != undefined && this.comboSituacion.length > 0 ){
      if(this.datosColegiales != undefined && this.datosColegiales.length > 0 && new Date(this.datosColegiales[0].fechaEstado) <= new Date()){
        this.colegialesBody.estadoColegial = this.comboSituacion.find(item => item.value === this.datosColegiales[0].idEstado).label;
      }else{
        let check = false;
  
        if(this.datosColegiales != undefined && this.datosColegiales.length > 1){
          for (let index = 1; index < this.datosColegiales.length; index++) {
            if(!check && new Date(this.datosColegiales[index].fechaEstado) <= new Date()){
              this.colegialesBody.estadoColegial = this.comboSituacion.find(item => item.value === this.datosColegiales[index].idEstado).label;
              check = true;
            }
            
          }
        }else{
          if(this.datosColegiales != null && this.datosColegiales != undefined && this.datosColegiales.length != 0){
            this.colegialesBody.estadoColegial = this.comboSituacion.find(item => item.value === this.datosColegiales[0].idEstado).label;
          }
        }
       
      }
    }
  
  }

  showFailNumColegiado(mensaje: string) {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "",
      detail: this.translateService.instant(mensaje)
    });
  }

  obtenerEtiquetasPersonaJuridicaConcreta() {
    this.sigaServices
      .post("fichaDatosGenerales_etiquetasPersona", this.generalBody)
      .subscribe(
        n => {
          // coger etiquetas de una persona juridica
          this.etiquetasPersonaJuridica = JSON.parse(
            n["body"]
          ).comboEtiquetasItems;

          // en cada busqueda vaciamos el vector para añadir las nuevas etiquetas
          this.etiquetasPersonaJuridicaSelecionados = [];
          this.etiquetasPersonaJuridica.forEach((value: any, index: number) => {
            this.etiquetasPersonaJuridicaSelecionados.push(value);
            // this.generalBody.
          });

          this.etiquetasPersonaJuridicaSelecionados.forEach(
            (value: any, index: number) => {
              let pruebaComboE: ComboEtiquetasItem = new ComboEtiquetasItem();
              pruebaComboE = value;
              this.updateItems.set(value.idGrupo, pruebaComboE);
            }
          );

          this.createItems = this.etiquetasPersonaJuridicaSelecionados;
          this.checkGeneralBody.etiquetas = JSON.parse(JSON.stringify(this.etiquetasPersonaJuridicaSelecionados));
        },
        err => {
          console.log(err);
        }
      );
    // this.generalBody.etiquetas = new ComboEtiquetasItem();

    // this.generalBody.grupos = this.etiquetasPersonaJuridicaSelecionados;
  }
  cerrarAuditoria() {
    this.displayAuditoria = false;
  }
  onChangeDropResidenteColegial(event, selectedDatos) {
    if (!this.isCrearColegial) {
      if (event.value == 1) {
        selectedDatos.situacionResidente = 'Si';
      } else if (event.value == 0) {
        selectedDatos.situacionResidente = 'No';
      } else {
        selectedDatos.situacionResidente = undefined;
      }
      this.colegialesBody.situacionResidente = selectedDatos.situacionResidente;
    }
    this.isRestablecer = true;
    this.activacionGuardarColegiales();
  }

  styleObligatorio(resaltado, evento) {
    if (resaltado = 'datosColegiales') {
      if ((evento == null || evento == undefined || evento == "") && resaltado == "datosColegiales" && this.resaltadoDatosColegiales) {
        return "camposObligatorios";
      }
    }
    else {
      if (this.resaltadoDatosColegiales && (evento == undefined || evento == null || evento == "")) {
        return this.commonService.styleObligatorio(evento);
      }
    }
  }

  comprobarCamposColegiales() {
    // if(this.inscritoChange && this.activarGuardarColegiales){
    //   this.comprobarAuditoria('guardarDatosColegiales');
    // }else{
    let filaVacia = [];




    if ((this.colegialesBody.numColegiado == null || this.colegialesBody.numColegiado == undefined || this.colegialesBody.numColegiado === "") ||
      (this.colegialesBody.incorporacion == null || this.colegialesBody.incorporacion == undefined) ||
      (this.colegialesBody.fechapresentacion == null || this.colegialesBody.fechapresentacion == undefined) ||
      (this.inscritoSeleccionado == null || this.inscritoSeleccionado == undefined || this.inscritoSeleccionado === "") ||
      (this.datosColegiales.length > 0 && (!this.nuevoEstadoColegial.fechaEstadoStr || !this.nuevoEstadoColegial.situacion ||
        !this.nuevoEstadoColegial.situacionResidente) && this.isCrearColegial)) {
      this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios') }];
      this.resaltadoDatosColegiales = true;
    } else {
      if ((this.nuevoEstadoColegial != undefined && this.nuevoEstadoColegial.situacion != "20") || this.datosColegiales[1].idEstado == "20"){
        if(this.datosColegiales[0].nuevoRegistro == undefined){
          if(this.datosColegiales[0].idEstado != undefined && this.datosColegiales[0].situacionResidente != undefined && this.datosColegiales[0].fechaEstadoStr){
            this.comprobarTurnosGuardias('guardarDatosColegiales');
          }else{
            this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios') }];
            this.resaltadoDatosColegiales = true;
          }
        }else{
          this.comprobarTurnosGuardias('guardarDatosColegiales');
        }
        
      }     
      else{
        this.comprobarAuditoria('guardarDatosColegiales');
      }

    }
    // }
  }
  comprobarAuditoria(tipoCambio) {
    // modo creación
    if (this.showMessageInscripcion && tipoCambio == 'guardarDatosColegiales' && this.tieneTurnosGuardias) {

      if (!this.isCrearColegial) {
        this.datosColegiales[0].cambioEstado = true;
      }
      this.callConfirmationServiceUpdate(tipoCambio);

    } else {

      if (this.ocultarMotivo) {
        if (tipoCambio == 'guardarDatosColegiales') {
          this.datosColegiales[0].cambioEstado = false;
          this.guardarColegiales();
        }
      } else {
        if (!this.esNewColegiado) {
          this.tipoCambioAuditoria = tipoCambio;
          this.displayAuditoria = true;
          this.showGuardarAuditoria = false;
        } else {
          if (tipoCambio == 'guardarDatosColegiales') {
            this.guardarColegiales();
          }
        }
      }

      // mostrar la auditoria depende de un parámetro que varía según la institución
      this.generalBody.motivo = undefined;
    }

  }
  callConfirmationServiceUpdate(tipoCambio) {
    let mess = this.translateService.instant("message.fichaColegial.informarBajaInscripciones.cambioEstadoColegial");
    this.icon = "fa fa-edit";
    let keyConfirmation = "bajaInscripcionesUpdate";

    this.confirmationService.confirm({
      key: keyConfirmation,
      message: mess,
      icon: this.icon,
      accept: () => {
        this.showMessageInscripcion = false;

        if (this.ocultarMotivo) {
          if (tipoCambio == 'guardarDatosColegiales') {
            this.guardarColegiales();
          }
        } else {
          if (!this.esNewColegiado) {
            this.tipoCambioAuditoria = tipoCambio;
            this.displayAuditoria = true;
            this.showGuardarAuditoria = false;
          } else {
            if (tipoCambio == 'guardarDatosColegiales') {
              this.guardarColegiales();
            }
          }
        }

        // mostrar la auditoria depende de un parámetro que varía según la institución
        this.generalBody.motivo = undefined;
        // this.showGuardarAuditoria = false;
      },
      reject: () => {
        this.showMessageInscripcion = true;
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
  comprobarTurnosGuardias(tipoCambio): void {
    //Si el cambio de estado es de ejerciente a no ejerciente
    //Comprobamos si tiene turnos o guardias
    this.sigaServices
      .post("fichaDatosColegiales_searchTurnosGuardias", this.colegialesBody)
      .subscribe(
        data => {
          let resultado = JSON.parse(data["body"]);
          if (resultado.valor == "0") {
            this.tieneTurnosGuardias = false;
          } else {
            this.tieneTurnosGuardias = true;
          }
        },
        error => {
          let resultado = JSON.parse(error["error"]);
          this.tieneTurnosGuardias = false;
          this.progressSpinner = false;
        },
        () => {
          this.comprobarAuditoria('guardarDatosColegiales');
        }


      );
  }
  onChangeDropEstadoColegial(event, selectedDatos) {
    if (!this.isCrearColegial && event.value != null && event.value != undefined) {
      let identificacion = this.comboSituacion.find(
        item => item.value === event.value
      );

      if (selectedDatos.estadoColegial != identificacion.label) {
        this.activarGuardarColegiales = false;
      }
      selectedDatos.estadoColegial = identificacion.label;
      //this.colegialesBody.estadoColegial = identificacion.label;
      this.cambioEstadoResumen();    
    }
    this.isRestablecer = true;
    this.showMessageInscripcion = true;
    this.activacionGuardarColegiales();
  }

  comprobarCampoMotivo() {
    if (
      this.generalBody.motivo != undefined &&
      this.generalBody.motivo != "" &&
      this.generalBody.motivo.trim() != ""
    ) {
      this.showGuardarAuditoria = true;
    } else {
      this.showGuardarAuditoria = false;
    }
  }

  guardarAuditoria() {
    if (this.tipoCambioAuditoria == 'guardarDatosColegiales') {
      this.colegialesBody.motivo = this.generalBody.motivo;
      this.guardarColegiales();
    }
  }
  onInitDirecciones() {
    this.bodyDirecciones = new DatosDireccionesItem();
    this.bodyDirecciones.idPersona = this.idPersona;
    this.bodyDirecciones.historico = false;
    this.searchDirecciones();
  }

  onChangeCalendarTable(event, selectedDatos) {
    if (this.isCrearColegial) {
      this.nuevoEstadoColegial.fechaEstadoStr = event;
    } else {
      selectedDatos.fechaEstadoStr = event;
      this.datosColegiales[0].fechaEstadoNueva = event;
      this.datosColegiales[0].fechaEstadoStr = event;
      this.activarGuardarColegiales = true;
    }
    this.isRestablecer = true;
    this.activacionGuardarColegiales();
    this.cambioEstadoResumen();

  }
  aceptInformation() {
    this.information = false;
    this.displayAuditoria = false;
  }
  callConfirmationServiceDelete(selectedDatosColegiales) {
    let mess = this.translateService.instant("message.fichaColegial.informarBajaInscripciones.cambioEstadoColegial");
    this.icon = "fa fa-edit";
    let keyConfirmation = "bajaInscripcionesDelete";

    this.confirmationService.confirm({
      key: keyConfirmation,
      message: mess,
      icon: this.icon,
      accept: () => {
        this.eliminarEstadoColegial(selectedDatosColegiales);
        this.showMessageInscripcion = false;

      },
      reject: () => {
        this.showMessageInscripcion = false;
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
  eliminarEstadoColegial(selectedItem) {
    if (this.datosColegiales[1].idEstado == "20" && selectedItem.idEstado != "20") {
      //Se comprueba si le falta alguna direccion
      //Si no le falta llamamos al servicio para guardar los cambios
      if (this.comprobarDireccion(true)) {
        this.callServiceEliminarEstadoColegial(selectedItem);
        //Si falta se muestra un mensaje indicando que se creara esa direccion que falta automaticamente
      } else {
        this.displayDelete = true;
        this.selectedItemDelete = selectedItem;
      }
      //Si el cambio es de ejerciente a no ejerciente
    } else if (selectedItem.idEstado == "20" && this.datosColegiales[1].idEstado != "20") {
      //Se comprueba si le falta alguna direccion
      //Si no le falta llamamos al servicio para guardar los cambios
      if (this.comprobarDireccion(false)) {
        this.callServiceEliminarEstadoColegial(selectedItem);
        //Si falta se muestra un mensaje indicando que se creara esa direccion que falta automaticamente
      } else {
        this.displayDelete = true;
        this.selectedItemDelete = selectedItem;
      }
      //Si el cambio pertenece a un estado no ejerciente, se elimina sin realizar comprobaciones
    } else {
      this.callServiceEliminarEstadoColegial(selectedItem);
    }
  }

  callServiceEliminarEstadoColegial(selectedItem) {
    this.displayDelete = false;
    this.progressSpinner = true;


    let estadoCol = JSON.parse(JSON.stringify(selectedItem));
    selectedItem = JSON.parse(JSON.stringify(this.colegialesBody));
    selectedItem.fechaEstado = estadoCol.fechaEstado;
    selectedItem.observaciones = estadoCol.observaciones;
    selectedItem.situacionResidente = estadoCol.situacionResidente;
    selectedItem.idInstitucion = this.colegialesBody.idInstitucion;
    selectedItem.idPersona = this.colegialesBody.idPersona;
    selectedItem.situacionResidente = this.datosColegiales[1].situacionResidente;
    selectedItem.idEstado = this.datosColegiales[1].idEstado;
    this.colegialesBody.estadoColegial = this.datosColegiales[1].estadoColegial;

    this.sigaServices
      .post("fichaDatosColegiales_datosColegialesDeleteEstado", selectedItem)
      .subscribe(
        data => {

          this.progressSpinner = false;
          this.isCrearColegial = false;
          this.isRestablecer = false;
          this.activarGuardarColegiales = false;
          this.filaEditable = false;
          this.isEliminarEstadoColegial = false;
          this.numSelectedColegiales = 0;
          this.onInitColegiales();
          if (JSON.parse(data.body).error != null &&
            JSON.parse(data.body).error != undefined &&
            JSON.parse(data.body).error != "") {
            let msg = JSON.parse(data.body).error.message;
            this.showSuccessDetalle(msg);
          } else {
            this.showSuccess();

          } this.searchDirecciones();
        },
        error => {
          console.log(error);
          this.progressSpinner = false;
          this.isCrearColegial = false;
          this.isRestablecer = false;
          this.activarGuardarColegiales = false;
          this.filaEditable = false;
          this.isEliminarEstadoColegial = false;
          this.onInitColegiales();
          this.numSelectedColegiales = 0;

          if (JSON.parse(error.error).error != null && JSON.parse(error.error).error != "" && JSON.parse(error.error).error != undefined) {
            let msg = JSON.parse(error.error).error.message;
            this.showFailDetalle(msg);
          } else {
            this.showFail();
          }
        }, () => {
          this.numSelectedColegiales = 0;
          if (this.datosColegiales[0].situacionResidente == "1" || this.datosColegiales[0].situacionResidente == "Si") {
            this.residente = "Si";
          } else {
            this.residente = "No";
          }
        }
      );
    this.isRestablecer = false;
  }

  blurFechaIncorporacion(e) {

    let REGEX = /[a-zA-Z]/;
    //evento necesario para informar de las fechas que metan manualmente (escribiendo o pegando)
    if (!this.fechaIncorporacionSelected) {
      let newValue = e.target.value;
      if (newValue != null && newValue != '') {
        if (!REGEX.test(newValue) && newValue.length < 11) {
          if (this.comprobarFecha(newValue, this.calendarFechaIncorporacion.minDate)) {
            let fecha = moment(newValue, 'DD/MM/YYYY').toDate();
            this.colegialesBody.incorporacion = fecha;
            this.calendarFechaIncorporacion.onSelect.emit();
          } else {
            this.calendarFechaIncorporacion.overlayVisible = false;
            this.colegialesBody.incorporacion = null;
          }
        } else {
          this.calendarFechaIncorporacion.overlayVisible = false;
          this.colegialesBody.incorporacion = null;
        }
      }
    }
  }

  inputFechaIncorporacion(e) {
    this.fechaIncorporacionSelected = false;

    //evento necesario para informar de las fechas que borren manualmente (teclado)
    if (e.inputType == 'deleteContentBackward') {
      this.borrarFechaIncorporacion();
    }
  }

  borrarFechaIncorporacion() {
    this.colegialesBody.incorporacion = null;
    this.fechaIncorporacionSelected = true;
    this.calendarFechaIncorporacion.onClearButtonClick("");

  }

  fechaHoyFechaIncorporacion() {
    this.colegialesBody.incorporacion = new Date();
    this.calendarFechaIncorporacion.overlayVisible = false;
    this.fechaIncorporacionSelected = true;
    this.calendarFechaIncorporacion.onSelect.emit();

  }
  comprobarFecha(newValue, minDate) {
    let hoy = new Date();
    let fecha = moment(newValue, 'DD/MM/YYYY').toDate();
    let year = hoy.getFullYear();
    let yearFecha = fecha.getFullYear();
    if (yearFecha >= year - 80 && yearFecha <= year + 20) {
      if (minDate) {
        if (fecha >= minDate) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
  blurFechaPresentacion(e) {

    let REGEX = /[a-zA-Z]/;
    //evento necesario para informar de las fechas que metan manualmente (escribiendo o pegando)
    if (!this.fechaPresentacionSelected) {
      let newValue = e.target.value;
      if (newValue != null && newValue != '') {
        if (!REGEX.test(newValue) && newValue.length < 11) {
          if (this.comprobarFecha(newValue, this.calendarFechaPresentacion.minDate)) {
            let fecha = moment(newValue, 'DD/MM/YYYY').toDate();
            this.colegialesBody.fechapresentacion = fecha;
            this.calendarFechaPresentacion.onSelect.emit();
          } else {
            this.calendarFechaPresentacion.overlayVisible = false;
            this.colegialesBody.fechapresentacion = null;
          }
        } else {
          this.calendarFechaPresentacion.overlayVisible = false;
          this.colegialesBody.fechapresentacion = null;
        }
      }
    }
  }

  inputFechaPresentacion(e) {
    this.fechaPresentacionSelected = false;

    //evento necesario para informar de las fechas que borren manualmente (teclado)
    if (e.inputType == 'deleteContentBackward') {
      this.borrarFechaPresentacion();
    }
  }

  borrarFechaPresentacion() {
    this.colegialesBody.fechapresentacion = null;
    this.fechaPresentacionSelected = true;
    this.calendarFechaPresentacion.onClearButtonClick("");
  }

  fechaHoyFechaPresentacion() {
    this.colegialesBody.fechapresentacion = new Date();
    this.calendarFechaPresentacion.overlayVisible = false;
    this.fechaPresentacionSelected = true;
    this.calendarFechaPresentacion.onSelect.emit();

  }

  blurFechaJura(e) {

    let REGEX = /[a-zA-Z]/;
    //evento necesario para informar de las fechas que metan manualmente (escribiendo o pegando)
    if (!this.fechaJuraSelected) {
      let newValue = e.target.value;
      if (newValue != null && newValue != '') {
        if (!REGEX.test(newValue) && newValue.length < 11) {
          if (this.comprobarFecha(newValue, this.calendarFechaJura.minDate)) {
            let fecha = moment(newValue, 'DD/MM/YYYY').toDate();
            this.colegialesBody.fechaJura = fecha;
            this.calendarFechaJura.onSelect.emit();
          } else {
            this.calendarFechaJura.overlayVisible = false;
            this.colegialesBody.fechaJura = null;
          }
        } else {
          this.calendarFechaJura.overlayVisible = false;
          this.colegialesBody.fechaJura = null;
        }
      }
    }
  }

  inputFechaJura(e) {
    this.fechaJuraSelected = false;

    //evento necesario para informar de las fechas que borren manualmente (teclado)
    if (e.inputType == 'deleteContentBackward') {
      this.borrarFechaJura();
    }
  }

  borrarFechaJura() {
    this.colegialesBody.fechaJura = null;
    this.fechaJuraSelected = true;
    this.calendarFechaJura.onClearButtonClick("");
  }

  fechaHoyFechaJura() {
    this.colegialesBody.fechaJura = new Date();
    this.calendarFechaJura.overlayVisible = false;
    this.fechaJuraSelected = true;
    this.calendarFechaJura.onSelect.emit();

  }

  blurFechaTitulacion(e) {

    let REGEX = /[a-zA-Z]/;
    //evento necesario para informar de las fechas que metan manualmente (escribiendo o pegando)
    if (!this.fechaTitulacionSelected) {
      let newValue = e.target.value;
      if (newValue != null && newValue != '') {
        if (!REGEX.test(newValue) && newValue.length < 11) {
          if (this.comprobarFecha(newValue, this.calendarFechaTitulacion.minDate)) {
            let fecha = moment(newValue, 'DD/MM/YYYY').toDate();
            this.colegialesBody.fechaTitulacion = fecha;
            this.calendarFechaTitulacion.onSelect.emit();
          } else {
            this.calendarFechaTitulacion.overlayVisible = false;
            this.colegialesBody.fechaTitulacion = null;
          }
        } else {
          this.calendarFechaTitulacion.overlayVisible = false;
          this.colegialesBody.fechaTitulacion = null;
        }
      }
    }
  }

  inputFechaTitulacion(e) {
    this.fechaTitulacionSelected = false;

    //evento necesario para informar de las fechas que borren manualmente (teclado)
    if (e.inputType == 'deleteContentBackward') {
      this.borrarFechaTitulacion();
    }
  }

  borrarFechaTitulacion() {
    this.colegialesBody.fechaTitulacion = null;
    this.fechaTitulacionSelected = true;
    this.calendarFechaTitulacion.onClearButtonClick("");
  }

  fechaHoyFechaTitulacion() {
    this.colegialesBody.fechaTitulacion = new Date();
    this.calendarFechaTitulacion.overlayVisible = false;
    this.fechaTitulacionSelected = true;
    this.calendarFechaTitulacion.onSelect.emit();

  }
  clear() {
    this.msgs = [];
  }

  getCols() {
    this.colsColegiales = [
      {
        field: "fechaEstado",
        header: "censo.nuevaSolicitud.fechaEstado"
      },
      {
        field: "estadoColegial",
        header: "censo.fichaIntegrantes.literal.estado"
      },
      {
        field: "situacionResidente",
        header: "censo.ws.literal.residente"
      },
      {
        field: "observaciones",
        header: "gratuita.mantenimientoLG.literal.observaciones"
      }
    ];
    this.rowsPerPage = [
      {
        label: 10,
        value: 10
      },
      {
        label: 20,
        value: 20
      },
      {
        label: 30,
        value: 30
      },
      {
        label: 40,
        value: 40
      }
    ];
  }
  isOpenReceive(event) {
    let fichaPosible = this.esFichaActiva(event);
    if (fichaPosible == false) {
      this.abreCierraFicha(event);
    }
    // window.scrollTo(0,0);
  }
  getLetrado() {
    if (JSON.parse(sessionStorage.getItem("isLetrado")) == true) {
      this.isLetrado = true;
    } else {
      this.isLetrado = !this.permisos;
    }
  }

  checkAcceso() {
    this.progressSpinner = true;
    let procesos: any = ["12P"];
    let proceso;
    procesos = procesos.map(it => {
      proceso = it;
      it = new ControlAccesoDto();
      it.idProceso = proceso;
      return it

    })
    this.sigaServices.post("acces_controls", procesos).subscribe(
      data => {
        let permisos = JSON.parse(data.body);
        let permisosArray = permisos.permisoItems;
        this.activateNumColegiado = permisosArray[0].derechoacceso == 3 ? true : false;
      },
      err => {
        console.log(err);
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }

}
