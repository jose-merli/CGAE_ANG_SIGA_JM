import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  AfterViewInit,
  ViewEncapsulation
} from "@angular/core";
import { AutoComplete, Dialog, Calendar } from "primeng/primeng";
import { esCalendar, catCalendar, euCalendar, glCalendar } from '../../../utils/calendar';
import { Location } from "@angular/common";
import { DatePipe } from "@angular/common";
import { ConfirmationService, Message } from "primeng/components/common/api";
import { TranslateService } from "./../../../commons/translate/translation.service";
import { DataTable } from "primeng/datatable";
import { SigaServices } from "./../../../_services/siga.service";
import { Router } from "@angular/router";

//import "rxjs/Rx";
import { saveAs } from "file-saver/FileSaver";
import { ControlAccesoDto } from "./../../../../app/models/ControlAccesoDto";
import { DatosGeneralesComponent } from "./../../../new-features/censo/ficha-colegial/datos-generales/datos-generales.component";
// IMPORT PANTALLA EDICION
import { EdicionCurricularesComponent } from "./edicionDatosCurriculares/edicionCurriculares.component";
// BODYS IMPORT
import { FichaColegialGeneralesItem } from "./../../../../app/models/FichaColegialGeneralesItem";
import { FichaColegialGeneralesObject } from "./../../../../app/models/FichaColegialGeneralesObject";
import { FichaColegialColegialesItem } from "./../../../../app/models/FichaColegialColegialesItem";
import { FichaColegialColegialesObject } from "./../../../../app/models/FichaColegialColegialesObject";
import { FichaColegialColegiacionesItem } from "./../../../../app/models/FichaColegialColegiacionesItem";
import { FichaColegialColegiacionesObject } from "./../../../../app/models/FichaColegialColegiacionesObject";
import { FichaColegialCertificadosItem } from "./../../../../app/models/FichaColegialCertificadosItem";
import { FichaColegialCertificadosObject } from "./../../../../app/models/FichaColegialCertificadosObject";
import { SolicitudIncorporacionItem } from "../../../models/SolicitudIncorporacionItem";
import { FichaColegialSociedadesItem } from "./../../../../app/models/FichaColegialSociedadesItem";
import { FichaColegialSociedadesObject } from "./../../../../app/models/FichaColegialSociedadesObject";
import { FichaColegialEdicionCurricularesItem } from "./../../../models/FichaColegialEdicionCurricularesItem";
import { FichaColegialEdicionCurricularesObject } from "./../../../models/FichaColegialEdicionCurricularesObject";
import { DatosDireccionesItem } from "./../../../models/DatosDireccionesItem";
import { DatosDireccionesObject } from "./../../../models/DatosDireccionesObject";
import { DatosBancariosItem } from "./../../../models/DatosBancariosItem";
import { DatosBancariosObject } from "./../../../models/DatosBancariosObject";
import { DomSanitizer } from "../../../../../node_modules/@angular/platform-browser";
import { DatosGeneralesItem } from "../../../models/DatosGeneralesItem";
import { DatosColegiadosObject } from "../../../models/DatosColegiadosObject";
import { PersonaJuridicaItem } from "../../../models/PersonaJuridicaItem";
import { PersonaJuridicaObject } from "../../../models/PersonaJuridicaObject";
import { ComboEtiquetasItem } from "./../../../models/ComboEtiquetasItem";
import { ComboItem } from "../../administracion/parametros/parametros-generales/parametros-generales.component";
import { DatosColegiadosItem } from "../../../models/DatosColegiadosItem";
import { NoColegiadoItem } from "../../../models/NoColegiadoItem";
import { BusquedaSancionesItem } from "../../../models/BusquedaSancionesItem";
import { BusquedaSancionesObject } from "../../../models/BusquedaSancionesObject";
import { DocushareObject } from "../../../models/DocushareObject";
import { DocushareItem } from "../../../models/DocushareItem";
import { FichaDatosCurricularesObject } from "../../../models/FichaDatosCurricularesObject";
import { DatosSolicitudMutualidadItem } from "../../../models/DatosSolicitudMutualidadItem";
import * as moment from 'moment';
import { findIndex } from 'rxjs/operators';

