import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  AfterViewInit
} from "@angular/core";
import { esCalendar } from "../../../utils/calendar";
import { Location } from "@angular/common";
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
  colegialesBody: FichaColegialColegialesItem = new FichaColegialColegialesItem();
  //sociedadesBody: FichaColegialColegialesObject = new FichaColegialColegialesObject();
  sociedadesBody: PersonaJuridicaObject = new PersonaJuridicaObject();
  otrasColegiacionesBody: DatosColegiadosObject = new DatosColegiadosObject();
 

  idPersona: any;
  openFicha: boolean = false;
  es: any = esCalendar;
  progressSpinner: boolean = false;
  editar: boolean = false;
  blockCrear: boolean = true;
  activarGuardarGenerales: boolean = false;
  selectAll: boolean = false;
  selectMultiple: boolean = false;

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
  activacionEditar: boolean = false;
  selectedItem: number = 10;
  camposDesactivados: boolean = false;
  datos: any[];
  datosCurriculares: any[];

  bodyDirecciones: DatosDireccionesItem;
  bodyDatosBancarios: DatosBancariosItem;
  datosDirecciones: DatosDireccionesItem[];
  datosBancarios: DatosBancariosItem[];
  searchDireccionIdPersona = new DatosDireccionesObject();
  searchDatosBancariosIdPersona = new DatosBancariosObject();

  datosColegiales: any[];
  datosColegiaciones: any[];
  datosCertificados: any[];
  datosSociedades: any[];
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

  esNewColegiado: boolean = false;
  esColegiado: boolean;
  archivoDisponible: boolean = false;
  existeImagen: boolean = false;
  imagenPersona: any;

  // comboSexo: any[];

  @ViewChild("table")
  table: DataTable;
  selectedDatos;

  comboSexo = [
    { label: "", value: null },
    { label: "Hombre", value: "H" },
    { label: "Mujer", value: "M" }
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
    private router: Router
  ) {}

  ngOnInit() {
    // Cogemos los datos de la busqueda de Colegiados
    if (
      sessionStorage.getItem("personaBody") != null &&
      sessionStorage.getItem("personaBody") != undefined &&
      JSON.parse(sessionStorage.getItem("esNuevoNoColegiado")) != true
    ) {
      this.generalBody = new FichaColegialGeneralesItem();
      this.generalBody = JSON.parse(sessionStorage.getItem("personaBody"));
      this.generalBody = this.generalBody[0];
      this.checkGeneralBody = new FichaColegialGeneralesItem();
      this.checkGeneralBody = JSON.parse(sessionStorage.getItem("personaBody"));
      this.checkGeneralBody = this.checkGeneralBody[0];
      this.colegialesBody = JSON.parse(sessionStorage.getItem("personaBody"));
      this.colegialesBody = this.colegialesBody[0];
      this.idPersona = this.generalBody.idPersona;
      this.esColegiado = JSON.parse(sessionStorage.getItem("esColegiado"));
      this.generalBody.colegiado = this.esColegiado;
      this.checkAcceso();
      this.onInitGenerales();
      this.onInitCurriculares();
      this.onInitColegiales();
      this.onInitSociedades();
      this.onInitOtrasColegiaciones();
    } else {
      sessionStorage.removeItem("esNuevoNoColegiado");
      this.generalBody = new FichaColegialGeneralesItem();
      this.colegialesBody = new FichaColegialColegialesItem();
      // this.searchDatosBancariosIdPersona.datosBancariosItem[0] = new DatosBancariosItem();
    }
    if (JSON.parse(sessionStorage.getItem("esNuevoNoColegiado"))) {
      this.esNewColegiado = true;
    } else {
      this.esNewColegiado = false;
    }
    this.onInitCurriculares();

    this.onInitDirecciones();

    this.onInitDatosBancarios();

    this.onInitSociedades();

    this.onInitOtrasColegiaciones();

    // RELLENAMOS LOS ARRAY PARA LAS CABECERAS DE LAS TABLAS
    this.colsColegiales = [
      {
        field: "fecha",
        header: "censo.consultaDatosGenerales.literal.fechaIncorporacion"
      },
      {
        field: "Estado",
        header: "censo.fichaIntegrantes.literal.estado"
      },
      {
        field: "Residente",
        header: "censo.ws.literal.residente"
      },
      {
        field: "Observaciones",
        header: "gratuita.mantenimientoLG.literal.observaciones"
      }
    ];

    this.colsColegiaciones = [
      {
        field: "numIdentificacion",
        header: "censo.consultaDatosColegiacion.literal.numIden"
      },
      {
        field: "nombreApellidos",
        header: "administracion.usuarios.literal.nombre"
      },
      {
        field: "numColegiado",
        header: "censo.busquedaClientesAvanzada.literal.nColegiado"
      },
      {
        field: "estado",
        header: "censo.fichaIntegrantes.literal.estado"
      },
      {
        field: "residente",
        header: "censo.ws.literal.residente"
      },
      {
        field: "fNacimiento",
        header: "censo.consultaDatosColegiacion.literal.fechaNac"
      },
      {
        field: "correoElectronico",
        header: "censo.datosDireccion.literal.correo"
      },
      {
        field: "telFijo",
        header: "censo.datosDireccion.literal.telefonoFijo"
      },
      {
        field: "telMovil",
        header: "censo.datosDireccion.literal.telefonoMovil"
      }
    ];

    this.colsCertificados = [
      {
        field: "numCertificado",
        header: "menu.certificados"
      },
      {
        field: "descripcion",
        header: "general.description"
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
        field: "fechaInicio",
        header: "facturacion.seriesFacturacion.literal.fInicio"
      },
      {
        field: "fechaFin",
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

  // PENDIENTE AÑADIR IDPROCESO PROPIO DE FICHA COLEGIAL
  checkAcceso() {
    let controlAcceso = new ControlAccesoDto();
    controlAcceso.idProceso = "120";
    let derechoAcceso;
    this.sigaServices.post("acces_control", controlAcceso).subscribe(
      data => {
        let permisosTree = JSON.parse(data.body);
        let permisosArray = permisosTree.permisoItems;
        derechoAcceso = permisosArray[0].derechoacceso;
      },
      err => {
        console.log(err);
      },
      () => {
        if (derechoAcceso >= 2) {
          this.activacionEditar = true;
          if (derechoAcceso == 2) {
            this.camposDesactivados = true;
          }
        } else {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
          this.router.navigate(["/errorAcceso"]);
        }
      }
    );
  }

  // MÉTODOS GENÉRICOS PARA TABLAS Y USOS VARIOS

  isSelectMultiple() {
    this.selectMultiple = !this.selectMultiple;
    if (!this.selectMultiple) {
      this.numSelected = 0;
      this.selectedDatos = [];
    } else {
      this.selectAll = false;
      this.selectedDatos = [];
      this.numSelected = 0;
    }
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

  onChangeSelectAll(datos) {
    if (this.selectAll === true) {
      this.numSelected = datos.length;
      this.selectMultiple = false;
      this.selectedDatos = datos;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
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

  isValidDNI(dni: String): boolean {
    return (
      dni &&
      typeof dni === "string" &&
      /^[0-9]{8}([A-Za-z]{1})$/.test(dni) &&
      dni.substr(8, 9).toUpperCase() ===
        this.DNI_LETTERS.charAt(parseInt(dni.substr(0, 8), 10) % 23)
    );
  }

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
    this.cargarImagen(this.idPersona);
    this.stringAComisiones();
    this.fechaNacimiento = this.generalBody.fechaNacimiento;
    this.fechaAlta = this.generalBody.incorporacion;
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
  }

  // getComboSexo() {
  //   this.comboSexo = [
  //     { label: "", value: null },
  //     { label: "Hombre", value: "H" },
  //     { label: "Mujer", value: "M" }
  //   ];
  // }

  generalesGuardar() {
    this.progressSpinner = true;
    this.generalBody.nombre = this.generalBody.soloNombre;
    this.generalBody.colegiado = this.esColegiado;
    this.checkGeneralBody.colegiado = this.esColegiado;
    this.arreglarFechas();
    this.comisionesAString();
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

          this.checkGeneralBody = JSON.parse(JSON.stringify(this.generalBody));

          if (this.file != undefined) {
            this.guardarImagen(this.idPersona);
          }
          this.activacionGuardarGenerales();
          // this.body = JSON.parse(data["body"]);
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

  comisionesAString() {
    if (this.comisiones == true) {
      this.generalBody.comisiones = "1";
    } else {
      this.generalBody.comisiones = "0";
    }
  }

  stringAComisiones() {
    if (this.generalBody.comisiones == "1") {
      this.comisiones = true;
    } else {
      this.comisiones = false;
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
    if (
      JSON.stringify(this.checkGeneralBody) != JSON.stringify(this.generalBody)
    ) {
      if (
        ((this.isValidDNI(this.generalBody.nif) || this.esColegiado == false) &&
          this.generalBody.nif != undefined &&
          this.generalBody.idTipoIdentificacion != undefined &&
          this.generalBody.soloNombre != undefined &&
          this.generalBody.apellidos1 != undefined &&
          this.generalBody.idTratamiento != null &&
          this.generalBody.asientoContable != null &&
          this.generalBody.idLenguaje != "") ||
        this.generalBody.idLenguaje == null
      ) {
        this.activarGuardarGenerales = true;
      } else {
        this.activarGuardarGenerales = false;
      }
    } else {
      this.activarGuardarGenerales = false;
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
    this.cargarImagen(this.idPersona);
    // this.generalBody = this.checkGeneralBody;
    this.activacionGuardarGenerales();
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
  onInitColegiales() {
    this.sigaServices.get("fichaDatosColegiales_tipoSeguro").subscribe(
      n => {
        this.comboTipoSeguro = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );
  }
  restablecerColegiales() {
    this.colegialesBody = JSON.parse(sessionStorage.getItem("personaBody"));
    this.colegialesBody = this.colegialesBody[0];
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
          this.datosColegiales = this.otrasColegiacionesBody.colegiadoItem;
          this.table.paginator = true;
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
          this.table.paginator = true;
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        }
      );
  }

  redireccionar(datos) {
    sessionStorage.setItem("busqueda", JSON.stringify(datos));
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
  onInitCurriculares() {
    this.searchDatosCurriculares();
  }

  irNuevoCurriculares() {
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
  // MÉTODOS PARA DIRECCIONES
  activarPaginacionDireciones() {
    if (!this.datosDirecciones || this.datosDirecciones.length == 0)
      return false;
    else return true;
  }

  onInitDirecciones() {
    this.bodyDirecciones = new DatosDireccionesItem();
    this.bodyDirecciones.idPersona = this.idPersona;
    this.bodyDirecciones.historico = false;
    this.searchDirecciones();
  }

  searchDirecciones() {
    this.selectMultiple = false;
    this.selectedDatos = "";
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
    sessionStorage.setItem("editarDireccion", "false");
    this.router.navigate(["/consultarDatosDirecciones"]);
  }

  redireccionarDireccion(dato) {
    if (this.camposDesactivados != true) {
      if (!this.selectMultiple) {
        if (dato[0].fechaBaja != null) {
          sessionStorage.setItem("historicoDir", "true");
        }
        var enviarDatos = null;
        if (dato && dato.length > 0) {
          enviarDatos = dato[0];
          sessionStorage.setItem("idDireccion", enviarDatos.idDireccion);
          sessionStorage.setItem("direccion", JSON.stringify(enviarDatos));
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
        this.numSelected = this.selectedDatos.length;
        sessionStorage.removeItem("esColegiado");
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

  onInitDatosBancarios() {
    this.bodyDatosBancarios = new DatosBancariosItem();
    this.bodyDatosBancarios.idPersona = this.idPersona;
    this.bodyDatosBancarios.historico = false;
    this.searchDatosBancarios();
  }

  searchDatosBancarios() {
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
      if (!this.selectMultiple) {
        var enviarDatos = null;
        if (dato && dato.length > 0) {
          enviarDatos = dato[0];
          sessionStorage.setItem("idCuenta", enviarDatos.idCuenta);
          sessionStorage.setItem("editar", "true");
          sessionStorage.setItem("datosCuenta", JSON.stringify(enviarDatos));
          sessionStorage.setItem(
            "usuarioBody",
            sessionStorage.getItem("personaBody")
          );
        } else {
          sessionStorage.setItem("editar", "false");
        }

        this.router.navigate(["/consultarDatosBancarios"]);
      } else {
        this.numSelected = this.selectedDatos.length;
      }
    }
  }

  nuevaCuentaBancaria() {
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
    this.router.navigate(["/facturas"]);
  }
  irAuditoria() {
    this.router.navigate(["/auditoriaUsuarios"]);
    sessionStorage.setItem("tarjeta", "/fichaPersonaJuridica");
  }
  irComunicaciones() {
    this.router.navigate(["/informesGenericos"]);
  }

  // FIN MÉTODOS PARA SERVICIOS DE INTERÉS
}
