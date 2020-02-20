import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, SimpleChanges } from '@angular/core';
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
import { ControlAccesoDto } from '../../../../models/ControlAccesoDto';




@Component({
  selector: 'app-ficha-colegial-general',
  templateUrl: './ficha-colegial-general.component.html',
  styleUrls: ['./ficha-colegial-general.component.scss']
})
export class FichaColegialGeneralComponent implements OnInit, OnDestroy {

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
  idPersonaNuevo;
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
  enlacesTarjetaResumen: any[] = [];
  DescripcionCertificado;
  DescripcionSanciones;
  DescripcionSociedades;
  DescripcionDatosCurriculares;
  DescripcionDatosDireccion;
  DescripcionDatosBancarios;
  // irTurnoOficio: any;
  iconoTarjetaResumen = "clipboard";
  msgs: Message[];
  displayColegiado: boolean = false;
  showMessageInscripcion: boolean = false;
  tieneTurnosGuardias: boolean = false;
  openGen: Boolean = false;
  openColegia: Boolean = false;
  openOtrasCole: Boolean = false;
  openCertifi: Boolean = false;
  openSanci: Boolean = false;
  openSocie: Boolean = false;
  openCurricu: Boolean = false;
  openDirec: Boolean = false;
  openBanca: Boolean = false;
  openRegtel: Boolean = false;
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
  datosTarjetaResumen;
  disabledTarjetaResumen:Boolean = false;
  constructor(
    private sigaServices: SigaServices,
    private translateService: TranslateService,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit() {
    this.datosTarjetaResumen = [];
    if (sessionStorage.getItem("fichaColegialByMenu")) {
      this.getColegiadoLogeado(); // Hay que asegurarse de que esto sirve para algo y funciona correctamente
    } else {
      this.OnInit();
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    this.enviarEnlacesTarjeta();
  }

  OnInit() {
    sessionStorage.removeItem("direcciones");
    sessionStorage.removeItem("situacionColegialesBody");
    sessionStorage.removeItem("fichaColegial");

    this.checkAccesos();

    if(sessionStorage.getItem("esNuevoNoColegiado")){
      this.disabledTarjetaResumen = true;
    }else{
      this.disabledTarjetaResumen = false;
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
  ngOnDestroy() {
    sessionStorage.removeItem("esNuevoNoColegiado");

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
  checkAccesos() {
    this.initSpinner = true;
    let procesos: any = ["285", "234", "286", "12P", "235", "290", "236", "237", "289", "287", "288", "291", "298", "299"];
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
        this.tarjetaGeneralesNum = permisosArray[0].derechoacceso;
        this.tarjetaInteresNum = permisosArray[1].derechoacceso;
        this.tarjetaColegialesNum = permisosArray[2].derechoacceso;
        this.activateNumColegiado = permisosArray[3].derechoacceso == 3 ? true : false;
        this.tarjetaOtrasColegiacionesNum = permisosArray[4].derechoacceso;
        this.tarjetaCertificadosNum = permisosArray[5].derechoacceso;
        this.tarjetaSancionesNum = permisosArray[6].derechoacceso;
        this.tarjetaSociedadesNum = permisosArray[7].derechoacceso;
        this.tarjetaCurricularesNum = permisosArray[8].derechoacceso;
        this.tarjetaDireccionesNum = permisosArray[9].derechoacceso;
        this.tarjetaBancariosNum = permisosArray[9].derechoacceso;
        this.tarjetaRegtelNum = permisosArray[10].derechoacceso;
        this.tarjetaMutualidadNum = permisosArray[11].derechoacceso;
        this.tarjetaAlterMutuaNum = permisosArray[12].derechoacceso;
      },
      err => {
        console.log(err);
      },
      () => {
        this.asignarPermisosTarjetas();
      }
    );
  }



  asignarPermisosTarjetas() {
    this.tarjetaInteres = this.tarjetaInteresNum;
    this.tarjetaGenerales = this.tarjetaGeneralesNum;
    this.tarjetaColegiales = this.tarjetaColegialesNum;
    this.tarjetaOtrasColegiaciones = this.tarjetaOtrasColegiacionesNum;
    this.tarjetaCertificados = this.tarjetaCertificadosNum;
    this.tarjetaSanciones = this.tarjetaSancionesNum;
    this.tarjetaSociedades = this.tarjetaSociedadesNum;
    this.tarjetaCurriculares = this.tarjetaCurricularesNum;
    this.tarjetaDirecciones = this.tarjetaDireccionesNum;
    this.tarjetaBancarios = this.tarjetaBancariosNum;
    this.tarjetaRegtel = this.tarjetaRegtelNum;
    this.tarjetaMutualidad = this.tarjetaMutualidadNum;
    this.tarjetaAlterMutua = this.tarjetaAlterMutuaNum;

    this.initSpinner = false;

    this.enviarEnlacesTarjeta();
  }

  enviarEnlacesTarjeta() {
    this.enlacesTarjetaResumen = [];
    if (this.tarjetaGeneralesNum == "3" || this.tarjetaGeneralesNum == "2") {
      let pruebaTarjeta =
      {
        label: "facturacion.tarjetas.literal.serviciosInteres",
        value: document.getElementById("sInteres"),
        nombre: "tarjetaInteres",
      };

      this.enlacesTarjetaResumen.push(pruebaTarjeta);
    }
    if (this.tarjetaInteresNum == "3" || this.tarjetaInteresNum == "2") {
      let pruebaTarjeta = {
        label: "general.message.datos.generales",
        value: document.getElementById("datosGen"),
        nombre: "generales",

      };
      this.enlacesTarjetaResumen.push(pruebaTarjeta);
    }
    if ((this.tarjetaColegialesNum == "3" || this.tarjetaColegialesNum == "2") && this.esColegiado) {
      let pruebaTarjeta = {
        label: "censo.consultaDatosColegiales.literal.cabecera",
        value: document.getElementById("datosCol"),
        nombre: "colegiales",
      };
      this.enlacesTarjetaResumen.push(pruebaTarjeta);
    }
    if ((this.tarjetaOtrasColegiacionesNum == "3" || this.tarjetaOtrasColegiacionesNum == "2") && this.esColegiado) {
      let pruebaTarjeta = {
        label: "censo.consultaDatosColegiacion.literal.otrasColegiaciones",
        value: document.getElementById("otrasColegiaciones"),
        nombre: "colegiaciones",
      };
      let findDato = this.enlacesTarjetaResumen.find(item => item.value == pruebaTarjeta.value);
      if (findDato == undefined) {
        this.enlacesTarjetaResumen.push(pruebaTarjeta);
      }
    }
    if (this.tarjetaCertificadosNum == "3" || this.tarjetaOtrasColegiaciones == "2") {
      let pruebaTarjeta = {
        label: "menu.certificados",
        value: document.getElementById("certif"),
        nombre: "certificados",
      }
      let findDato = this.enlacesTarjetaResumen.find(item => item.value == pruebaTarjeta.value);
      if (findDato == undefined) {
        this.enlacesTarjetaResumen.push(pruebaTarjeta);
      }
    }
    if (this.tarjetaSancionesNum == "3" || this.tarjetaSancionesNum == "2") {
      let pruebaTarjeta = {
        label: "censo.consultaDatosColegiacion.literal.sancionesLetrado",
        value: document.getElementById("sancio"),
        nombre: "sanciones",
      }
      let findDato = this.enlacesTarjetaResumen.find(item => item.value == pruebaTarjeta.value);
      if (findDato == undefined) {
        this.enlacesTarjetaResumen.push(pruebaTarjeta);
      }
    }
    if (this.tarjetaSociedadesNum == "3" || this.tarjetaSociedadesNum == "2") {
      let pruebaTarjeta = {
        label: "censo.fichaColegial.titulo",
        value: document.getElementById("socied"),
        nombre: "sociedades",
      }
      let findDato = this.enlacesTarjetaResumen.find(item => item.value == pruebaTarjeta.value);
      if (findDato == undefined) {
        this.enlacesTarjetaResumen.push(pruebaTarjeta);
      }
    }
    if (this.tarjetaCurricularesNum == "3" || this.tarjetaCurricularesNum == "2") {
      let pruebaTarjeta = {
        label: "censo.consultaDatosCV.cabecera",
        value: document.getElementById("datosCurriculares"),
        nombre: "curriculares",
      }
      let findDato = this.enlacesTarjetaResumen.find(item => item.value == pruebaTarjeta.value);
      if (findDato == undefined) {
        this.enlacesTarjetaResumen.push(pruebaTarjeta);
      }
    }

    if (this.tarjetaDireccionesNum == "3" || this.tarjetaDireccionesNum == "2") {
      let pruebaTarjeta = {
        label: "censo.fichaCliente.datosDirecciones.cabecera",
        value: document.getElementById("direcciones"),
        nombre: "direcciones",
      }
      let findDato = this.enlacesTarjetaResumen.find(item => item.value == pruebaTarjeta.value);
      if (findDato == undefined) {
        this.enlacesTarjetaResumen.push(pruebaTarjeta);
      }
    }
    if (this.tarjetaBancariosNum == "3" || this.tarjetaBancariosNum == "2") {
      let pruebaTarjeta = {
        label: "censo.consultaDatosBancarios.cabecera",
        value: document.getElementById("datosBanc"),
        nombre: "bancarios",
      }
      let findDato = this.enlacesTarjetaResumen.find(item => item.value == pruebaTarjeta.value);
      if (findDato == undefined) {
        this.enlacesTarjetaResumen.push(pruebaTarjeta);
      }
    }
    if (this.tarjetaRegtelNum == "3" || this.tarjetaRegtelNum == "2") {
      let pruebaTarjeta = {
        label: "censo.regtel.literal.titulo",
        value: document.getElementById("regtel"),
        nombre: "regtel",
      }
      let findDato = this.enlacesTarjetaResumen.find(item => item.value == pruebaTarjeta.value);
      if (findDato == undefined) {
        this.enlacesTarjetaResumen.push(pruebaTarjeta);
      }
    }
    if (this.tarjetaMutualidadNum == "3" || this.tarjetaMutualidadNum == "2") {
      let pruebaTarjeta = {
        label: "censo.fichaColegial.mutualidadAbogacia.literal.titulo",
        value: document.getElementById("mutualidad"),
        nombre: "tarjetaMutualidad",
      }
      let findDato = this.enlacesTarjetaResumen.find(item => item.value == pruebaTarjeta.value);
      if (findDato == undefined) {
        this.enlacesTarjetaResumen.push(pruebaTarjeta);
      }
    }
    if (this.tarjetaAlterMutuaNum == "3" || this.tarjetaAlterMutuaNum == "2") {
      let pruebaTarjeta = {
        label: "censo.alterMutua.titulo",
        value: document.getElementById("alterMutua"),
        nombre: "tarjetaAlterMutua",
      }
      let findDato = this.enlacesTarjetaResumen.find(item => item.value == pruebaTarjeta.value);
      if (findDato == undefined) {
        this.enlacesTarjetaResumen.push(pruebaTarjeta);
      }
    }
  }
  idPersonaNuevoEvent(event) {
    if (event != undefined) {
      this.idPersona = event;
    }
  }
  datosTarjetaResumenEvent(event) {
    if (event != undefined) {
      this.datosTarjetaResumen = event;
    }
  }
  isOpenReceive(event) {
    if (event != undefined) {
      switch (event) {
        case "generales":
          this.openGen = true;
          break;
        case "colegiales":
          this.openColegia = true;
          break;
        case "colegiaciones":
          this.openOtrasCole = true;
          break;
        case "certificados":
          this.openCertifi = true;
          break;
        case "sanciones":
          this.openSanci = true;
          break;
        case "sociedades":
          this.openSocie = true;
          break;
        case "curriculares":
          this.openCurricu = true;
          break;
        case "direcciones":
          this.openDirec = true;
          break;
        case "bancarios":
          this.openBanca = true;
          break;
        case "regtel":
          this.openRegtel = true;
          break;
      }
    }
  }
}

