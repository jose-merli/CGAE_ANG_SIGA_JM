import { Component, OnInit, ChangeDetectorRef, ViewChild, SimpleChanges, Input, OnChanges, Output, EventEmitter, ViewEncapsulation, ElementRef } from '@angular/core';
import { DatosDireccionesItem } from '../../../../../models/DatosDireccionesItem';
import { ComboEtiquetasItem } from '../../../../../models/ComboEtiquetasItem';
import { DatosDireccionesObject } from '../../../../../models/DatosDireccionesObject';
import { DatosGeneralesItem } from '../../../../../models/DatosGeneralesItem';
import { FichaColegialGeneralesItem } from '../../../../../models/FichaColegialGeneralesItem';
import { SigaServices } from '../../../../../_services/siga.service';
import { FichaColegialColegialesItem } from '../../../../../models/FichaColegialColegialesItem';
import { TranslateService } from '../../../../../commons/translate';
import { ConfirmationService } from '../../../../../../../node_modules/primeng/api';
import { DomSanitizer } from '../../../../../../../node_modules/@angular/platform-browser';
import { FichaColegialGeneralesObject } from '../../../../../models/FichaColegialGeneralesObject';
import { DatosBancariosItem } from '../../../../../models/DatosBancariosItem';
import * as moment from 'moment';
import { SolicitudIncorporacionItem } from '../../../../../models/SolicitudIncorporacionItem';
import { FichaColegialColegialesObject } from '../../../../../models/FichaColegialColegialesObject';
import { ControlAccesoDto } from '../../../../../models/ControlAccesoDto';
import { Calendar, AutoComplete } from 'primeng/primeng';
import { esCalendar, catCalendar, euCalendar, glCalendar } from '../../../../../utils/calendar';
import { MultiSelect } from 'primeng/multiselect';
import { StringObject } from "../../../../../models/StringObject";
import { RevisionAutLetradoItem } from '../../../../../models/RevisionAutLetradoItem';
import { Router } from '@angular/router';
@Component({
  selector: 'app-datos-generales-ficha-colegial',
  templateUrl: './datos-generales-ficha-colegial.component.html',
  styleUrls: ['./datos-generales-ficha-colegial.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DatosGeneralesFichaColegialComponent implements OnInit, OnChanges {

  private DNI_LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE";

  showGuardar: boolean = false;
  datosColegialesActual: any[] = [];
  msgDir = "";
  selectMultipleDirecciones: boolean = false;
  fechaMinimaEstadoColegialMod: Date;
  DescripcionDatosDireccion;
  searchDireccionIdPersona = new DatosDireccionesObject();
  tarjetaGeneralesNum: string;
  @Input() tarjetaGenerales: string;
  emptyLoadFichaColegial: boolean = false;
  disabledNif: boolean = false;
  es: any = esCalendar;
  suggestTopics: any[] = [];
  resaltadoDatosGenerales: boolean = false;

  comboTopics: any[] = [];
  item: ComboEtiquetasItem = new ComboEtiquetasItem();
  msgs = [];
  createItems: Array<ComboEtiquetasItem> = new Array<ComboEtiquetasItem>();
  activacionTarjeta: boolean = false;
  publicarDatosContacto: boolean;
  control: boolean = false;
  etiquetasPersonaJuridica: any[] = [];
  bodyRegTel: any[] = [];
  selectedDatosColegiales;
  situacionPersona: String;
  isEliminarEstadoColegial: boolean = false;
 openFicha: boolean = false;
  information: boolean = false;
  checkDatosColegiales: any[] = [];
  datosColegialesInit: any[] = [];

  nifCif: StringObject = new StringObject();
  activarGuardarGenerales: boolean = false;
  fechaNacCambiada: boolean = false;
  edadCalculada: any;
  residente: String;
  inscritoDisabled: boolean = false;
  maxNumColegiado: string;
  filaEditable: boolean = false;
  inscritoChange: boolean = false;
  fichaPosible = {
    key: "generales",
    activa: false
  }
  inscritoSeleccionado: String = "00";
  inscrito: string;
  generalTratamiento: any[] = [];
  generalEstadoCivil: any[] = [];
  generalIdiomas: any[] = [];
  comboSituacion: any[] = [];
  tipoIdentificacion: any[] = [];
  comboTipoSeguro: any[] = [];
  fechaNacimiento: Date;
  fechaAlta: Date;
  comisiones: boolean;
  guiaJudicial: boolean;
  publicidad: boolean;
  partidoJudicial: any;
  ocultarMotivo: boolean = undefined;
  esNewColegiado: boolean = false;
  @Input() esColegiado: boolean = null;
  archivoDisponible: boolean = false;
  existeImagen: boolean = false;
  showGuardarAuditoria: boolean = false;
  etiquetasPersonaJuridicaSelecionados: any[] = [];
  imagenPersona: any;
  fechaMinimaEstadoColegial: Date;
  comboSexo = [
    { label: "Hombre", value: "H" },
    { label: "Mujer", value: "M" }
  ];
  checkColegialesBody: FichaColegialColegialesItem = new FichaColegialColegialesItem();
  datosDirecciones: DatosDireccionesItem[] = [];
  selectedDatosDirecciones;
  selectAll: boolean = false;
  partidoJudicialObject: DatosDireccionesObject = new DatosDireccionesObject();
  partidoJudicialItem: DatosDireccionesItem = new DatosDireccionesItem();
  displayServicios: boolean = false;
  atrasRegTel: String = "";
  fechaHoy: Date;
  datosTarjetaResumen;
  iconoTarjetaResumen = "clipboard";



  mostrarDatosCertificados: boolean = false;
  mostrarDatosSanciones: boolean = false;
  backgroundColor;
  mostrarDatosSociedades: boolean = false;
  tratamientoDesc: String;
  checkGeneralBody: FichaColegialGeneralesItem = new FichaColegialGeneralesItem();
  isTrue: boolean = false;
  mostrarDatosCurriculares: boolean = false;
  showMessageInscripcion: boolean = false;
  tieneTurnosGuardias: boolean = false;
  datosColegiales: any[] = [];
  tipoCambioAuditoria: String;
  generalError: FichaColegialGeneralesObject = new FichaColegialGeneralesObject();
  activacionEditar: boolean = true;
  solicitudModificacionMens: string;
  isCrear: boolean = false;
  solicitudEditar: SolicitudIncorporacionItem = new SolicitudIncorporacionItem();
  colegialesObject: FichaColegialColegialesObject = new FichaColegialColegialesObject();
  isRestablecer: boolean = false;
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
  bodyDirecciones: DatosDireccionesItem;
  bodyDatosBancarios: DatosBancariosItem;
  icon;
  activarGuardarColegiales: boolean = false;
  disabledAction: boolean = false;
  mostrarDatosDireccion: boolean = false;
  isFechaBajaCorrect: boolean = false;
  mostrarDatosBancarios: boolean = false;
  autocompletar: boolean = false;
  generalBody: FichaColegialGeneralesItem = new FichaColegialGeneralesItem();
  isCrearColegial: boolean = false;
  file: File = undefined;
  comboEtiquetas: any[] = [];
  numSelectedColegiales: number = 0;
  numSelectedDatosRegtel: number = 0;
  progressSpinner: boolean = false;
  idPersona: any;
  isColegiadoEjerciente: boolean = false;
  yearRange: string;
  @ViewChild('someDropdown') someDropdown: MultiSelect;
  resultsTopics: any[] = [];
  displayAuditoria: boolean = false;
  permisos: boolean = true;
  nuevoEstadoColegial: FichaColegialColegialesItem = new FichaColegialColegialesItem();
  colegialesBody: FichaColegialColegialesItem = new FichaColegialColegialesItem();
  updateItems: Map<String, ComboEtiquetasItem> = new Map<
    String,
    ComboEtiquetasItem
    >();
  textFilter = 'Etiquetas';

  @ViewChild("calendarFechaNacimiento") calendarFechaNacimiento: Calendar;
  fechaNacimientoSelected: boolean = true;

  @ViewChild("autocompleteTopics")
  autocompleteTopics: AutoComplete;

  isLetrado: boolean;
  @Output() idPersonaNuevo = new EventEmitter<any>();
  @Output() aparecerLOPD = new EventEmitter<any>();
  @Output() datosTarjetaResumenEmit = new EventEmitter<any>();
  @Input() openGen;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Input() datosTratamientos;
  constructor(private sigaServices: SigaServices,
    private changeDetectorRef: ChangeDetectorRef,
    private translateService: TranslateService,
    private confirmationService: ConfirmationService,
    private sanitizer: DomSanitizer,
    private router: Router,

  ) { }

  ngOnInit() {
    this.resaltadoDatosGenerales = true;
    this.getLetrado();
    sessionStorage.removeItem("direcciones");
    sessionStorage.removeItem("situacionColegialesBody");
    sessionStorage.removeItem("fichaColegial");
    sessionStorage.setItem("permisos", JSON.stringify(this.permisos)); // No se si esto hace falta
    
    if (sessionStorage.getItem("busquedaCensoGeneral") == "true") {
      this.disabledNif = true;
    } else {
      this.disabledNif = false;
    }

    if (sessionStorage.getItem("disabledAction") == "true") { // Esto disablea tela de cosas funciona como medio permisos. 
      // Es estado baja colegial (historico?)
      this.disabledAction = true;
    } else {
      this.disabledAction = false;
    }


    // if (sessionStorage.getItem("solimodifMensaje")) {
    //   this.solicitudModificacionMens = sessionStorage.getItem("solimodifMensaje");
    //   sessionStorage.removeItem("solimodifMensaje");
    // }

    if (
      sessionStorage.getItem("personaBody") != null &&
      sessionStorage.getItem("personaBody") != undefined &&
      JSON.parse(sessionStorage.getItem("esNuevoNoColegiado")) != true
    ) {
      // sessionStorage.removeItem("esNuevoNoColegiado");
      this.generalBody = new FichaColegialGeneralesItem();
      this.generalBody = JSON.parse(sessionStorage.getItem("personaBody"));
      this.checkGeneralBody = new FichaColegialGeneralesItem();
      this.checkGeneralBody = JSON.parse(sessionStorage.getItem("personaBody"));
      this.colegialesBody = JSON.parse(sessionStorage.getItem("personaBody"));
      if (this.colegialesBody.situacionResidente == "0") this.colegialesBody.situacionResidente = "No";
     if (this.colegialesBody.situacionResidente == "1") this.colegialesBody.situacionResidente = "Si";

      this.checkColegialesBody = JSON.parse(JSON.stringify(this.colegialesBody));
      this.idPersona = this.generalBody.idPersona;

      this.tipoCambioAuditoria = null;
      // this.checkAcceso();
      //this.onInitGenerales();
      //this.onInitColegiales();
    } else {
      if (sessionStorage.getItem("busquedaCensoGeneral") == "true") {
        this.generalBody = new FichaColegialGeneralesItem();
        this.isLetrado = false;
         let enviar = JSON.parse(sessionStorage.getItem("nuevoNoColegiado"));
        this.colegialesBody = JSON.parse(sessionStorage.getItem("personaBody"));
        this.generalBody = enviar;
        this.generalBody.nif = enviar.numeroIdentificacion;
        this.generalBody.apellidos1 = enviar.apellido1;
        this.generalBody.soloNombre = enviar.nombre;
        this.generalBody.idInstitucion = enviar.idInstitucion;
        this.generalBody.apellidos2 = enviar.apellido2;
        this.generalBody.idTratamiento = undefined;
        this.situacionPersona = enviar.idEstado;
        if (this.generalBody.fechaNacimiento != null && this.generalBody.fechaNacimiento != undefined) {
          this.fechaNacimiento = this.arreglarFecha(this.generalBody.fechaNacimiento);
        }
        this.colegialesBody = JSON.parse(JSON.stringify(this.generalBody));
        this.compruebaDNI();
      } else if (sessionStorage.getItem("nuevoNoColegiado")) {
        let enviar = JSON.parse(sessionStorage.getItem("nuevoNoColegiado"));
        this.generalBody = new FichaColegialGeneralesItem();
        this.colegialesBody = new FichaColegialColegialesItem();
        this.generalBody = enviar;
        this.generalBody.nif = enviar.numeroIdentificacion;
        this.generalBody.apellidos1 = enviar.apellido1;
        this.generalBody.soloNombre = enviar.nombre;
        this.generalBody.idInstitucion = enviar.idInstitucion;
        this.generalBody.apellidos2 = enviar.apellido2;
        this.generalBody.idTratamiento = undefined;
        this.situacionPersona = enviar.idEstado;
        if (this.generalBody.fechaNacimiento != null && this.generalBody.fechaNacimiento != undefined) {
          this.fechaNacimiento = this.arreglarFecha(this.generalBody.fechaNacimiento);
        }
        // this.desactivarVolver = false;
        if (sessionStorage.getItem("nifNuevo") != undefined) {
          this.generalBody.nif = sessionStorage.getItem("nifNuevo");
          let bodyNuevo = JSON.parse(sessionStorage.getItem("bodyNuevo"));
          this.generalBody.soloNombre = bodyNuevo.nombre;
          this.generalBody.apellidos1 = bodyNuevo.primerApellido;
          this.generalBody.apellidos2 = bodyNuevo.segundoApellido;
          sessionStorage.removeItem("nifNuevo");
          sessionStorage.removeItem("bodyNuevo");

        }

        this.colegialesBody = JSON.parse(JSON.stringify(this.generalBody));
        this.compruebaDNI();
      } else {
        this.generalBody = new FichaColegialGeneralesItem();
        this.colegialesBody = new FichaColegialColegialesItem();
      }

     // this.searchDatosBancariosIdPersona.datosBancariosItem[0] = new DatosBancariosItem();
    }
    // Control de si es creacion o no 
    if (JSON.parse(sessionStorage.getItem("esNuevoNoColegiado"))) {
      this.esNewColegiado = true;
      this.activacionEditar = false;
      this.emptyLoadFichaColegial = false;
      // this.desactivarVolver = false;
      this.activacionTarjeta = false;

      // sessionStorage.removeItem("esNuevoNoColegiado");
      // this.onInitGenerales();
    } else {
      this.activacionEditar = true;
      this.esNewColegiado = false;
      this.activacionTarjeta = true;
    }
    this.getLenguage();
    this.getYearRange();
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
          //console.log(err);
        }
      );
    this.filterLabelsMultiple();
    if (!(this.generalBody.nif != "" && this.generalBody.nif != undefined && this.generalBody.idTipoIdentificacion != "" &&
    this.generalBody.idTipoIdentificacion != undefined && this.generalBody.soloNombre != undefined && this.generalBody.apellidos1 != undefined &&
    this.generalBody.soloNombre != "" && this.generalBody.apellidos1 != "" && this.generalBody.idTratamiento != null &&
    this.generalBody.idLenguaje != "" && this.generalBody.idLenguaje != undefined)) {
        this.abreCierraFicha("generales");
      }
  }

  ngOnChanges(changes: SimpleChanges) {
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
    if(this.tarjetaGenerales == "3" || this.tarjetaGenerales == "2"){
      this.onInitGenerales();
      this.getSituacionPersona();
      this.getInscritoInit();
      this.getSituacionPersona();

      if(this.tarjetaGenerales == "3"){
        this.permisos = true;
      }else{
        this.permisos = false;
      }
      this.getLetrado();
    }
    if (this.openGen == true) {
      if (this.openFicha == false) {
        this.abreCierraFicha('colegiales')
      }
    }
  }
  onInitGenerales() {
    // this.activacionGuardarGenerales();
    this.etiquetasPersonaJuridicaSelecionados = this.generalBody.etiquetas;
    // this.checkGeneralBody.etiquetas = JSON.parse(JSON.stringify(this.generalBody.etiquetas));
    if (!this.esNewColegiado) {
      this.obtenerEtiquetasPersonaJuridicaConcreta();
      this.getTopicsCourse();
      this.cargarImagen(this.idPersona);
      this.stringAComisiones();
      this.fechaNacimiento = this.generalBody.fechaNacimiento;
      this.fechaAlta = this.generalBody.fechaAlta;
    }
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
        //console.log(err);
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
        //console.log(err);
      }
    );

    this.sigaServices.get("etiquetas_lenguaje").subscribe(
      n => {
        this.generalIdiomas = n.combooItems;
        this.arregloTildesCombo(this.generalIdiomas);

      },
      err => {
        //console.log(err);
      }
    );

    this.sigaServices.get("busquedaColegiados_situacion").subscribe(
      n => {
        this.comboSituacion = n.combooItems;
        this.arregloTildesCombo(this.comboSituacion);

      },
      err => {
        //console.log(err);
      }
    );

    if (this.generalBody.fechaNacimiento) {
      this.calcularEdad(this.generalBody.fechaNacimiento);
    }

    if (this.esNewColegiado) {
      this.abreCierraFicha("generales");
    } else {
      this.obtenerPartidoJudicial();
    }

    this.getComboTemas();

    if (!(this.generalBody.nif != "" && this.generalBody.nif != undefined && this.generalBody.idTipoIdentificacion != "" &&
    this.generalBody.idTipoIdentificacion != undefined && this.generalBody.soloNombre != undefined && this.generalBody.apellidos1 != undefined &&
    this.generalBody.soloNombre != "" && this.generalBody.apellidos1 != "" && this.generalBody.idTratamiento != null &&
    this.generalBody.idLenguaje != "" && this.generalBody.idLenguaje != undefined)) {
        this.abreCierraFicha("generales");
      }
  }

  closeDialogConfirmation(item) {
    // this.checked = false;

    // if (this.isCrear) {
    //   // Borramos el residuo de la etiqueta
    //   this.autoComplete.multiInputEL.nativeElement.value = null;
    // } else {
    //   // Borramos el residuo de la etiqueta vieja
    //   this.deleteLabel(item);
    // } 

    // // Borramos las fechas
    // this.item = new ComboEtiquetasItem();
    // this.item.fechaInicio = null;
    // this.item.fechaBaja = null;
  }

  validateFields() {
    if (
      this.item.fechaInicio != undefined &&
      this.item.fechaInicio != null
      // this.item.fechaBaja != undefined &&
      // this.item.fechaBaja != null &&
      // this.validateFinalDate() == true
    ) {
      this.fechaHoy = this.transformaFecha(this.item.fechaInicio);
      this.isTrue = true;
    } else {
      this.isTrue = false;
    }
  }

  validateFinalDate(): boolean {
    if (this.item.fechaBaja != undefined && this.item.fechaBaja != null) {
      if (this.item.fechaInicio >= this.item.fechaBaja) {
        this.isFechaBajaCorrect = false;
      } else {
        this.isFechaBajaCorrect = true;
      }
    }

    return this.isFechaBajaCorrect;
  }

  ngAfterViewChecked() {
    this.changeDetectorRef.detectChanges();
  }

  getPartidoJudicial() {
    return this.partidoJudicial;
  }


  clear() {
    this.msgs = []
  }
  // fichaDatosGenerales_partidoJudicialSearch LLAMAR AQUI PARA CONSEGUIR PARTIDO JUDICIAL PARA PONER EN TOOLTIP
  obtenerPartidoJudicial() {
    this.sigaServices
      // .get("fichaDatosGenerales_partidoJudicialSearch")
      .postPaginado(
        "fichaDatosGenerales_partidoJudicialSearch",
        "?numPagina=1",
        this.generalBody
      )
      .subscribe(
        data => {
          this.partidoJudicialObject = JSON.parse(data["body"]);
          // this.partidoJudicialItem = this.partidoJudicialObject.datosDireccionesItem[0];
          // this.partidoJudicial = this.partidoJudicialItem.nombrepartido;
          this.partidoJudicial = "";
          for (let i in this.partidoJudicialObject.datosDireccionesItem) {
            this.partidoJudicialItem = this.partidoJudicialObject.datosDireccionesItem[
              i
            ];
            this.partidoJudicial =
              this.partidoJudicial +
              ",  " +
              this.partidoJudicialItem.nombrepartido;
          }
          this.partidoJudicial = this.partidoJudicial.substring(
            2,
            this.partidoJudicial.length
          );
        },
        err => {
          //console.log(err);
        }
      );
  }

  cerrarAuditoria() {
    this.displayAuditoria = false;
  }

  disabledAutocomplete() {
    if (!this.isLetrado) {
      this.autocompletar = true;
    } else {
      this.autocompletar = false;
    }
  }

  comprobarAuditoria(tipoCambio) {
    // modo creación
    if ((this.generalBody.nif != null && this.generalBody.nif.length > 0) &&
      (this.generalBody.soloNombre != null && this.generalBody.soloNombre.length > 0) &&
      (this.generalBody.apellidos1 != null && this.generalBody.apellidos1.length > 0) &&
      (this.generalBody.idTratamiento != null && this.generalBody.idTratamiento != "") &&
      (this.generalBody.idLenguaje != null && this.generalBody.idLenguaje.length > 0)) {
      if (this.showMessageInscripcion && tipoCambio == 'guardarDatosColegiales' && this.tieneTurnosGuardias) {

        if (!this.isCrearColegial) {
          this.datosColegiales[0].cambioEstado = true;
        }
        this.callConfirmationServiceUpdate(tipoCambio);

      } else {

        if (this.ocultarMotivo) {
          if (tipoCambio == 'solicitudModificacion') {
            this.solicitarModificacionGenerales();
          } else if (tipoCambio == 'guardarDatosColegiales') {
            this.datosColegiales[0].cambioEstado = false;
            this.guardarColegiales();
          } else if (tipoCambio == 'guardarDatosGenerales') {
            this.generalesGuardar();
          }
        } else {
          if (!this.esNewColegiado) {
            this.tipoCambioAuditoria = tipoCambio;
            this.displayAuditoria = true;
            this.showGuardarAuditoria = false;
          } else {
            if (tipoCambio == 'guardarDatosColegiales') {
              this.guardarColegiales();
            } else if (tipoCambio == 'guardarDatosGenerales') {
              this.generalesGuardar();
            }
          }
        }

        // mostrar la auditoria depende de un parámetro que varía según la institución
        this.generalBody.motivo = undefined;
        // this.showGuardarAuditoria = false;

        // if (!this.isLetrado) {
        //   this.generalesGuardar();
        // } else {
        //   this.displayAuditoria = true;
        // }

      }
    } else {
      this.showFailDetalle("Faltan datos por rellenar");
    }
  }
  comprobarTurnosGuardias(tipoCambio): void {
    //Si el cambio de estado es de ejerciente a no ejerciente
    if ((this.nuevoEstadoColegial != undefined && this.nuevoEstadoColegial.situacion != "20") || this.datosColegiales[1].idEstado == "20") {
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
            this.comprobarAuditoria(tipoCambio);
          }


        );
    }
  }

  generalesGuardar() {
    this.progressSpinner = true;
    this.generalBody.nombre = this.generalBody.soloNombre;
    this.generalBody.colegiado = this.esColegiado;
    this.checkGeneralBody.colegiado = this.esColegiado;
    this.arreglarFechas();
    this.comisionesAString(); 
    this.generalBody.etiquetas = [];
    this.generalBody.temasCombo = this.resultsTopics;
    // this.generalBody.grupos = this.etiquetasPersonaJuridicaSelecionados.values;
    for (let i in this.etiquetasPersonaJuridicaSelecionados) {
      const encEtiqueta = this.comboEtiquetas.find(item => item.value.value == this.etiquetasPersonaJuridicaSelecionados[i].value);
      if (encEtiqueta) {
        let etiCopia: ComboEtiquetasItem = new ComboEtiquetasItem();
        etiCopia.label = encEtiqueta.value.label;
        etiCopia.idInstitucion = encEtiqueta.value.idInstitucion;
        etiCopia.idGrupo = encEtiqueta.value.idGrupo;
        this.generalBody.etiquetas[i] = etiCopia;
      }
      /*this.generalBody.etiquetas[i] = this.etiquetasPersonaJuridicaSelecionados[
        i
      ];*/

      // Ya no se permite el crear nuevas etiquetas
      /*if (this.generalBody.etiquetas[i].value != "" && this.generalBody.etiquetas[i].value != null &&
        this.generalBody.etiquetas[i].value != undefined) {
        this.generalBody.etiquetas[i].idGrupo = this.generalBody.etiquetas[i].value
      }*/
    }

    // fichaDatosGenerales_CreateNoColegiado
    if (!this.esNewColegiado) {
      // this.generalBody.idioma = this.idiomaPreferenciaSociedad;

      // let finalUpdateItems: any[] = [];
      // this.updateItems.forEach((valorMap: ComboEtiquetasItem, key: string) => {
      //   this.etiquetasPersonaJuridicaSelecionados.forEach(
      //     (valorSeleccionados: any, index: number) => {
      //       if (
      //         valorSeleccionados.idGrupo == valorMap.idGrupo &&
      //         valorSeleccionados.label == valorMap.label &&
      //         valorSeleccionados.idInstitucion == valorMap.idInstitucion
      //       ) {
      //         finalUpdateItems.push(valorMap);
      //       } else if (
      //         valorSeleccionados.value == valorMap.idGrupo &&
      //         valorSeleccionados.label == valorMap.label &&
      //         valorSeleccionados.idInstitucion == valorMap.idInstitucion
      //       ) {
      //         finalUpdateItems.push(valorMap);
      //       }
      //     }
      //   );
      // });

      // this.generalBody.etiquetas = finalUpdateItems;

      // this.generalBody.motivo = "registro actualizado";

      // this.generalBody.etiquetas = finalUpdateItems;

      this.sigaServices
        .post("fichaDatosGenerales_Update", this.generalBody)
        .subscribe(
          data => {
            // sessionStorage.removeItem("personaBody");
            sessionStorage.setItem(
              "personaBody",
              JSON.stringify(this.generalBody)
            );

            //Se comprueba si se han realizado cambios en los datos generales o en las etiquetas
            //para comprobar si cumple condiciones de los distintos servicios
            if (
              JSON.stringify(this.checkGeneralBody) != JSON.stringify(this.generalBody) || this.etiquetasPersonaJuridicaSelecionados != this.generalBody.etiquetas
            ){
              //IMPORTANTE: LLAMADA PARA REVISION SUSCRIPCIONES (COLASUSCRIPCIONES)
              let peticion = new RevisionAutLetradoItem();
              peticion.idPersona = this.generalBody.idPersona.toString();
              peticion.fechaProcesamiento = new Date();
              this.sigaServices.post("PyS_actualizacionColaSuscripcionesPersona", peticion).subscribe();
            }


            this.checkGeneralBody = new FichaColegialGeneralesItem();

            this.checkGeneralBody = JSON.parse(
              JSON.stringify(this.generalBody)
            );

            if (this.file != undefined) {
              if (this.isLetrado) {
                this.solicitudGuardarImagen(this.idPersona);
              } else {
                this.guardarImagen(this.idPersona);
              }
            }
            this.activacionGuardarGenerales();
            // this.body = JSON.parse(data["body"]);
            this.generalBody.etiquetas = [];
            this.obtenerEtiquetasPersonaJuridicaConcreta();
            this.progressSpinner = false;
            this.cerrarAuditoria();

            this.showSuccess();

          },
          error => {
            //console.log(error);
            this.progressSpinner = false;
            this.activacionGuardarGenerales();
            this.generalError = JSON.parse(error["error"]);
            if (this.generalError.error.message.toString()) {
              this.showFailDetalle(this.translateService.instant(this.generalError.error.message.toString()));
            } else {
              this.showFail();
            }
          }, () => {
            this.aparecerLOPD.emit(this.generalBody.noAparecerRedAbogacia);
            if (this.esColegiado) {
              let nombreCompleto;
              if(this.generalBody.apellidos2 != undefined){
                nombreCompleto = this.generalBody.apellidos1 + " " + this.generalBody.apellidos2 + ", " + this.generalBody.nombre;
              }else{
                nombreCompleto =  this.generalBody.apellidos1 + ", " + this.generalBody.nombre;
              }
              
              this.datosTarjetaResumen = [
                {
                  label: "Apellidos y Nombre",
                  value: nombreCompleto
                },
                {
                  label: "Identificación",
                  value: this.generalBody.nif
                },

                {
                  label: "Número de Colegiado",
                  value: this.generalBody.numColegiado
                },
                {
                  label: "Situación Ejercicio Actual",
                  value: this.situacionPersona
                },
              ];
              this.datosTarjetaResumenEmit.emit(this.datosTarjetaResumen);
            } else {
              let nombreCompleto;
              if(this.generalBody.apellidos2 != undefined){
                nombreCompleto = this.generalBody.apellidos1 + " " + this.generalBody.apellidos2 + ", " + this.generalBody.nombre;
              }else{
                nombreCompleto =  this.generalBody.apellidos1 + ", " + this.generalBody.nombre;
              }
              this.datosTarjetaResumen = [
                {
                  label: "Apellidos y Nombre",
                  value: nombreCompleto
                },
                {
                  label: "Identificación",
                  value: this.generalBody.nif
                },
                {
                  label: "Situación Ejercicio Actual",
                  value: this.situacionPersona
                },
              ];
              this.datosTarjetaResumenEmit.emit(this.datosTarjetaResumen);
            }
          }
          // EVENTO PARA ACTIVAR GUARDAR AL BORRAR UNA ETIQUETA
        );
    } else {
      // let finalUpdateItems: any[] = [];
      // this.updateItems.forEach((valorMap: ComboEtiquetasItem, key: string) => {
      //   this.etiquetasPersonaJuridicaSelecionados.forEach(
      //     (valorSeleccionados: any, index: number) => {
      //       if (
      //         valorSeleccionados.idGrupo == valorMap.idGrupo ||
      //         valorSeleccionados.value == valorMap.idGrupo
      //       ) {
      //         finalUpdateItems.push(valorMap);
      //       }
      //     }
      //   );
      // });

      // this.generalBody.etiquetas = finalUpdateItems;
      this.sigaServices
        .post("fichaDatosGenerales_CreateNoColegiado", this.generalBody)
        .subscribe(
          data => {
            // sessionStorage.removeItem("personaBody");
            sessionStorage.setItem(
              "personaBody",
              JSON.stringify([this.generalBody])
            );
            this.checkGeneralBody = new FichaColegialGeneralesItem();

            this.checkGeneralBody = JSON.parse(
              JSON.stringify(this.generalBody)
            );

            // Activamos modo guardar para poder editar al momento
            this.esNewColegiado = false;
            this.generalBody.idPersona = JSON.parse(data.body).id;
            this.idPersona = this.generalBody.idPersona;
            this.generalBody.colegiado = false;
            this.esColegiado = false;
            this.checkGeneralBody = JSON.parse(
              JSON.stringify(this.generalBody)
            );
            this.activacionGuardarGenerales();
            if (this.file != undefined) {
              if (this.isLetrado) {
                this.solicitudGuardarImagen(this.idPersona);
              } else {
                this.guardarImagen(this.idPersona);
              }
            }
            this.obtenerEtiquetasPersonaJuridicaConcreta();
            this.progressSpinner = false;
            this.showSuccess();
            sessionStorage.removeItem("esNuevoNoColegiado");
            this.activacionEditar = true;
            this.activacionTarjeta = true;
          },
          error => {
            //console.log(error);
            this.progressSpinner = false;
            this.activacionGuardarGenerales();
            this.generalError = JSON.parse(error["error"]);
            if (this.generalError.error.message.toString()) {
              this.showFailDetalle(this.translateService.instant(this.generalError.error.message.toString()));
            } else {
              this.showFail();
            }
          },
          () => {

            

            this.bodyDirecciones = new DatosDireccionesItem();
            this.bodyDatosBancarios = new DatosBancariosItem();
            sessionStorage.setItem("esNuevoNoColegiado", "false");
            sessionStorage.setItem(
              "personaBody",
              JSON.stringify(this.generalBody)
            );
            this.idPersonaNuevo.emit(this.idPersona);
            this.aparecerLOPD.emit(this.generalBody.noAparecerRedAbogacia);

            if (this.esColegiado) {
              let nombreCompleto;
              if(this.generalBody.apellidos2 != undefined){
                nombreCompleto = this.generalBody.apellidos1 + " " + this.generalBody.apellidos2 + ", " + this.generalBody.nombre;
              }else{
                nombreCompleto =  this.generalBody.apellidos1 + ", " + this.generalBody.nombre;
              }
              this.datosTarjetaResumen = [
                {
                  label: "Apellidos y Nombre",
                  value: nombreCompleto
                },
                {
                  label: "Identificación",
                  value: this.generalBody.nif
                },

                {
                  label: "Número de Colegiado",
                  value: this.generalBody.numColegiado
                },
                {
                  label: "Situación Ejercicio Actual",
                  value: this.situacionPersona
                },
              ];
              this.datosTarjetaResumenEmit.emit(this.datosTarjetaResumen);
            } else {
              let nombreCompleto;
              if(this.generalBody.apellidos2 != undefined){
                nombreCompleto = this.generalBody.apellidos1 + " " + this.generalBody.apellidos2 + ", " + this.generalBody.nombre;
              }else{
                nombreCompleto =  this.generalBody.apellidos1 + ", " + this.generalBody.nombre;
              }
              this.datosTarjetaResumen = [
                {
                  label: "Apellidos y Nombre",
                  value: nombreCompleto
                },
                {
                  label: "Identificación",
                  value: this.generalBody.nif
                },
                {
                  label: "Situación Ejercicio Actual",
                  value: this.situacionPersona
                },
              ];
              this.datosTarjetaResumenEmit.emit(this.datosTarjetaResumen);
            }

            if(sessionStorage.getItem('nuevoNoColegiadoDesigna')){
              sessionStorage.removeItem('nuevoNoColegiadoDesigna')
              sessionStorage.setItem("colegiadoGeneralDesignaNuevo", JSON.stringify(this.generalBody));
              this.router.navigate(['/fichaDesignaciones']);
            }
          }
        );
    }

    /*if ((this.generalBody.nif != "" && this.generalBody.nif != undefined && this.generalBody.idTipoIdentificacion != "" &&
    this.generalBody.idTipoIdentificacion != undefined && this.generalBody.soloNombre != undefined && this.generalBody.apellidos1 != undefined &&
    this.generalBody.soloNombre != "" && this.generalBody.apellidos1 != "" && this.generalBody.idTratamiento != null &&
    this.generalBody.idLenguaje != "" && this.generalBody.idLenguaje != undefined)) {
        this.abreCierraFicha("generales");
      }*/
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

  solicitarModificacionGenerales() {
    // fichaDatosGenerales_datosGeneralesSolicitudModificación
    if (JSON.stringify(this.generalBody) == JSON.stringify(this.checkGeneralBody)) {
      if (this.file != undefined) {
        this.solicitudGuardarImagen(this.idPersona);
      }
    } else {
      this.comisionesAString();
      this.sigaServices
        .post(
          "fichaDatosGenerales_datosGeneralesSolicitudModificación",
          this.generalBody
        )
        .subscribe(
          data => {
            // sessionStorage.removeItem("personaBody");
            sessionStorage.setItem(
              "personaBody",
              JSON.stringify(this.generalBody)
            );
            this.checkGeneralBody = new FichaColegialGeneralesItem();
            if (this.file != undefined) {
              this.solicitudGuardarImagen(this.idPersona);
            }
            if (data.error != undefined) {
              if (data.error.description != "") {
                this.solicitudModificacionMens = data.error.description;
              }
            }
            this.checkGeneralBody = JSON.parse(JSON.stringify(this.generalBody));
            this.activacionGuardarGenerales();
            this.progressSpinner = false;
            this.cerrarAuditoria();
            this.showSuccess();
          },
          error => {
            //console.log(error);
            this.progressSpinner = false;
            this.activacionGuardarGenerales();
            this.cerrarAuditoria();
            this.generalError = JSON.parse(error["error"]);
            if (this.generalError.error.message.toString()) {
              this.showFailDetalle(this.generalError.error.message.toString());
            } else {
              this.showFail();
            }
          }
          // EVENTO PARA ACTIVAR GUARDAR AL BORRAR UNA ETIQUETA
        );
    }
  }


  comisionesAString() {
    if (this.comisiones == true) {
      this.generalBody.comisiones = "1";
    } else {
      this.generalBody.comisiones = "0";
    }
    if (this.publicarDatosContacto == true) {
      // this.showInfo(
      //   this.translateService.instant("menu.fichaColegial.lopd.literal")
      // );
      this.generalBody.noAparecerRedAbogacia = "1";
    } else {
      this.generalBody.noAparecerRedAbogacia = "0";
    }
  }

  stringAComisiones() {
    if (this.generalBody.comisiones == "1") {
      this.comisiones = true;
    } else {
      this.comisiones = false;
    }
    if (this.generalBody.noAparecerRedAbogacia == "1") {
      this.publicarDatosContacto = true;
    } else {
      this.publicarDatosContacto = false;
    }
  }

  arreglarFechas() {
    if (this.fechaNacimiento != undefined) {
      this.generalBody.fechaNacimientoDate = this.transformaFecha(
        this.fechaNacimiento
      );
    }
    /* if (this.fechaAlta != undefined) {
      this.generalBody.incorporacionDate = this.transformaFecha(this.fechaAlta);
    } */
  }

  transformaFecha(fecha) {
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

  activacionGuardarGenerales() {

    this.comisionesAString();
    this.getInscritoInit();
    this.sortOptions();
    this.generalBody.etiquetas = this.etiquetasPersonaJuridicaSelecionados;
    if(this.generalBody.nif != "" && this.generalBody.nif != undefined && this.generalBody.idTipoIdentificacion != "" &&
    this.generalBody.idTipoIdentificacion != undefined && this.generalBody.soloNombre != undefined && this.generalBody.apellidos1 != undefined &&
    this.generalBody.soloNombre != "" && this.generalBody.apellidos1 != "" && this.generalBody.idTratamiento != null &&
    this.generalBody.idLenguaje != "" && this.generalBody.idLenguaje != undefined){

    this.resaltadoDatosGenerales = true;
    }
    if (JSON.parse(JSON.stringify(this.resultsTopics)) != undefined && JSON.parse(JSON.stringify(this.resultsTopics)) != null && JSON.parse(JSON.stringify(this.resultsTopics)).length > 0) {
      this.generalBody.temasCombo = JSON.parse(JSON.stringify(this.resultsTopics));
    }

    this.activarGuardarGenerales = true;

    return this.activarGuardarGenerales;
  }

  activacionRestablecerGenerales() {
    this.generalBody.etiquetas = this.etiquetasPersonaJuridicaSelecionados;
    if (
      JSON.stringify(this.checkGeneralBody) != JSON.stringify(this.generalBody)
    ) {
      return true;
    } else {
      return false;
    }
  }

  onChangeCalendar(event) {
    this.fechaNacCambiada = true;
    this.fechaNacimientoSelected = true;
    // //console.log(new Date(event));
    var hoy = new Date();
    var cumpleanos = new Date(event); //

    if (this.comprobarFecha(cumpleanos, this.calendarFechaNacimiento.minDate)) {

      // var cumpleanos = new Date(fecha);
      var edad = hoy.getFullYear() - cumpleanos.getFullYear();
      var m = hoy.getMonth() - cumpleanos.getMonth();

      if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
        edad--;
      }

      if (edad < 0) {
        this.edadCalculada = 0;
      } else {
        this.edadCalculada = edad;
      }

      this.fechaNacimiento = cumpleanos;
      this.calendarFechaNacimiento.overlayVisible = false;
      this.generalBody.fechaNacimientoDate = this.fechaNacimiento;

    } else {
      this.edadCalculada = 0;
      this.generalBody.fechaNacimientoDate = undefined;
    }
  }

  onWriteCalendar() {
    // //console.log(new Date(event));
    var hoy = new Date();

    if (this.fechaNacimiento instanceof Date) {
      var edad = hoy.getFullYear() - this.fechaNacimiento.getFullYear();
      var m = hoy.getMonth() - this.fechaNacimiento.getMonth();

      if (
        m < 0 ||
        (m === 0 && hoy.getDate() < this.fechaNacimiento.getDate())
      ) {
        edad--;
      }

      this.edadCalculada = edad;
    } else {
      this.edadCalculada = "";
    }
  }

  calcularEdad(fecha) {
    var hoy = new Date();
    var dateParts = fecha.split("/");
    var cumpleanos = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]); //

    // var cumpleanos = new Date(fecha);
    var edad = hoy.getFullYear() - cumpleanos.getFullYear();
    var m = hoy.getMonth() - cumpleanos.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
      edad--;
    }

    this.edadCalculada = edad;
  }

  restablecerGenerales() {
    if (this.esNewColegiado) {
      this.generalBody = new FichaColegialGeneralesItem();
      this.generalBody = JSON.parse(JSON.stringify(this.colegialesBody));
      if (this.generalBody.nif != undefined && this.generalBody.nif != "" && this.generalBody != null)
        this.compruebaDNI();
      this.etiquetasPersonaJuridicaSelecionados = this.generalBody.etiquetas;
      this.generalBody.etiquetas = [];
      this.obtenerEtiquetasPersonaJuridicaConcreta();
      this.stringAComisiones();
      this.activacionGuardarGenerales();
    } else {
      this.cargarImagen(this.idPersona);
      this.generalBody = JSON.parse(JSON.stringify(this.checkGeneralBody));
      if (this.generalBody.fechaNacimiento != undefined && this.generalBody.fechaNacimiento != null) {
        this.fechaNacimiento = this.arreglarFecha(this.generalBody.fechaNacimiento);
        this.calcularEdad(this.generalBody.fechaNacimiento);
      }
      this.etiquetasPersonaJuridicaSelecionados = this.generalBody.etiquetas;
      this.generalBody.etiquetas = [];
      this.obtenerEtiquetasPersonaJuridicaConcreta();
      this.stringAComisiones();
      this.activacionGuardarGenerales();
      this.resultsTopics = JSON.parse(JSON.stringify(this.checkGeneralBody.temasCombo));
    }
  }

  //FOTOGRAFIA
  uploadImage(event: any) {
    // guardamos la imagen en front para despues guardarla, siempre que tenga extension de imagen
    let fileList: FileList = event.files;

    let nombreCompletoArchivo = fileList[0].name;
    let extensionArchivo = nombreCompletoArchivo.substring(
      nombreCompletoArchivo.lastIndexOf("."),
      nombreCompletoArchivo.length
    );

    if (
      extensionArchivo == null ||
      extensionArchivo.trim() == "" ||
      !/\.(gif|jpg|jpeg|tiff|png)$/i.test(extensionArchivo.trim().toUpperCase())
    ) {
      // Mensaje de error de formato de imagen y deshabilitar boton guardar
      this.file = undefined;
      this.archivoDisponible = false;
      this.existeImagen = false;
      this.showFailUploadedImage();
    } else {
      // se almacena el archivo para habilitar boton guardar
      this.file = fileList[0];
      this.archivoDisponible = true;
      this.generalBody.imagenCambiada == true;
      this.existeImagen = true;
      let urlCreator = window.URL;
      this.imagenPersona = this.sanitizer.bypassSecurityTrustUrl(
        urlCreator.createObjectURL(this.file)
      );
    }
    this.activacionGuardarGenerales();
  }

  // guardar() {
  //   // pasamos el idPersona creado para la nueva sociedad
  //   if (this.file != undefined) {
  //     this.guardarImagen(this.idPersona);
  //   }
  // }

  guardarImagen(idPersona: String) {
    this.sigaServices
      .postSendFileAndParameters(
        "personaJuridica_uploadFotografia",
        this.file,
        idPersona
      )
      .subscribe(
        data => {
          this.file = undefined;
          this.cargarImagen(this.idPersona);
          this.progressSpinner = false;
        },
        error => {
          //console.log(error);
          this.progressSpinner = false;
        }
      );
  }

  solicitudGuardarImagen(idPersona: String) {
    this.sigaServices
      .postSendFileAndBody(
        "personaJuridica_solicitudUploadFotografia",
        this.file,
        this.idPersona,
        this.generalBody.motivo
      )
      .subscribe(
        data => {
          this.file = undefined;
          this.progressSpinner = false;
          if (data.error.description != "") {
            this.solicitudModificacionMens = data.error.description;
          }
          this.activacionGuardarGenerales();
        },
        error => {
          //console.log(error);
          this.progressSpinner = false;
        }
      );
  }

  habilitarAutocompletar(event) {
    if (!this.isLetrado) {
      if (event) {
        this.autocompletar = true;
      } else {
        this.autocompletar = false;
      }
    }
  }

  // disabledAutocomplete() {
  //   this.autocompletar = true;
  // }

  // ETIQUETAS

  filterLabelsMultiple() {
    let etiquetasPuestas = [];
    if (this.etiquetasPersonaJuridicaSelecionados) {
      etiquetasPuestas = this.etiquetasPersonaJuridicaSelecionados;
    }
    this.sigaServices.get("busquedaPerJuridica_etiquetas").subscribe(
      n => {
        // coger todas las etiquetas
        // let etiquetasSugerencias = this.filterLabel(event.query, n.comboItems);

        // this.comboEtiquetas = this.comboEtiquetas.filter(function(item) {
        //   return !etiquetasPuestas.includes(item);
        // });

        // if (etiquetasPuestas.length > 0) {
        //   this.comboEtiquetas = [];

        //   etiquetasSugerencias.forEach(element => {
        //     let find = etiquetasPuestas.find(x => x.label === element.label);
        //     if (find == undefined) {
        //       this.comboEtiquetas.push(element);
        //     }
        //   });
        // } else {
        let array = n.comboItems;
        //let array = JSON.parse(
        //  n["body"]
        //).comboEtiquetasItems;

        // en cada busqueda vaciamos el vector para añadir las nuevas etiquetas
        this.comboEtiquetas = [];
        array.forEach(element => {
          let idGrupoAux = "-"+element.value;
          if(idGrupoAux == undefined || idGrupoAux == null){
            idGrupoAux = "";
          }
        //let e = { label: element.label, value: element.idInstitucion+idGrupoAux, idGrupo: element.value, idInstitucion: element.idInstitucion };
        let e = { label: element.label, value:
          { label: element.label, value: element.idInstitucion+idGrupoAux, idGrupo: element.value, idInstitucion: element.idInstitucion } };
          this.comboEtiquetas.push(e);
          // this.generalBody.
        });
        this.arregloTildesCombo(this.comboEtiquetas);
        this.sortOptions();
        // }
      },
      err => {
        //console.log(err);
      }
    );
  }

  private sortOptions() {
    if (this.comboEtiquetas && this.etiquetasPersonaJuridicaSelecionados) {
      this.comboEtiquetas.sort((a, b) => {
        //const includeA = this.etiquetasPersonaJuridicaSelecionados.includes(a);
        //const includeB = this.etiquetasPersonaJuridicaSelecionados.includes(b);
        const includeA = this.etiquetasPersonaJuridicaSelecionados.find(item => item.value == a.value.value);
        const includeB = this.etiquetasPersonaJuridicaSelecionados.find(item => item.value == b.value.value);
        if (includeA && !includeB) {
        //const includeA = this.etiquetasPersonaJuridicaSelecionados.indexOf(a);
        //const includeB = this.etiquetasPersonaJuridicaSelecionados.indexOf(b);
        //if ((includeA != -1) && (includeB == -1)) {
          return -1;
        }
        else if (!includeA && includeB) {
        //else if ((includeA == -1) && (includeB != -1)) {
          return 1;
        }
        return a.label.localeCompare(b.label);
      });
    }
  }

  filterLabel(query, etiquetas: any[]): any[] {
    let filtered: any[] = [];
    for (let i = 0; i < etiquetas.length; i++) {
      let etiqueta = etiquetas[i];

      if (etiqueta.label.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(etiqueta);
      }
    }

    if (filtered.length == 0) {
      this.control = true;
    } else {
      this.control = false;
    }

    return filtered;
  }

  // Evento para detectar la etiqueta de nueva creación
  onKeyUp(event) {
    if (event.keyCode == 13) {
      event.currentTarget.value = "";
    }

  }

  activarPaginacionRegTel() {
    if (!this.bodyRegTel || this.bodyRegTel.length == 0) return false;
    else return true;
  }

  actualizaSeleccionadosRegTel(selectedDatos) {
    this.numSelectedDatosRegtel = selectedDatos.length;
  }

  actualizaSeleccionadosColegiales(selectedDatos) {
    this.selectedDatosColegiales = [];
    this.numSelectedColegiales = selectedDatos.length;
  }

  compruebaDNI() {
    // modo creacion
    this.activacionGuardarGenerales();
    if(this.generalBody.idTipoIdentificacion == "" || this.generalBody.idTipoIdentificacion == undefined){
      this.resaltadoDatosGenerales = true;
    }
    if(this.generalBody.idTipoIdentificacion  != undefined && this.generalBody.idTipoIdentificacion  != null){
      if (this.generalBody.idTipoIdentificacion != "50") {
        if (this.isValidDNI(this.generalBody.nif)) {
          this.generalBody.idTipoIdentificacion = "10";
          return true;
        } else if (this.isValidPassport(this.generalBody.nif)) {
          this.generalBody.idTipoIdentificacion = "30";
          return true;
        } else if (this.isValidNIE(this.generalBody.nif)) {
          this.generalBody.idTipoIdentificacion = "40";
          return true;
        } else if (this.isValidCIF(this.generalBody.nif)) {
          this.generalBody.idTipoIdentificacion = "20";
          return true;
        } else {
          this.generalBody.idTipoIdentificacion = "30";
          return true;
        }
      }
    }else{
      this.nifCif.valor = this.generalBody.nif;
      this.sigaServices
      .post("fichaDatosGenerales_tipoidentificacion", this.nifCif)
      .subscribe(
        data => {
          this.generalBody.idTipoIdentificacion = JSON.parse(data.body)['valor'];
          if (this.generalBody.idTipoIdentificacion != "50") {
            if (this.isValidDNI(this.generalBody.nif)) {
              this.generalBody.idTipoIdentificacion = "10";
              return true;
            } else if (this.isValidPassport(this.generalBody.nif)) {
              this.generalBody.idTipoIdentificacion = "30";
              return true;
            } else if (this.isValidNIE(this.generalBody.nif)) {
              this.generalBody.idTipoIdentificacion = "40";
              return true;
            } else if (this.isValidCIF(this.generalBody.nif)) {
              this.generalBody.idTipoIdentificacion = "20";
              return true;
            } else {
              this.generalBody.idTipoIdentificacion = "30";
              return true;
            }
          }
        },
        err => {
          //console.log(err);
        }
      );
    
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

  isNotContains(event): boolean {
    var keepGoing = true;
    this.updateItems.forEach(element => {
      if (keepGoing) {
        if (element.value == event.value.value) {
          keepGoing = false;
        }
      }
    });

    return keepGoing;
  }

  isNotContainsEtiq(event): boolean {
    var keepGoing = true;
    this.etiquetasPersonaJuridicaSelecionados.forEach(element => {
      if (element.label == event.label) {
        keepGoing = false;
      }
    });

    return keepGoing;
  }

  // Evento para detectar una etiqueta existente
  onSelect(event) {
    this.activacionGuardarGenerales();
    if (event) {
      if (this.isNotContains(event)) {

        // Variable controladora
        this.isCrear = false;

        // Rellenamos los valores de la etiqueta
        this.item = new ComboEtiquetasItem();
        this.item.idGrupo = event.value.idGrupo;
        this.item.label = event.value.label;
        this.item.idInstitucion = event.value.idInstitucion;
        this.item.value = event.value.value;

        // this.mensaje = this.translateService.instant(
        //   "censo.etiquetas.literal.rango"
        // );
        this.createItems.push(this.item);
        this.updateItems.set(this.item.value, this.item);

      } else {
        // Si existe en el array, lo borramos para que no queden registros duplicados
        /*for (
          let i = 0;
          i < this.etiquetasPersonaJuridicaSelecionados.length;
          i++
        ) {
          if (
            this.etiquetasPersonaJuridicaSelecionados[i].idGrupo == undefined
          ) {
            if (
              this.etiquetasPersonaJuridicaSelecionados[i].label == event.label &&
              this.etiquetasPersonaJuridicaSelecionados[i].idInstitucion == event.idInstitucion
            ) {
              this.etiquetasPersonaJuridicaSelecionados.splice(i, 1);
            }
          } else {
            if (
              this.etiquetasPersonaJuridicaSelecionados[i].idGrupo ==
              event.value &&
              this.etiquetasPersonaJuridicaSelecionados[i].idInstitucion == event.idInstitucion
            ) {
              this.etiquetasPersonaJuridicaSelecionados.splice(i, 1);
              this.onUnselect(event);
            }
          }
        }*/
        if (
          this.updateItems.size >
          this.etiquetasPersonaJuridicaSelecionados.length
        ) {
          this.updateItems.delete(event.value.value);
        }
      }
    }
  }

  onUnselect(event) {
    this.activacionGuardarGenerales();
    if (event) {
      if (event.value == undefined) {
        this.updateItems.delete(event.value.value);
        this.showGuardar = true;
      } else {
        this.updateItems.delete(event.value.value);
        this.showGuardar = true;
      }
    }
  }

  deleteLabel(event) {
    this.activacionGuardarGenerales();
    for (let i = 0; i < this.etiquetasPersonaJuridicaSelecionados.length; i++) {
      if (this.etiquetasPersonaJuridicaSelecionados[i].value == event.value.value) {
          this.etiquetasPersonaJuridicaSelecionados.splice(i, 1);
          this.onUnselect(event);
      }
    }
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
          this.etiquetasPersonaJuridica.forEach(element => {
            let idGrupoAux = "-"+element.idGrupo;
            if(idGrupoAux == undefined || idGrupoAux == null){
              idGrupoAux = "";
            }
            let e = { label: element.label, value: element.idInstitucion+idGrupoAux, idGrupo: element.idGrupo, idInstitucion: element.idInstitucion };
            //let e = { label: element.label, value:
            //  { label: element.label, value: element.idInstitucion+idGrupoAux, idGrupo: element.idGrupo, idInstitucion: element.idInstitucion } };
    
            this.etiquetasPersonaJuridicaSelecionados.push(e);
            // this.generalBody.
          });

          this.etiquetasPersonaJuridicaSelecionados.forEach(
            (value: any, index: number) => {
              let pruebaComboE: ComboEtiquetasItem = new ComboEtiquetasItem();
              pruebaComboE = value.value;
              this.updateItems.set(pruebaComboE.value, pruebaComboE);
            }
          );

          this.createItems = this.etiquetasPersonaJuridicaSelecionados;
          this.checkGeneralBody.etiquetas = JSON.parse(JSON.stringify(this.etiquetasPersonaJuridicaSelecionados));

          this.sortOptions();
        },
        err => {
          //console.log(err);
        }
      );
    // this.generalBody.etiquetas = new ComboEtiquetasItem();

    // this.generalBody.grupos = this.etiquetasPersonaJuridicaSelecionados;
  }

  cargarImagen(idPersona: String) {
    let datosParaImagen: DatosGeneralesItem = new DatosGeneralesItem();
    datosParaImagen.idPersona = idPersona;

    this.sigaServices
      .postDownloadFiles("personaJuridica_cargarFotografia", datosParaImagen)
      .subscribe(data => {
        const blob = new Blob([data], { type: "text/csv" });
        if (blob.size == 0) {
          this.existeImagen = false;
        } else {
          let urlCreator = window.URL;
          this.imagenPersona = this.sanitizer.bypassSecurityTrustUrl(
            urlCreator.createObjectURL(blob)
          );
          this.existeImagen = true;
        }
      });
  }

  getTopicsCourse() {
    this.progressSpinner = true;
    this.sigaServices
      .getParam(
        "fichaCursos_getTopicsSpecificPerson",
        "?idPersona=" + this.generalBody.idPersona
      )
      .subscribe(
        n => {
          this.resultsTopics = n.combooItems;
          this.arregloTildesCombo(this.resultsTopics);

          this.resultsTopics.forEach(e => {
            if (e.color == undefined) {
              e.color = "#024eff";
            }
          });

          this.generalBody.temasCombo = JSON.parse(JSON.stringify(this.resultsTopics));
          this.checkGeneralBody.temasCombo = JSON.parse(JSON.stringify(this.resultsTopics));
          this.progressSpinner = false;
        },
        err => {
          //console.log(err);
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        }
      );
  }

  // A PARTIR DE AQUI SE HA AÑADIDO APARTE PORQUE HACIA FALTA
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
  esFichaActiva(key) {

    return this.fichaPosible.activa;
  }
  abreCierraFicha(key) {
    this.resaltadoDatosGenerales = true;
    if (
      key == "generales" &&
      !this.activacionTarjeta
      && !this.emptyLoadFichaColegial
    ) {
      this.fichaPosible.activa = !this.fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    if (this.activacionTarjeta) {
      this.fichaPosible.activa = !this.fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    this.opened.emit(this.openFicha);
    this.idOpened.emit(key);
  }


  getComboTemas() {
    this.backgroundColor = "#024eff";
    // obtener colegios
    this.sigaServices.get("fichaCursos_getTopicsCourse").subscribe(
      n => {
        this.comboTopics = n.combooItems;
        this.arregloTildesCombo(this.comboTopics);
      },
      err => {
        //console.log(err);
      }
    );
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
          if (tipoCambio == 'solicitudModificacion') {
            this.solicitarModificacionGenerales();
          } else if (tipoCambio == 'guardarDatosColegiales') {
            this.guardarColegiales();
          } else if (tipoCambio == 'guardarDatosGenerales') {
            this.generalesGuardar();
          }
        } else {
          if (!this.esNewColegiado) {
            this.tipoCambioAuditoria = tipoCambio;
            this.displayAuditoria = true;
            this.showGuardarAuditoria = false;
          } else {
            if (tipoCambio == 'guardarDatosColegiales') {
              this.guardarColegiales();
            } else if (tipoCambio == 'guardarDatosGenerales') {
              this.generalesGuardar();
            }
          }
        }

        // mostrar la auditoria depende de un parámetro que varía según la institución
        this.generalBody.motivo = undefined;
        // this.showGuardarAuditoria = false;
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

  showSuccess() {
    this.msgs = [];
    this.msgs.push({
      severity: "success",
      summary: this.translateService.instant("general.message.correct"),
      detail: this.translateService.instant("general.message.accion.realizada")
    });
  }

  showSuccessDetalle(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "success", summary: this.translateService.instant("general.message.correct"), detail: mensaje });
  }
  showFailDetalle(mensaje: string) {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: this.translateService.instant("general.message.incorrect"),
      detail: mensaje
    });
  }

  showFailUploadedImage() {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Error",
      detail: "Error al adjuntar la imagen"
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


  isValidDNI(dni: String): boolean {
    return (
      dni &&
      typeof dni === "string" &&
      /^[0-9]{8}([A-Za-z]{1})$/.test(dni) &&
      dni.substr(8, 9).toUpperCase() ===
      this.DNI_LETTERS.charAt(parseInt(dni.substr(0, 8), 10) % 23)
    );
  }
  guardarColegiales() {
    // Meter datos colegiales aquí para guardar y probar.
    this.progressSpinner = true;
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

              this.colegialesBody.estadoColegial = this.comboSituacion.find(item => item.value === this.datosColegiales[0].situacion).label;

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
      if (this.nuevoEstadoColegial.situacion == "20") {
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
      } else if (this.nuevoEstadoColegial.situacion != "20" && this.datosColegiales[1].idEstado == "20") {
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
      } else {
        this.callServiceGuardarColegiales();
      }
      //Si es una modificacion de estado
    } else {
      //Si el cambio es a ejerciente
      if (this.datosColegiales[0].idEstado == "20" && this.datosColegiales[0].idEstado != this.datosColegialesInit[0].idEstado) {
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
      } else if (this.datosColegiales[0].idEstado != "20" && this.datosColegiales[0].idEstado != this.datosColegialesInit[0].idEstado
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
        //Si el cambio pertenece a un estado no ejerciente, se guarda sin realizar comprobaciones
      } else {
        this.callServiceGuardarColegiales();
      }
    }
    if (this.nuevoEstadoColegial.situacionResidente == "1" || this.nuevoEstadoColegial.situacionResidente == "Si") {
      this.residente = "Si";
    } else {
      this.residente = "No";
    }
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

  callServiceGuardarColegiales() {
    this.progressSpinner = true;

    this.colegialesBody.situacionResidente = this.datosColegiales[0].situacionResidente;
    this.sigaServices
      .post("fichaDatosColegiales_datosColegialesUpdate", this.colegialesBody)
      .subscribe(
        data => {

          // Siempre realizaremos el update de los registros de la tabla, tanto del registro editable como de los registros que solo se pueden modificar las observaciones
          this.datosColegiales[0].idInstitucion = this.colegialesBody.idInstitucion;
          this.datosColegiales[0].idPersona = this.colegialesBody.idPersona;
          if (this.datosColegiales[0].observaciones == undefined) this.datosColegiales[0].observaciones = "";
          this.sigaServices
            .post("fichaDatosColegiales_datosColegialesUpdateEstados", this.datosColegiales)
            .subscribe(
              data => {
                // En el caso de que se haya insertado un nuevo estado colegial en la tabla, habrá que realizar el insert
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

                  this.sigaServices
                    .post("fichaDatosColegiales_datosColegialesInsertEstado", this.nuevoEstadoColegial)
                    .subscribe(
                      data => {
                        this.nuevoEstadoColegial = new FichaColegialColegialesItem;
                       this.isCrearColegial = false;
                        this.isRestablecer = false;
                        this.inscritoChange = false;
                        this.filaEditable = false;
                        this.activarGuardarColegiales = false;
                        this.numSelectedColegiales = 0;

                        this.obtenerEtiquetasPersonaJuridicaConcreta();
                        this.progressSpinner = false;
                        this.cerrarAuditoria();

                        if (JSON.parse(data.body).error != null &&
                          JSON.parse(data.body).error != undefined &&
                          JSON.parse(data.body).error != "") {
                          let msg = JSON.parse(data.body).error.message;
                          this.showSuccessDetalle(msg);
                        } else {
                          this.showSuccess();
                        }

                        this.onInitColegiales();
                        this.searchDirecciones();
                        this.checkColegialesBody = new FichaColegialColegialesItem();

                        this.checkColegialesBody = JSON.parse(
                          JSON.stringify(this.colegialesBody)
                        );

                        let newBody = JSON.parse(sessionStorage.getItem("personaBody"));
                        newBody.numColegiado = this.colegialesBody.numColegiado;
                        newBody.idTiposSeguro = this.colegialesBody.idTiposSeguro;
                        newBody.nMutualista = this.colegialesBody.nMutualista;
                        newBody.comunitario = this.colegialesBody.comunitario;
                        newBody.incorporacion = this.colegialesBody.incorporacion;
                        newBody.fechapresentacion = this.colegialesBody.fechapresentacion;
                        newBody.fechaJura = this.colegialesBody.fechaJura;
                        sessionStorage.setItem("personaBody", JSON.stringify(newBody));

                      },
                      error => {
                        //console.log(error);
                        this.progressSpinner = false;
                        if (JSON.parse(error.error).error != null && JSON.parse(error.error).error != "" && JSON.parse(error.error).error != undefined) {
                          let msg = JSON.parse(error.error).error.message;
                          this.showFailDetalle(this.translateService.instant(msg));
                        } else {
                          this.showFail();
                        }
                        this.isCrearColegial = false;
                        this.isRestablecer = false;
                        this.restablecerColegiales();
                        this.inscritoChange = false;
                        this.filaEditable = false;
                        this.activarGuardarColegiales = false;
                        this.cerrarAuditoria();
                        this.numSelectedColegiales = 0;
                      }
                    );
                } else {
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
                }
              },
              error => {
                //console.log(error);

                if (JSON.parse(error.error).error != null && JSON.parse(error.error).error != "" && JSON.parse(error.error).error != undefined) {
                  let msg = JSON.parse(error.error).error.message;
                  this.showFailDetalle(msg);
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
                this.cerrarAuditoria();
              }
            );
        },
        error => {
          //console.log(error);
          this.progressSpinner = false;
          this.isCrearColegial = false;
          this.isRestablecer = false;
          this.inscritoChange = false;
          this.activarGuardarColegiales = false;
          this.filaEditable = false;
          this.numSelectedColegiales = 0;
          this.cerrarAuditoria();
          this.showFail();
        }
      );
  }
  onInitColegiales() {
    this.itemAInscrito();
    this.sigaServices.get("fichaDatosColegiales_tipoSeguro").subscribe(
      n => {
        this.comboTipoSeguro = n.combooItems;
        this.arregloTildesCombo(this.comboTipoSeguro);

      },
      err => {
        //console.log(err);
      }
    );
    this.searchColegiales();
    this.getInscritoInit();
    this.getSituacionPersona();
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
        },
        err => {
          //console.log(err);
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

  restablecerColegiales() {
    this.selectedDatosColegiales = '';
    this.showMessageInscripcion = false;
    this.colegialesBody = JSON.parse(JSON.stringify(this.checkColegialesBody));
    // this.colegialesBody = this.colegialesBody[0];
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


  sumarDia(fechaInput) {
    let fecha = new Date(fechaInput);
    let one_day = 1000 * 60 * 60 * 24;
    let ayer = fecha.getMilliseconds() + one_day;
    fecha.setMilliseconds(ayer);
    return fecha;
  }
  getSituacionPersona() {
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
      this.situacionPersona = "";
    }
    if (this.esColegiado) {
      this.datosTarjetaResumen = [
        {
          label: "Apellidos y Nombre",
          value: this.generalBody.nombre
        },
        {
          label: "Identificación",
          value: this.generalBody.nif
        },

        {
          label: "Número de Colegiado",
          value: this.generalBody.numColegiado
        },
        {
          label: "Situación Ejercicio Actual",
          value: this.situacionPersona
        },
      ];
      this.datosTarjetaResumenEmit.emit(this.datosTarjetaResumen);
    } else {
      this.datosTarjetaResumen = [
        {
          label: "Apellidos y Nombre",
          value: this.generalBody.nombre
        },
        {
          label: "Identificación",
          value: this.generalBody.nif
        },
        {
          label: "Situación Ejercicio Actual",
          value: this.situacionPersona
        },
      ];
      this.datosTarjetaResumenEmit.emit(this.datosTarjetaResumen);
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

  callServiceShowMessageUpdate() {
    this.progressSpinner = false;
    this.icon = "fa fa-edit";
    let keyConfirmation = "direcciones";

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
    this.progressSpinner = true;
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
            //console.log(err);
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
  asignarPermisosTarjetas() {
    this.tarjetaGenerales = this.tarjetaGeneralesNum;

  }
  getLetrado() {
    if (JSON.parse(sessionStorage.getItem("isLetrado")) == true) {
      this.isLetrado = true;
    } else {
      this.isLetrado = !this.permisos;
    }
  }
  inputFechaNacimiento(e) {
    this.fechaNacimientoSelected = false;

    //evento necesario para informar de las fechas que borren manualmente (teclado)
    if (e.inputType == 'deleteContentBackward') {
      this.borrarFechaNacimiento();
    }
  }
  blurFechaNacimiento(e) {

    let REGEX = /[a-zA-Z]/;
    //evento necesario para informar de las fechas que metan manualmente (escribiendo o pegando)
    if (!this.fechaNacimientoSelected) {
      let newValue = e.target.value;
      if (newValue != null && newValue != '') {
        if (!REGEX.test(newValue) && newValue.length < 11) {
          let fecha = moment(newValue, 'DD/MM/YYYY').toDate();
          this.calendarFechaNacimiento.onSelect.emit(fecha);
        } else {
          this.calendarFechaNacimiento.overlayVisible = false;
          this.fechaNacimiento = null;
          this.generalBody.fechaNacimientoDate = undefined;
          this.edadCalculada = 0;
        }
      }
    }
  }
  borrarFechaNacimiento() {
    this.fechaNacimiento = null;
    this.generalBody.fechaNacimientoDate = undefined;
    this.generalBody.fechaNacimiento = undefined;
    this.fechaNacimientoSelected = true;
    this.edadCalculada = 0;
    this.calendarFechaNacimiento.onClearButtonClick("");
  }

  fechaHoyFechaNacimiento() {
    this.fechaNacimiento = new Date();
    this.calendarFechaNacimiento.overlayVisible = false;
    this.fechaNacimientoSelected = true;
    this.calendarFechaNacimiento.onSelect.emit(this.fechaNacimiento);
  }
  fillFechaAlta(event) {
    this.fechaAlta = event;
    this.activacionGuardarGenerales();
  }

  fillFechaInicio(event) {
    this.item.fechaInicio = event;
    this.validateFields();
  }

  fillFechaBaja(event) {
    this.item.fechaBaja = event;
    this.validateFields();
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
  visiblePanelBlurTopics(event) {
    if (this.autocompleteTopics.highlightOption != undefined) {
      this.autocompleteTopics.highlightOption.color = "#024eff";
      this.resultsTopics.push(this.autocompleteTopics.highlightOption);
      this.autocompleteTopics.highlightOption = undefined;
    }
    this.autocompleteTopics.panelVisible = false;
    this.activacionGuardarGenerales();
    event.currentTarget.value = "";
  }
  filterTopics(event) {
    if (
      this.comboTopics.length > 0 &&
      this.comboTopics.length != this.resultsTopics.length
    ) {
      if (this.resultsTopics.length > 0) {
        this.suggestTopics = [];

        this.comboTopics.forEach(element => {
          let findTopic = this.resultsTopics.find(
            x => x.value === element.value
          );
          if (findTopic == undefined) {
            this.suggestTopics.push(element);
          }
        });

        this.resultsTopics.forEach(e => {
          if (e.color == undefined) {
            e.color = "#024eff";
          }
        });

      } else {
        this.suggestTopics = JSON.parse(JSON.stringify(this.comboTopics));
      }
      this.autocompleteTopics.suggestionsUpdated = true;
     this.autocompleteTopics.panelVisible = true;
      this.autocompleteTopics.focusInput();
    } else {
      if (this.autocompleteTopics.highlightOption != undefined) {
        this.resultsTopics.forEach(e => {
          if (e.color == undefined) {
            e.color = "#024eff";
          }
        });
      }

      this.autocompleteTopics.panelVisible = false;
      this.autocompleteTopics.focusInput();

    }
    this.generalBody.temasCombo = JSON.parse(JSON.stringify(this.resultsTopics));
    this.activacionGuardarGenerales();
  }
  getYearRange() {
    let today = new Date();
    let year = today.getFullYear();
    this.yearRange = (year - 80) + ":" + (year + 20);
  }
  guardarAuditoria() {

    if (this.tipoCambioAuditoria == 'solicitudModificacion') {
      this.solicitarModificacionGenerales();
    } else if (this.tipoCambioAuditoria == 'guardarDatosColegiales') {
      this.colegialesBody.motivo = this.generalBody.motivo;
      this.guardarColegiales();
    } else if (this.tipoCambioAuditoria == 'guardarDatosGenerales') {
      this.generalesGuardar();
    }

  }
  onBlur(event) {
    event.currentTarget.value = "";
  }

  styleObligatorio(resaltado, evento) {
    if ((evento == null || evento == undefined || evento == "") && resaltado == "datosGenerales" && this.resaltadoDatosGenerales) {
      return "camposObligatorios";
    }
  }
  checkDatosGenerales(datos) {
    if (this.generalBody.nif != "" && this.generalBody.nif != undefined && this.generalBody.idTipoIdentificacion != "" &&
      this.generalBody.idTipoIdentificacion != undefined && this.generalBody.soloNombre != undefined && this.generalBody.apellidos1 != undefined &&
      this.generalBody.soloNombre != "" && this.generalBody.apellidos1 != "" && this.generalBody.idTratamiento != null &&
      this.generalBody.idLenguaje != "" && this.generalBody.idLenguaje != undefined) {

      this.resaltadoDatosGenerales = false;
      if (datos == "guardarDatosGenerales") {
        this.comprobarAuditoria('guardarDatosGenerales');
      } else {
        this.comprobarAuditoria('solicitudModificacion');
      }
    } else {
      this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios') }];
      this.resaltadoDatosGenerales = true;
    }
  }
  isOpenReceive(event) {
    let fichaPosible = this.esFichaActiva(event);
    if (fichaPosible == false) {
      this.abreCierraFicha(event);
    }
    // window.scrollTo(0,0);
  }
  
  focusInputField() {
    setTimeout(() => {
      this.someDropdown.filterInputChild.nativeElement.focus();  
    }, 300);
  }

}

