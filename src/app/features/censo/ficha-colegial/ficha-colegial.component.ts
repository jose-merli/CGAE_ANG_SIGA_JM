import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  AfterViewInit
} from "@angular/core";
import { AutoComplete, Dialog, Calendar } from "primeng/primeng";
import { esCalendar } from "../../../utils/calendar";
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

@Component({
  selector: "app-ficha-colegial",
  templateUrl: "./ficha-colegial.component.html",
  styleUrls: ["./ficha-colegial.component.scss"]
})
export class FichaColegialComponent implements OnInit {
  //fichasPosibles: any[];

  // Bodys
  generalBody: FichaColegialGeneralesItem = new FichaColegialGeneralesItem();
  checkGeneralBody: FichaColegialGeneralesItem = new FichaColegialGeneralesItem();
  checkColegialesBody: FichaColegialColegialesItem = new FichaColegialColegialesItem();
  colegialesBody: FichaColegialColegialesItem = new FichaColegialColegialesItem();
  colegialesObject: FichaColegialColegialesObject = new FichaColegialColegialesObject();
  sociedadesBody: PersonaJuridicaObject = new PersonaJuridicaObject();
  otrasColegiacionesBody: DatosColegiadosObject = new DatosColegiadosObject();
  certificadosBody: FichaColegialCertificadosObject = new FichaColegialCertificadosObject();

  isLetrado: boolean;
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
  selectAllBancarios: boolean = false;
  selectMultiple: boolean = false;
  selectMultipleDirecciones: boolean = false;
  selectMultipleBancarios: boolean = false;
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

  rowsPerPage: any = [];
  tipoCuenta: any[] = [];
  selectedTipo: any[] = [];
  uploadedFiles: any[] = [];
  numSelected: number = 0;
  numSelectedDirecciones: number = 0;
  numSelectedBancarios: number = 0;
  activacionEditar: boolean = true;
  selectedItem: number = 10;
  camposDesactivados: boolean = false;
  datos: any[];
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
  datosColegiales: FichaColegialColegialesItem[] = [];
  datosColegiaciones: any[] = [];
  datosCertificados: any[] = [];
  url: String;
  etiquetasPersonaJuridica: any[];
  datosSociedades: any[] = [];
  file: File = undefined;
  edadCalculada: any;

  // Datos Generales
  generalTratamiento: any[];
  generalEstadoCivil: any[];
  generalIdiomas: any[];
  comboSituacion: any[];
  tipoIdentificacion: any[];
  comboTipoSeguro: any[];
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
  // etiquetas
  showGuardar: boolean = false;
  mensaje: String = "";
  control: boolean = false;
  checked: boolean = false;
  autocompletar: boolean = false;
  // isCrear: boolean = false;
  closable: boolean = false;
  isFechaInicioCorrect: boolean = false;
  isFechaBajaCorrect: boolean = false;
  isTrue: boolean = false;
  historico: boolean = false;
  isClose: boolean = false;
  comboEtiquetas: any[];
  inscritoSeleccionado: String = "00";
  displayServicios: boolean = false;
  updateItems: Map<String, ComboEtiquetasItem> = new Map<
    String,
    ComboEtiquetasItem
  >();
  items: Array<ComboEtiquetasItem> = new Array<ComboEtiquetasItem>();
  newItems: Array<ComboEtiquetasItem> = new Array<ComboEtiquetasItem>();
  item: ComboEtiquetasItem = new ComboEtiquetasItem();
  createItems: Array<ComboEtiquetasItem> = new Array<ComboEtiquetasItem>();

  @ViewChild("table")
  table: DataTable;
  // selectedDatos;
  selectedDatosDirecciones;
  selectedDatosBancarios;

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

