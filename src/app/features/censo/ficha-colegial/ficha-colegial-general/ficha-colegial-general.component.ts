import { Component, OnInit, ViewChild, OnDestroy, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { SigaServices } from '../../../../_services/siga.service';
import { Message } from "primeng/components/common/api";
import { TranslateService } from '../../../../commons/translate/translation.service';
import { Router } from '@angular/router';
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
import { PersistenceService } from '../../../../_services/persistence.service';


@Component({
  selector: 'app-ficha-colegial-general',
  templateUrl: './ficha-colegial-general.component.html',
  styleUrls: ['./ficha-colegial-general.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FichaColegialGeneralComponent implements OnInit, OnDestroy {
  publicarDatosContacto: Boolean = false;
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
  openExp: Boolean = false;
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
  vieneDeFactura:any;
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

  datosTratamientos: any[] = [];

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
  tarjetasActivas: boolean = false;

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
  tarjetaExpedientes: string;

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
  tarjetaExpedientesNum: string;

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
  manuallyOpened:Boolean;
  idManuallyOpened: any;
  constructor(
    private sigaServices: SigaServices,
    private translateService: TranslateService,
    private router: Router,
    private location: Location,
    private persistenceService: PersistenceService
  ) { }

  ngOnInit() {
    this.datosTarjetaResumen = [];
    if (sessionStorage.getItem("fichaColegialByMenu")) {
      this.comprobarColegiado();
      this.getColegiadoLogeado();
    } else {
      this.OnInit();
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    this.enviarEnlacesTarjeta();
  }
  //Resto de tarjetas
 


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

    if(sessionStorage.getItem("vieneDeFactura")){
      sessionStorage.removeItem("vieneDeFactura")
      this.vieneDeFactura = true;
    }else{
      this.vieneDeFactura = false;
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
    } else if (sessionStorage.getItem("abonosSJCSItem")) {
      this.desactivarVolver = false;
    }else if (sessionStorage.getItem("destinatarioCom") != null) {
      this.desactivarVolver = false;
    } else if (sessionStorage.getItem("esNuevoNoColegiado")) {
      this.desactivarVolver = false;
    } //Si viene de la ficha de compra/suscripcion
    else if(sessionStorage.getItem("origin")=="Cliente"){
      this.desactivarVolver = false;
    } else if (sessionStorage.getItem("fromTarjetaLetradoInscripciones") != null){
      this.desactivarVolver = false;
    } else {
      //  LLEGA DESDE PUNTO DE MENÚ
      this.emptyLoadFichaColegial = JSON.parse(
        sessionStorage.getItem("emptyLoadFichaColegial")
      );
      this.desactivarVolver = true;
      this.generalBody.searchLoggedUser = true;
    }

    if (
      sessionStorage.getItem("personaBody") != null &&
      sessionStorage.getItem("personaBody") != undefined &&
      JSON.parse(sessionStorage.getItem("esNuevoNoColegiado")) != true
    ) {
      if (this.generalBody == undefined){
        this.generalBody = new FichaColegialGeneralesItem();
      }
      
      this.checkGeneralBody = new FichaColegialGeneralesItem();
      if(sessionStorage.getItem("personaBody") != null && sessionStorage.getItem("personaBody") != 'undefined'){
        this.generalBody = JSON.parse(sessionStorage.getItem("personaBody"));
        this.checkGeneralBody = JSON.parse(sessionStorage.getItem("personaBody"));
        this.colegialesBody = JSON.parse(sessionStorage.getItem("personaBody"));
      }
      if (this.colegialesBody.situacionResidente == "0") this.colegialesBody.situacionResidente = "No";
      if (this.colegialesBody.situacionResidente == "1") this.colegialesBody.situacionResidente = "Si";

      this.checkColegialesBody = JSON.parse(JSON.stringify(this.colegialesBody));
      this.idPersona = this.generalBody.idPersona;
      if (sessionStorage.getItem("esColegiado")) {
        this.esColegiado = JSON.parse(sessionStorage.getItem("esColegiado"));
      } else {
        this.esColegiado = false;
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

      this.sigaServices
        .post("busquedaColegiados_searchSituacionGlobal", this.generalBody.idPersona)
        .subscribe(
          data => {   
            sessionStorage.setItem("situacionGlobal", this.getSituacionGlobal(JSON.parse(data.body).combooItems));    
          },
          err => {
            //console.log(err);
          }
        );   

    }

    if (sessionStorage.getItem("busquedaCensoGeneral") == "true") {
      this.generalBody.idTipoIdentificacion = "10";
    }

    // obtener parametro para saber si se oculta la auditoria
    let parametro = {
      valor: "OCULTAR_MOTIVO_MODIFICACION"
    };

    this.tarjetasActivas = true;
      this.stringAComisiones();

    // Se obtienen los tratamientos disponibles
    this.getTratamientos();
  }

  getSituacionGlobal(rawList): string{
    let result = "";
    let fallecido = false;
    let activo = false;

    if(sessionStorage.getItem("esColegiado") && sessionStorage.getItem("esColegiado") == "false") {
      // Si no es colegiado hay que mostrarlo
      result = "No colegiado";
      // Comprobamos que no este fallecido
      if(rawList){
        rawList.forEach( e => {
          if (e.value == "60"){ result = "Fallecido"; }
        });
      }
    } else if(rawList){
      rawList.forEach( e => {
        if (e.value == "60"){ fallecido = true; }
        if (e.value == "10" || e.value == "20"){ activo = true; }
      });

      if (fallecido){ result = "Fallecido"; } 
      else if (activo){ result = "Activo"; } 
      else { result = "De baja"; }
    }

    return result;
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

  getTratamientos() {
    this.sigaServices.get("fichaColegialGenerales_tratamiento").subscribe(
      n => {
        this.datosTratamientos = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );
  }

  getColegiadoLogeado() {
    this.generalBody.searchLoggedUser = true;

    this.sigaServices
//      .postPaginado('busquedaColegiados_searchColegiado', '?numPagina=1', this.generalBody)
      .postPaginado('busquedaColegiados_searchColegiadoFicha', '?numPagina=1', this.generalBody)
      .subscribe(
        (data) => {
          let busqueda = JSON.parse(data['body']);
          if (busqueda.colegiadoItem.length > 0) {
            //this.OnInit();
            //this.displayColegiado = false;
            sessionStorage.setItem('personaBody', JSON.stringify(busqueda.colegiadoItem[0]));
            sessionStorage.setItem('esNuevoNoColegiado', JSON.stringify(false));
            sessionStorage.setItem('esColegiado', 'true');
          } else {
            //this.displayColegiado = true;
            sessionStorage.setItem('personaBody', JSON.stringify(this.generalBody));
            sessionStorage.setItem('esNuevoNoColegiado', JSON.stringify(true));
            sessionStorage.setItem('emptyLoadFichaColegial', 'true');
            sessionStorage.setItem('esColegiado', 'true');
          }
          if (this.generalBody == undefined)
            this.generalBody = new FichaColegialGeneralesItem();
          this.generalBody = JSON.parse(sessionStorage.getItem("personaBody"));
        },
        (err) => {
          //console.log(err);
        }, () => {
          this.OnInit();
        });

  }

    ngOnDestroy() {
    sessionStorage.removeItem("esNuevoNoColegiado");

  }
  // DE MOMENTO VA PERFE 
  backTo() {
    if (sessionStorage.getItem("fromTarjetaLetradoInscripciones") != null){
         this.persistenceService.setDatos(JSON.parse(sessionStorage.getItem("fromTarjetaLetradoInscripciones")));
         sessionStorage.removeItem("fromTarjetaLetradoInscripciones");
         this.router.navigate(["/fichaInscripcionesGuardia"]);

    }else if(this.vieneDeFactura){
      this.router.navigate(["/facturas"]);
    }else{
    sessionStorage.removeItem("personaBody");
    sessionStorage.removeItem("situacionGlobal");
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
    } 
    else if (sessionStorage.getItem("volverAbonoSJCS") == "true") {
      this.location.back();
    } 
    else if (sessionStorage.getItem("esColegiado") == "false") {
      this.router.navigate(["/busquedaNoColegiados"]);
    } else if (sessionStorage.getItem("esColegiado") == "true" && sessionStorage.getItem("solicitudAprobada") != "true" && sessionStorage.getItem("origin")!="Cliente") {
      this.router.navigate(["/busquedaColegiados"]);
    } else if(sessionStorage.getItem("originGuardiaColeg") == "true"){
      sessionStorage.removeItem("originGuardiaColeg")
      this.router.navigate(["/gestionGuardiaColegiado"]);
    } else{
      sessionStorage.removeItem("solicitudAprobada")
      this.location.back();
    }
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
    this.progressSpinner = true;
    let procesos: any = ["285", "234", "286", "12P", "235", "290", "236", "237", "289", "287", "288", "291", "298", "299", "127"];
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
        this.tarjetaBancariosNum = permisosArray[10].derechoacceso;
        this.tarjetaRegtelNum = permisosArray[11].derechoacceso;
        this.tarjetaMutualidadNum = permisosArray[12].derechoacceso;
        this.tarjetaAlterMutuaNum = permisosArray[13].derechoacceso;
        this.tarjetaExpedientesNum = permisosArray[14].derechoacceso;
      },
      err => {
        //console.log(err);
      },
      () => {
        this.progressSpinner = false;
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
    this.tarjetaExpedientes = this.tarjetaExpedientesNum;

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

    if (this.tarjetaExpedientesNum == "3" || this.tarjetaExpedientesNum == "2") {
      let pruebaTarjeta = {
        label: "menu.expedientes",
        value: document.getElementById("tarjExp"),
        nombre: "expedientes",
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
      // Venimos de la tarjeta datos colegiales - cambio estado colegio
      if(event.length == 1){
        this.sigaServices
        .post("busquedaColegiados_searchSituacionGlobal", this.generalBody.idPersona)
        .subscribe(
          data => {  
            //estado_colegio[0] = nuevoEstado -- estado_colegio[1] = colegio 
            let estado_colegio = event[0].value.split("/");
            let fallecido = false;
            let activo = false;

            JSON.parse(data.body).combooItems.forEach( e => {
              if(e.label == estado_colegio[1]){
                switch(estado_colegio[0]){
                  case "10":
                  case "20":
                    activo = true; break;
                  case "60":
                    fallecido = true; break;
                  default:
                    fallecido = fallecido || false;
                    activo = activo || false;
                    break;
                }
              }
              else{
                if (e.value == "60"){ fallecido = true; }
                if (e.value == "10" || e.value == "20"){ activo = true; }   
              }              
            });
      
            if (fallecido){ sessionStorage.setItem("situacionGlobal","Fallecido") } 
            else if (activo){ sessionStorage.setItem("situacionGlobal","Activo") } 
            else { sessionStorage.setItem("situacionGlobal","De baja") }

            // Se podria controlar mejor 
            // De momento solo hay 4 objetos y la situacion es siempre la ultima
            this.datosTarjetaResumen.splice(3,1,{
              label: "Situación Ejercicio Actual",
              value: sessionStorage.getItem("situacionGlobal")
            })
              
          },
          err => {
            //console.log(err);
          }
        );
      }
      else {
        this.datosTarjetaResumen = event;
      }      
    }
  }

  isCloseReceive(event) {
    if (event != undefined) {
      switch (event) {
        case "generales":
          this.openGen = this.manuallyOpened;
          break;
        case "colegiales":
          this.openColegia = this.manuallyOpened;
          break;
        case "colegiaciones":
          this.openOtrasCole = this.manuallyOpened;
          break;
        case "certificados":
          this.openCertifi = this.manuallyOpened;
          break;
        case "sanciones":
          this.openSanci = this.manuallyOpened;
          break;
        case "sociedades":
          this.openSocie = this.manuallyOpened;
          break;
        case "curriculares":
          this.openCurricu = this.manuallyOpened;
          break;
        case "direcciones":
          this.openDirec = this.manuallyOpened;
          break;
        case "bancarios":
          this.openBanca = this.manuallyOpened;
          break;
        case "regtel":
          this.openRegtel = this.manuallyOpened;
          break;
        case "expedientes":
          this.openExp = this.manuallyOpened;
          break;
      }
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
        case "expedientes":
          this.openExp = true;
          break;
      }
    }
  }
  returnHome() {
    this.displayColegiado = false;
    sessionStorage.removeItem("fichaColegialByMenu");
    this.location.back();
  }
  comprobarColegiado() {
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
          //console.log(err);
        }
      );
  }
aparecerLOPDEvent(event){
    if(event!= undefined){
      this.generalBody.noAparecerRedAbogacia = event;
      this.stringAComisiones();
    }
  }

}

