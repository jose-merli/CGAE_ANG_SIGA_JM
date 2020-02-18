import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { SigaServices } from '../../../../_services/siga.service';
import { ConfirmationService, Message } from "primeng/components/common/api";
import { AuthenticationService } from '../../../../_services/authentication.service';
import { TranslateService } from '../../../../commons/translate/translation.service';
// import { DomSanitizer } from '@angular/platform-browser/src/platform-browser';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { cardService } from "./../../../../_services/cardSearch.service";
import { DatosColegiadosItem } from '../../../../models/DatosColegiadosItem';
import { NoColegiadoItem } from '../../../../models/NoColegiadoItem';
import { Location } from "@angular/common";
import { FichaColegialGeneralesItem } from '../../../../models/FichaColegialGeneralesItem';
import { FichaColegialGeneralesObject } from '../../../../models/FichaColegialGeneralesObject';
import { FichaColegialColegialesItem } from '../../../../models/FichaColegialColegialesItem';
import { FichaColegialColegialesObject } from '../../../../models/FichaColegialColegialesObject';
import { PersonaJuridicaObject } from '../../../../models/PersonaJuridicaObject';
import { DatosColegiadosObject } from '../../../../models/DatosColegiadosObject';
import { FichaColegialCertificadosObject } from '../../../../models/FichaColegialCertificadosObject';
import { BusquedaSancionesItem } from '../../../../models/BusquedaSancionesItem';
import { BusquedaSancionesObject } from '../../../../models/BusquedaSancionesObject';
import { DocushareObject } from '../../../../models/DocushareObject';
import { SolicitudIncorporacionItem } from '../../../../models/SolicitudIncorporacionItem';
import { esCalendar } from '../../../../utils/calendar';
import { DatosDireccionesItem } from '../../../../models/DatosDireccionesItem';
import { DatosBancariosItem } from '../../../../models/DatosBancariosItem';
import { DatosDireccionesObject } from '../../../../models/DatosDireccionesObject';
import { DatosBancariosObject } from '../../../../models/DatosBancariosObject';
import { ComboEtiquetasItem } from '../../../../models/ComboEtiquetasItem';
import { FichaDatosCurricularesObject } from '../../../../models/FichaDatosCurricularesObject';
import { AutoComplete, DataTable, Calendar } from 'primeng/primeng';
import { DocushareItem } from '../../../../models/DocushareItem';
import { Dialog } from 'primeng/dialog';




@Component({
  selector: 'app-ficha-colegial-general',
  templateUrl: './ficha-colegial-general.component.html',
  styleUrls: ['./ficha-colegial-general.component.scss']
})
export class FichaColegialGeneralComponent implements OnInit {
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
  activateNumColegiado: boolean = false;
  disabledNif: boolean = false;
  selectedItemDelete;
  DescripcionCertificado;
  DescripcionSanciones;
  DescripcionSociedades;
  DescripcionDatosCurriculares;
  DescripcionDatosDireccion;
  DescripcionDatosBancarios;
  // irTurnoOficio: any;
  // irExpedientes: any;
  msgs: Message[];
  displayColegiado: boolean = false;
  showMessageInscripcion: boolean = false;
  tieneTurnosGuardias: boolean = false;

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
  icon: string;
  selectedTipo: any[] = [];
  uploadedFiles: any[] = [];
  numSelected: number = 0;
  numSelectedDirecciones: number = 0;
  numSelectedBancarios: number = 0;
  numSelectedDatosRegtel: number = 0;
  numSelectedCurriculares: number = 0;
  numSelectedColegiales: number = 0;
  activacionEditar: boolean = true;
  activacionTarjeta: boolean = false;
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
  datosColegialesActual: any[] = [];
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
  ocultarMotivo: boolean = undefined;
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
  mostrarDatosCertificados: boolean = false;
  mostrarDatosSanciones: boolean = false;

  mostrarDatosSociedades: boolean = false;

  mostrarDatosCurriculares: boolean = false;

  mostrarDatosDireccion: boolean = false;

  mostrarDatosBancarios: boolean = false;


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
  tipoCambioAuditoria: String;
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
  initSpinner: boolean = false;
  disableNumColegiado: boolean = true;
  information: boolean = false;
  keyConfirmation: string;

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
  desactivarVolver: boolean = true;

  comboTopics: any[] = [];
  comboService: any[] = [];
  suggestService: any[] = [];
  suggestTopics: any[] = [];
  resultsService: any[] = [];
  resultsTopics: any[] = [];
  backgroundColor;
  datePipeIncorporacion: boolean = false;
  datePipePresentacion: boolean = false;
  datePipeFechaJura: boolean = false;
  datePipeFechaTitulacion: boolean = false;
  fechaNacCambiada: boolean = false;
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

  tarjetaInteresNum: string;
  tarjetaGeneralesNum: string;
  tarjetaColegialesNum: string;
  tarjetaOtrasColegiacionesNum: string;
  tarjetaCertificadosNum: string;
  tarjetaSancionesNum: string;
  tarjetaSociedadesNum: string;
  tarjetaCurricularesNum: string;
  tarjetaDireccionesNum: string;
  tarjetaBancariosNum: string;
  tarjetaRegtelNum: string;
  tarjetaMutualidadNum: string;
  tarjetaAlterMutuaNum: string;

  isCrearColegial: boolean = false;
  nuevoEstadoColegial: FichaColegialColegialesItem = new FichaColegialColegialesItem();
  fechaMinimaEstadoColegial: Date;
  fechaMinimaEstadoColegialMod: Date;
  filaEditable: boolean = false;
  seleccionColegial: string = "single";
  isRestablecer: boolean = false;
  isEliminarEstadoColegial: boolean = false;
  disabledToday: boolean = false;
  fichaMutua: any;
  estadoColegial: String;
  residente: String;
  displayDelete: boolean;