  comboResidente = [
    { label: "Si / Si", value: "11" },
    { label: "Si / No", value: "10" },
    { label: "No / No", value: "00" },
    { label: "No / Si", value: "01" }
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
    }
  ];
  private DNI_LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE";

  constructor(
    private location: Location,
    private sigaServices: SigaServices,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private router: Router,
    private datepipe: DatePipe
  ) {}

  ngOnInit() {
    // Cogemos los datos de la busqueda de Colegiados
    this.getLetrado();
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
      this.checkColegialesBody = JSON.parse(sessionStorage.getItem("personaBody"));
      this.idPersona = this.generalBody.idPersona;
      if(sessionStorage.getItem("esColegiado")){
        this.esColegiado = JSON.parse(sessionStorage.getItem("esColegiado"));
      }else{
        this.esColegiado = true;
      }
      this.generalBody.colegiado = this.esColegiado;
      // this.checkAcceso();
      this.onInitGenerales();
      this.onInitCurriculares();
      this.onInitColegiales();
      this.onInitSociedades();
      this.onInitOtrasColegiaciones();
      this.searchCertificados();
    } else {
      this.generalBody = new FichaColegialGeneralesItem();
      this.colegialesBody = new FichaColegialColegialesItem();
      // this.searchDatosBancariosIdPersona.datosBancariosItem[0] = new DatosBancariosItem();
    }
    if (JSON.parse(sessionStorage.getItem("esNuevoNoColegiado"))) {
      this.esNewColegiado = true;
      this.onInitGenerales();
    } else {
      this.esNewColegiado = false;
    }
    if (!this.esNewColegiado) {
      this.onInitCurriculares();
      this.onInitDirecciones();
      this.onInitDatosBancarios();
    }

    this.onInitSociedades();

    this.onInitOtrasColegiaciones();

    // RELLENAMOS LOS ARRAY PARA LAS CABECERAS DE LAS TABLAS
    this.colsColegiales = [
      {
        field: "incorporacion",
        header: "censo.consultaDatosGenerales.literal.fechaIncorporacion"
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
        field: "observaciones",
        header: "gratuita.mantenimientoLG.literal.observaciones"
      }
    ];

    this.colsColegiaciones = [
      {
        field: "nif",
        header: "censo.consultaDatosColegiacion.literal.numIden"
      },
      {
        field: "nombre",
        header: "administracion.usuarios.literal.nombre"
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
        field: "fax",
        header: "censo.ws.literal.fax"
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

  // CONTROL DE PESTAÑAS ABRIR Y CERRAR

  abreCierraFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    if (this.activacionEditar == true) {
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
      this.isLetrado = false;
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
  // isSelectMultiple() {
  //   this.selectMultiple = !this.selectMultiple;
  //   if (!this.selectMultiple) {
  //     this.numSelected = 0;
  //     this.selectedDatos = [];
  //   } else {
  //     this.selectAll = false;
  //     this.selectedDatos = [];
  //     this.numSelected = 0;
  //   }
  // }

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
      summary: "",
      detail: this.translateService.instant(mensaje)
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

    // this.cardService.searchNewAnnounce.next(null);
    //this.location.back();
    if (sessionStorage.getItem("esColegiado") == "true") {
      this.router.navigate(["/busquedaColegiados"]);
    } else if (sessionStorage.getItem("esColegiado") == "false") {
      this.router.navigate(["/busquedaNoColegiados"]);
    }
  }

  uploadFile(event: any) {
    console.log("Event", event);
    // guardamos la imagen en front para despues guardarla, siempre que tenga extension de imagen
    let fileList: FileList = event.target.files;

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

  // onChangeSelectAll(datos) {
  //   if (this.selectAll === true) {
  //     this.numSelected = datos.length;
  //     this.selectMultiple = false;
  //     this.selectedDatos = datos;
  //   } else {
  //     this.selectedDatos = [];
  //     this.numSelected = 0;
  //   }
  // }

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

  isValidDNI(dni: String): boolean {
    return (
      dni &&
      typeof dni === "string" &&
      /^[0-9]{8}([A-Za-z]{1})$/.test(dni) &&
      dni.substr(8, 9).toUpperCase() ===
        this.DNI_LETTERS.charAt(parseInt(dni.substr(0, 8), 10) % 23)
    );
  }

  activadoBotonesLetrado(){
    if(this.isLetrado){
      return true;
    }else{
      return this.camposDesactivados;
    }
  }

  ngOnDestroy() {}
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
    if (!this.esNewColegiado) {
      this.obtenerEtiquetasPersonaJuridicaConcreta();
      this.cargarImagen(this.idPersona);
      this.stringAComisiones();
      this.fechaNacimiento = this.generalBody.fechaNacimiento;
      this.fechaAlta = this.generalBody.incorporacion;
    }
    this.sigaServices.get("fichaPersona_tipoIdentificacionCombo").subscribe(
      n => {
        this.tipoIdentificacion = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );

    this.sigaServices.get("fichaColegialGenerales_tratamiento").subscribe(
      n => {
        this.generalTratamiento = n.combooItems;
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
    }
    this.obtenerPartidoJudicial();
  }

  closeDialogConfirmation(item) {
    this.checked = false;

    if (this.esNewColegiado) {
      // Borramos el residuo de la etiqueta
      this.autoComplete.multiInputEL.nativeElement.value = null;
    } else {
      // Borramos el residuo de la etiqueta vieja
      this.deleteLabel(item);
    }

    // Borramos las fechas
    this.item = new ComboEtiquetasItem();
    this.item.fechaInicio = null;
    this.item.fechaBaja = null;
  }

  validateFields() {
    if (
      this.item.fechaInicio != undefined &&
      this.item.fechaInicio != null &&
      this.item.fechaBaja != undefined &&
      this.item.fechaBaja != null &&
      this.validateFinalDate() == true
    ) {
      this.isTrue = true;
    } else {
      this.isTrue = false;
    }
  }

  aceptDialogConfirmation(item) {
    this.checked = false;

    if (this.esNewColegiado) {
      let newItem = new ComboEtiquetasItem();
      newItem = item;

      newItem.fechaInicio = this.datepipe.transform(
        newItem.fechaInicio,
        "dd/MM/yyyy"
      );
      newItem.fechaBaja = this.datepipe.transform(
        newItem.fechaBaja,
        "dd/MM/yyyy"
      );

      this.createItems.push(newItem);

      this.updateItems.set(newItem.idGrupo, newItem);

      // this.etiquetasPersonaJuridicaSelecionados.push(newItem);
      this.autoComplete.multiInputEL.nativeElement.value = null;
    } else {
      let oldItem = new ComboEtiquetasItem();
      oldItem = item;
      oldItem.fechaInicio = this.datepipe.transform(
        oldItem.fechaInicio,
        "dd/MM/yyyy"
      );
      oldItem.fechaBaja = this.datepipe.transform(
        oldItem.fechaBaja,
        "dd/MM/yyyy"
      );

      this.createItems.push(oldItem);

      this.updateItems.set(oldItem.idGrupo, oldItem);
    }

    // Dehabilitamos el guardar para los próximos
    this.isTrue = false;
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
              valorSeleccionados.idGrupo == valorMap.idGrupo ||
              valorSeleccionados.value == valorMap.idGrupo
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
            this.showFail();
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
          },
          error => {
            console.log(error);
            this.progressSpinner = false;
            this.activacionGuardarGenerales();
            this.showFail();
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
          this.showFail();
        }
        // EVENTO PARA ACTIVAR GUARDAR AL BORRAR UNA ETIQUETA
      );
  }

  comisionesAString() {
    if (this.comisiones == true) {
      this.generalBody.comisiones = "1";
    } else {
      this.generalBody.comisiones = "0";
    }
    if (this.guiaJudicial == true) {
      this.generalBody.guiaJudicial = "1";
    } else {
      this.generalBody.guiaJudicial = "0";
    }
    if (this.publicidad == true) {
      this.generalBody.publicidad = "1";
    } else {
      this.generalBody.publicidad = "0";
    }
  }

  stringAComisiones() {
    if (this.generalBody.comisiones == "1") {
      this.comisiones = true;
    } else {
      this.comisiones = false;
    }
    if (this.generalBody.publicidad == "1") {
      this.publicidad = true;
    } else {
      this.publicidad = false;
    }
    if (this.generalBody.guiaJudicial == "1") {
      this.guiaJudicial = true;
    } else {
      this.guiaJudicial = false;
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
    this.generalBody.etiquetas = this.etiquetasPersonaJuridicaSelecionados;
    if (
      JSON.stringify(this.checkGeneralBody) != JSON.stringify(this.generalBody)
    ) {
      if (
        // this.isValidDNI(this.generalBody.nif) &&
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
    // console.log(new Date(event));
    var hoy = new Date();
    var cumpleanos = new Date(event); //

    // var cumpleanos = new Date(fecha);
    var edad = hoy.getFullYear() - cumpleanos.getFullYear();
    var m = hoy.getMonth() - cumpleanos.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
      edad--;
    }

    this.edadCalculada = edad;
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
    }
  }

  //FOTOGRAFIA
  uploadImage(event: any) {
    // guardamos la imagen en front para despues guardarla, siempre que tenga extension de imagen
    let fileList: FileList = event.target.files;

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
      this.existeImagen = true;
      let urlCreator = window.URL;
      this.imagenPersona = this.sanitizer.bypassSecurityTrustUrl(
        urlCreator.createObjectURL(this.file)
      );
    }
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
          this.cargarImagen(this.idPersona);
          this.progressSpinner = false;
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
        this.autocompletar = true;
      }
    }
  }

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
  // onKeyUp(event) {
  //   if (event.keyCode == 13) {
  //     if (this.control) {
  //       this.checked = true;
  //       // this.dialog.closable = false;
  //       // Variable controladora
  //       this.isCrear = true;
  //       // Variable controlador del deshabilitar fechas
  //       //  this.calendar.readonlyInput = false;
  //       this.historico = false;
  //       // Rellenamos el objeto nuevo
  //       this.item = new ComboEtiquetasItem();
  //       this.item.idGrupo = "";
  //       this.item.label = event.srcElement.value;
  //       this.mensaje = this.translateService.instant(
  //         "censo.datosGenerales.literal.crearEtiqueta"
  //       );
  //     }
  //   }
  // }

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

  // Evento para detectar una etiqueta existente
  onSelect(event) {
    this.activacionGuardarGenerales();
    if (event) {
      if (this.isNotContains(event)) {
        this.checked = true;
        // this.dialog.closable = false;

        // Variable controladora

        // Variable controlador del deshabilitar fechas
        this.historico = false;

        // Rellenamos los valores de la etiqueta
        this.item = new ComboEtiquetasItem();
        this.item.idGrupo = event.value;
        this.item.label = event.label;

        this.mensaje = this.translateService.instant(
          "censo.datosGenerales.literal.asociarEtiqueta"
        );
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

  onClick(event, value) {
    this.activacionGuardarGenerales();
    if (event) {
      this.checked = true;
      // this.dialog.closable = true;

      this.item = new ComboEtiquetasItem();
      this.item.fechaInicio = value.fechaInicio;
      this.item.fechaBaja = value.fechaBaja;

      this.mensaje = "Histórico de fechas";

      this.historico = true;

      // this.calendar.readonlyInput = true;
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

  inscritoAItem(){
    if (this.inscritoSeleccionado == "01"){
      this.colegialesBody.situacionresidente = "0";
      this.colegialesBody.comunitario = "1";
    }else if (this.inscritoSeleccionado == "10"){
      this.colegialesBody.situacionresidente = "1";
      this.colegialesBody.comunitario = "0";
    }else if (this.inscritoSeleccionado == "11"){
      this.colegialesBody.situacionresidente = "1";
      this.colegialesBody.comunitario = "1";
    }else{
      this.colegialesBody.situacionresidente = "0";
      this.colegialesBody.comunitario = "0";
    }
  }

  itemAInscrito(){
    if(this.colegialesBody.situacionresidente != undefined){
      this.inscritoSeleccionado = (this.colegialesBody.situacionresidente.toString() +""+ this.colegialesBody.comunitario.toString());
    }
  }

  activacionGuardarColegiales(){
    this.inscritoAItem();
    if (
      JSON.stringify(this.checkColegialesBody) != JSON.stringify(this.colegialesBody) 
    ) {
      this.activarGuardarColegiales = true;
    } else {
      this.activarGuardarColegiales = false;
    }
  }

  pasarFechas(){
    this.colegialesBody.incorporacionDate = this.arreglarFecha(this.colegialesBody.incorporacion);
    this.colegialesBody.fechapresentacionDate = this.arreglarFecha(this.colegialesBody.fechapresentacion);
    this.colegialesBody.fechaTitulacionDate = this.arreglarFecha(this.colegialesBody.fechaTitulacion);
    this.colegialesBody.fechaJuraDate = this.arreglarFecha(this.colegialesBody.fechaJura);
  }
  
  numMutualistaCheck(){
    this.activacionGuardarColegiales();
    if (
      Number(this.colegialesBody.nMutualista)
    ) {
      return true;
    } else{
      this.colegialesBody.nMutualista = "";
      return false;
    }
  }

  guardarColegiales(){
    // Meter datos colegiales aquí para guardar y probar.
    this.inscritoAItem();
    this.pasarFechas();
    this.sigaServices
    .post("fichaDatosColegiales_datosColegialesUpdate", this.colegialesBody)
    .subscribe(
      data => {
        this.checkColegialesBody = new FichaColegialColegialesItem();

        this.checkColegialesBody = JSON.parse(
          JSON.stringify(this.colegialesBody)
        );
        this.activacionGuardarColegiales();
        // this.body = JSON.parse(data["body"]);
        this.obtenerEtiquetasPersonaJuridicaConcreta();
        this.progressSpinner = false;
        this.showSuccess();
        this.onInitColegiales();
      },
      error => {
        console.log(error);
        this.progressSpinner = false;
        this.activacionGuardarGenerales();
        this.showFail();
      }
      // EVENTO PARA ACTIVAR GUARDAR AL BORRAR UNA ETIQUETA
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
  }

  restablecerColegiales() {
    this.colegialesBody = JSON.parse(JSON.stringify(this.checkColegialesBody));
    // this.colegialesBody = this.colegialesBody[0];
    this.itemAInscrito();
    this.checkColegialesBody = new FichaColegialColegialesItem();

    this.checkColegialesBody = JSON.parse(
      JSON.stringify(this.colegialesBody)
    );

    this.activacionGuardarColegiales();
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
        },
        err => {
          console.log(err);
        }
      );
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
        this.idPersona
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

  redireccionarCerts(selectedDatos) {
    this.router.navigate(["/mantenimientoCertificados"]);
  }

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
    if (this.table != undefined) {
      this.table.sortField = this.sortF;
      //this.table.sortOrder = this.sortO;
    }

    // this.table.sortMultiple();
  }

  deleteCurriculares() {
    for (let i in this.datosCurriculares) {
      if (this.datosCurriculares[i].fechaHasta == null) {
        this.sigaServices
          .post("fichaDatosCurriculares_delete", this.datosCurriculares[i])
          .subscribe(
            data => {
              this.progressSpinner = false;
              this.searchDatosCurriculares();
            },
            err => {
              console.log(err);
            },
            () => {
              this.progressSpinner = false;
              this.editar = false;
            }
          );
      }
    }
  }
 
  redireccionarCurriculares(dato) {
    if (dato && dato.length < 2 && !this.selectMultiple) {
      // enviarDatos = dato[0];
      sessionStorage.setItem("curriculo", JSON.stringify(dato));
      sessionStorage.setItem("crearCurriculo", "false");
      this.router.navigate(["/edicionCurriculares"]);
    } else {
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
    sessionStorage.setItem("nuevoCurriculo", "true");
    sessionStorage.setItem("idPersona", JSON.stringify(this.idPersona));
    this.router.navigate(["/edicionCurriculares"]);
  }
  searchDatosCurriculares() {
    let bodyCurricular = {
      idPersona: this.idPersona
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
          console.log(err);
        }
      );
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
          this.table.paginator = true;
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        },
        () => {}
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
      this.numSelected = 0;
      this.selectedDatosDirecciones = [];
    } else {
      this.selectAllDirecciones = false;
      this.selectedDatosDirecciones = [];
      this.numSelected = 0;
    }
  }

  onChangeSelectAllDirecciones(datos) {
    if (this.selectAll === true) {
      this.numSelected = datos.length;
      this.selectMultipleDirecciones = false;
      this.selectedDatosDirecciones = datos;
    } else {
      this.selectedDatosDirecciones = [];
      this.numSelected = 0;
    }
  }

  borrarSelectedDatos(selectedItem) {
    this.progressSpinner = true;
    let deleteDirecciones = new DatosDireccionesObject();
    deleteDirecciones.datosDireccionesItem = selectedItem;
    let datosDelete = [];
    selectedItem.forEach((value: DatosDireccionesItem, key: number) => {
      value.idPersona = this.idPersona;
      datosDelete.push(value);
    });

    this.sigaServices.post("direcciones_remove", datosDelete).subscribe(
      data => {
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      },
      () => {
        this.progressSpinner = false;
        this.editar = false;
        // this.dniCorrecto = null;
        // this.disabledRadio = false;
        this.selectMultipleDirecciones = false;
        this.searchDirecciones();
      }
    );
  }

  actualizaSeleccionadosDirecciones(selectedDatos) {
    this.numSelectedDirecciones = selectedDatos.length;
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
            this.progressSpinner = false;
          },
          err => {
            console.log(err);
          },
          () => {}
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
      JSON.stringify(this.bodyDirecciones.idPersona)
    );
    sessionStorage.setItem("editarDireccion", "false");
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

  onChangeSelectAllBancarios(datos) {
    if (this.selectAll === true) {
      this.numSelected = datos.length;
      this.selectMultipleBancarios = false;
      this.selectedDatosBancarios = datos;
    } else {
      this.selectedDatosBancarios = [];
      this.numSelected = 0;
    }
  }

  isSelectMultipleBancarios() {
    this.selectMultipleBancarios = !this.selectMultipleBancarios;
    if (!this.selectMultipleBancarios) {
      this.numSelected = 0;
      this.selectedDatosBancarios = [];
    } else {
      this.selectAllBancarios = false;
      this.selectedDatosBancarios = [];
      this.numSelected = 0;
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
        this.searchDatosBancarios();
      }
    );
  }

  searchDatosBancarios() {
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
            JSON.stringify(this.searchDatosBancariosIdPersona.error.description)
          );
          console.log(error);
          this.progressSpinner = false;
        }
      );
  }

  redireccionarDatosBancarios(dato) {
    if (this.camposDesactivados != true) {
      if (!this.selectMultipleBancarios) {
        var enviarDatos = null;
        if (dato && dato.length > 0) {
          enviarDatos = dato[0];
          sessionStorage.setItem("idCuenta", dato[0].idCuenta);
          sessionStorage.setItem("idPersona", this.idPersona);
          sessionStorage.setItem("editar", "true");
          sessionStorage.setItem("fichaColegial", "true");
          sessionStorage.setItem("datosCuenta", JSON.stringify(dato[0]));
          sessionStorage.setItem(
            "usuarioBody",JSON.stringify(dato[0])
          );
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

  // irFacturacion() {
  //   // this.router.navigate(["/facturas"]);   /SIGA/CEN_Facturacion.do?idInstitucion=2005& idPersona=-1& accion=ver& tipoAcceso=8  
  //   let idInstitucion = this.generalBody.idPersona.substr(0,4);
  //   let url = (this.sigaServices.getNewSigaUrl() + "SIGA/CEN_Facturacion.do?idInstitucion="+idInstitucion+"&idPersona="+this.generalBody.idPersona+"&accion=ver&tipoAcceso=8");
  //   window.open(url, "_blank", "menubar=1,resizable=1,width=1550,height=850, left=180");
  // }
  // irAuditoria() {
  //   // this.router.navigate(["/auditoriaUsuarios"]);
  //   // sessionStorage.setItem("tarjeta", "/fichaPersonaJuridica");  /SIGA/CEN_Historico.do?idInstitucion=2005& idPersona=-1& accion=ver& tipoAcceso=8
  //   let idInstitucion = this.generalBody.idPersona.substr(0,4);
  //   let url = (this.sigaServices.getNewSigaUrl() + "SIGA/CEN_Historico.do?idInstitucion="+idInstitucion+"&idPersona="+this.generalBody.idPersona+"&accion=ver&tipoAcceso=8");
  //   window.open(url, "_blank", "menubar=1,resizable=1,width=1550,height=850, left=180");
  // }
  // irComunicaciones() {
  //   // this.router.navigate(["/informesGenericos"]);             /SIGA/CEN_Comunicaciones.do?idInstitucion=2005& idPersona=-1& accion=ver& tipoAcceso=8  
  //   let idInstitucion = this.generalBody.idPersona.substr(0,4);
  //   let url = (this.sigaServices.getNewSigaUrl() + "SIGA/CEN_Comunicaciones.do?idInstitucion="+idInstitucion+"&idPersona="+this.generalBody.idPersona+"&accion=ver&tipoAcceso=8");
  //   window.open(url, "_blank", "menubar=1,resizable=1,width=1550,height=850, left=180");
  // }

  // irExpedientes() {
  //   // this.router.navigate(["/tiposExpedientes"]);
  //   let idInstitucion = this.generalBody.idPersona.substr(0,4);
  //   let url = (this.sigaServices.getNewSigaUrl() + "SIGA/CEN_Expedientes.do?idInstitucion="+idInstitucion+"&idPersona="+this.generalBody.idPersona+"&accion=ver&tipoAcceso=8");
  //   window.open(url, "_blank", "menubar=1,resizable=1,width=1550,height=850, left=180");
  // }

  // irTurnoOficio() {
  //   // this.router.navigate(["/tiposExpedientes"]);
  //   let idInstitucion = this.generalBody.idPersona.substr(0,4);
  //   let url = (this.sigaServices.getNewSigaUrl() + "SIGA/JGR_DefinirTurnosLetrado.do?&idInstitucionPestanha="+idInstitucion+"&idPersonaPestanha="+this.generalBody.idPersona+"");
  //   window.open(url, "_blank", "menubar=1,resizable=1,width=1550,height=850, left=180");

  // }
  
  // irRegTel() {
  //   // this.router.navigate(["/tiposExpedientes"]);
  //   let idInstitucion = this.generalBody.idPersona.substr(0,4);
  //   let url = (this.sigaServices.getNewSigaUrl() + "SIGA/CEN_Censo_DocumentacionRegTel.do?idInstitucion="+idInstitucion+"&idPersona="+this.generalBody.idPersona+"&accion=ver&tipoAcceso=8");
  //   window.open(url, "_blank", "menubar=1,resizable=1,width=1550,height=850, left=180");

  // }

  cerrarServicios(){
    this.displayServicios = false;
  }

  irFacturacion() {
    // this.router.navigate(["/facturas"]);   /SIGA/CEN_Facturacion.do?idInstitucion=2005& idPersona=-1& accion=ver& tipoAcceso=8  
    let idInstitucion = this.generalBody.idPersona.substr(0,4);
    this.url = (this.sigaServices.getNewSigaUrl() + "SIGA/CEN_Facturacion.do?idInstitucion="+idInstitucion+"&idPersona="+this.generalBody.idPersona+"&accion=ver&tipoAcceso=8");
    // window.open(url, "_blank", "menubar=1,resizable=1,width=1550,height=850, left=180");
    this.displayServicios = true;
  }
  irAuditoria() {
    // this.router.navigate(["/auditoriaUsuarios"]);
    // sessionStorage.setItem("tarjeta", "/fichaPersonaJuridica");  /SIGA/CEN_Historico.do?idInstitucion=2005& idPersona=-1& accion=ver& tipoAcceso=8
    let idInstitucion = this.generalBody.idPersona.substr(0,4);
    this.url = (this.sigaServices.getNewSigaUrl() + "SIGA/CEN_Historico.do?idInstitucion="+idInstitucion+"&idPersona="+this.generalBody.idPersona+"&accion=ver&tipoAcceso=8");
    // window.open(url, "_blank", "menubar=1,resizable=1,width=1550,height=850, left=180");
    this.displayServicios = true;
  }
  irComunicaciones() {
    // this.router.navigate(["/informesGenericos"]);             /SIGA/CEN_Comunicaciones.do?idInstitucion=2005& idPersona=-1& accion=ver& tipoAcceso=8  
    let idInstitucion = this.generalBody.idPersona.substr(0,4);
    this.url = (this.sigaServices.getNewSigaUrl() + "SIGA/CEN_Comunicaciones.do?idInstitucion="+idInstitucion+"&idPersona="+this.generalBody.idPersona+"&accion=ver&tipoAcceso=8");
    // window.open(url, "_blank", "menubar=1,resizable=1,width=1550,height=850, left=180");
    this.displayServicios = true;
  }

  irExpedientes() {
    // this.router.navigate(["/tiposExpedientes"]);
    let idInstitucion = this.generalBody.idPersona.substr(0,4);
    this.url = (this.sigaServices.getNewSigaUrl() + "SIGA/CEN_Expedientes.do?idInstitucion="+idInstitucion+"&idPersona="+this.generalBody.idPersona+"&accion=ver&tipoAcceso=8");
    // window.open(url, "_blank", "menubar=1,resizable=1,width=1550,height=850, left=180");
    this.displayServicios = true;
  }

  irTurnoOficio() {
    // this.router.navigate(["/tiposExpedientes"]);
    let idInstitucion = this.generalBody.idPersona.substr(0,4);
    this.url = (this.sigaServices.getNewSigaUrl() + "SIGA/JGR_DefinirTurnosLetrado.do?&idInstitucionPestanha="+idInstitucion+"&idPersonaPestanha="+this.generalBody.idPersona+"");
    // window.open(url, "_blank", "menubar=1,resizable=1,width=1550,height=850, left=180");
    this.displayServicios = true;
  }
  
  irRegTel() {
    // this.router.navigate(["/tiposExpedientes"]);
    let idInstitucion = this.generalBody.idPersona.substr(0,4);
    this.url = (this.sigaServices.getNewSigaUrl() + "SIGA/CEN_Censo_DocumentacionRegTel.do?idInstitucion="+idInstitucion+"&idPersona="+this.generalBody.idPersona+"&accion=ver&tipoAcceso=8");
    // window.open(url, "_blank", "menubar=1,resizable=1,width=1550,height=850, left=180");
    this.displayServicios = true;
  }

  // FIN MÉTODOS PARA SERVICIOS DE INTERÉS
}