@Component({
  selector: "app-ficha-colegial",
  templateUrl: "./ficha-colegial.component.html",
  styleUrls: ["./ficha-colegial.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class FichaColegialComponent implements OnInit {
  //fichasPosibles: any[];

  // Bodys
  generalBody: FichaColegialGeneralesItem = new FichaColegialGeneralesItem();
  generalError: FichaColegialGeneralesObject = new FichaColegialGeneralesObject();
  checkGeneralBody: FichaColegialGeneralesItem = new FichaColegialGeneralesItem();
  checkColegialesBody: FichaColegialColegialesItem = new FichaColegialColegialesItem();
  colegialesBody: FichaColegialColegialesItem = new FichaColegialColegialesItem();
  colegialesObject: FichaColegialColegialesObject = new FichaColegialColegialesObject();
  sociedadesBody: PersonaJuridicaObject = new PersonaJuridicaObject();
  otrasColegiacionesBody: DatosColegiadosObject = new DatosColegiadosObject();
  certificadosBody: FichaColegialCertificadosObject = new FichaColegialCertificadosObject();
  bodySanciones: BusquedaSancionesItem = new BusquedaSancionesItem();
  bodySearchSanciones: BusquedaSancionesObject = new BusquedaSancionesObject();
  bodySearchRegTel: DocushareObject = new DocushareObject();
  solicitudEditar: SolicitudIncorporacionItem = new SolicitudIncorporacionItem();
  bodyRegTel: any[] = [];
  isLetrado: boolean;
  permisos: boolean = true;
  displayAuditoria: boolean = false;
  publicarDatosContacto: boolean;
  idPersona: any;
  openFicha: boolean = false;
  es: any = esCalendar;
  progressSpinner: boolean = false;
  editar: boolean = false;
  blockCrear: boolean = true;
  activarGuardarGenerales: boolean = false;
  activarGuardarColegiales: boolean = false;
  selectAll: boolean = false;
  selectAllDirecciones: boolean = false;
  selectAllCurriculares: boolean = false;
  selectAllBancarios: boolean = false;
  selectMultiple: boolean = false;
  selectMultipleDirecciones: boolean = false;
  selectMultipleBancarios: boolean = false;
  selectMultipleCurriculares: boolean = false;
  solicitudModificacionMens: string;
  buttonVisibleRegtelAtras: boolean = true;
  buttonVisibleRegtelCarpeta: boolean = true;
  buttonVisibleRegtelDescargar: boolean = true;

  disabledNif: boolean = false;

  // irTurnoOficio: any;
  // irExpedientes: any;
  msgs: Message[];

  colsColegiales: any = [];
  colsColegiaciones: any = [];
  colsCertificados: any = [];
  colsSociedades: any = [];
  colsCurriculares: any = [];
  colsDirecciones: any = [];
  colsBancarios: any = [];
  colsSanciones: any = [];
  colsRegtel: any = [];
  inscrito: string;
  rowsPerPage: any = [];
  tipoCuenta: any[] = [];
  selectedTipo: any[] = [];
  uploadedFiles: any[] = [];
  numSelected: number = 0;
  numSelectedDirecciones: number = 0;
  numSelectedBancarios: number = 0;
  numSelectedDatosRegtel: number = 0;
  numSelectedCurriculares: number = 0;
  numSelectedColegiales: number = 0;
  activacionEditar: boolean = true;
  situacionPersona: String;
  camposDesactivados: boolean = false;
  datos: any[] = [];
  datosCurriculares: any[] = [];
  sortF: any;
  sortO: any;
  bodyDirecciones: DatosDireccionesItem;
  bodyDatosBancarios: DatosBancariosItem;
  datosDirecciones: DatosDireccionesItem[] = [];
  datosDireccionesHist = new DatosDireccionesObject();
  datosBancarios: DatosBancariosItem[] = [];
  searchDireccionIdPersona = new DatosDireccionesObject();
  searchDatosBancariosIdPersona = new DatosBancariosObject();
  datosColegiales: any[] = [];
  datosColegialesInit: any[] = [];
  checkDatosColegiales: any[] = [];
  datosColegiaciones: any[] = [];
  datosCertificados: any[] = [];
  url: any;
  etiquetasPersonaJuridica: any[] = [];
  datosSociedades: any[] = [];
  file: File = undefined;
  edadCalculada: any;
  dataSanciones: any[] = [];

  // Datos Generales
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
  esNewColegiado: boolean = false;
  esColegiado: boolean;
  archivoDisponible: boolean = false;
  existeImagen: boolean = false;
  showGuardarAuditoria: boolean = false;
  etiquetasPersonaJuridicaSelecionados: ComboEtiquetasItem[] = [];
  imagenPersona: any;
  partidoJudicialObject: DatosDireccionesObject = new DatosDireccionesObject();
  partidoJudicialItem: DatosDireccionesItem = new DatosDireccionesItem();
  displayServicios: boolean = false;
  atrasRegTel: String = "";
  fechaHoy: Date;
  // etiquetas
  showGuardar: boolean = false;
  mensaje: String = "";
  control: boolean = false;
  checked: boolean = false;
  autocompletar: boolean = false;
  isCrear: boolean = false;
  closable: boolean = false;
  isFechaInicioCorrect: boolean = false;
  isFechaBajaCorrect: boolean = false;
  isTrue: boolean = false;
  esRegtel: boolean = false;
  historico: boolean = false;
  historicoCV: boolean = false;
  isClose: boolean = false;
  emptyLoadFichaColegial: boolean = false;
  disabledAction: boolean = false;
  comboEtiquetas: any[];
  inscritoSeleccionado: String = "00";
  inscritoDisabled: boolean = false;
  tratamientoDesc: String;
  updateItems: Map<String, ComboEtiquetasItem> = new Map<
    String,
    ComboEtiquetasItem
    >();
  items: Array<ComboEtiquetasItem> = new Array<ComboEtiquetasItem>();
  newItems: Array<ComboEtiquetasItem> = new Array<ComboEtiquetasItem>();
  item: ComboEtiquetasItem = new ComboEtiquetasItem();
  createItems: Array<ComboEtiquetasItem> = new Array<ComboEtiquetasItem>();
  persistenciaColeg: DatosColegiadosItem = undefined;
  persistenciaNoCol: NoColegiadoItem = undefined;
  messageNoContentRegTel: String = "";
  messageRegtel: String;
  datosCurricularesRemove: FichaDatosCurricularesObject = new FichaDatosCurricularesObject();

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
  msgDir = "";

  @ViewChild("autocompleteTopics")
  autocompleteTopics: AutoComplete;
  @ViewChild("tableCertificados")
  tableCertificados: DataTable;
  @ViewChild("tableSanciones")
  tableSanciones: DataTable;
  @ViewChild("tableSociedades")
  tableSociedades: DataTable;
  @ViewChild("tableCurriculares")
  tableCurriculares: DataTable;
  @ViewChild("tableDirecciones")
  tableDirecciones: DataTable;
  @ViewChild("tableBancarios")
  tableBancarios: DataTable;
  @ViewChild("tableColegiales")
  tableColegiales: DataTable;
  @ViewChild("tableRegTel")
  tableRegTel: DataTable;
  @ViewChild("tableColegiaciones")
  tableColegiaciones: DataTable;

  @ViewChild("calendarFechaNacimiento") calendarFechaNacimiento: Calendar;
  fechaNacimientoSelected: boolean = true;
  @ViewChild("calendarFechaIncorporacion") calendarFechaIncorporacion: Calendar;
  fechaIncorporacionSelected: boolean = true;
  @ViewChild("calendarFechaPresentacion") calendarFechaPresentacion: Calendar;
  fechaPresentacionSelected: boolean = true;
  @ViewChild("calendarFechaJura") calendarFechaJura: Calendar;
  fechaJuraSelected: boolean = true;
  @ViewChild("calendarFechaTitulacion") calendarFechaTitulacion: Calendar;
  fechaTitulacionSelected: boolean = true;

  selectedDatosCertificados;
  selectedDatosSociedades;
  selectedDatosCurriculares;
  selectedDatosDirecciones;
  selectedDatosBancarios;
  selectedDatosSanciones;
  selectedDatosColegiales;

  selectedItemCertificados: number = 10;
  selectedItemSanciones: number = 10;
  selectedItemSociedades: number = 10;
  selectedItemCurriculares: number = 10;
  selectedItemDirecciones: number = 10;
  selectedItemBancarios: number = 10;
  selectedItemRegtel: number = 10;
  selectedItemColegiaciones: number = 10;
  selectedItemColegiales: number = 10;
  selectedItem: number = 10;

  selectedDatosRegtel: DocushareItem;
  desactivarVolver: Boolean;

  comboTopics: any[] = [];
  comboService: any[] = [];
  suggestService: any[] = [];
  suggestTopics: any[] = [];
  resultsService: any[] = [];
  resultsTopics: any[] = [];
  backgroundColor;

  yearRange: string;

  nuevaFecha: any;

  isColegiadoEjerciente: boolean = false;
  inscritoChange: boolean = false;
  maxNumColegiado: string;

  @ViewChild("auto")
  autoComplete: AutoComplete;

  @ViewChild("dialog")
  dialog: Dialog;

  @ViewChild("calendar")
  calendar: Calendar;

  comboSexo = [
    { label: "", value: null },
    { label: "Hombre", value: "H" },
    { label: "Mujer", value: "M" }
  ];

  comboInscrito = [
    { label: "Si", value: "1" },
    { label: "No", value: "0" }
  ];

  comboResidente = [
    { label: "Si", value: "1" },
    { label: "No", value: "0" }
  ];

  fichasPosibles = [
    {
      key: "generales",
      activa: false
    },
    {
      key: "colegiaciones",
      activa: false
    },
    {
      key: "colegiales",
      activa: false
    },
    {
      key: "certificados",
      activa: false
    },
    {
      key: "sanciones",
      activa: false
    },
    {
      key: "sociedades",
      activa: false
    },
    {
      key: "curriculares",
      activa: false
    },
    {
      key: "direcciones",
      activa: false
    },
    {
      key: "bancarios",
      activa: false
    },
    {
      key: "interes",
      activa: false
    },
    {
      key: "regtel",
      activa: false
    }
  ];
  private DNI_LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE";

  tarjetaInteres: string;
  tarjetaGenerales: string;
  tarjetaColegiales: string;
  tarjetaOtrasColegiaciones: string;
  tarjetaCertificados: string;
  tarjetaSanciones: string;
  tarjetaSociedades: string;
  tarjetaCurriculares: string;
  tarjetaDirecciones: string;
  tarjetaBancarios: string;
  tarjetaRegtel: string;
  tarjetaMutualidad: string;
  tarjetaAlterMutua: string;

  isCrearColegial: boolean = false;
  nuevoEstadoColegial: FichaColegialColegialesItem = new FichaColegialColegialesItem();
  fechaMinimaEstadoColegial: Date;
  fechaMinimaEstadoColegialMod: Date;
  filaEditable: boolean = false;
  seleccionColegial: string = "single";
  isRestablecer: boolean = false;
  isEliminarEstadoColegial: boolean = false;
  disabledToday: boolean = false;

  constructor(
    private location: Location,
    private sigaServices: SigaServices,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private router: Router,
    private datepipe: DatePipe
  ) { }

  ngOnInit() {

    this.getYearRange();
    this.getLenguage();
    this.checkAccesos();
    sessionStorage.removeItem("direcciones");
    sessionStorage.removeItem("situacionColegialesBody");

    if (sessionStorage.getItem("busquedaCensoGeneral") == "true") {
      this.disabledNif = true;
    } else {
      this.disabledNif = false;
    }

    if (sessionStorage.getItem("disabledAction") == "true") {
      // Es estado baja colegial
      this.disabledAction = true;
    } else {
      this.disabledAction = false;
    }

    if (sessionStorage.getItem("solimodifMensaje")) {
      this.solicitudModificacionMens = sessionStorage.getItem("solimodifMensaje");
      sessionStorage.removeItem("solimodifMensaje");
    }

    // Cogemos los datos de la busqueda de Colegiados
    this.getLetrado();
    if (sessionStorage.getItem("filtrosBusquedaColegiados")) {
      sessionStorage.removeItem("filtrosBusquedaColegiadosFichaColegial");
      this.persistenciaColeg = new DatosColegiadosItem();
      this.persistenciaColeg = JSON.parse(
        sessionStorage.getItem("filtrosBusquedaColegiados")
      );
    } else if (sessionStorage.getItem("filtrosBusquedaNoColegiados")) {
      sessionStorage.removeItem("filtrosBusquedaNoColegiadosFichaColegial");
      this.persistenciaNoCol = new NoColegiadoItem();
      this.persistenciaNoCol = JSON.parse(
        sessionStorage.getItem("filtrosBusquedaNoColegiados")
      );
    } else if (sessionStorage.getItem("busquedaCensoGeneral") == "true") {
      this.disabledNif = true;
    } else if (sessionStorage.getItem("destinatarioCom") != null) {
      this.desactivarVolver = false;
    } else {
      //  LLEGA DESDE PUNTO DE MENÚ
      this.emptyLoadFichaColegial = JSON.parse(
        sessionStorage.getItem("emptyLoadFichaColegial")
      );
      // if (this.emptyLoadFichaColegial) {
      // this.showFailDetalle(
      //   "No se han podido cargar los datos porque el usuario desde el que ha inciado sesión no es colegiado"
      // );
      // }
      this.desactivarVolver = true;
    }
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
      this.checkColegialesBody = JSON.parse(
        sessionStorage.getItem("personaBody")
      );
      this.idPersona = this.generalBody.idPersona;
      if (sessionStorage.getItem("esColegiado")) {
        this.esColegiado = JSON.parse(sessionStorage.getItem("esColegiado"));
      } else {
        this.esColegiado = true;
      }

      if (this.esColegiado) {
        if (this.colegialesBody.situacion == "20") {
          this.isColegiadoEjerciente = true;
        } else {
          this.isColegiadoEjerciente = false;
        }
      }

      this.generalBody.colegiado = this.esColegiado;
      this.checkGeneralBody.colegiado = this.esColegiado;

      // this.checkAcceso();
      this.onInitGenerales();
      this.onInitCurriculares();
      this.onInitColegiales();
      this.onInitSociedades();
      this.onInitOtrasColegiaciones();
      this.searchSanciones();
      this.searchCertificados();
    } else {
      if (sessionStorage.getItem("busquedaCensoGeneral") == "true") {
        this.generalBody = JSON.parse(sessionStorage.getItem("personaBody"));
        this.isLetrado = false;
        this.colegialesBody = JSON.parse(sessionStorage.getItem("personaBody"));
      } else {
        this.generalBody = new FichaColegialGeneralesItem();
        this.colegialesBody = new FichaColegialColegialesItem();
      }

      // this.searchDatosBancariosIdPersona.datosBancariosItem[0] = new DatosBancariosItem();
    }
    if (JSON.parse(sessionStorage.getItem("esNuevoNoColegiado"))) {
      this.esNewColegiado = true;
      this.activacionEditar = false;
      this.onInitGenerales();
    } else {
      this.activacionEditar = true;
      this.esNewColegiado = false;
    }
    if (!this.esNewColegiado && this.generalBody.idPersona != null && this.generalBody.idPersona != undefined) {
      this.onInitCurriculares();
      this.onInitDirecciones();
      this.onInitDatosBancarios();
      this.comprobarREGTEL();

    }

    // this.onInitSociedades();

    // this.onInitOtrasColegiaciones();

    if (!this.esNewColegiado) {
      this.compruebaDNI();
    }

    // RELLENAMOS LOS ARRAY PARA LAS CABECERAS DE LAS TABLAS
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

    this.colsColegiaciones = [
      {
        field: "institucion",
        header: "censo.busquedaClientesAvanzada.literal.colegio"
      },
      {
        field: "numColegiado",
        header: "censo.busquedaClientesAvanzada.literal.nColegiado"
      },
      {
        field: "estadoColegial",
        header: "censo.fichaIntegrantes.literal.estado"
      },
      {
        field: "residenteInscrito",
        header: "censo.ws.literal.residente"
      },
      {
        field: "fechaNacimiento",
        header: "censo.consultaDatosColegiacion.literal.fechaNac"
      },
      {
        field: "correo",
        header: "censo.datosDireccion.literal.correo"
      },
      {
        field: "telefono",
        header: "censo.datosDireccion.literal.telefonoFijo"
      },
      {
        field: "movil",
        header: "censo.datosDireccion.literal.telefonoMovil"
      }
    ];

    this.colsCertificados = [
      {
        field: "descripcion",
        header: "general.description"
      },
      {
        field: "fechaEmision",
        header: "facturacion.busquedaAbonos.literal.fecha2"
      }
    ];
    this.colsRegtel = [
      {
        field: "title",
        header: "censo.resultadosSolicitudesModificacion.literal.Nombre"
      },
      {
        field: "summary",
        header: "censo.regtel.literal.resumen"
      },
      {
        field: "fechaModificacion",
        header: "censo.datosDireccion.literal.fechaModificacion"
      },
      {
        field: "sizeKB",
        header: "censo.regtel.literal.tamanno"
      }
    ];

    this.colsDirecciones = [
      {
        field: "tipoDireccion",
        header: "censo.datosDireccion.literal.tipo.direccion"
      },
      {
        field: "domicilioLista",
        header: "censo.consultaDirecciones.literal.direccion"
      },
      {
        field: "codigoPostal",
        header: "censo.ws.literal.codigopostal"
      },
      {
        field: "nombrePoblacion",
        header: "censo.consultaDirecciones.literal.poblacion"
      },
      {
        field: "nombreProvincia",
        header: "censo.datosDireccion.literal.provincia"
      },
      {
        field: "telefono",
        header: "censo.ws.literal.telefono"
      },
      {
        field: "movil",
        header: "censo.datosDireccion.literal.movil"
      },
      {
        field: "correoElectronico",
        header: "censo.datosDireccion.literal.correo"
      }
    ];

    this.colsSociedades = [
      {
        field: "tipo",
        header: "censo.busquedaClientesAvanzada.literal.tipoCliente"
      },
      { field: "nif", header: "administracion.usuarios.literal.NIF" },
      {
        field: "denominacion",
        header: "censo.consultaDatosGenerales.literal.denominacion"
      },
      {
        field: "fechaConstitucion",
        header: "censo.general.literal.FechaConstitucion"
      },
      {
        field: "abreviatura",
        header: "gratuita.definirTurnosIndex.literal.abreviatura"
      },
      {
        field: "numeroIntegrantes",
        header: "censo.general.literal.numeroIntegrantes"
      }
    ];

    this.colsCurriculares = [
      {
        field: "fechaDesde",
        header: "facturacion.seriesFacturacion.literal.fInicio"
      },
      {
        field: "fechaHasta",
        header: "censo.consultaDatos.literal.fechaFin"
      },
      {
        field: "categoriaCurricular",
        header: "censo.busquedaClientesAvanzada.literal.categoriaCV"
      },
      {
        field: "tipoSubtipo",
        header: "censo.busquedaClientesAvanzada.literal.subtiposCV"
      },
      {
        field: "descripcion",
        header: "general.description"
      }
    ];

    this.colsBancarios = [
      {
        field: "titular",
        header: "Titular"
      },
      {
        field: "iban",
        header: "Código de cuenta (IBAN)"
      },
      {
        field: "bic",
        header: "Banco (BIC)"
      },
      {
        field: "uso",
        header: "Uso"
      },
      {
        field: "fechaFirmaServicios",
        header: "Fecha firma del mandato de servicios"
      },
      {
        field: "fechaFirmaProductos",
        header: "Fecha firma del mandato de productos"
      }
    ];
    this.colsSanciones = [
      {
        field: "colegio",
        header: "busquedaSanciones.colegioSancionador.literal"
      },
      {
        field: "nombre",
        header: "administracion.parametrosGenerales.literal.nombre"
      },
      {
        field: "tipoSancion",
        header:
          "menu.expediente.sanciones.busquedaPorColegio.tipoSancion.literal"
      },
      {
        field: "refColegio",
        header:
          "menu.expediente.sanciones.busquedaPorColegio.RefColegio.literal"
      },
      {
        field: "fechaDesde",
        header: "censo.busquedaSolicitudesTextoLibre.literal.fechaDesde"
      },
      {
        field: "fechaHasta",
        header: "censo.busquedaSolicitudesTextoLibre.literal.fechaHasta"
      },
      {
        field: "rehabilitado",
        header:
          "menu.expediente.sanciones.busquedaPorColegio.sancionesRehabilitadas.literal"
      },
      {
        field: "firmeza",
        header: "menu.expediente.sanciones.firmeza.literal"
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

  //CONTROL DE PERMISOS

  checkAccesos() {
    this.checkAccesoDatosGenerales();
    this.checkAccesoInteres();
    this.checkAccesoDatosColegiales();
    this.checkAccesoOtrasColegiaciones();
    this.checkAccesoCertificados();
    this.checkAccesoSanciones();
    this.checkAccesoSociedades();
    this.checkAccesoDatosCurriculares();
    this.checkAccesoDirecciones();
    this.checkAccesoDatosBancarios();
    this.checkAccesoRegtel();
    this.checkAccesoMutualidad();
    this.checkAccesoAlterMutua();
  }

  // CONTROL DE PESTAÑAS ABRIR Y CERRAR

  abreCierraFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);

    if (
      key == "generales" &&
      !this.activacionEditar &&
      !this.emptyLoadFichaColegial
    ) {
      fichaPosible.activa = !fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }

    if (this.activacionEditar) {
      fichaPosible.activa = !fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
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

  // MÉTODOS GENÉRICOS PARA TABLAS Y USOS VARIOS
  getLetrado() {
    if (JSON.parse(sessionStorage.getItem("isLetrado")) == true) {
      this.isLetrado = true;
    } else {
      this.isLetrado = !this.permisos;
    }
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

  arreglarFecha(fecha) {
    let jsonDate = JSON.stringify(fecha);
    let rawDate = jsonDate.slice(1, -1);
    if (rawDate.length < 14) {
      let splitDate = rawDate.split("/");
      let arrayDate = splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0];
      fecha = new Date((arrayDate += "T00:00:00.001Z"));
    } else {
      fecha = new Date(rawDate);
    }

    return fecha;
  }

  arreglarFechaRegtel(fecha) {
    let jsonDate = JSON.stringify(fecha);
    let rawDate = jsonDate.slice(3, -17);
    let splitDate = rawDate.split("-");
    let arrayDate = splitDate[2] + "/" + splitDate[1] + "/" + splitDate[0];
    // fecha = new Date((arrayDate += "T00:00:00.001Z"));
    // fecha = new Date(rawDate);
    return arrayDate;
  }

  arreglarFechaColegial(fecha) {
    let jsonDate = JSON.stringify(fecha);
    let rawDate = jsonDate.slice(3, -15);
    let splitDate = rawDate.split("-");
    let arrayDate = splitDate[2] + "/" + splitDate[1] + "/" + splitDate[0];
    // fecha = new Date((arrayDate += "T00:00:00.001Z"));
    // fecha = new Date(rawDate);
    return arrayDate;
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
      summary: "Incorrecto",
      detail: mensaje
    });
  }

  showSuccessDetalle(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "success", summary: "", detail: mensaje });
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

  showInfo(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "info", summary: "", detail: mensaje });
  }

  backTo() {
    sessionStorage.removeItem("personaBody");
    sessionStorage.removeItem("esNuevoNoColegiado");
    sessionStorage.removeItem("filtrosBusquedaColegiados");
    sessionStorage.removeItem("filtrosBusquedaNoColegiados");

    if (this.persistenciaColeg != undefined) {
      sessionStorage.setItem(
        "filtrosBusquedaColegiadosFichaColegial",
        JSON.stringify(this.persistenciaColeg)
      );
    }
    if (this.persistenciaNoCol != undefined) {
      sessionStorage.setItem(
        "filtrosBusquedaNoColegiadosFichaColegial",
        JSON.stringify(this.persistenciaNoCol)
      );
    }
    // this.cardService.searchNewAnnounce.next(null);
    //this.location.back();
    if (sessionStorage.getItem("busquedaCensoGeneral") == "true") {
      this.router.navigate(["/busquedaCensoGeneral"]);
    } else if (sessionStorage.getItem("esColegiado") == "false") {
      this.router.navigate(["/busquedaNoColegiados"]);
    } else if (sessionStorage.getItem("esColegiado") == "true") {
      this.router.navigate(["/busquedaColegiados"]);
    } else {
      this.location.back();
    }
  }

  uploadFile(event: any) {
    // guardamos la imagen en front para despues guardarla, siempre que tenga extension de imagen
    let fileList: FileList = event.files;

    let nombreCompletoArchivo = fileList[0].name;
    let extensionArchivo = nombreCompletoArchivo.substring(
      nombreCompletoArchivo.lastIndexOf("."),
      nombreCompletoArchivo.length
    );

    if (extensionArchivo == null) {
      // Mensaje de error de formato de imagen y deshabilitar boton guardar
      this.file = undefined;

      this.showFailUploadedImage();
    } else {
      // se almacena el archivo para habilitar boton guardar
      this.file = fileList[0];
    }
  }

  showFailUploadedImage() {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Error",
      detail: "Error al adjuntar la imagen"
    });
  }

  activarPaginacion() {
    // TEMPORAL HASTA INTEGRAR CAMBIOS
    return true;
  }

  clear() {
    this.msgs = [];
  }

  setItalic(datoH) {
    if (datoH.fechaBaja == null) return false;
    else return true;
  }

  setItalica(datoH) {
    if (datoH.archivada == "No") return false;
    else return true;
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

  activadoBotonesLetrado() {
    if (this.isLetrado) {
      return true;
    } else {
      return this.camposDesactivados;
    }
  }

  ngOnDestroy() { }
  // FIN MÉTODOS GENÉRICOS
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  // MÉTODOS PARA DATOS GENERALES

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
      this.fechaAlta = this.generalBody.incorporacion;
    }
    this.sigaServices.get("fichaPersona_tipoIdentificacionCombo").subscribe(
      n => {
        this.tipoIdentificacion = n.combooItems;
        // 1: {label: "CIF", value: "20"}
        // 2: {label: "NIE", value: "40"}
        // 3: {label: "NIF", value: "10"}
        // 4: {label: "Otro", value: "50"}
        // 5: {label: "Pasaporte", value: "30"}
        this.tipoIdentificacion[5].label =
          this.tipoIdentificacion[5].label +
          " / " +
          this.tipoIdentificacion[4].label;
      },
      err => {
        console.log(err);
      }
    );

    this.sigaServices.get("fichaColegialGenerales_tratamiento").subscribe(
      n => {
        this.generalTratamiento = n.combooItems;
        let tratamiento = this.generalTratamiento.find(
          item => item.value === this.generalBody.idTratamiento
        );
        if (tratamiento != undefined && tratamiento.label != undefined) {
          this.tratamientoDesc = tratamiento.label;
        }
      },
      err => {
        console.log(err);
      }
    );

    this.sigaServices.get("fichaColegialGenerales_estadoCivil").subscribe(
      n => {
        this.generalEstadoCivil = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );

    this.sigaServices.get("etiquetas_lenguaje").subscribe(
      n => {
        this.generalIdiomas = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );

    this.sigaServices.get("busquedaColegiados_situacion").subscribe(
      n => {
        this.comboSituacion = n.combooItems;
      },
      err => {
        console.log(err);
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

  aceptDialogConfirmation(item) {
    // this.checked = false;

    // if (this.isCrear) {
    //   let newItem = new ComboEtiquetasItem();
    //   newItem = item;

    //   newItem.fechaInicio = this.datepipe.transform(
    //     newItem.fechaInicio,
    //     "dd/MM/yyyy"
    //   );
    //   newItem.fechaBaja = this.datepipe.transform(
    //     newItem.fechaBaja,
    //     "dd/MM/yyyy"
    //   );

    //   this.createItems.push(newItem);
    //   this.activacionGuardarGenerales();

    //   this.updateItems.set(newItem.label, newItem);

    //   if (this.isNotContainsEtiq(newItem)) {
    //     this.etiquetasPersonaJuridicaSelecionados.push(newItem);
    //   }
    //   this.autoComplete.multiInputEL.nativeElement.value = null;
    // } else {
    //   let oldItem = new ComboEtiquetasItem();
    //   oldItem = item;
    //   oldItem.fechaInicio = this.datepipe.transform(
    //     oldItem.fechaInicio,
    //     "dd/MM/yyyy"
    //   );
    //   oldItem.fechaBaja = this.datepipe.transform(
    //     oldItem.fechaBaja,
    //     "dd/MM/yyyy"
    //   );

    //   this.createItems.push(oldItem);

    //   this.updateItems.set(oldItem.idGrupo, oldItem);
    // }

    // // Dehabilitamos el guardar para los próximos
    // this.isTrue = false;
    // this.activacionGuardarGenerales();
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
  // getComboSexo() {
  //   this.comboSexo = [
  //     { label: "", value: null },
  //     { label: "Hombre", value: "H" },
  //     { label: "Mujer", value: "M" }
  //   ];
  // }

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
          console.log(err);
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

  comprobarAuditoria() {
    // modo creación

    // mostrar la auditoria depende de un parámetro que varía según la institución
    this.generalBody.motivo = undefined;
    this.showGuardarAuditoria = false;

    if (!this.isLetrado) {
      this.generalesGuardar();
    } else {
      this.displayAuditoria = true;
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
      this.generalBody.etiquetas[i] = this.etiquetasPersonaJuridicaSelecionados[
        i
      ];
    }

    // fichaDatosGenerales_CreateNoColegiado
    if (!this.esNewColegiado) {
      // this.generalBody.idioma = this.idiomaPreferenciaSociedad;

      let finalUpdateItems: any[] = [];
      this.updateItems.forEach((valorMap: ComboEtiquetasItem, key: string) => {
        this.etiquetasPersonaJuridicaSelecionados.forEach(
          (valorSeleccionados: any, index: number) => {
            if (
              valorSeleccionados.idGrupo == valorMap.idGrupo &&
              valorSeleccionados.label == valorMap.label
            ) {
              finalUpdateItems.push(valorMap);
            } else if (
              valorSeleccionados.value == valorMap.idGrupo &&
              valorSeleccionados.label == valorMap.label
            ) {
              finalUpdateItems.push(valorMap);
            }
          }
        );
      });

      this.generalBody.etiquetas = finalUpdateItems;

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
            this.obtenerEtiquetasPersonaJuridicaConcreta();
            this.progressSpinner = false;
            this.showSuccess();
          },
          error => {
            console.log(error);
            this.progressSpinner = false;
            this.activacionGuardarGenerales();
            this.generalError = JSON.parse(error["error"]);
            if (this.generalError.error.message.toString()) {
              this.showFailDetalle(this.generalError.error.message.toString());
            } else {
              this.showFail();
            }
          }
          // EVENTO PARA ACTIVAR GUARDAR AL BORRAR UNA ETIQUETA
        );
    } else {
      let finalUpdateItems: any[] = [];
      this.updateItems.forEach((valorMap: ComboEtiquetasItem, key: string) => {
        this.etiquetasPersonaJuridicaSelecionados.forEach(
          (valorSeleccionados: any, index: number) => {
            if (
              valorSeleccionados.idGrupo == valorMap.idGrupo ||
              valorSeleccionados.value == valorMap.idGrupo
            ) {
              finalUpdateItems.push(valorMap);
            }
          }
        );
      });

      this.generalBody.etiquetas = finalUpdateItems;
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
            this.activacionEditar = true;
          },
          error => {
            console.log(error);
            this.progressSpinner = false;
            this.activacionGuardarGenerales();
            this.generalError = JSON.parse(error["error"]);
            if (this.generalError.error.message.toString()) {
              this.showFailDetalle(this.generalError.error.message.toString());
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
          }
        );
    }
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
            if (data.error.description != "") {
              this.solicitudModificacionMens = data.error.description;
            }
            this.checkGeneralBody = JSON.parse(JSON.stringify(this.generalBody));
            this.activacionGuardarGenerales();
            this.progressSpinner = false;
            this.cerrarAuditoria();
            this.showSuccess();
          },
          error => {
            console.log(error);
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
    if (this.fechaAlta != undefined) {
      this.generalBody.incorporacionDate = this.transformaFecha(this.fechaAlta);
    }
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
    this.generalBody.etiquetas = this.etiquetasPersonaJuridicaSelecionados;

    if (JSON.parse(JSON.stringify(this.resultsTopics)) != undefined && JSON.parse(JSON.stringify(this.resultsTopics)) != null && JSON.parse(JSON.stringify(this.resultsTopics)).length > 0) {
      this.generalBody.temasCombo = JSON.parse(JSON.stringify(this.resultsTopics));
    }

    if (
      (JSON.stringify(this.checkGeneralBody) != JSON.stringify(this.generalBody)) || this.file != undefined
    ) {
      if (
        this.generalBody.nif != "" &&
        this.generalBody.nif != undefined &&
        this.generalBody.idTipoIdentificacion != "" &&
        this.generalBody.idTipoIdentificacion != undefined &&
        this.generalBody.soloNombre != undefined &&
        this.generalBody.apellidos1 != undefined &&
        this.generalBody.soloNombre != "" &&
        this.generalBody.apellidos1 != "" &&
        this.generalBody.idTratamiento != null &&
        this.generalBody.idLenguaje != "" &&
        this.generalBody.idLenguaje != undefined
      ) {
        this.activarGuardarGenerales = true;
      } else {
        this.activarGuardarGenerales = false;
      }
    } else {
      this.activarGuardarGenerales = false;
    }

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

    this.fechaNacimientoSelected = true;
    // console.log(new Date(event));
    var hoy = new Date();
    var cumpleanos = new Date(event); //

    if (this.comprobarFecha(cumpleanos, this.calendarFechaNacimiento.minDate)) {

      // var cumpleanos = new Date(fecha);
      var edad = hoy.getFullYear() - cumpleanos.getFullYear();
      var m = hoy.getMonth() - cumpleanos.getMonth();

      if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
        edad--;
      }

      this.edadCalculada = edad;
      this.fechaNacimiento = cumpleanos;
      this.calendarFechaNacimiento.overlayVisible = false;

    } else {
      this.edadCalculada = 0;
    }
  }

  onWriteCalendar() {
    // console.log(new Date(event));
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
      this.etiquetasPersonaJuridicaSelecionados = this.generalBody.etiquetas;
      this.obtenerEtiquetasPersonaJuridicaConcreta();
      this.stringAComisiones();
      this.activacionGuardarGenerales();
    } else {
      this.cargarImagen(this.idPersona);
      this.generalBody = JSON.parse(JSON.stringify(this.checkGeneralBody));
      this.etiquetasPersonaJuridicaSelecionados = this.generalBody.etiquetas;
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
          console.log(error);
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
          console.log(error);
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

  filterLabelsMultiple(event) {
    let etiquetasPuestas = [];
    if (this.etiquetasPersonaJuridicaSelecionados) {
      etiquetasPuestas = this.etiquetasPersonaJuridicaSelecionados;
    }
    this.sigaServices.get("busquedaPerJuridica_etiquetas").subscribe(
      n => {
        // coger todas las etiquetas
        let etiquetasSugerencias = this.filterLabel(event.query, n.combooItems);

        // this.comboEtiquetas = this.comboEtiquetas.filter(function(item) {
        //   return !etiquetasPuestas.includes(item);
        // });

        if (etiquetasPuestas.length > 0) {
          this.comboEtiquetas = [];

          etiquetasSugerencias.forEach(element => {
            let find = etiquetasPuestas.find(x => x.label === element.label);
            if (find == undefined) {
              this.comboEtiquetas.push(element);
            }
          });
        } else {
          this.comboEtiquetas = etiquetasSugerencias;
        }
      },
      err => {
        console.log(err);
      }
    );
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

    // if (this.generalBody.nif.length > 8) {
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
        if (element.idGrupo == event.value) {
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
        this.item.idGrupo = event.value;
        this.item.label = event.label;

        // this.mensaje = this.translateService.instant(
        //   "censo.etiquetas.literal.rango"
        // );
        this.createItems.push(this.item);
        this.updateItems.set(this.item.idGrupo, this.item);

      } else {
        // Si existe en el array, lo borramos para que no queden registros duplicados
        for (
          let i = 0;
          i < this.etiquetasPersonaJuridicaSelecionados.length;
          i++
        ) {
          if (
            this.etiquetasPersonaJuridicaSelecionados[i].idGrupo == undefined
          ) {
            if (
              this.etiquetasPersonaJuridicaSelecionados[i].label == event.label
            ) {
              this.etiquetasPersonaJuridicaSelecionados.splice(i, 1);
            }
          } else {
            if (
              this.etiquetasPersonaJuridicaSelecionados[i].idGrupo ==
              event.value
            ) {
              this.etiquetasPersonaJuridicaSelecionados.splice(i, 1);
              this.onUnselect(event);
            }
          }
        }
        if (
          this.updateItems.size >
          this.etiquetasPersonaJuridicaSelecionados.length
        ) {
          this.updateItems.delete(event.value);
        }
      }
    }
  }

  onUnselect(event) {
    this.activacionGuardarGenerales();
    if (event) {
      if (event.value == undefined) {
        this.updateItems.delete(event.idGrupo);
        this.showGuardar = true;
      } else {
        this.updateItems.delete(event.value);
        this.showGuardar = true;
      }
    }
  }

  deleteLabel(event) {
    this.activacionGuardarGenerales();
    for (let i = 0; i < this.etiquetasPersonaJuridicaSelecionados.length; i++) {
      if (this.etiquetasPersonaJuridicaSelecionados[i].idGrupo == undefined) {
        if (this.etiquetasPersonaJuridicaSelecionados[i].label == event.label) {
          this.etiquetasPersonaJuridicaSelecionados.splice(i, 1);
        }
      } else {
        if (
          this.etiquetasPersonaJuridicaSelecionados[i].idGrupo == event.value
        ) {
          this.etiquetasPersonaJuridicaSelecionados.splice(i, 1);
          this.onUnselect(event);
        }
      }
    }
    // if (event) {
    //   if (event.value == undefined) {
    //     this.updateItems.delete(event.idGrupo);
    //     this.showGuardar = true;
    //   } else {
    //     this.updateItems.delete(event.value);
    //     this.showGuardar = true;
    //   }
    // }
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
  // FIN DATOS GENERALES
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  // MÉTODOS PARA DATOS COLEGIALES
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
    if (this.colegialesBody.situacionResidente != undefined) {
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

  activacionGuardarColegiales() {
    this.inscritoAItem();
    if (
      JSON.stringify(this.checkColegialesBody) !=
      JSON.stringify(this.colegialesBody) &&
      this.colegialesBody.numColegiado != "" &&
      this.colegialesBody.residenteInscrito != "" &&
      this.colegialesBody.incorporacion != null &&
      this.colegialesBody.fechapresentacion != null &&
      this.colegialesBody.fechaJura != null
    ) {

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
      if (this.isCrearColegial == false) {
        if (JSON.stringify(this.datosColegiales) != JSON.stringify(this.checkDatosColegiales)) {
          this.activarGuardarColegiales = true;
        } else {
          this.activarGuardarColegiales = false;
        }
      } else if (this.colegialesBody.numColegiado != "" &&
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

  numMutualistaCheck() {
    if (this.colegialesBody.nMutualista != "") {
      this.activacionGuardarColegiales();
      if (Number(this.colegialesBody.nMutualista)) {
        return true;
      } else {
        this.colegialesBody.nMutualista = "";
        this.checkColegialesBody.nMutualista = "";
        return false;
      }
    } else {
      return true;
    }
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
      this.colegialesBody.estadoColegial = this.nuevoEstadoColegial.situacion;

      //Si el cambio es a ejerciente
      if (this.nuevoEstadoColegial.situacion == "20") {
        //Se comprueba si le falta alguna direccion
        //Si no le falta llamamos al servicio para guardar los cambios
        if (this.comprobarDireccion(true)) {
          this.callServiceGuardarColegiales();
          //Si falta se muestra un mensaje indicando que se creara esa direccion que falta automaticamente
        } else {
          this.callServiceShowMessageUpdate();
        }
        //Si el cambio es de ejerciente a no ejerciente
      } else if (this.nuevoEstadoColegial.situacion != "20" && this.datosColegiales[1].idEstado == "20") {
        //Se comprueba si le falta alguna direccion
        //Si no le falta llamamos al servicio para guardar los cambios
        if (this.comprobarDireccion(false)) {
          this.callServiceGuardarColegiales();
        } else {
          //Si falta se muestra un mensaje indicando que se creara esa direccion que falta automaticamente
          this.callServiceShowMessageUpdate();
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
          this.callServiceShowMessageUpdate();
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
          this.callServiceShowMessageUpdate();
        }
        //Si el cambio pertenece a un estado no ejerciente, se guarda sin realizar comprobaciones
      } else {
        this.callServiceGuardarColegiales();
      }
    }
  }

  callServiceShowMessageUpdate() {
    this.progressSpinner = false;
    let icon = "fa fa-edit";
    this.confirmationService.confirm({
      message: this.msgDir,
      icon: icon,

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

  callServiceShowMessageDelete(selectedItem) {
    let icon = "fa fa-edit";
    this.confirmationService.confirm({
      message: this.msgDir,
      icon: icon,

      accept: () => {
        this.callServiceEliminarEstadoColegial(selectedItem);
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
      tipos.push("Preferente Teléfono");
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
      if (isEjerciente) {
        this.msgDir = "Antes de pasar el colegiado a Ejerciente, tendrá que introducir una dirección para el colegiado.";
        return false;
      } else {
        this.msgDir = "Antes de cambiar la situación, tendrá que introducir una dirección para el colegiado.";
        return false;
      }
    } else {
      this.msgDir = "Para finalizar el cambio a Ejerciente ";
      if (tipos.length == 0) {
        return true;
      } else if (tipos.length == 1) {
        this.msgDir += "es necesaria una dirección de ";
        this.msgDir += tipos[0];
        this.msgDir += ". Se asignará automáticamente el tipo ";
        this.msgDir += tipos[0];
        this.msgDir += " a la actual dirección de Censo Web ¿Desea continuar?";
        return false;
      } else if (tipos.length > 1) {

        this.msgDir += "son necesarias las direcciones de ";
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
        this.msgDir += " .Se asignará automáticamente los tipos ";
        this.msgDir += msgTipos;
        this.msgDir += " a la actual dirección de Censo Web ¿Desea continuar?";
        return false;
      }
    }
  }

  callServiceGuardarColegiales() {
    this.progressSpinner = true;

    this.sigaServices
      .post("fichaDatosColegiales_datosColegialesUpdate", this.colegialesBody)
      .subscribe(
        data => {

          // Siempre realizaremos el update de los registros de la tabla, tanto del registro editable como de los registros que solo se pueden modificar las observaciones
          this.datosColegiales[0].idInstitucion = this.colegialesBody.idInstitucion;
          this.datosColegiales[0].idPersona = this.colegialesBody.idPersona;
          this.sigaServices
            .post("fichaDatosColegiales_datosColegialesUpdateEstados", this.datosColegiales)
            .subscribe(
              data => {
                // En el caso de que se haya insertado un nuevo estado colegial en la tabla, habrá que realizar el insert
                if (this.isCrearColegial == true) {
                  this.nuevoEstadoColegial.idInstitucion = this.colegialesBody.idInstitucion;
                  this.nuevoEstadoColegial.idPersona = this.colegialesBody.idPersona;

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
                        this.showSuccess();
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
                        console.log(error);
                        this.progressSpinner = false;
                        this.isCrearColegial = false;
                        this.isRestablecer = false;
                        this.inscritoChange = false;
                        this.filaEditable = false;
                        this.activarGuardarColegiales = false;
                        this.numSelectedColegiales = 0;
                        this.showFail();
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
                  this.showSuccess();
                  this.onInitColegiales();
                  this.searchDirecciones();

                  this.checkColegialesBody = JSON.parse(
                    JSON.stringify(this.colegialesBody)
                  );
                }
              },
              error => {
                console.log(error);
                this.progressSpinner = false;
                this.isCrearColegial = false;
                this.isRestablecer = false;
                this.inscritoChange = false;
                this.activarGuardarColegiales = false;
                this.numSelectedColegiales = 0;
                this.filaEditable = false;
                this.showFail();
              }
            );
        },
        error => {
          console.log(error);
          this.progressSpinner = false;
          this.isCrearColegial = false;
          this.isRestablecer = false;
          this.inscritoChange = false;
          this.activarGuardarColegiales = false;
          this.filaEditable = false;
          this.numSelectedColegiales = 0;
          this.showFail();
        }
      );
  }

  onInitColegiales() {
    this.itemAInscrito();
    this.sigaServices.get("fichaDatosColegiales_tipoSeguro").subscribe(
      n => {
        this.comboTipoSeguro = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );
    this.searchColegiales();
    this.getInscritoInit();
    this.getSituacionPersona();
  }

  restablecerColegiales() {
    this.selectedDatosColegiales = '';
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

  searchColegiales() {
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

          this.checkDatosColegiales = JSON.parse(JSON.stringify(this.datosColegiales));
        },
        err => {
          console.log(err);
        }
      );
  }

  onChangeCalendarTable(event, selectedDatos) {
    if (this.isCrearColegial) {
      this.nuevoEstadoColegial.fechaEstadoStr = event;
    } else {
      selectedDatos.fechaEstadoStr = event;
      this.datosColegiaciones[0].fechaEstadoNueva = event;
    }
    this.isRestablecer = true;
    this.activacionGuardarColegiales();
  }

  onChangeDropEstadoColegial(event, selectedDatos) {
    if (!this.isCrearColegial) {
      let identificacion = this.comboSituacion.find(
        item => item.value === event.value
      );

      if (selectedDatos.estadoColegial != identificacion.label) {
        this.activarGuardarColegiales = false;
      }
      selectedDatos.estadoColegial = identificacion.label;
    }
    this.isRestablecer = true;
    this.activacionGuardarColegiales();
  }

  onChangeDropResidenteColegial(event, selectedDatos) {
    if (!this.isCrearColegial) {
      if (event.value == 1) {
        selectedDatos.situacionResidente = 'Si';
      } else {
        selectedDatos.situacionResidente = 'No';
      }
    }
    this.isRestablecer = true;
    this.activacionGuardarColegiales();
  }

  changeSortColegiales(event) {
    this.sortF = "fechaEstado";
    this.sortO = 1;
    if (this.tableColegiales != undefined) {
      this.tableColegiales.sortField = this.sortF;
    }
  }

  nuevoColegial() {
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
    } else {
      this.disabledToday = false;
    }

    this.datosColegiales.forEach(element => {
      element.habilitarObs = false;
    });
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

  confirmarEliminarEstadoColegial(selectedDatos) {
    let mess = this.translateService.instant("messages.deleteConfirmation");
    let icon = "fa fa-trash-alt";
    this.confirmationService.confirm({
      message: mess,
      icon: icon,
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

  callServiceEliminarEstadoColegial(selectedItem) {
    this.progressSpinner = true;

    selectedItem.idInstitucion = this.colegialesBody.idInstitucion;
    selectedItem.idPersona = this.colegialesBody.idPersona;

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
          this.showSuccess();
          this.searchDirecciones();
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
          this.showFail();
        }, () => {
          this.numSelectedColegiales = 0;
        }
      );
  }

  eliminarEstadoColegial(selectedItem) {

    if (this.datosColegiales[1].idEstado == "20" && selectedItem.idEstado != "20") {
      //Se comprueba si le falta alguna direccion
      //Si no le falta llamamos al servicio para guardar los cambios
      if (this.comprobarDireccion(true)) {
        this.callServiceEliminarEstadoColegial(selectedItem);
        //Si falta se muestra un mensaje indicando que se creara esa direccion que falta automaticamente
      } else {
        this.callServiceShowMessageDelete(selectedItem);
      }
      //Si el cambio es de ejerciente a no ejerciente
    } else if (selectedItem.idEstado == "20" && this.datosColegiales[1].idEstado != "20") {
      //Se comprueba si le falta alguna direccion
      //Si no le falta llamamos al servicio para guardar los cambios
      if (this.comprobarDireccion(false)) {
        this.callServiceEliminarEstadoColegial(selectedItem);
        //Si falta se muestra un mensaje indicando que se creara esa direccion que falta automaticamente
      } else {
        this.callServiceShowMessageDelete(selectedItem);
      }
      //Si el cambio pertenece a un estado no ejerciente, se elimina sin realizar comprobaciones
    } else {
      this.callServiceEliminarEstadoColegial(selectedItem);
    }



  }

  // FIN DATOS COLEGIALES
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  // MÉTODOS PARA OTRAS COLEGIACIONES
  onInitOtrasColegiaciones() {
    this.searchOtherCollegues();
  }

  activarPaginacionOtrasColegiaciones() {
    if (!this.datosColegiaciones || this.datosColegiaciones.length == 0)
      return false;
    else return true;
  }

  searchOtherCollegues() {
    this.sigaServices
      .postPaginado(
        "fichaColegialOtrasColegiaciones_searchOtherCollegues",
        "?numPagina=1",
        this.generalBody.nif
      )
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.otrasColegiacionesBody = JSON.parse(data["body"]);
          this.datosColegiaciones = this.otrasColegiacionesBody.colegiadoItem;
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        }
      );
  }
  // FIN OTRAS COLEGIACIONES
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  // MÉTODOS PARA CERTIFICADOS
  activarPaginacionCertificados() {
    if (!this.datosCertificados || this.datosCertificados.length == 0)
      return false;
    else return true;
  }

  searchCertificados() {
    this.sigaServices
      .postPaginado(
        "fichaDatosCertificados_datosCertificadosSearch",
        "?numPagina=1",
        this.idPersona
      )
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.certificadosBody = JSON.parse(data["body"]);
          this.datosCertificados = this.certificadosBody.certificadoItem;
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        }
      );
  }

  // redireccionarCerts(selectedDatos) {
  //   this.router.navigate(["/mantenimientoCertificados"]);
  // }

  // FIN CERTIFICADOS
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  // MÉTODOS PARA SOCIEDADES

  onInitSociedades() {
    this.searchSocieties();
  }

  activarPaginacionSociedades() {
    if (!this.datosSociedades || this.datosSociedades.length == 0) return false;
    else return true;
  }

  searchSocieties() {
    this.sigaServices
      .postPaginado(
        "fichaColegialSociedades_searchSocieties",
        "?numPagina=1",
        this.idPersona
      )
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.sociedadesBody = JSON.parse(data["body"]);
          this.datosSociedades = this.sociedadesBody.busquedaJuridicaItems;
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        }
      );
  }

  redireccionarSociedades(datos) {
    // this.usuarioBody = JSON.parse(sessionStorage.getItem("usuarioBody"));
    sessionStorage.setItem("usuarioBody", JSON.stringify(datos));
    this.router.navigate(["/fichaPersonaJuridica"]);
  }

  onChangeRowsPerPagesRegtel(event) {
    this.selectedItemRegtel = event.value;
    this.changeDetectorRef.detectChanges();
    this.tableRegTel.reset();
  }
  onChangeRowsPerPagesCertificados(event) {
    this.selectedItemCertificados = event.value;
    this.changeDetectorRef.detectChanges();
    this.tableCertificados.reset();
  }

  onChangeRowsPerPagesSanciones(event) {
    this.selectedItemSanciones = event.value;
    this.changeDetectorRef.detectChanges();
    this.tableSanciones.reset();
  }

  onChangeRowsPerPagesSociedades(event) {
    this.selectedItemSociedades = event.value;
    this.changeDetectorRef.detectChanges();
    this.tableSociedades.reset();
  }

  onChangeRowsPerPagesCurriculares(event) {
    this.selectedItemCurriculares = event.value;
    this.changeDetectorRef.detectChanges();
    this.tableCurriculares.reset();
  }

  onChangeRowsPerPagesDirecciones(event) {
    this.selectedItemDirecciones = event.value;
    this.changeDetectorRef.detectChanges();
    this.tableDirecciones.reset();
  }

  onChangeRowsPerPagesBancarios(event) {
    this.selectedItemBancarios = event.value;
    this.changeDetectorRef.detectChanges();
    this.tableBancarios.reset();
  }

  onChangeRowsPerPagesColegiaciones(event) {
    this.selectedItemColegiaciones = event.value;
    this.changeDetectorRef.detectChanges();
    this.tableColegiaciones.reset();
  }

  onChangeRowsPerPagesColegiales(event) {
    this.selectedItemColegiales = event.value;
    this.changeDetectorRef.detectChanges();
    this.tableColegiales.reset();
  }
  // FIN SOCIEDADES
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  // MÉTODOS PARA DATOS CURRICULARES
  activarPaginacionCurriculares() {
    if (!this.datosCurriculares || this.datosCurriculares.length == 0)
      return false;
    else return true;
  }

  changeSort(event) {
    this.sortF = "fechaHasta";
    this.sortO = 1;
    if (this.tableCurriculares != undefined) {
      this.tableCurriculares.sortField = this.sortF;
      //this.table.sortOrder = this.sortO;
    }

    // this.table.sortMultiple();
  }

  deleteCurriculares(selectedDatosCurriculares) {
    let mess = this.translateService.instant("messages.deleteConfirmation");
    let icon = "fa fa-trash-alt";
    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        this.eliminarRegistroCV(selectedDatosCurriculares);
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

        this.selectedDatosCurriculares = [];
        this.selectMultipleCurriculares = false;
      }
    });
  }

  eliminarRegistroCV(selectedDatosCurriculares) {
    selectedDatosCurriculares.forEach(element => {
      this.datosCurricularesRemove.fichaDatosCurricularesItem.push(element);
    });

    this.sigaServices
      .post("fichaDatosCurriculares_delete", this.datosCurricularesRemove)
      .subscribe(
        data => {
          if (selectedDatosCurriculares.length == 1) {
            this.showSuccessDetalle(
              this.translateService.instant("messages.deleted.success")
            );
          } else {
            this.showSuccessDetalle(
              selectedDatosCurriculares.length +
              " " +
              this.translateService.instant(
                "messages.deleted.selected.success"
              )
            );
          }
          this.progressSpinner = false;
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
          this.editar = false;
          this.selectedDatosCurriculares = [];
          this.numSelectedCurriculares = 0;
          this.selectMultipleCurriculares = false;
          this.searchDatosCurriculares();
        }
      );
  }

  redireccionarCurriculares(dato) {
    if (dato && dato.length < 2 && !this.selectMultipleCurriculares) {
      // enviarDatos = dato[0];
      sessionStorage.setItem("curriculo", JSON.stringify(dato));

      if (dato[0].fechaBaja != null || (this.tarjetaCurriculares == '2')) {
        sessionStorage.setItem("permisos", "false");
      } else {
        sessionStorage.setItem("permisos", "true");
      }

      sessionStorage.setItem("crearCurriculo", "false");
      this.router.navigate(["/edicionCurriculares"]);
    } else {
      this.numSelectedCurriculares = this.selectedDatosCurriculares.length;
      sessionStorage.setItem("crearCurriculo", "true");
    }
  }

  onInitCurriculares() {
    this.searchDatosCurriculares();
    if (sessionStorage.getItem("abrirCurriculares")) {
      this.abreCierraFicha("curriculares");
    }
    sessionStorage.removeItem("abrirCurriculares");

    // this.nuevafecha = new Date();
    let event = { field: "fechaFin", order: 1, multisortmeta: undefined };
    this.changeSort(event);
  }

  irNuevoCurriculares() {
    sessionStorage.removeItem("permisos");
    sessionStorage.setItem("nuevoCurriculo", "true");
    sessionStorage.setItem("idPersona", JSON.stringify(this.idPersona));
    this.router.navigate(["/edicionCurriculares"]);
  }
  searchDatosCurriculares() {
    let bodyCurricular = {
      idPersona: this.idPersona,
      historico: this.historicoCV
    };
    this.sigaServices
      .postPaginado(
        "fichaDatosCurriculares_search",
        "?numPagina=1",
        bodyCurricular
      )
      .subscribe(
        data => {
          console.log(data);

          let search = JSON.parse(data["body"]);
          this.datosCurriculares = search.fichaDatosCurricularesItem;
          // this.table.reset();
        },
        err => {
          //   console.log(err);
        }
      );
  }

  isSelectMultipleCurriculares() {
    this.selectMultipleCurriculares = !this.selectMultipleCurriculares;
    if (!this.selectMultipleCurriculares) {
      this.numSelectedCurriculares = 0;
      this.selectedDatosCurriculares = [];
    } else {
      this.selectAllCurriculares = false;
      this.selectedDatosCurriculares = [];
      this.numSelectedCurriculares = 0;
    }
  }

  //Opción tabla de seleccionar todas las filas
  onChangeSelectAllCurriculares() {
    if (this.selectAllCurriculares === true) {
      this.selectMultipleCurriculares = false;
      this.selectedDatosCurriculares = this.datosCurriculares;
      this.numSelectedCurriculares = this.datosCurriculares.length;
    } else {
      this.selectedDatosCurriculares = [];
      this.numSelectedCurriculares = 0;
    }
  }

  cargarDatosCV() {
    this.historicoCV = false;

    this.searchDatosCurriculares();

    if (!this.historicoCV) {
      this.selectMultiple = false;
      this.selectAll = false;
    }
  }

  cargarHistorico() {
    this.historicoCV = true;
    this.searchDatosCurriculares();
  }
  // FIN CURRICULARES
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  // MÉTODOS PARA DIRECCIONES
  activarPaginacionDireciones() {
    if (!this.datosDirecciones || this.datosDirecciones.length == 0)
      return false;
    else return true;
  }
  // HACIENDO HISTÓRICO DIRECCIONES
  // searchHistoricoDatosDirecciones() {
  searchHistoricoDatosDirecciones() {
    this.bodyDirecciones.historico = true;
    this.progressSpinner = true;
    // this.historico = true;
    let searchObject = new DatosDireccionesItem();
    searchObject.idPersona = this.idPersona;
    searchObject.historico = true;
    // this.buscar = false;
    this.selectMultiple = false;
    this.selectedDatosDirecciones = "";
    this.selectAll = false;
    this.sigaServices
      .postPaginado("direcciones_search", "?numPagina=1", searchObject)
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.datosDireccionesHist = JSON.parse(data["body"]);
          this.datosDirecciones = this.datosDireccionesHist.datosDireccionesItem;
          this.tableDirecciones.paginator = true;
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        },
        () => { }
      );
  }

  onInitDirecciones() {
    this.bodyDirecciones = new DatosDireccionesItem();
    this.bodyDirecciones.idPersona = this.idPersona;
    this.bodyDirecciones.historico = false;
    this.searchDirecciones();
  }

  isSelectMultipleDirecciones() {
    this.selectMultipleDirecciones = !this.selectMultipleDirecciones;
    if (!this.selectMultipleDirecciones) {
      this.numSelectedDirecciones = 0;
      this.selectedDatosDirecciones = [];
    } else {
      this.selectAllDirecciones = false;
      this.selectedDatosDirecciones = [];
      this.numSelectedDirecciones = 0;
    }
  }

  onChangeSelectAllDirecciones() {
    if (this.selectAllDirecciones === true) {
      this.numSelectedDirecciones = this.datosDirecciones.length;
      this.selectMultipleDirecciones = false;
      this.selectedDatosDirecciones = this.datosDirecciones;
    } else {
      this.selectedDatosDirecciones = [];
      this.numSelectedDirecciones = 0;
    }
  }

  borrarSelectedDatos(selectedItem) {
    this.progressSpinner = true;
    let deleteDirecciones = new DatosDireccionesObject();
    deleteDirecciones.datosDireccionesItem = selectedItem;
    let datosDelete = [];
    // selectedItem.forEach((value: DatosDireccionesItem, key: number) => {
    //   value.idPersona = this.idPersona;
    //   datosDelete.push(value);
    // if (value.idTipoDireccion.includes("2")) {
    //   if (JSON.parse(sessionStorage.getItem("numDespacho")) > 1) {
    //     if (!(value.idTipoDireccion.includes("3") || value.idTipoDireccion.includes("9") || value.idTipoDireccion.includes("8") || value.idTipoDireccion.includes("6"))) {
    //       datosDelete.push(value);
    //     }
    //   }
    // } else {
    //   if (!(value.idTipoDireccion.includes("3") || value.idTipoDireccion.includes("9") || value.idTipoDireccion.includes("8") || value.idTipoDireccion.includes("6"))) {
    //     datosDelete.push(value);
    //   }
    // }

    // });

    this.borrarDireccion(selectedItem);


  }

  borrarDireccion(datosDelete) {

    if (this.esColegiado) {
      let dirDelete = JSON.parse(JSON.stringify(datosDelete));

      for (const key in datosDelete) {

        let flag = false;
        datosDelete[key].idTipoDireccion.forEach(element => {

          if (!flag) {

            if (element == this.valorCensoWeb
              || element == this.valorTraspaso
              || element == this.valorFacturacion
              || element == this.valorGuardia
              || element == this.valorGuiaJudicial
              || element == this.valorPreferenteCorreo
              || element == this.valorPreferenteEmail
              || element == this.valorPreferenteSMS) {

              dirDelete.splice(key, 1);
              flag = true;
            }

            if (this.isColegiadoEjerciente) {
              let cont = 0;

              if (element == this.valorDespacho) {

                this.datosDirecciones.forEach(dir => {
                  let idFindDespacho = dir.idTipoDireccion.findIndex(x => x == element);

                  if (idFindDespacho != -1) {
                    cont = cont + 1;
                  }

                });

                if (cont == 1) {
                  dirDelete.splice(key, 1);
                  flag = true;
                }

              }

            }
          }
        });
      }

      if (dirDelete.length != datosDelete.length && dirDelete.length > 0) {
        datosDelete = dirDelete;
        this.serviceDeleteDirection(datosDelete, false);

      } else if (dirDelete.length == 0) {
        this.showInfo("No se puede borrar la dirección porque tiene tipos de dirección obligatorios");

        this.selectMultipleDirecciones = false;
        this.selectAllDirecciones = false;
        this.numSelectedDirecciones = 0;

      } else {
        this.serviceDeleteDirection(datosDelete, true);

      }
    } else {
      this.serviceDeleteDirection(datosDelete, true);
    }

  }

  serviceDeleteDirection(datosDelete, all) {
    this.sigaServices.post("direcciones_remove", datosDelete).subscribe(
      data => {
        this.progressSpinner = false;
        this.showSuccess();

        if (!all) {
          this.showInfo("No se ha podido borrar todas las direcciones seleccionadas porque tienen tipos de dirección obligatorios");

        }
      },
      err => {
        this.progressSpinner = false;
        this.showInfo("No se puede eliminar una dirección con tipo CensoWeb, Traspaso, Facturación, Guardia o Despacho");
        this.selectMultipleDirecciones = false;
        this.selectAllDirecciones = false;
        this.numSelectedDirecciones = 0;
        console.log(err);
      },
      () => {
        this.progressSpinner = false;
        this.editar = false;
        // this.dniCorrecto = null;
        // this.disabledRadio = false;
        this.selectMultipleDirecciones = false;
        this.numSelectedDirecciones = 0;
        this.selectAllDirecciones = false;
        this.searchDirecciones();
      }
    );
  }

  actualizaSeleccionadosDirecciones(selectedDatos) {
    this.numSelectedDirecciones = selectedDatos.length;
  }

  actualizaSeleccionadosCurriculares(selectedDatos) {
    this.numSelectedCurriculares = selectedDatos.length;
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
            console.log(err);
          },
          () => { }
        );
    }
  }

  searchDireccionesHistoric() {
    this.bodyDirecciones.historico = true;
    this.searchDirecciones();
  }

  nuevaDireccion() {
    let newDireccion = new DatosDireccionesItem();
    sessionStorage.removeItem("direccion");
    sessionStorage.removeItem("editarDireccion");
    sessionStorage.setItem("fichaColegial", "true");
    sessionStorage.setItem(
      "usuarioBody",
      JSON.stringify(this.generalBody.idPersona)
    );
    sessionStorage.setItem("editarDireccion", "false");
    sessionStorage.setItem(
      "direcciones",
      JSON.stringify(this.datosDirecciones)
    );

    if (this.datosColegiales.length != 0) {
      if (this.isCrearColegial) {
        sessionStorage.setItem(
          "situacionColegialesBody",
          JSON.stringify(this.datosColegiales[1].idEstado)
        );
      } else {
        sessionStorage.setItem(
          "situacionColegialesBody",
          JSON.stringify(this.datosColegiales[0].idEstado)
        );
      }
    }
    // CAMBIO INCIDENCIA DIRECCIONES
    //sessionStorage.setItem("numDirecciones", JSON.stringify(this.datosDirecciones.length));
    this.router.navigate(["/consultarDatosDirecciones"]);
  }

  redireccionarDireccion(dato) {
    if (this.camposDesactivados != true) {
      if (!this.selectMultipleDirecciones) {
        if (dato[0].fechaBaja != null) {
          sessionStorage.setItem("historicoDir", "true");
        }
        var enviarDatos = null;
        if (dato && dato.length > 0) {
          enviarDatos = dato[0];
          sessionStorage.setItem("idDireccion", enviarDatos.idDireccion);
          sessionStorage.setItem("direccion", JSON.stringify(enviarDatos));
          sessionStorage.setItem("permisos", JSON.stringify(this.permisos));
          sessionStorage.setItem("fichaColegial", "true");
          sessionStorage.removeItem("editarDireccion");

          sessionStorage.setItem("editarDireccion", "true");

          sessionStorage.setItem("usuarioBody", JSON.stringify(this.idPersona));
          sessionStorage.setItem(
            "esColegiado",
            sessionStorage.getItem("esColegiado")
          );
        } else {
          sessionStorage.setItem("editar", "false");
        }
        sessionStorage.setItem(
          "direcciones",
          JSON.stringify(this.datosDirecciones)
        );
        sessionStorage.setItem("permisoTarjeta", this.tarjetaDirecciones);

        if (this.datosColegiales.length != 0) {
          if (this.isCrearColegial) {
            sessionStorage.setItem(
              "situacionColegialesBody",
              JSON.stringify(this.datosColegiales[1].idEstado)
            );
          } else {
            sessionStorage.setItem(
              "situacionColegialesBody",
              JSON.stringify(this.datosColegiales[0].idEstado)
            );
          }
        }

        this.router.navigate(["/consultarDatosDirecciones"]);
      } else {
        this.numSelectedDirecciones = this.selectedDatosDirecciones.length;
      }
    }
  }
  // FIN DIRECCIONES
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  // MÉTODOS PARA DATOS BANCARIOS

  activarPaginacionBancarios() {
    if (!this.datosBancarios || this.datosBancarios.length == 0) return false;
    else return true;
  }

  actualizaSeleccionadosBancarios(selectedDatos) {
    this.numSelectedBancarios = selectedDatos.length;
  }

  onInitDatosBancarios() {
    this.bodyDatosBancarios = new DatosBancariosItem();
    this.bodyDatosBancarios.idPersona = this.idPersona;
    this.bodyDatosBancarios.historico = false;
    this.searchDatosBancarios();
  }

  onChangeSelectAllBancarios() {
    if (this.selectAllBancarios === true) {
      this.numSelectedBancarios = this.datosBancarios.length;
      this.selectMultipleBancarios = false;
      this.selectedDatosBancarios = this.datosBancarios;
    } else {
      this.selectedDatosBancarios = [];
      this.numSelectedBancarios = 0;
    }
  }

  isSelectMultipleBancarios() {
    this.selectMultipleBancarios = !this.selectMultipleBancarios;
    if (!this.selectMultipleBancarios) {
      this.numSelectedBancarios = 0;
      this.selectedDatosBancarios = [];
    } else {
      this.selectAllBancarios = false;
      this.selectedDatosBancarios = [];
      this.numSelectedBancarios = 0;
    }
  }

  confirmarEliminar(selectedDatos) {
    let mess = this.translateService.instant("messages.deleteConfirmation");
    let icon = "fa fa-trash-alt";
    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        this.eliminarRegistro(selectedDatos);
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

        this.selectedDatosBancarios = [];
        this.selectMultipleBancarios = false;
      }
    });
  }

  eliminarRegistro(selectedDatos) {
    this.progressSpinner = true;

    let item = new DatosBancariosItem();

    item.idCuentas = [];
    item.idPersona = this.idPersona;

    selectedDatos.forEach(element => {
      item.idCuentas.push(element.idCuenta);
    });

    this.sigaServices.post("datosBancarios_delete", item).subscribe(
      data => {
        this.progressSpinner = false;
        if (selectedDatos.length == 1) {
          this.showSuccessDetalle(
            this.translateService.instant("messages.deleted.success")
          );
        } else {
          this.showSuccessDetalle(
            selectedDatos.length +
            " " +
            this.translateService.instant("messages.deleted.selected.success")
          );
        }
      },
      error => {
        console.log(error);
        this.progressSpinner = false;
      },
      () => {
        // this.historico = true;
        this.selectedDatosBancarios = [];
        this.selectMultipleBancarios = false;
        this.searchDatosBancarios();
      }
    );
  }

  searchDatosBancarios() {
    if (this.emptyLoadFichaColegial != true) {
      this.progressSpinner = true;
      this.sigaServices
        .postPaginado(
          "fichaDatosBancarios_datosBancariosSearch",
          "?numPagina=1",
          this.bodyDatosBancarios
        )
        .subscribe(
          data => {
            this.progressSpinner = false;
            this.searchDatosBancariosIdPersona = JSON.parse(data["body"]);
            this.datosBancarios = this.searchDatosBancariosIdPersona.datosBancariosItem;
          },
          error => {
            this.searchDatosBancariosIdPersona = JSON.parse(error["error"]);
            this.showFailDetalle(
              JSON.stringify(
                this.searchDatosBancariosIdPersona.error.description
              )
            );
            console.log(error);
            this.progressSpinner = false;
          }
        );
    }
  }

  redireccionarDatosBancarios(dato) {
    if (this.camposDesactivados != true) {
      if (!this.selectMultipleBancarios) {
        var enviarDatos = null;
        if (dato && dato.length > 0) {
          enviarDatos = dato[0];
          sessionStorage.setItem("idCuenta", dato[0].idCuenta);
          //sessionStorage.setItem("permisos", JSON.stringify(this.permisos));

          if (dato[0].fechaBaja != null || this.tarjetaBancarios == '2') {
            sessionStorage.setItem("permisos", "false");
          } else {
            sessionStorage.setItem("permisos", "true");
          }

          sessionStorage.setItem("allBanksData", JSON.stringify(this.datosBancarios));
          sessionStorage.setItem("editar", "true");
          sessionStorage.setItem("idPersona", this.idPersona);
          sessionStorage.setItem("fichaColegial", "true");
          sessionStorage.setItem("datosCuenta", JSON.stringify(dato[0]));
          sessionStorage.setItem("usuarioBody", JSON.stringify(dato[0]));
          sessionStorage.setItem("historico", JSON.stringify(this.bodyDatosBancarios.historico));

        } else {
          sessionStorage.setItem("editar", "false");
        }

        this.router.navigate(["/consultarDatosBancarios"]);
      } else {
        this.numSelectedBancarios = this.selectedDatosBancarios.length;
      }
    }
  }

  nuevaCuentaBancaria() {
    sessionStorage.removeItem("permisos");
    sessionStorage.setItem("fichaColegial", "true");
    sessionStorage.setItem(
      "usuarioBody",
      sessionStorage.getItem("personaBody")
    );
    sessionStorage.setItem("editar", "false");
    this.router.navigate(["/consultarDatosBancarios"]);
  }

  searchHistoricoDatosBancarios() {
    this.bodyDatosBancarios.historico = true;
    this.searchDatosBancarios();
  }

  // FIN DATOS BANCARIOS
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  // MÉTODOS PARA SERVICIOS DE INTERÉS

  irFacturacion() {
    let idInstitucion = this.generalBody.idInstitucion;
    let us =
      this.sigaServices.getOldSigaUrl() +
      "CEN_Facturacion.do?granotmp=" +
      new Date().getMilliseconds() +
      "&idInstitucion=" +
      idInstitucion +
      "&tipoCliente=1&idPersona=" +
      this.generalBody.idPersona +
      "&accion=ver&tipoAcceso=8";
    sessionStorage.setItem("url", JSON.stringify(us));
    this.router.navigate(["/facturas"]);
  }
  irAuditoria() {
    let idInstitucion = this.generalBody.idInstitucion;
    let us =
      this.sigaServices.getOldSigaUrl() +
      "CEN_Historico.do?granotmp=" +
      new Date().getMilliseconds() +
      "&idInstitucion=" +
      idInstitucion +
      "&idPersona=" +
      this.generalBody.idPersona +
      "&accion=ver&tipo=1&tipoAcceso=1";

    this.router.navigate(["/auditoria"]);
  }
  irComunicaciones() {
    let idInstitucion = this.generalBody.idInstitucion;
    let us =
      this.sigaServices.getOldSigaUrl() +
      "CEN_Comunicaciones.do?granotmp=" +
      new Date().getMilliseconds() +
      "&idInstitucion=" +
      idInstitucion +
      "&idPersona=" +
      this.generalBody.idPersona +
      "&accion=ver&tipo=1&tipoAcceso=1";
    sessionStorage.setItem("url", JSON.stringify(us));
    this.router.navigate(["/comunicacionesCenso"]);
  }

  irExpedientes() {
    let idInstitucion = this.generalBody.idInstitucion;
    let us =
      this.sigaServices.getOldSigaUrl() +
      "CEN_Expedientes.do?granotmp=" +
      new Date().getMilliseconds() +
      "&idInstitucion=" +
      idInstitucion +
      "&idPersona=" +
      this.generalBody.idPersona +
      "&accion=ver&tipo=1&tipoAcceso=1";
    sessionStorage.setItem("url", JSON.stringify(us));
    this.router.navigate(["/expedientesCenso"]);
  }

  irTurnoOficio() {
    let idInstitucion = this.generalBody.idInstitucion;
    // let  us = this.sigaServices.getOldSigaUrl() +"SIGA/CEN_BusquedaClientes.do?noReset=true";

    // let  us = this.sigaServices.getOldSigaUrl() + "JGR_DefinirTurnosLetrado.do?granotmp="+new Date().getMilliseconds()+"&accion=ver&idInstitucionPestanha="+idInstitucion+"&idPersonaPestanha="+this.generalBody.idPersona+"";
    let us =
      this.sigaServices.getOldSigaUrl() +
      "CEN_BusquedaClientes.do?modo=Editar&seleccionarTodos=&colegiado=1&avanzada=&actionModal=&verFichaLetrado=&tablaDatosDinamicosD=" +
      this.generalBody.idPersona +
      "%2C" +
      idInstitucion +
      "%2CNINGUNO%2C1&filaSelD=1";
    sessionStorage.setItem("url", JSON.stringify(us));
    sessionStorage.removeItem("reload");
    sessionStorage.setItem("reload", "si");
    sessionStorage.setItem("personaBody", JSON.stringify(this.generalBody));
    this.router.navigate(["/turnoOficioCenso"]);
  }

  irRegTel() {
    let idInstitucion = this.generalBody.idInstitucion;
    let us =
      this.sigaServices.getOldSigaUrl() +
      "CEN_Censo_DocumentacionRegTel.do?granotmp=" +
      new Date().getMilliseconds() +
      "&idInstitucion=" +
      idInstitucion +
      "&idPersona=" +
      this.generalBody.idPersona +
      "&accion=ver&tipoAcceso=8";
    sessionStorage.setItem("url", JSON.stringify(us));
    this.router.navigate(["/regTel"]);
  }
  // FIN MÉTODOS PARA SERVICIOS DE INTERÉS

  //INICIO METODOS TARJETA SANCIONES

  // Métodos gestionar tabla
  enablePagination() {
    if (!this.dataSanciones || this.dataSanciones.length == 0) return false;
    else return true;
  }

  onRowSelectSanciones(selectedDatos) {
    // Guardamos los filtros
    sessionStorage.setItem("saveFilters", JSON.stringify(this.bodySanciones));

    // Guardamos los datos seleccionados para pasarlos a la otra pantalla
    sessionStorage.setItem("rowData", JSON.stringify(selectedDatos));
    sessionStorage.setItem("permisoTarjeta", this.tarjetaSanciones);

    this.router.navigate(["/detalleSancion"]);
  }

  searchSanciones() {
    // Llamada al rest

    this.bodySanciones.chkArchivadas = undefined;
    this.bodySanciones.idPersona = this.generalBody.idPersona;
    this.bodySanciones.nif = this.generalBody.nif;
    this.bodySanciones.tipoFecha = "";
    this.bodySanciones.chkFirmeza = undefined;
    // this.bodySanciones.idColegios = [];
    // this.bodySanciones.idColegios.push(this.generalBody.i.idInstitucion);

    this.transformDates(this.bodySanciones);

    this.sigaServices
      .postPaginado(
        "busquedaSanciones_searchBusquedaSanciones",
        "?numPagina=1",
        this.bodySanciones
      )
      .subscribe(
        data => {
          this.bodySearchSanciones = JSON.parse(data["body"]);
          this.dataSanciones = this.bodySearchSanciones.busquedaSancionesItem;
          this.progressSpinner = false;
        },
        err => {
          this.progressSpinner = false;
        }
      );
  }

  transformDates(bodySanciones) {
    if (
      bodySanciones.fechaDesdeDate != null &&
      bodySanciones.fechaDesdeDate != undefined
    ) {
      bodySanciones.fechaDesdeDate = new Date(bodySanciones.fechaDesdeDate);
    } else {
      bodySanciones.fechaDesdeDate = null;
    }

    if (
      bodySanciones.fechaHastaDate != null &&
      bodySanciones.fechaHastaDate != undefined
    ) {
      bodySanciones.fechaHastaDate = new Date(bodySanciones.fechaHastaDate);
    } else {
      bodySanciones.fechaHastaDate = null;
    }

    if (
      bodySanciones.fechaArchivadaDesdeDate != null &&
      bodySanciones.fechaArchivadaDesdeDate != undefined
    ) {
      bodySanciones.fechaArchivadaDesdeDate = new Date(
        bodySanciones.fechaArchivadaDesdeDate
      );
    } else {
      bodySanciones.fechaArchivadaDesdeDate = null;
    }

    if (
      bodySanciones.fechaArchivadaHastaDate != null &&
      bodySanciones.fechaArchivadaHastaDate != undefined
    ) {
      bodySanciones.fechaArchivadaHastaDate = new Date(
        bodySanciones.fechaArchivadaHastaDate
      );
    } else {
      bodySanciones.fechaArchivadaHastaDate = null;
    }
  }
  comprobarREGTEL() {
    this.esRegtel = false;
    this.messageNoContentRegTel = this.translateService.instant(
      "aplicacion.cargando"
    );
    this.messageRegtel = this.messageNoContentRegTel;
    this.sigaServices.get("fichaColegialRegTel_permisos").subscribe(
      data => {
        let value = data;
        if (value) {
          this.esRegtel = true;
          this.onInitRegTel();
        } else {
          this.esRegtel = false;
        }
      },
      err => {
        this.messageRegtel = this.translateService.instant(
          "general.message.no.registros"
        );
        this.progressSpinner = false;
      }
    );
  }
  onInitRegTel() {
    if (this.esColegiado) {
      this.sigaServices
        .postPaginado(
          "fichaColegialRegTel_searchListDoc",
          "?numPagina=1",
          this.idPersona
        )
        .subscribe(
          data => {
            this.bodySearchRegTel = JSON.parse(data["body"]);
            this.bodyRegTel = this.bodySearchRegTel.docuShareObjectVO;
            this.bodyRegTel = this.bodySearchRegTel.docuShareObjectVO;
            this.bodyRegTel.forEach(element => {
              element.fechaModificacion = this.arreglarFechaRegtel(
                JSON.stringify(new Date(element.fechaModificacion))
              );
            });
            if (this.bodyRegTel.length != 0) {
              this.messageRegtel = this.bodyRegTel.length + "";
            } else {
              this.messageRegtel = this.translateService.instant(
                "general.message.no.registros"
              );
            }
            if (this.bodyRegTel.length > 0) {
              this.atrasRegTel = this.bodyRegTel[0].parent;
            }
          },

          err => {
            this.messageRegtel = this.translateService.instant(
              "general.message.no.registros"
            );
          }
        );
    } else {
      this.sigaServices
        .postPaginado(
          "fichaColegialRegTel_searchListDocNoCol",
          "?numPagina=1",
          this.idPersona
        )
        .subscribe(
          data => {
            this.bodySearchRegTel = JSON.parse(data["body"]);
            this.bodyRegTel = this.bodySearchRegTel.docuShareObjectVO;
            this.bodyRegTel = this.bodySearchRegTel.docuShareObjectVO;
            this.bodyRegTel.forEach(element => {
              element.fechaModificacion = this.arreglarFechaRegtel(
                JSON.stringify(new Date(element.fechaModificacion))
              );
            });
            if (this.bodyRegTel.length != 0) {
              this.messageRegtel = this.bodyRegTel.length + "";
            } else {
              this.messageRegtel = this.translateService.instant(
                "general.message.no.registros"
              );
            }
            if (this.bodyRegTel.length > 0) {
              this.atrasRegTel = this.bodyRegTel[0].parent;
            }
          },
          err => {
            this.messageRegtel = this.translateService.instant(
              "general.message.no.registros"
            );
          }
        );
    }
  }
  onRowSelectedRegTel(selectedDatosRegtel) {
    if (this.tarjetaRegtel == '3') {
      this.selectedDatosRegtel = selectedDatosRegtel;
      if (this.selectedDatosRegtel.tipo == "0") {
        this.buttonVisibleRegtelCarpeta = false;
        this.buttonVisibleRegtelDescargar = true;
      } else {
        this.buttonVisibleRegtelCarpeta = true;
        this.buttonVisibleRegtelDescargar = false;
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

  onRowDesselectedRegTel() {
    this.buttonVisibleRegtelCarpeta = true;
    this.buttonVisibleRegtelDescargar = true;
  }
  onClickAtrasRegtel() {
    this.progressSpinner = true;
    this.selectedDatosRegtel.idPersona = this.idPersona;
    this.selectedDatosRegtel.id = this.selectedDatosRegtel.parent;
    this.selectedDatosRegtel.fechaModificacion = undefined;
    if (this.esColegiado) {
      this.sigaServices
        .postPaginado(
          "fichaColegialRegTel_searchListDir",
          "?numPagina=1",
          this.selectedDatosRegtel
        )
        .subscribe(
          data => {
            this.bodySearchRegTel = JSON.parse(data["body"]);
            this.bodyRegTel = this.bodySearchRegTel.docuShareObjectVO;


            this.bodyRegTel = this.bodySearchRegTel.docuShareObjectVO;
            this.bodyRegTel.forEach(element => {
              element.fechaModificacion = this.arreglarFechaRegtel(
                JSON.stringify(new Date(element.fechaModificacion))
              );
            });

            if (this.atrasRegTel != "") {
              this.buttonVisibleRegtelAtras = true;
            }
            this.buttonVisibleRegtelCarpeta = true;
            this.buttonVisibleRegtelDescargar = true;
            if (this.bodyRegTel.length != 0) {
              this.messageRegtel = this.bodyRegTel.length + "";
            } else {
              this.messageRegtel = this.translateService.instant(
                "general.message.no.registros"
              );
            }
            this.progressSpinner = false;
          },
          err => {
            this.messageRegtel = this.translateService.instant(
              "general.message.no.registros"
            );
            this.progressSpinner = false;
          }
        );
    } else {
      this.sigaServices
        .postPaginado(
          "fichaColegialRegTel_searchListDirNoCol",
          "?numPagina=1",
          this.selectedDatosRegtel
        )
        .subscribe(
          data => {
            this.bodySearchRegTel = JSON.parse(data["body"]);

            this.bodyRegTel = this.bodySearchRegTel.docuShareObjectVO;
            this.bodyRegTel.forEach(element => {
              element.fechaModificacion = this.arreglarFechaRegtel(
                JSON.stringify(new Date(element.fechaModificacion))
              );
            });

            if (this.atrasRegTel != "") {
              this.buttonVisibleRegtelAtras = true;
            }
            this.buttonVisibleRegtelCarpeta = true;
            this.buttonVisibleRegtelDescargar = true;
            this.progressSpinner = false;
          },
          err => {
            this.progressSpinner = false;
          }
        );
    }
  }

  onClickCarpetaRegTel() {
    this.progressSpinner = true;
    if (this.atrasRegTel != this.selectedDatosRegtel.parent) {
      this.atrasRegTel = this.selectedDatosRegtel.parent;
    }
    this.selectedDatosRegtel.idPersona = this.idPersona;
    this.selectedDatosRegtel.fechaModificacion = undefined;
    if (this.esColegiado) {
      this.sigaServices
        .postPaginado(
          "fichaColegialRegTel_searchListDir",
          "?numPagina=1",
          this.selectedDatosRegtel
        )
        .subscribe(
          data => {
            this.bodySearchRegTel = JSON.parse(data["body"]);
            this.bodyRegTel = this.bodySearchRegTel.docuShareObjectVO;
            if (this.atrasRegTel != "") {
              this.buttonVisibleRegtelAtras = false;
            } else {
              this.buttonVisibleRegtelAtras = true;
            }
            this.buttonVisibleRegtelCarpeta = true;
            this.buttonVisibleRegtelDescargar = true;
            this.progressSpinner = false;
            if (this.bodyRegTel.length != 0) {
              this.messageRegtel = this.bodyRegTel.length + "";
            } else {
              this.messageRegtel = this.translateService.instant(
                "general.message.no.registros"
              );
            }
            this.bodyRegTel = this.bodySearchRegTel.docuShareObjectVO;
            this.bodyRegTel.forEach(element => {
              element.fechaModificacion = this.arreglarFechaRegtel(
                JSON.stringify(new Date(element.fechaModificacion))
              );
            });
          },
          err => {
            this.messageRegtel = this.translateService.instant(
              "general.message.no.registros"
            );
            this.progressSpinner = false;
          }
        );
    } else {
      this.sigaServices
        .postPaginado(
          "fichaColegialRegTel_searchListDirNoCol",
          "?numPagina=1",
          this.selectedDatosRegtel
        )
        .subscribe(
          data => {
            this.bodySearchRegTel = JSON.parse(data["body"]);
            this.bodyRegTel = this.bodySearchRegTel.docuShareObjectVO;
            if (this.atrasRegTel != "") {
              this.buttonVisibleRegtelAtras = false;
            } else {
              this.buttonVisibleRegtelAtras = true;
            }
            this.buttonVisibleRegtelCarpeta = true;
            this.buttonVisibleRegtelDescargar = true;
            this.progressSpinner = false;
            if (this.bodyRegTel.length != 0) {
              this.messageRegtel = this.bodyRegTel.length + "";
            } else {
              this.messageRegtel = this.translateService.instant(
                "general.message.no.registros"
              );
            }
            this.bodyRegTel = this.bodySearchRegTel.docuShareObjectVO;
            this.bodyRegTel.forEach(element => {
              element.fechaModificacion = this.arreglarFechaRegtel(
                JSON.stringify(new Date(element.fechaModificacion))
              );
            });
          },
          err => {
            this.messageRegtel = this.translateService.instant(
              "general.message.no.registros"
            );
            this.progressSpinner = false;
          }
        );
    }
  }
  onClickDescargarRegTel() {
    this.progressSpinner = true;
    this.selectedDatosRegtel.idPersona = this.idPersona;
    this.selectedDatosRegtel.fechaModificacion = undefined;
    this.sigaServices
      .postDownloadFiles(
        "fichaColegialRegTel_downloadDoc",

        this.selectedDatosRegtel
      )
      .subscribe(
        data => {
          const blob = new Blob([data], { type: "application/pdf" });
          saveAs(blob, this.selectedDatosRegtel.title + ".pdf");
          this.progressSpinner = false;
        },
        err => {
          this.progressSpinner = false;
        }
      );
  }

  // MÉTODOS PARA MUTUALIDAD DE LA ABOGACÍA

  prepararDatosMutualidad() {
    if (this.datosDirecciones.length > 0) {
      for (let i in this.datosDirecciones) {
        if ((this.datosDirecciones[i].idTipoDireccion.find(x => x == "3")) != "-1") {
          let direccion = this.datosDirecciones[i];
          sessionStorage.setItem(
            "direcciones",
            JSON.stringify(direccion)
          );
        }
      }

    }
    if (this.datosBancarios.length > 0) {
      let masActual;
      let tieneCargo;
      for (let i in this.datosBancarios) {
        if (masActual == undefined || this.datosBancarios[i].fechaModificacion > masActual.fechaModificacion) {
          masActual = this.datosBancarios[i];
        }
        if (this.datosBancarios[i].uso == "ABONO/CARGO" || this.datosBancarios[i].uso == "CARGO" || this.datosBancarios[i].uso == "PARA TODO") {
          tieneCargo = this.datosBancarios[i];
        }
      }
      let cuenta = masActual;

      if (tieneCargo != undefined) {
        cuenta = tieneCargo;
      } else {
        cuenta = masActual;
      }
      sessionStorage.setItem(
        "cuentas",
        JSON.stringify(cuenta)
      );
    }
  }
  // irPlanUniversal() {
  //   this.prepararDatosMutualidad();
  //   this.arreglarFechas();
  //   if (this.generalBody.nif == undefined || this.generalBody.nif == "" || this.generalBody.fechaNacimientoDate == undefined || this.generalBody.fechaNacimientoDate == null) {
  //     this.showFailDetalle("Asegurese de que el NIF y la fecha de nacimiento son correctos");
  //   } else {
  //     this.progressSpinner = true;
  //     let mutualidadRequest = new DatosSolicitudMutualidadItem();
  //     mutualidadRequest.numeroidentificador = this.generalBody.nif;
  //     this.arreglarFechas();
  //     this.solicitudEditar = JSON.parse(JSON.stringify(this.generalBody));
  //     this.solicitudEditar.idPais = "191";
  //     this.solicitudEditar.identificador = this.generalBody.nif;
  //     this.solicitudEditar.numeroIdentificacion = this.generalBody.nif;
  //     this.solicitudEditar.tratamiento = this.generalBody.idTratamiento;
  //     this.solicitudEditar.apellido1 = this.generalBody.apellidos1;
  //     this.solicitudEditar.apellido2 = this.generalBody.apellidos2;
  //     this.solicitudEditar.idEstadoCivil = this.generalBody.idEstadoCivil;
  //     this.solicitudEditar.estadoCivil = this.generalBody.idEstadoCivil;
  //     this.solicitudEditar.fechaNacimiento = this.generalBody.fechaNacimientoDate;
  //     this.solicitudEditar.tratamiento = this.tratamientoDesc;
  //     this.solicitudEditar.tipoIdentificacion = this.generalBody.idTipoIdentificacion;
  //     this.solicitudEditar.nombre = this.solicitudEditar.soloNombre;
  //     sessionStorage.setItem(
  //       "solicitudEnviada",
  //       JSON.stringify(this.solicitudEditar));
  //     this.router.navigate(["/MutualidadAbogaciaPlanUniversal"]);
  //     this.progressSpinner = false;
  //   }
  // }

  irAlterMutuaReta() {
    this.solicitudEditar = JSON.parse(JSON.stringify(this.generalBody));
    this.solicitudEditar.idPais = "191";
    this.solicitudEditar.identificador = this.generalBody.nif;
    this.solicitudEditar.numeroIdentificacion = this.generalBody.nif;
    this.solicitudEditar.tratamiento = this.generalBody.idTratamiento;
    this.solicitudEditar.apellido1 = this.generalBody.apellidos1;
    this.solicitudEditar.apellido2 = this.generalBody.apellidos2;
    this.solicitudEditar.idEstadoCivil = this.generalBody.idEstadoCivil;
    this.solicitudEditar.estadoCivil = this.generalBody.idEstadoCivil;
    this.solicitudEditar.fechaNacimiento = this.generalBody.fechaNacimientoDate;
    this.solicitudEditar.tratamiento = this.tratamientoDesc;
    this.sigaServices
      .get("solicitudIncorporacion_tipoIdentificacion")
      .subscribe(
        result => {
          let tipos = result.combooItems;
          this.progressSpinner = false;
          let identificacion = tipos.find(
            item => item.value === this.solicitudEditar.idTipoIdentificacion
          );
          this.solicitudEditar.tipoIdentificacion = identificacion.label;
          sessionStorage.setItem("datosSolicitud", JSON.stringify(this.solicitudEditar));
          sessionStorage.setItem("tipoPropuesta", "RETA");
          this.router.navigate(["/alterMutuaReta"]);
        },
        error => {
          console.log(error);
        }
      );
  }

  irOfertas() {
    this.solicitudEditar = JSON.parse(JSON.stringify(this.generalBody));
    this.solicitudEditar.idPais = "191";
    this.solicitudEditar.identificador = this.generalBody.nif;
    this.solicitudEditar.numeroIdentificacion = this.generalBody.nif;
    this.solicitudEditar.tratamiento = this.generalBody.idTratamiento;
    this.solicitudEditar.apellido1 = this.generalBody.apellidos1;
    this.solicitudEditar.apellido2 = this.generalBody.apellidos2;
    this.solicitudEditar.idEstadoCivil = this.generalBody.idEstadoCivil;
    this.solicitudEditar.estadoCivil = this.generalBody.idEstadoCivil;
    this.solicitudEditar.fechaNacimiento = this.generalBody.fechaNacimientoDate;
    this.solicitudEditar.tratamiento = this.tratamientoDesc;
    this.sigaServices
      .get("solicitudIncorporacion_tipoIdentificacion")
      .subscribe(
        result => {
          let tipos = result.combooItems;
          this.progressSpinner = false;
          let identificacion = tipos.find(
            item => item.value === this.solicitudEditar.idTipoIdentificacion
          );
          this.solicitudEditar.tipoIdentificacion = identificacion.label;
          sessionStorage.setItem("datosSolicitud", JSON.stringify(this.solicitudEditar));
          sessionStorage.setItem("tipoPropuesta", "Ofertas");
          this.router.navigate(["/alterMutuaOfertas"]);
        },
        error => {
          console.log(error);
        }
      );
  }


  irPlanUniversal() {
    this.prepararDatosMutualidad();
    this.arreglarFechas();
    if (this.generalBody.nif == undefined || this.generalBody.nif == "" || this.generalBody.fechaNacimientoDate == undefined || this.generalBody.fechaNacimientoDate == null) {
      this.showFailDetalle("Asegurese de que el NIF y la fecha de nacimiento son correctos");
    } else {
      this.progressSpinner = true;
      let mutualidadRequest = new DatosSolicitudMutualidadItem();
      mutualidadRequest.numeroidentificador = this.generalBody.nif;
      this.sigaServices
        .post("mutualidad_searchSolicitud", mutualidadRequest)
        .subscribe(
          result => {
            let resultParsed = JSON.parse(result.body);
            if (
              resultParsed.idsolicitud != null &&
              resultParsed.idsolicitud != undefined
            ) {
              this.arreglarFechas();
              this.solicitudEditar = JSON.parse(JSON.stringify(this.generalBody));
              this.solicitudEditar.idPais = "191";
              this.solicitudEditar.identificador = this.generalBody.nif;
              this.solicitudEditar.numeroIdentificacion = this.generalBody.nif;
              this.solicitudEditar.tratamiento = this.generalBody.idTratamiento;
              this.solicitudEditar.apellido1 = this.generalBody.apellidos1;
              this.solicitudEditar.apellido2 = this.generalBody.apellidos2;
              this.solicitudEditar.idEstadoCivil = this.generalBody.idEstadoCivil;
              this.solicitudEditar.estadoCivil = this.generalBody.idEstadoCivil;
              this.solicitudEditar.fechaNacimiento = this.generalBody.fechaNacimientoDate;
              this.solicitudEditar.tratamiento = this.tratamientoDesc;
              this.sigaServices
                .post("mutualidad_estadoMutualista", this.solicitudEditar)
                .subscribe(
                  result => {
                    let prueba = JSON.parse(result.body);
                    if ((prueba.valorRespuesta == "1") || (prueba.idSolicitud != "0")) {
                      this.solicitudEditar.idSolicitudMutualidad = prueba.idSolicitud;
                      this.solicitudEditar.estadoMutualidad = prueba.valorRespuesta;
                      this.solicitudEditar.tipoIdentificacion = this.generalBody.idTipoIdentificacion;
                      this.solicitudEditar.nombre = this.solicitudEditar.soloNombre;
                      sessionStorage.setItem(
                        "solicitudEnviada",
                        JSON.stringify(this.solicitudEditar)
                      );
                      this.router.navigate(["/MutualidadAbogaciaPlanUniversal"]);
                    } else {
                      //  this.modoLectura = true;
                      if (prueba.valorRespuesta == undefined || prueba.valorRespuesta == null || prueba.valorRespuesta == "") {
                        this.showInfo("No se ha podido comprobar si tiene ya un Plan Universal");

                      } else {
                        this.showInfo(prueba.valorRespuesta);
                      }
                    }
                    this.progressSpinner = false;
                  },
                  error => {
                    console.log(error);
                  }, () => {
                    this.progressSpinner = false;
                  }
                );
            } else {
              this.arreglarFechas();
              this.solicitudEditar = JSON.parse(JSON.stringify(this.generalBody));
              this.solicitudEditar.idPais = "191";
              this.solicitudEditar.identificador = this.generalBody.nif;
              this.solicitudEditar.numeroIdentificacion = this.generalBody.nif;
              this.solicitudEditar.tratamiento = this.generalBody.idTratamiento;
              this.solicitudEditar.apellido1 = this.generalBody.apellidos1;
              this.solicitudEditar.apellido2 = this.generalBody.apellidos2;
              this.solicitudEditar.idEstadoCivil = this.generalBody.idEstadoCivil;
              this.solicitudEditar.estadoCivil = this.generalBody.idEstadoCivil;
              this.solicitudEditar.fechaNacimiento = this.generalBody.fechaNacimientoDate;
              this.solicitudEditar.tratamiento = this.tratamientoDesc;
              this.sigaServices
                .post("mutualidad_estadoMutualista", this.solicitudEditar)
                .subscribe(
                  result => {
                    let prueba = JSON.parse(result.body);
                    if ((prueba.valorRespuesta == "1")) {
                      this.solicitudEditar.idSolicitudMutualidad = prueba.idSolicitud;
                      this.solicitudEditar.estadoMutualidad = prueba.valorRespuesta;
                      this.solicitudEditar.tipoIdentificacion = this.generalBody.idTipoIdentificacion;
                      this.solicitudEditar.nombre = this.solicitudEditar.soloNombre;
                      sessionStorage.setItem(
                        "solicitudEnviada",
                        JSON.stringify(this.solicitudEditar)
                      );
                      this.router.navigate(["/MutualidadAbogaciaPlanUniversal"]);
                    } else {
                      //  this.modoLectura = true;
                      if (prueba.valorRespuesta == undefined || prueba.valorRespuesta == null || prueba.valorRespuesta == "") {
                        this.showInfo("No se ha podido comprobar si tiene ya un Plan Universal");

                      } else {
                        this.showInfo(prueba.valorRespuesta);
                      }
                    }
                  },
                  error => {
                    console.log(error);
                  }, () => {
                    this.progressSpinner = false;
                  }
                );
            }
          }, error => {
            console.log(error);
          }, () => {
            this.progressSpinner = false;
          }
        );
    }
  }


  irSegAccidentes() {
    this.prepararDatosMutualidad();
    this.arreglarFechas();
    if (this.generalBody.nif == undefined || this.generalBody.nif == "" || this.generalBody.fechaNacimientoDate == undefined || this.generalBody.fechaNacimientoDate == null) {
      this.showFailDetalle("Asegurese de que el NIF y la fecha de nacimiento son correctos");
    } else {
      this.progressSpinner = true;
      let mutualidadRequest = new DatosSolicitudMutualidadItem();
      mutualidadRequest.numeroidentificador = this.generalBody.nif;
      this.sigaServices
        .post("mutualidad_searchSolicitud", mutualidadRequest)
        .subscribe(
          result => {
            let resultParsed = JSON.parse(result.body);
            if (
              resultParsed.idsolicitud != null &&
              resultParsed.idsolicitud != undefined
            ) {
              this.arreglarFechas();
              this.solicitudEditar = JSON.parse(JSON.stringify(this.generalBody));
              this.solicitudEditar.idPais = "191";
              this.solicitudEditar.identificador = this.generalBody.nif;
              this.solicitudEditar.numeroIdentificacion = this.generalBody.nif;
              this.solicitudEditar.tratamiento = this.generalBody.idTratamiento;
              this.solicitudEditar.apellido1 = this.generalBody.apellidos1;
              this.solicitudEditar.apellido2 = this.generalBody.apellidos2;
              this.solicitudEditar.idEstadoCivil = this.generalBody.idEstadoCivil;
              this.solicitudEditar.estadoCivil = this.generalBody.idEstadoCivil;
              this.solicitudEditar.fechaNacimiento = this.generalBody.fechaNacimientoDate;
              this.solicitudEditar.tratamiento = this.tratamientoDesc;
              this.sigaServices
                .post("mutualidad_estadoMutualista", this.solicitudEditar)
                .subscribe(
                  result => {
                    let prueba = JSON.parse(result.body);
                    if ((prueba.valorRespuesta == "1") || (prueba.idSolicitud != "0")) {
                      this.solicitudEditar.idSolicitudMutualidad = prueba.idSolicitud;
                      this.solicitudEditar.estadoMutualidad = prueba.valorRespuesta;
                      this.solicitudEditar.tipoIdentificacion = this.generalBody.idTipoIdentificacion;
                      this.solicitudEditar.nombre = this.solicitudEditar.soloNombre;
                      sessionStorage.setItem(
                        "solicitudEnviada",
                        JSON.stringify(this.solicitudEditar)
                      );
                      this.router.navigate(["/mutualidadSeguroAccidentes"]);
                    } else {
                      //  this.modoLectura = true;
                      if (prueba.valorRespuesta == undefined || prueba.valorRespuesta == null || prueba.valorRespuesta == "") {
                        this.showInfo("No se ha podido comprobar si tiene ya un Plan Universal");

                      } else {
                        this.showInfo(prueba.valorRespuesta);
                      }
                    }
                    this.progressSpinner = false;
                  },
                  error => {
                    console.log(error);
                  }, () => {
                    this.progressSpinner = false;
                  }
                );
            } else {
              this.arreglarFechas();
              this.solicitudEditar = JSON.parse(JSON.stringify(this.generalBody));
              this.solicitudEditar.idPais = "191";
              this.solicitudEditar.identificador = this.generalBody.nif;
              this.solicitudEditar.numeroIdentificacion = this.generalBody.nif;
              this.solicitudEditar.tratamiento = this.generalBody.idTratamiento;
              this.solicitudEditar.apellido1 = this.generalBody.apellidos1;
              this.solicitudEditar.apellido2 = this.generalBody.apellidos2;
              this.solicitudEditar.idEstadoCivil = this.generalBody.idEstadoCivil;
              this.solicitudEditar.estadoCivil = this.generalBody.idEstadoCivil;
              this.solicitudEditar.fechaNacimiento = this.generalBody.fechaNacimientoDate;
              this.solicitudEditar.tratamiento = this.tratamientoDesc;
              this.sigaServices
                .post("mutualidad_estadoMutualista", this.solicitudEditar)
                .subscribe(
                  result => {
                    let prueba = JSON.parse(result.body);
                    if ((prueba.valorRespuesta == "1")) {
                      this.solicitudEditar.idSolicitudMutualidad = prueba.idSolicitud;
                      this.solicitudEditar.estadoMutualidad = prueba.valorRespuesta;
                      this.solicitudEditar.tipoIdentificacion = this.generalBody.idTipoIdentificacion;
                      this.solicitudEditar.nombre = this.solicitudEditar.soloNombre;
                      sessionStorage.setItem(
                        "solicitudEnviada",
                        JSON.stringify(this.solicitudEditar)
                      );
                      this.router.navigate(["/mutualidadSeguroAccidentes"]);
                    } else {
                      //  this.modoLectura = true;
                      if (prueba.valorRespuesta == undefined || prueba.valorRespuesta == null || prueba.valorRespuesta == "") {
                        this.showInfo("No se ha podido comprobar si tiene ya un Plan Universal");

                      } else {
                        this.showInfo(prueba.valorRespuesta);
                      }
                    }
                  },
                  error => {
                    console.log(error);
                  }, () => {
                    this.progressSpinner = false;
                  }
                );
            }
          }, error => {
            console.log(error);
          }, () => {
            this.progressSpinner = false;
          }
        );
    }
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
            e.color = "#87CEFA";
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
            e.color = "#87CEFA";
          }
        });
      }

      this.autocompleteTopics.panelVisible = false;
      this.autocompleteTopics.focusInput();

    }
    this.generalBody.temasCombo = JSON.parse(JSON.stringify(this.resultsTopics));
    this.activacionGuardarGenerales();
  }

  getRandomColor() {
    var color = Math.floor(0x1000000 * Math.random()).toString(16);
    return "#" + ("000000" + color).slice(-6);
  }

  visiblePanelBlurTopics(event) {
    if (this.autocompleteTopics.highlightOption != undefined) {
      this.autocompleteTopics.highlightOption.color = "#87CEFA";
      this.resultsTopics.push(this.autocompleteTopics.highlightOption);
      this.autocompleteTopics.highlightOption = undefined;
    }
    this.autocompleteTopics.panelVisible = false;
    this.activacionGuardarGenerales();
  }

  filterLabelsMultipleTopics(event) {
    let query = event.query;
    this.suggestTopics = [];

    this.comboTopics.forEach(element => {
      if (element.label.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        let findTopic = this.resultsTopics.find(x => x.value === element.value);
        if (findTopic == undefined) {
          this.suggestTopics.push(element);
        }
      }
    });

    this.resultsTopics.forEach(e => {
      if (e.color == undefined) {
        e.color = "#87CEFA";
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

          this.resultsTopics.forEach(e => {
            if (e.color == undefined) {
              e.color = "#87CEFA";
            }
          });

          this.generalBody.temasCombo = JSON.parse(JSON.stringify(this.resultsTopics));
          this.checkGeneralBody.temasCombo = JSON.parse(JSON.stringify(this.resultsTopics));
          this.progressSpinner = false;
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        }
      );
  }

  getComboTemas() {
    this.backgroundColor = "#87CEFA";
    // obtener colegios
    this.sigaServices.get("fichaCursos_getTopicsCourse").subscribe(
      n => {
        this.comboTopics = n.combooItems;
        this.arregloTildesCombo(this.comboTopics);
      },
      err => {
        console.log(err);
      }
    );
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
          this.edadCalculada = 0;
        }
      }
    }
  }

  inputFechaNacimiento(e) {
    this.fechaNacimientoSelected = false;

    //evento necesario para informar de las fechas que borren manualmente (teclado)
    if (e.inputType == 'deleteContentBackward') {
      this.borrarFechaNacimiento();
    }
  }

  borrarFechaNacimiento() {
    this.fechaNacimiento = null;
    this.fechaNacimientoSelected = true;
    this.edadCalculada = 0;
  }

  fechaHoyFechaNacimiento() {
    this.fechaNacimiento = new Date();
    this.calendarFechaNacimiento.overlayVisible = false;
    this.fechaNacimientoSelected = true;
    this.calendarFechaNacimiento.onSelect.emit(this.fechaNacimiento);
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
  }

  fechaHoyFechaIncorporacion() {
    this.colegialesBody.incorporacion = new Date();
    this.calendarFechaIncorporacion.overlayVisible = false;
    this.fechaIncorporacionSelected = true;
    this.calendarFechaIncorporacion.onSelect.emit();

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
  }

  fechaHoyFechaTitulacion() {
    this.colegialesBody.fechaTitulacion = new Date();
    this.calendarFechaTitulacion.overlayVisible = false;
    this.fechaTitulacionSelected = true;
    this.calendarFechaTitulacion.onSelect.emit();

  }

  getYearRange() {
    let today = new Date();
    let year = today.getFullYear();
    this.yearRange = (year - 80) + ":" + (year + 20);
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

  checkAccesoDatosGenerales() {
    let controlAcceso = new ControlAccesoDto();
    controlAcceso.idProceso = "120";

    this.sigaServices.post("acces_control", controlAcceso).subscribe(
      data => {
        let permisos = JSON.parse(data.body);
        let permisosArray = permisos.permisoItems;
        this.tarjetaGenerales = permisosArray[0].derechoacceso;
      },
      err => {
        console.log(err);
      },
      () => {
      }
    );
  }

  checkAccesoInteres() {
    let controlAcceso = new ControlAccesoDto();
    controlAcceso.idProceso = "234";

    this.sigaServices.post("acces_control", controlAcceso).subscribe(
      data => {
        let permisos = JSON.parse(data.body);
        let permisosArray = permisos.permisoItems;
        this.tarjetaInteres = permisosArray[0].derechoacceso;
      },
      err => {
        console.log(err);
      },
      () => {
      }
    );
  }

  checkAccesoDatosColegiales() {
    let controlAcceso = new ControlAccesoDto();
    controlAcceso.idProceso = "121";

    this.sigaServices.post("acces_control", controlAcceso).subscribe(
      data => {
        let permisos = JSON.parse(data.body);
        let permisosArray = permisos.permisoItems;
        this.tarjetaColegiales = permisosArray[0].derechoacceso;
      },
      err => {
        console.log(err);
      },
      () => {
      }
    );
  }

  checkAccesoOtrasColegiaciones() {
    let controlAcceso = new ControlAccesoDto();
    controlAcceso.idProceso = "235";

    this.sigaServices.post("acces_control", controlAcceso).subscribe(
      data => {
        let permisos = JSON.parse(data.body);
        let permisosArray = permisos.permisoItems;
        this.tarjetaOtrasColegiaciones = permisosArray[0].derechoacceso;
      },
      err => {
        console.log(err);
      },
      () => {
      }
    );
  }

  checkAccesoCertificados() {
    let controlAcceso = new ControlAccesoDto();
    controlAcceso.idProceso = "131";

    this.sigaServices.post("acces_control", controlAcceso).subscribe(
      data => {
        let permisos = JSON.parse(data.body);
        let permisosArray = permisos.permisoItems;
        this.tarjetaCertificados = permisosArray[0].derechoacceso;
      },
      err => {
        console.log(err);
      },
      () => {
      }
    );
  }

  checkAccesoSanciones() {
    let controlAcceso = new ControlAccesoDto();
    controlAcceso.idProceso = "236";

    this.sigaServices.post("acces_control", controlAcceso).subscribe(
      data => {
        let permisos = JSON.parse(data.body);
        let permisosArray = permisos.permisoItems;
        this.tarjetaSanciones = permisosArray[0].derechoacceso;
      },
      err => {
        console.log(err);
      },
      () => {
      }
    );
  }

  checkAccesoSociedades() {
    let controlAcceso = new ControlAccesoDto();
    controlAcceso.idProceso = "237";

    this.sigaServices.post("acces_control", controlAcceso).subscribe(
      data => {
        let permisos = JSON.parse(data.body);
        let permisosArray = permisos.permisoItems;
        this.tarjetaSociedades = permisosArray[0].derechoacceso;
      },
      err => {
        console.log(err);
      },
      () => {
      }
    );
  }

  checkAccesoDatosCurriculares() {
    let controlAcceso = new ControlAccesoDto();
    controlAcceso.idProceso = "124";

    this.sigaServices.post("acces_control", controlAcceso).subscribe(
      data => {
        let permisos = JSON.parse(data.body);
        let permisosArray = permisos.permisoItems;
        this.tarjetaCurriculares = permisosArray[0].derechoacceso;
      },
      err => {
        console.log(err);
      },
      () => {
      }
    );
  }

  checkAccesoDirecciones() {
    let controlAcceso = new ControlAccesoDto();
    controlAcceso.idProceso = "122";

    this.sigaServices.post("acces_control", controlAcceso).subscribe(
      data => {
        let permisos = JSON.parse(data.body);
        let permisosArray = permisos.permisoItems;
        this.tarjetaDirecciones = permisosArray[0].derechoacceso;
      },
      err => {
        console.log(err);
      },
      () => {
      }
    );
  }

  checkAccesoDatosBancarios() {
    let controlAcceso = new ControlAccesoDto();
    controlAcceso.idProceso = "123";

    this.sigaServices.post("acces_control", controlAcceso).subscribe(
      data => {
        let permisos = JSON.parse(data.body);
        let permisosArray = permisos.permisoItems;
        this.tarjetaBancarios = permisosArray[0].derechoacceso;
      },
      err => {
        console.log(err);
      },
      () => {
      }
    );
  }

  checkAccesoRegtel() {
    let controlAcceso = new ControlAccesoDto();
    controlAcceso.idProceso = "222";

    this.sigaServices.post("acces_control", controlAcceso).subscribe(
      data => {
        let permisos = JSON.parse(data.body);
        let permisosArray = permisos.permisoItems;
        this.tarjetaRegtel = permisosArray[0].derechoacceso;
      },
      err => {
        console.log(err);
      },
      () => {
      }
    );
  }

  checkAccesoMutualidad() {
    let controlAcceso = new ControlAccesoDto();
    controlAcceso.idProceso = "223";

    this.sigaServices.post("acces_control", controlAcceso).subscribe(
      data => {
        let permisos = JSON.parse(data.body);
        let permisosArray = permisos.permisoItems;
        this.tarjetaMutualidad = permisosArray[0].derechoacceso;
      },
      err => {
        console.log(err);
      },
      () => {
      }
    );
  }

  checkAccesoAlterMutua() {
    let controlAcceso = new ControlAccesoDto();
    controlAcceso.idProceso = "226";

    this.sigaServices.post("acces_control", controlAcceso).subscribe(
      data => {
        let permisos = JSON.parse(data.body);
        let permisosArray = permisos.permisoItems;
        this.tarjetaAlterMutua = permisosArray[0].derechoacceso;
      },
      err => {
        console.log(err);
      },
      () => {
      }
    );
  }


  sumarDia(fechaInput) {
    let fecha = new Date(fechaInput);
    let one_day = 1000 * 60 * 60 * 24;
    let ayer = fecha.getMilliseconds() + one_day;
    fecha.setMilliseconds(ayer);
    return fecha;
  }

  showFailNumColegiado(mensaje: string) {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "",
      detail: this.translateService.instant(mensaje)
    });
  }
}