  constructor(
    private sigaServices: SigaServices,
    private confirmationService: ConfirmationService,
    private authenticationService: AuthenticationService,
    private cardService: cardService,
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    // private sanitizer: DomSanitizer,
    private router: Router,
    private datepipe: DatePipe,
    private location: Location,
  ) { }

  ngOnInit() {
    if (sessionStorage.getItem("fichaColegialByMenu")) {
      this.getColegiadoLogeado(); // Hay que asegurarse de que esto sirve para algo y funciona correctamente
    } else {
      this.OnInit();
    }
  }
  OnInit() {
    sessionStorage.removeItem("direcciones");
    sessionStorage.removeItem("situacionColegialesBody");
    sessionStorage.removeItem("fichaColegial");

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

    if (sessionStorage.getItem("filtrosBusquedaColegiados")) {
      sessionStorage.removeItem("filtrosBusquedaColegiadosFichaColegial");
      this.persistenciaColeg = new DatosColegiadosItem();
      this.persistenciaColeg = JSON.parse(
        sessionStorage.getItem("filtrosBusquedaColegiados")
      );
      this.desactivarVolver = false;
    } else if (sessionStorage.getItem("filtrosBusquedaNoColegiados")) {
      sessionStorage.removeItem("filtrosBusquedaNoColegiadosFichaColegial");
      this.persistenciaNoCol = new NoColegiadoItem();
      this.persistenciaNoCol = JSON.parse(
        sessionStorage.getItem("filtrosBusquedaNoColegiados")
      );
      this.desactivarVolver = false;
    } else if (sessionStorage.getItem("busquedaCensoGeneral") == "true") {
      this.disabledNif = true;
      this.desactivarVolver = false;
    } else if (sessionStorage.getItem("fichaColegialByMenu")) {
      this.desactivarVolver = true;
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
      sessionStorage.removeItem("esNuevoNoColegiado");
      this.generalBody = new FichaColegialGeneralesItem();
      this.generalBody = JSON.parse(sessionStorage.getItem("personaBody"));
      this.checkGeneralBody = new FichaColegialGeneralesItem();
      this.checkGeneralBody = JSON.parse(sessionStorage.getItem("personaBody"));
      this.colegialesBody = JSON.parse(sessionStorage.getItem("personaBody"));
      if (this.colegialesBody.situacionResidente == "0") this.colegialesBody.situacionResidente = "No";
      if (this.colegialesBody.situacionResidente == "1") this.colegialesBody.situacionResidente = "Si";

      this.checkColegialesBody = JSON.parse(JSON.stringify(this.colegialesBody));
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

      let migaPan = "";

      if (this.esColegiado) {
        migaPan = this.translateService.instant("menu.censo.fichaColegial");
      } else {
        migaPan = this.translateService.instant("menu.censo.fichaNoColegial");
      }

      sessionStorage.setItem("migaPan", migaPan);

      this.generalBody.colegiado = this.esColegiado;
      this.checkGeneralBody.colegiado = this.esColegiado;
      this.tipoCambioAuditoria = null;
      // this.checkAcceso();
      // this.onInitGenerales();
      // this.onInitCurriculares();
      // this.onInitColegiales();
      // this.onInitSociedades();
      // this.onInitOtrasColegiaciones();
      // this.searchSanciones();
      // this.searchCertificados();
    } else {
      if (sessionStorage.getItem("busquedaCensoGeneral") == "true") {
        this.generalBody = JSON.parse(sessionStorage.getItem("personaBody"));
        this.isLetrado = false;
        this.colegialesBody = JSON.parse(sessionStorage.getItem("personaBody"));
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
        this.situacionPersona = enviar.idEstado;
        if (this.generalBody.fechaNacimiento != null && this.generalBody.fechaNacimiento != undefined) {
          // this.fechaNacimiento = this.arreglarFecha(this.generalBody.fechaNacimiento);
        }
        this.desactivarVolver = false;
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
      } else {
        this.generalBody = new FichaColegialGeneralesItem();
        this.colegialesBody = new FichaColegialColegialesItem();
      }

      // this.searchDatosBancariosIdPersona.datosBancariosItem[0] = new DatosBancariosItem();
    }

    if (JSON.parse(sessionStorage.getItem("esNuevoNoColegiado"))) {
      this.esNewColegiado = true;
      this.activacionEditar = false;
      this.emptyLoadFichaColegial = false;
      this.desactivarVolver = false;
      this.activacionTarjeta = false;

      sessionStorage.removeItem("esNuevoNoColegiado");
      // this.onInitGenerales();
    } else {
      this.activacionEditar = true;
      this.esNewColegiado = false;
      this.activacionTarjeta = true;
    }

    if (sessionStorage.getItem("busquedaCensoGeneral") == "true") {
      this.generalBody.idTipoIdentificacion = "10";
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
  }
  getColegiadoLogeado() {
    this.generalBody.searchLoggedUser = true;

    this.sigaServices
      .postPaginado('busquedaColegiados_searchColegiado', '?numPagina=1', this.generalBody)
      .subscribe(
        (data) => {
          let busqueda = JSON.parse(data['body']);
          if (busqueda.colegiadoItem.length > 0) {
            this.OnInit();
            this.displayColegiado = false;

          } else {
            this.displayColegiado = true;
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }
  // DE MOMENTO VA PERFE 
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
    } else if (sessionStorage.getItem("esColegiado") == "true" && sessionStorage.getItem("solicitudAprobada") != "true") {
      this.router.navigate(["/busquedaColegiados"]);
    } else {
      sessionStorage.removeItem("solicitudAprobada")
      this.location.back();
    }
  }
}


