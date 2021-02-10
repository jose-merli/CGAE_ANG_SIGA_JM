import { Location } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation, ElementRef, Renderer, Input } from "@angular/core";
import { saveAs } from "file-saver/FileSaver";
import { DomSanitizer } from "../../../../../node_modules/@angular/platform-browser";
import { Router } from "../../../../../node_modules/@angular/router";
import { ConfirmationService } from "../../../../../node_modules/primeng/api";
import { AutoComplete, Dropdown } from "../../../../../node_modules/primeng/primeng";
import { TranslateService } from "../../../commons/translate";
import { CargaMasivaInscripcionObject } from "../../../models/CargaMasivaInscripcionObject";
import { DatosCursosItem } from "../../../models/DatosCursosItem";
import { DatosCursosObject } from "../../../models/DatosCursosObject";
import { DatosInscripcionItem } from "../../../models/DatosInscripcionItem";
import { ErrorItem } from "../../../models/ErrorItem";
import { FormadorCursoItem } from "../../../models/FormadorCursoItem";
import { FormadorCursoObject } from "../../../models/FormadorCursoObject";
import { esCalendar } from "../../../utils/calendar";
import { AuthenticationService } from "../../../_services/authentication.service";
import { SigaServices } from "../../../_services/siga.service";
import { CertificadoCursoItem } from "../../../models/CertificadoCursoItem";
import { CertificadoCursoObject } from "../../../models/CertificadoCursoObject";
import { EventoObject } from "../../../models/EventoObject";
import { ControlAccesoDto } from "../../../models/ControlAccesoDto";
import * as moment from 'moment';
import { EditorModule, EditorComponent } from '@tinymce/tinymce-angular';
import { CommonsService } from '../../../_services/commons.service';

@Component({
  selector: "app-ficha-curso",
  templateUrl: "./ficha-curso.component.html",
  styleUrls: ["./ficha-curso.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class FichaCursoComponent implements OnInit {
  iconoTarjetaResumen = "clipboard";
  openFicha;
  fichasPosibles = [];
  msgs;
  results;
  es: any = esCalendar;
  marginPx = "4px";
  bw = "white";
  isLetrado;

  modoEdicion: boolean = false;
  fieldNoEditable: boolean = true;
  progressSpinner: boolean = false;
  curso: DatosCursosItem = new DatosCursosItem();
  initCurso: DatosCursosItem;
  hoy: Date = new Date();

  // COMBOS
  comboVisibilidad: any[];
  comboColegios: any[];
  comboEstados: any[];
  comboDisponibilidadPlazas: any[];

  //Generales
  backgroundColor;

  //para deshabilitar combo de visibilidad
  deshabilitarCombVis: boolean = false;

  //para deshabilitar combo de colegios
  deshabilitarCombCol: boolean = false;

  //Precios
  @ViewChild("tablePrices")
  tablePrices;

  //Formadores
  @ViewChild("tableFormadores")
  tableFormadores;

  //Certificados
  @ViewChild("tableCertificates")
  tableCertificates;

  //Comunicaciones
  @ViewChild("tableNotifications")
  tableNotifications;

  //Sesiones
  @ViewChild("tableSessions")
  tableSessions;

  //Cargas
  @ViewChild("tableCargas")
  tableCargas;

  @ViewChild("pUploadFile")
  pUploadFile;

  //Colegios
  @ViewChild("colegio")
  colegio: Dropdown;

  //Certificate
  @ViewChild("dropdownCertificate")
  dropdownCertificate: Dropdown;

  @ViewChild("autocompleteService")
  autocompleteService: AutoComplete;

  @ViewChild("autocompleteTopics")
  autocompleteTopics: AutoComplete;

  @ViewChild("fechaInicioInscripcion")
  fechaInicioInscripcion;

  @ViewChild("fechaFinInscripcion")
  fechaFinInscripcion;

  @ViewChild("editor")
  editor: EditorComponent;

  @ViewChild("nombre")
  nombre: any;

  persistenciaFichaCurso;
  fechaFinInscripcionSelected: boolean = true;

  //Generales
  valorEstadoAbierto = "0";
  valorEstadoAnunciado = "1";
  valorEstadoCancelado = "5";
  valorEstadoFinalizado = "4";
  valorEstadoImpartido = "3";
  valorEstadoEnCurso = "2";
  valorTipoInicioIncripcion = "4";
  valorTipoFinIncripcion = "5";
  valorTipoSesion = "8";
  asignarTutor = 1;
  desasignarTutor = 0;
  comboTopics: any[] = [];
  comboService: any[] = [];
  // suggestService: any[] = [];
  suggestTopics: any[] = [];
  // resultsService: any[] = [];
  resultsTopics: any[] = [];
  edicionDocumentoAdjunto: boolean = true;
  edicionEncuestaSatisfaccion: boolean = true;
  edicionInformacionAdicional: boolean = true;

  //Precio
  colsPrices;
  selectedItemPrices;
  datosPrices = [];
  selectedDatosPrices = [];
  selectAllPrices: any;
  selectedPrices: number = 10;
  selectMultiplePrices: boolean = false;
  numSelectedPrices: number = 0;
  comboPrices;
  datosTarjetaResumen
  //Formadores
  colsFormadores;
  selectedItemFormadores;
  datosFormadores = [];
  selectedDatosFormadores;
  selectAllFormadores: any;
  selectedFormadores: number = 10;
  selectMultipleFormadores: boolean = false;
  numSelectedFormadores: number = 0;
  comboFormadores;
  rowsPerPage;
  editFormador: boolean = false;
  modoEdicionFormador: boolean = true;
  pressNewFormador: boolean = false;
  newFormadorCourse: FormadorCursoItem;
  comboRoles;
  comboTipoCoste;
  formadoresUpdate = [];
  numCheckedTutor: number = 0;
  datosFormadoresInit = [];
  changeTutor: boolean = false;
  //Sesiones
  sesionesExistentes: String = this.translateService.instant("formacion.fichaCurso.numero.sesiones") + ": 0";
  colsSessions;
  selectedItemSessions;
  datosSessions = [];
  selectedDatosSessions = [];
  selectAllSessions: any;
  selectedSessions: number = 10;
  selectMultipleSessions: boolean = false;
  numSelectedSessions: number = 0;
  comboSessions;

  //Inscripciones
  inscription: DatosInscripcionItem;

  //Certificados
  colsCertificates;
  selectedItemCertificates;
  datosCertificates = [];
  selectedDatosCertificates = [];
  selectAllCertificates: any;
  selectedCertificates: number = 10;
  selectMultipleCertificates: boolean = false;
  numSelectedCertificates: number = 0;
  comboCertificates;
  editCertificate: boolean = false;
  modoEdicionCertificate: boolean = true;
  pressNewCertificate: boolean = false;
  newCertificate: CertificadoCursoItem;
  comboCalificaciones;
  certificatesUpdate = [];
  enlacesTarjetaResumen;
  //Comunicaciones
  colsNotifications;
  selectedItemNotifications;
  datosNotifications = [];
  selectedDatosNotifications;
  selectAllNotifications: any;
  selectedNotifications: number = 10;
  selectMultipleNotifications: boolean = false;
  numSelectedNotifications: number = 0;
  comboNotifications;
  selectedItem: number = 10;
  //Cargas
  colsCargas;
  selectedItemCargas;
  datosCargas = [];
  selectedDatosCargas = [];
  selectAllCargas: any;
  selectedCargas: number = 10;
  selectMultipleCargas: boolean = false;
  numSelectedCargas: number = 0;
  comboCargas;
  archivoDisponible: boolean = false;
  existeArchivo: boolean = false;
  activacionEditar: boolean = true;
  otraInstitucion: boolean = false;
  file: File = undefined;
  apiKey: string = "";
  progressSpinner2: boolean = true;
  isCursoFinalizado: boolean = false;
  historico: boolean = false;

  editorConfig: any = {
    auto_focus: "nombre",
    selector: 'textarea',
    plugins: "autoresize pagebreak table save charmap media contextmenu paste directionality noneditable visualchars nonbreaking spellchecker template searchreplace lists link image insertdatetime textcolor code hr",
    toolbar: "newdocument | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify formatselect fontselect fontsizeselect | cut copy paste pastetext | searchreplace | bullist numlist | indent blockquote | undo redo | link unlink image code | insertdatetime preview | forecolor backcolor",
    menubar: false,
    autoresize_on_init: true,
    statusbar: false
  };

  resaltadoDatos: boolean = false;

  constructor(
    private sigaServices: SigaServices,
    private router: Router,
    private location: Location,
    private translateService: TranslateService,
    private confirmationService: ConfirmationService,
    private authenticationService: AuthenticationService,
    private changeDetectorRef: ChangeDetectorRef,
    private commonsService: CommonsService,
    private elRef: ElementRef, private renderer: Renderer,
  ) {

    window.scrollTo(0, 0);

  }

  ngOnInit() {
    this.resaltadoDatos = true;
    sessionStorage.removeItem("crearnuevo");
    sessionStorage.removeItem("pantallaFichaCurso");
    if (sessionStorage.getItem("tinyApiKey") != null) {
      this.apiKey = sessionStorage.getItem("tinyApiKey")
    }
    this.fichasPosibles = [
      {
        key: "generales",
        activa: true
      },
      {
        key: "descripcion",
        activa: false
      },
      {
        key: "formadores",
        activa: false
      },
      {
        key: "price",
        activa: false
      },
      {
        key: "certificate",
        activa: false
      },
      {
        key: "session",
        activa: false
      },
      {
        key: "carga",
        activa: false
      }
      
    ];
    this.getCombosDatosGenerales();
    this.getCombosFormadores();
    this.getColsResultsPrices();
    this.getColsResultsFormadores();
    this.getColsResultsSessions();
    this.getColsResultsCertificates();
    this.getColsResultsCargas();
    this.cleanSessionStorage();

    this.isLetrado = JSON.parse(sessionStorage.getItem("isLetrado"));

    if (this.isLetrado) {
      sessionStorage.setItem("disabledIsLetrado", "true");
    }

    this.inscription = new DatosInscripcionItem();

    //1.Proviene de la creacion evento Incripcion Inicio
    if (
      sessionStorage.getItem("isFormacionCalendarByStartInscripcion") == "true"
    ) {
      this.curso = new DatosCursosItem();
      this.curso = JSON.parse(sessionStorage.getItem("courseCurrent"));

      // this.resultsService = this.curso.tipoServicios;
      this.resultsTopics = this.curso.temasCombo;

      this.curso.idEventoInicioInscripcion = sessionStorage.getItem(
        "idEventoInicioInscripcion"
      );
      sessionStorage.removeItem("idEventoInicioInscripcion");
      sessionStorage.removeItem("isFormacionCalendarByStartInscripcion");

      if (this.curso.idCurso != null && this.curso.idCurso != undefined) {
        this.searchCourse(this.curso.idCurso);
        this.modoEdicion = true;
        this.getMassiveLoadInscriptions();
        this.getCertificatesCourse();
        this.getPrices();
      } else {
        //Si no se ha guardado el evento limpiamos la fecha introducida
        if (this.curso.idEventoInicioInscripcion == "undefined") {
          this.curso.fechaInscripcionDesdeDate = null;
        }
      }

      if (!this.modoEdicion) {
        this.curso.idEstado = this.valorEstadoAbierto;
      }

      sessionStorage.setItem("courseCurrent", JSON.stringify(this.curso));
      this.configurationInformacionAdicional();
      this.arreglarFechasEvento();
      this.progressSpinner = false;


      //2.Proviene de la creacion evento Incripcion Fin
    } else if (
      sessionStorage.getItem("isFormacionCalendarByEndInscripcion") == "true"
    ) {
      this.curso = new DatosCursosItem();
      this.curso = JSON.parse(sessionStorage.getItem("courseCurrent"));

      // this.resultsService = this.curso.tipoServicios;
      this.resultsTopics = this.curso.temasCombo;

      this.curso.idEventoFinInscripcion = sessionStorage.getItem(
        "idEventoFinInscripcion"
      );

      sessionStorage.removeItem("idEventoFinInscripcion");
      sessionStorage.removeItem("isFormacionCalendarByEndInscripcion");

      if (this.curso.idCurso != null && this.curso.idCurso != undefined) {
        this.searchCourse(this.curso.idCurso);
        this.modoEdicion = true;
        this.getCertificatesCourse();
        this.getMassiveLoadInscriptions();
        this.getPrices();
      } else {
        //Si no se ha guardado el evento limpiamos la fecha introducida
        if (this.curso.idEventoFinInscripcion == "undefined") {
          this.curso.fechaInscripcionHastaDate = null;
        }
        // this.progressSpinner2 = false;

      }

      if (!this.modoEdicion) {
        this.curso.idEstado = this.valorEstadoAbierto;
      }

      this.arreglarFechasEvento();
      this.configurationInformacionAdicional();
      this.progressSpinner = false;


      //3. Estamos en modo edicion
    } else if (sessionStorage.getItem("modoEdicionCurso") == "true") {
      this.modoEdicion = true;

      //4. Viene de la ficha de inscripcion
      if (sessionStorage.getItem("isInscripcion") == "true") {
        this.curso = new DatosCursosItem();
        this.curso.idCurso = JSON.parse(
          sessionStorage.getItem("codigoCursoInscripcion")
        );
        this.searchCourse(this.curso.idCurso);
        this.getMassiveLoadInscriptions();
        this.configurationInformacionAdicional();

        sessionStorage.removeItem("codigoCursoInscripcion");
        sessionStorage.removeItem("isInscripcion");
      } else if (sessionStorage.getItem("isSession") == "true") {
        this.curso.idCurso = JSON.parse(sessionStorage.getItem("idCurso"));
        sessionStorage.removeItem("idCurso");
        this.searchCourse(this.curso.idCurso);

        sessionStorage.removeItem("isSession");
      } else {
        this.curso = new DatosCursosItem();
        this.curso.idCurso = JSON.parse(
          sessionStorage.getItem("courseCurrent")
        ).idCurso;
        this.searchCourse(this.curso.idCurso);

        // if (this.curso.fechaImparticionDesde != null) {
        //   this.curso.fechaImparticionDesdeDate = this.arreglarFecha(
        //     this.curso.fechaImparticionDesde
        //   );
        // }

        // if (this.curso.fechaImparticionHasta != null) {
        //   this.curso.fechaImparticionHastaDate = this.arreglarFecha(
        //     this.curso.fechaImparticionHasta
        //   );
        // }

        // if (this.curso.fechaInscripcionDesdeDate != null) {
        //   let fecha = this.curso.fechaInscripcionDesdeDate;
        //   this.curso.fechaInscripcionDesdeDate = new Date(fecha);
        // }

        // if (this.curso.fechaInscripcionHastaDate != null) {
        //   let fecha = this.curso.fechaInscripcionHastaDate;
        //   this.curso.fechaInscripcionHastaDate = new Date(fecha);
        // }
      }

      if (this.curso.autovalidacionInscripcion == "1") {
        this.curso.autovalidacion = true;
      } else if (this.curso.autovalidacionInscripcion == "0") {
        this.curso.autovalidacion = false;
      }

      if (
        (sessionStorage.getItem("formador") != null ||
          sessionStorage.getItem("formador") != undefined) &&
        sessionStorage.getItem("toBackNewFormador") == "true"
      ) {
        this.abreCierraFicha('formadores');
        this.pressNewFormador = true;
        this.modoEdicionFormador = false;
        this.editFormador = true;
        this.loadNewTrainer(JSON.parse(sessionStorage.getItem("formador")));
        sessionStorage.removeItem("toBackNewFormador");
        let x = document.getElementById("Formadores");
        x.scrollIntoView({ behavior: "auto" });
      } else {
        this.getTrainers();
        sessionStorage.removeItem("toBackNewFormador");
      }

      this.getPrices();
      // this.getServicesCourse();
      this.getCertificatesCourse();
      this.getTopicsCourse();

      if (
        this.curso.idInstitucion != null ||
        this.curso.idInstitucion != undefined
      ) {
        this.getSessions();
      }

      this.getCountInscriptions();
      this.getMassiveLoadInscriptions();
      this.configurationInformacionAdicional();

      //5. Modo duplicar
    } else if (sessionStorage.getItem("duplicarCurso") == "true") {
      this.modoEdicion = false;
      this.curso = new DatosCursosItem();
      this.curso = JSON.parse(sessionStorage.getItem("courseCurrent"));
      this.curso.codigoCurso = undefined;
      this.curso.fechaInscripcionHastaDate = undefined;
      this.curso.fechaInscripcionDesdeDate = undefined;
      this.curso.fechaImparticionHastaDate = undefined;
      this.curso.fechaImparticionDesdeDate = undefined;
      this.curso.idEstado = this.valorEstadoAbierto;

      // this.resultsService = this.curso.tipoServicios;
      this.resultsTopics = this.curso.temasCombo;

      sessionStorage.removeItem("duplicarCurso");

      //6. Modo nuevo
    } else {
      this.modoEdicion = false;
      this.curso = new DatosCursosItem();
      //Obligamos a que sea el curso nuevo privado
      this.curso.idVisibilidad = "1";
      this.curso.idEstado = this.valorEstadoAbierto;
      let colegio = 1;
      this.onChangeSelectVisibilidadObligate(colegio);

    }

    if (sessionStorage.getItem("filtrosBusquedaCursos")) {
      sessionStorage.removeItem("filtrosBusquedaCursosFichaCursos");
      this.persistenciaFichaCurso = JSON.parse(
        sessionStorage.getItem("filtrosBusquedaCursos")
      );
    }
    this.enlacesTarjetaResumen = [
      {
        label: "general.message.datos.generales",
        value: document.getElementById("datosGen"),
        nombre: "generales",

      },
      {
        label: "administracion.parametrosGenerales.literal.descripcion",
        value: document.getElementById("descripcion"),
        nombre: "descripcion",

      },
      {
        label: "formacion.fichaCurso.tarjetaPrecios.precios",
        value: document.getElementById("precios"),
        nombre: "price",
      },
      {
        label: "agenda.fichaEventos.datosFormadores.cabecera",
        value: document.getElementById("formadores"),
        nombre: "formadores",

      },
      {
        label: "formacion.fichaCurso.inscripciones.cabecera",
        value: document.getElementById("inscripciones"),
        nombre: "inscription",

      },
      {
        label: "formacion.fichaInscripcion.datosCertificados.cabecera",
        value: document.getElementById("certificados"),
        nombre: "certificate",

      },
      {
        label: "formacion.fichaCursos.sesiones.cabecera",
        value: document.getElementById("sesiones"),
        nombre: "session",

      }, {
        label: "formacion.fichaCurso.cargaMasivaInscripciones.cabecera",
        value: document.getElementById("carga"),
        nombre: "carga",
      },
    ];

    console.log(this.editor);
    this.getNumTutor();
    this.checkAcceso();
    this.focusNombre(this.nombre);

  }

  ngAfterViewInit(): void {
    this.focusNombre(this.nombre);
  }


  focusNombre(inputNombre: ElementRef) {
    const input: HTMLInputElement = inputNombre.nativeElement as HTMLInputElement;
    input.focus();
    input.select();
    this.progressSpinner2 = false;
  }

  // Control Permisos
  checkAcceso() {
    let controlAcceso = new ControlAccesoDto();
    controlAcceso.idProceso = "20A";
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
        if (derechoAcceso == 3) {
          //permiso total
          this.activacionEditar = true;

          if (sessionStorage.getItem("isCancelado") == "true") {
            this.activacionEditar = false;
          }
          sessionStorage.setItem(
            "fichaCursoPermisos",
            JSON.stringify(this.activacionEditar)
          );

          if (sessionStorage.getItem("formador") != undefined) {
            let x = document.getElementById("fichaFormadores");
            x.scrollIntoView({ behavior: "smooth" });
            this.abreCierraFicha('formadores');
          }

        } else if (derechoAcceso == 2) {
          // solo lectura
          this.activacionEditar = false;
          sessionStorage.setItem(
            "fichaCursoPermisos",
            JSON.stringify(this.activacionEditar)
          );
        } else {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
          this.router.navigate(["/errorAcceso"]);
        }
        this.compruebaInstitucionCurso();
      }
    );
  }

  cleanSessionStorage() {
    sessionStorage.removeItem("isFormacionCalendar");
    sessionStorage.removeItem("fichaCursoPermisos");
    sessionStorage.removeItem("abrirFormador");
    sessionStorage.removeItem("cursoSelected");
    sessionStorage.removeItem("datosCertificatesInit");
    sessionStorage.removeItem("notificaciones");
    sessionStorage.removeItem("sessions");
    sessionStorage.removeItem("historico");
    sessionStorage.removeItem("evento");
  }

  //TARJETA DATOS GENERALES

  configurationInformacionAdicional() {
    if (
      this.curso.adjunto != null &&
      this.curso.adjunto != undefined &&
      this.curso.adjunto != ""
    ) {
      this.edicionDocumentoAdjunto = false;
    } else {
      this.edicionDocumentoAdjunto = true;
    }

    if (
      this.curso.adicional != null &&
      this.curso.adicional != undefined &&
      this.curso.adicional != ""
    ) {
      this.edicionInformacionAdicional = false;
    } else {
      this.edicionInformacionAdicional = true;
    }

    if (
      this.curso.encuesta != null &&
      this.curso.encuesta != undefined &&
      this.curso.encuesta != ""
    ) {
      this.edicionEncuestaSatisfaccion = false;
    } else {
      this.edicionEncuestaSatisfaccion = true;
    }

    this.progressSpinner = false;
  }

  getCombosDatosGenerales() {
    this.getComboEstados();
    this.getComboVisibilidad();
    this.getComboColegios();
    this.getComboTemas();
    this.getComboServicios();
  }

  getCombosFormadores() {
    this.getComboRoles();
    this.getComboTipoCoste();
  }

  arreglarFechasEvento() {
    if (this.curso.fechaImparticionDesdeDate != null) {
      this.curso.fechaImparticionDesdeDate = this.arreglarFecha(
        this.curso.fechaImparticionDesdeDate
      );
    }

    if (this.curso.fechaImparticionHastaDate != null) {
      this.curso.fechaImparticionHastaDate = this.arreglarFecha(
        this.curso.fechaImparticionHastaDate
      );
    }

    if (this.curso.fechaInscripcionDesdeDate != null) {
      let fecha = this.curso.fechaInscripcionDesdeDate;
      this.curso.fechaInscripcionDesdeDate = new Date(fecha);
    }

    if (this.curso.fechaInscripcionHastaDate != null) {
      let fecha = this.curso.fechaInscripcionHastaDate;
      this.curso.fechaInscripcionHastaDate = new Date(fecha);
    }

  }

  getComboVisibilidad() {
    // obtener visibilidad
    this.sigaServices.get("busquedaCursos_visibilidadCursos").subscribe(
      n => {
        this.comboVisibilidad = n.combooItems;
        this.arregloTildesCombo(this.comboVisibilidad);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboColegios() {
    // obtener colegios
    this.sigaServices.get("busquedaPer_colegio").subscribe(
      n => {
        this.comboColegios = n.combooItems;
        this.arregloTildesCombo(this.comboColegios);
      },
      err => {
        console.log(err);
      }
    );
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
        console.log(err);
      }
    );
  }

  getComboEstados() {
    // obtener estados
    this.sigaServices.get("busquedaCursos_estadosCursos").subscribe(
      n => {
        this.comboEstados = n.combooItems;
        this.arregloTildesCombo(this.comboEstados);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboServicios() {
    // obtener tipos servicios
    this.sigaServices.get("fichaCursos_getServicesCourse").subscribe(
      n => {
        this.comboService = n.combooItems;
        this.arregloTildesCombo(this.comboService);
      },
      err => {
        console.log(err);
      }
    );
  }

  getCodeCourse() {
    // obtener visibilidad
    this.sigaServices
      .getParam("fichaCursos_getCodeCourse", "?idCurso=" + this.curso.idCurso)
      .subscribe(
        n => {
          this.curso.codigoCurso = n;
        },
        err => {
          console.log(err);
        }
      );
  }

  // getServicesCourse() {
  //   this.progressSpinner = true;
  //   this.sigaServices
  //     .getParam(
  //       "fichaCursos_getServicesSpecificCourse",
  //       "?idCurso=" + this.curso.idCurso
  //     )
  //     .subscribe(
  //       n => {
  //         this.curso.tipoServicios = n.combooItems[0].value;

  //         // this.resultsService.forEach(e => {
  //         //   if (e.color == undefined) {
  //         //     e.color = "#024eff";
  //         //   }
  //         // });
  //         this.progressSpinner = false;
  //       },
  //       err => {
  //         console.log(err);
  //         this.progressSpinner = false;
  //       },
  //       () => {
  //         this.progressSpinner = false;
  //       }
  //     );
  // }

  getTopicsCourse() {
    this.progressSpinner = true;
    this.sigaServices
      .getParam(
        "fichaCursos_getTopicsSpecificCourse",
        "?idCurso=" + this.curso.idCurso
      )
      .subscribe(
        n => {
          this.resultsTopics = n.combooItems;

          this.resultsTopics.forEach(e => {
            if (e.color == undefined) {
              e.color = "#024eff";
            }
          });
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

  onChangeSelectVisibilidad(event) {
    this.onlyCheckDatos();
    if (event.value == 1) {
      this.deshabilitarCombCol = true;
      this.curso.colegio = this.authenticationService.getInstitucionSession();
    } else {
      this.deshabilitarCombCol = false;
    }
  }

  onChangeSelectVisibilidadObligate(colegio) {
    this.onlyCheckDatos();
    if (colegio == 1) {
      this.deshabilitarCombCol = true;
      this.curso.colegio = this.authenticationService.getInstitucionSession();
      this.progressSpinner = false;
    } else {
      this.deshabilitarCombCol = false;
    }
  }

  onChangeSelectColegio(event) {
    this.onlyCheckDatos();
    if (
      event.value != "" &&
      event.value != this.authenticationService.getInstitucionSession()
    ) {
      //Si elige un colegio que no es el propio, se deshabilita el combo de visibilidad y se selecciona 'Público' por defecto ya que los privados no deben mostrarse
      this.deshabilitarCombVis = true;
      this.curso.idVisibilidad = "0"; //Visibilidad pública
    } else {
      this.deshabilitarCombVis = false;
    }
  }

  saveCourse() {
    let url = "";

    if (this.curso.autovalidacion) {
      this.curso.autovalidacionInscripcion = "1";
    } else {
      this.curso.autovalidacionInscripcion = "0";
    }

    // this.curso.tipoServicios = this.resultsService;
    this.curso.temasCombo = this.resultsTopics;

    if (this.modoEdicion) {
      //Enviamos al back todos los formadores editados
      url = "fichaCursos_updateCourse";

      if (this.curso.idEstado != this.valorEstadoAbierto) {
        this.callSaveCourse(url);
        // let mess = "¿Desea enviar un aviso del cambio realizado?";

        // let icon = "fa fa-edit";
        // this.confirmationService.confirm({
        //   message: mess,
        //   icon: icon,
        //   accept: () => {
        //     this.callSaveCourse(url);
        //   },
        //   reject: () => {
        //     this.msgs = [
        //       {
        //         severity: "info",
        //         summary: this.translateService.instant(
        //           "general.message.cancelado"
        //         ),
        //         detail: "Aviso cancelado"
        //       }
        //     ];
        //     this.callSaveCourse(url);
        //   }
        // });
      } else {
        this.callSaveCourse(url);
      }
    } else {
      //Mapeamos el formador que queremos insertar nuevo
      url = "fichaCursos_saveCourse";
      this.callSaveCourse(url);
    }
  }


  saveDescription() {
    let url = "";

    if (this.modoEdicion) {
      //Enviamos al back todos los formadores editados
      url = "fichaCursos_updateCourse";
      let curso = new DatosCursosItem();
      curso.descripcionEstado = this.curso.descripcionEstado;
      curso.nombreCurso = this.curso.nombreCurso;
      curso.idCurso = this.curso.idCurso;
      curso.idEstado = this.curso.idEstado;
      this.sigaServices.post(url, curso).subscribe(
        data => {
          this.progressSpinner = false;

          if (!this.modoEdicion) {
            this.curso.idCurso = JSON.parse(data.body).id;
            this.curso.codigoCurso = JSON.parse(data.body).status;
            this.getCountInscriptions();
            this.getPrices();
            // this.curso.fechaInscripcionDesde = this.curso.fechaInscripcionDesdeDate.toString();
            // this.curso.fechaInscripcionHasta = this.curso.fechaInscripcionHastaDate.toString();
            this.searchCourse(this.curso.idCurso);

            sessionStorage.setItem("courseCurrent", JSON.stringify(this.curso));
            sessionStorage.setItem("modoEdicionCurso", "true");

            this.showMessage(
              "success",
              this.translateService.instant("general.message.correct"),
              this.translateService.instant("formacion.mensaje.guardar.curso.correcto")
            );
            this.modoEdicion = true;
          } else {
            this.showMessage(
              "success",
              this.translateService.instant("general.message.correct"),
              this.translateService.instant("formacion.mensaje.modificar.curso.correcto")
            );
            this.modoEdicion = true;
            this.resaltadoDatos = false;
            // if (this.initCurso.plazasDisponibles < this.curso.plazasDisponibles) {
            //   this.curso.aviso = "3";
            //   this.notifyAvailablePlaces();
            // } else {
            //   this.curso.aviso = undefined;
            // }
          }
          this.configurationInformacionAdicional();
        },
        err => {
          this.progressSpinner = false;

          if (JSON.parse(err.error).error.description != null) {
            this.showFail(JSON.parse(err.error).error.description);
          } else {
            this.showFail(
              this.translateService.instant("general.message.error.realiza.accion")
            );
          }

        },
        () => {
          this.progressSpinner = false;
        }
      );

    }
  }

  callSaveCourse(url) {
    this.sigaServices.post(url, this.curso).subscribe(
      data => {
        this.progressSpinner = false;

        if (!this.modoEdicion) {
          this.curso.idCurso = JSON.parse(data.body).id;
          this.curso.codigoCurso = JSON.parse(data.body).status;
          this.getCountInscriptions();
          this.getPrices();
          // this.curso.fechaInscripcionDesde = this.curso.fechaInscripcionDesdeDate.toString();
          // this.curso.fechaInscripcionHasta = this.curso.fechaInscripcionHastaDate.toString();
          this.searchCourse(this.curso.idCurso);

          sessionStorage.setItem("courseCurrent", JSON.stringify(this.curso));
          sessionStorage.setItem("modoEdicionCurso", "true");

          this.showMessage(
            "success",
            this.translateService.instant("general.message.correct"),
            this.translateService.instant("formacion.mensaje.guardar.curso.correcto")
          );
          this.modoEdicion = true;
        } else {
          this.showMessage(
            "success",
            this.translateService.instant("general.message.correct"),
            this.translateService.instant("formacion.mensaje.modificar.curso.correcto")
          );
          this.modoEdicion = true;
          this.resaltadoDatos = false;
          // if (this.initCurso.plazasDisponibles < this.curso.plazasDisponibles) {
          //   this.curso.aviso = "3";
          //   this.notifyAvailablePlaces();
          // } else {
          //   this.curso.aviso = undefined;
          // }
        }
        this.configurationInformacionAdicional();
      },
      err => {
        this.progressSpinner = false;

        if (JSON.parse(err.error).error.description != null) {
          this.showFail(JSON.parse(err.error).error.description);
        } else {
          this.showFail(
            this.translateService.instant("general.message.error.realiza.accion")
          );
        }

      },
      () => {
        this.progressSpinner = false;
        this.datosTarjetaResumen = [
          {
            label: "Nombre",
            value: this.curso.nombreCurso
          },
          {
            label: "Código",
            value: this.curso.codigoCurso
          },

          {
            label: "Estado",
            value: this.curso.estado
          },
        ];
      }
    );
  }

  notifyAvailablePlaces() {
    // let mess =
    //   "¿Desea enviar un aviso a los incritos que fueron rechazados o cancelados de que existen plazas disponibles?";

    // let icon = "fa fa-edit";
    // this.confirmationService.confirm({
    //   message: mess,
    //   icon: icon,
    //   accept: () => {
    //     //Realizar el aviso
    //     this.msgs = [
    //       {
    //         severity: "info",
    //         summary: "Guai",
    //         detail: "Guai"
    //       }
    //     ];
    //   },
    //   reject: () => {
    //     this.msgs = [
    //       {
    //         severity: "info",
    //         summary: this.translateService.instant("general.message.cancelado"),
    //         detail: "Aviso cancelado"
    //       }
    //     ];
    //   }
    // });
  }

  announceCourse() {
    if (this.curso.idEstado == this.valorEstadoAbierto) {
      this.curso.idEstado = this.valorEstadoAnunciado;
      let cursoDTO = new DatosCursosObject();
      cursoDTO.cursoItem.push(this.curso);

      this.sigaServices
        .post("fichaCursos_releaseOrAnnounceCourse", cursoDTO)
        .subscribe(
          data => {
            this.progressSpinner = false;
            this.showSuccess();
          },
          err => {
            this.progressSpinner = false;
          }
        );
    } else {
      this.showMessage(
        "info",
        this.translateService.instant("general.message.informacion"),
        this.translateService.instant("formacion.mensaje.curso.anunciado")
      );
    }
  }

  releaseCourse() {
    if (this.curso.idEstado == this.valorEstadoAnunciado) {
      this.curso.idEstado = this.valorEstadoAbierto;
      let cursoDTO = new DatosCursosObject();
      cursoDTO.cursoItem.push(this.curso);

      this.sigaServices
        .post("fichaCursos_releaseOrAnnounceCourse", cursoDTO)
        .subscribe(
          data => {
            this.progressSpinner = false;
            this.showSuccess();
          },
          err => {
            this.progressSpinner = false;
          }
        );
    } else {
      this.showMessage(
        "info",
        this.translateService.instant("general.message.informacion"),
        this.translateService.instant("formacion.mensaje.curso.desanunciado")
      );
    }
  }

  cancelCourse() {
    this.callCancelCourse();
    // let mess =
    //   "¿Desea comunicar a todos los inscritos la cancelación del curso?";

    // let icon = "fa fa-edit";
    // this.confirmationService.confirm({
    //   message: mess,
    //   icon: icon,
    //   accept: () => {
    //     this.curso.aviso = "1";
    //     this.callCancelCourse();
    //   },
    //   reject: () => {
    //     this.msgs = [
    //       {
    //         severity: "info",
    //         summary: this.translateService.instant("general.message.cancelado"),
    //         detail: "Aviso cancelado"
    //       }
    //     ];
    //     this.callCancelCourse();
    //   }
    // });
  }

  callCancelCourse() {
    let cursoDTO = new DatosCursosObject();
    cursoDTO.cursoItem = [];
    cursoDTO.cursoItem.push(this.curso);

    this.sigaServices.post("fichaCursos_cancelCourse", cursoDTO).subscribe(
      data => {
        this.progressSpinner = false;
        this.curso.idEstado = this.valorEstadoCancelado;
        // this.curso.aviso = undefined;
        if (JSON.parse(data.body).error.code == null) {
          this.showMessage(
            "info",
            this.translateService.instant("general.message.informacion"),
            JSON.parse(data.body).error.description
          );
        } else if (JSON.parse(data.body).error.code == 200) {
          this.showMessage(
            "success",
            this.translateService.instant("general.message.correct"),
            JSON.parse(data.body).error.description
          );
          this.getSessions();
          this.getCountInscriptions();
        } else if (JSON.parse(data.body).error.code == 400) {
          this.showMessage(
            "error",
            this.translateService.instant("general.message.incorrect"),
            JSON.parse(data.body).error.description
          );
        }
      },
      err => {
        this.progressSpinner = false;
      }
    );
  }

  finishCourse() {
    let mess = this.translateService.instant(
      "formacion.mensaje.finalizar.curso"
    );

    let icon = "fa fa-edit";
    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        let cursoDTO = new DatosCursosObject();
        cursoDTO.cursoItem = [];
        cursoDTO.cursoItem.push(this.curso);

        this.sigaServices.post("fichaCursos_finishCourse", cursoDTO).subscribe(
          data => {
            this.progressSpinner = false;

            if (JSON.parse(data.body).error.code == null) {
              this.showMessage(
                "info",
                this.translateService.instant("general.message.informacion"),
                JSON.parse(data.body).error.description
              );
            } else if (JSON.parse(data.body).error.code == 200) {
              this.showMessage(
                "success",
                this.translateService.instant("general.message.correct"),
                JSON.parse(data.body).error.description
              );

              this.curso.idEstado = this.valorEstadoFinalizado;
            } else if (JSON.parse(data.body).error.code == 400) {
              this.showMessage(
                "error",
                this.translateService.instant("general.message.incorrect"),
                JSON.parse(data.body).error.description
              );
            }
          },
          err => {
            this.progressSpinner = false;
          }
        );
      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            summary: this.translateService.instant("general.message.cancelado"),
            detail: this.translateService.instant(
              "general.message.accion.cancelada"
            )
          }
        ];
      }
    });
  }

  showMessageEditInitInscriptionEvent(value) {

    if (this.activacionEditar) {
      this.fechaInicioInscripcion.calendar.overlayVisible = false;

      let mess = this.translateService.instant("formacion.fichaCurso.mensaje.editar.fechaInscripcion");

      let icon = "fa fa-edit";
      this.confirmationService.confirm({
        message: mess,
        icon: icon,
        accept: () => {
          this.selectStartDateInscription();
        },
        reject: () => {
          if (this.modoEdicion) {
            this.fechaInicioInscripcion.calendar.inputFieldValue = this.arreglarFechaString(this.curso.fechaInscripcionDesdeDate);
            this.fechaInicioInscripcion.calendar.value = this.curso.fechaInscripcionDesdeDate;

          } else if ((!this.modoEdicion && this.curso.idEventoInicioInscripcion != undefined)
            || (!this.modoEdicion && this.curso.idEventoFinInscripcion != undefined)) {
            this.fechaInicioInscripcion.calendar.inputFieldValue = this.arreglarFechaString(this.curso.fechaInscripcionDesdeDate);
            this.fechaInicioInscripcion.calendar.value = this.curso.fechaInscripcionDesdeDate;
          } else {
            this.fechaInicioInscripcion.calendar.inputFieldValue = "";
            this.fechaInicioInscripcion.calendar.value = undefined;
          }
          this.msgs = [
            {
              severity: "info",
              summary: this.translateService.instant("general.message.cancelado"),
              detail: this.translateService.instant(
                "general.message.accion.cancelada"
              )
            }
          ];
        }
      });
    }

  }

  selectStartDateInscription() {

    this.curso.idTipoEvento = this.valorTipoInicioIncripcion;
    this.curso.temasCombo = this.resultsTopics;
    sessionStorage.setItem("courseCurrent", JSON.stringify(this.curso));
    sessionStorage.setItem("isFormacionCalendarByStartInscripcion", "true");
    this.router.navigate(["/fichaEventos"]);
  }

  showMessageEditEndInscriptionEvent(event) {

    if (this.activacionEditar) {
      this.fechaFinInscripcion.calendar.overlayVisible = false;

      let mess = this.translateService.instant("formacion.fichaCurso.mensaje.editar.fechaInscripcion");

      let icon = "fa fa-edit";
      this.confirmationService.confirm({
        message: mess,
        icon: icon,
        accept: () => {
          this.selectEndDateInscription(event);
        },
        reject: () => {

          if (this.modoEdicion) {
            this.fechaFinInscripcion.calendar.inputFieldValue = this.arreglarFechaString(this.curso.fechaInscripcionHastaDate);
            this.fechaFinInscripcion.calendar.value = this.curso.fechaInscripcionHastaDate;

          } else if ((!this.modoEdicion && this.curso.idEventoFinInscripcion != undefined)
            || (!this.modoEdicion && this.curso.idEventoFinInscripcion != undefined)) {
            this.fechaFinInscripcion.calendar.inputFieldValue = this.arreglarFechaString(this.curso.fechaInscripcionHastaDate);
            this.fechaFinInscripcion.calendar.value = this.curso.fechaInscripcionHastaDate;
          } else {
            this.fechaFinInscripcion.calendar.inputFieldValue = "";
            this.fechaFinInscripcion.calendar.value = undefined;
          }

          this.msgs = [
            {
              severity: "info",
              summary: this.translateService.instant("general.message.cancelado"),
              detail: this.translateService.instant(
                "general.message.accion.cancelada"
              )
            }
          ];
        }
      });

    }
  }

  selectEndDateInscription(event) {

    this.curso.idTipoEvento = this.valorTipoFinIncripcion;
    this.curso.temasCombo = this.resultsTopics;
    sessionStorage.setItem("courseCurrent", JSON.stringify(this.curso));
    sessionStorage.setItem("isFormacionCalendarByEndInscripcion", "true");
    this.router.navigate(["/fichaEventos"]);
  }

  searchCourse(idCurso) {
    this.progressSpinner = true;
    this.sigaServices.post("fichaCursos_searchCourse", idCurso).subscribe(
      data => {
        this.progressSpinner = false;
        this.curso = JSON.parse(data.body);

        if (this.curso.autovalidacionInscripcion == "1") {
          this.curso.autovalidacion = true;
        } else if (this.curso.autovalidacionInscripcion == "0") {
          this.curso.autovalidacion = false;
        }

        if (this.curso.fechaImparticionDesde != null) {
          this.curso.fechaImparticionDesdeDate = this.arreglarFecha(
            this.curso.fechaImparticionDesde
          );
        }

        if (this.curso.fechaImparticionHasta != null) {
          this.curso.fechaImparticionHastaDate = this.arreglarFecha(
            this.curso.fechaImparticionHasta
          );
        }

        if (this.curso.fechaInscripcionDesdeDate != null) {
          let fecha = this.curso.fechaInscripcionDesdeDate;
          this.curso.fechaInscripcionDesdeDate = new Date(fecha);
        }

        if (this.curso.fechaInscripcionHastaDate != null) {
          let fecha = this.curso.fechaInscripcionHastaDate;
          this.curso.fechaInscripcionHastaDate = new Date(fecha);
        }

        if (this.curso.idEstado == this.valorEstadoFinalizado) {
          this.isCursoFinalizado = true;
        } else {
          this.isCursoFinalizado = false;
        }

        this.getSessions();
        // this.getServicesCourse();
        this.getTopicsCourse();
        this.getCountInscriptions();
        this.initCurso = JSON.parse(JSON.stringify(this.curso));
        sessionStorage.setItem("courseCurrent", JSON.stringify(this.curso));
      },
      err => {
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
        this.compruebaInstitucionCurso();
        window.scrollTo(0, 0);
        this.datosTarjetaResumen = [
          {
            label: "Nombre",
            value: this.curso.nombreCurso
          },
          {
            label: "Código",
            value: this.curso.codigoCurso
          },

          {
            label: "Estado",
            value: this.curso.estado
          },
        ];
      }
    );
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
        e.color = "#024eff";
      }
    });
  }

  resetSuggestServicesTopics() {
    this.autocompleteTopics.panelVisible = false;
  }

  visiblePanelBlurTopics(event) {
    if (this.autocompleteTopics.highlightOption != undefined) {
      this.autocompleteTopics.highlightOption.color = "#024eff";
      this.resultsTopics.push(this.autocompleteTopics.highlightOption);
      this.autocompleteTopics.highlightOption = undefined;
    }
    this.autocompleteTopics.panelVisible = false;
  }

  visiblePanelOnSelectTopics() {
    this.autocompleteTopics.panelVisible = false;
  }

  // filterServices(event) {
  //   let query = event.query;

  //   if (
  //     this.comboService.length > 0 &&
  //     this.comboService.length != this.resultsService.length
  //   ) {
  //     if (this.resultsService.length > 0) {
  //       this.suggestService = [];

  //       this.comboService.forEach(element => {
  //         let findService = this.resultsService.find(
  //           x => x.value === element.value
  //         );
  //         if (findService == undefined) {
  //           this.suggestService.push(element);
  //         }
  //       });

  //       this.resultsService.forEach(e => {
  //         if (e.color == undefined) {
  //           e.color = "#024eff";
  //         }
  //       });
  //     } else {
  //       this.suggestService = JSON.parse(JSON.stringify(this.comboService));
  //     }
  //     this.autocompleteService.suggestionsUpdated = true;
  //     this.autocompleteService.panelVisible = true;
  //     this.autocompleteService.focusInput();
  //   } else {
  //     if (this.autocompleteService.highlightOption != undefined) {
  //       this.resultsService.forEach(e => {
  //         if (e.color == undefined) {
  //           e.color = "#024eff";
  //         }
  //       });
  //     }

  //     this.autocompleteService.panelVisible = false;
  //     this.autocompleteService.focusInput();
  //   }
  // }

  // filterLabelsMultiple(event) {
  //   let query = event.query;
  //   this.suggestService = [];

  //   this.comboService.forEach(element => {
  //     if (element.label.toLowerCase().indexOf(query.toLowerCase()) == 0) {
  //       let findService = this.resultsService.find(
  //         x => x.value === element.value
  //       );
  //       if (findService == undefined) {
  //         this.suggestService.push(element);
  //       }
  //     }
  //   });

  //   this.resultsService.forEach(e => {
  //     if (e.color == undefined) {
  //       e.color = "#024eff";
  //     }
  //   });
  // }

  resetSuggestServices() {
    this.autocompleteService.panelVisible = false;
  }

  // visiblePanelBlur(event) {
  //   if (this.autocompleteService.highlightOption != undefined) {
  //     this.autocompleteService.highlightOption.color = "#024eff";
  //     this.resultsService.push(this.autocompleteService.highlightOption);
  //     this.autocompleteService.highlightOption = undefined;
  //   }
  //   this.autocompleteService.panelVisible = false;
  // }

  visiblePanelOnSelect() {
    this.autocompleteService.panelVisible = false;
  }

  showInfoServices() {
    this.msgs = [];
    this.msgs.push({
      severity: "info",
      summary: this.translateService.instant("general.message.informacion"),
      detail: this.translateService.instant(
        "formacion.mensaje.noexiste.servicios.curso"
      )
    });
  }

  editDocumentoAdjunto() {
    if (this.edicionDocumentoAdjunto) this.edicionDocumentoAdjunto = false;
    else this.edicionDocumentoAdjunto = true;
  }

  editInformacionAdicional() {
    if (this.edicionInformacionAdicional)
      this.edicionInformacionAdicional = false;
    else this.edicionInformacionAdicional = true;
  }

  editEncuestaSatisfaccion() {
    if (this.edicionEncuestaSatisfaccion)
      this.edicionEncuestaSatisfaccion = false;
    else this.edicionEncuestaSatisfaccion = true;
  }

  validateCourse() {
    if (
      this.curso.nombreCurso == null ||
      this.curso.idVisibilidad == null ||
      this.curso.idEstado == null ||
      this.curso.fechaInscripcionDesdeDate == null ||
      this.curso.fechaInscripcionHastaDate == null ||
      this.curso.idEstado == "" ||
      this.curso.nombreCurso == "" ||
      this.curso.idVisibilidad == "" ||
      this.curso.tipoServicios == null || this.curso.tipoServicios == ""
    ) {
      return true;
    } else {
      return false;
    }
  }

  //Sesiones

  getColsResultsPrices() {
    this.colsPrices = [
      {
        field: "importe",
        header: "formacion.fichaCurso.tarjetaPrecios.importe"
      },
      {
        field: "periocidad",
        header: "formacion.fichaCurso.tarjetaPrecios.periocidad"
      },
      {
        field: "descripcion",
        header: "administracion.parametrosGenerales.literal.descripcion"
      },
      {
        field: "porDefecto",
        header: "formacion.fichaCurso.tarjetaPrecios.precioPorDefecto"
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

  getPrices() {
    this.sigaServices
      .getParam("fichaCursos_getPricesCourse", "?idCurso=" + this.curso.idCurso)
      .subscribe(
        n => {
          this.progressSpinner = false;
          this.datosPrices = n.preciosCursoItem;
        },
        err => {
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        }
      );
  }

  isSelectMultiplePrices() {
    this.selectMultiplePrices = !this.selectMultiplePrices;
    if (!this.selectMultiplePrices) {
      this.selectedDatosPrices = [];
      this.numSelectedPrices = 0;
    } else {
      this.selectAllPrices = false;
      this.selectedDatosPrices = [];
      this.numSelectedPrices = 0;
    }
  }

  onChangeSelectAllPrices() {
    if (this.selectAllPrices === true) {
      this.selectMultiplePrices = false;
      this.selectedDatosPrices = this.datosPrices;
      this.numSelectedPrices = this.datosPrices.length;
    } else {
      this.selectedDatosPrices = [];
      this.numSelectedPrices = 0;
    }
  }

  actualizaSeleccionadosPrices(selectedDatosPrices) {
    this.numSelectedPrices = selectedDatosPrices.length;
  }

  onChangeRowsPerPagesPrices(event) {
    this.selectedPrices = event.value;
    this.changeDetectorRef.detectChanges();
    this.tablePrices.reset();
  }

  //TARJETA FORMADORES

  getTrainers() {
    this.sigaServices
      .getParam(
        "fichaCursos_getTrainersCourse",
        "?idCurso=" + this.curso.idCurso
      )
      .subscribe(
        n => {
          this.datosFormadores = n.formadoresCursoItem;
          this.datosFormadoresInit = JSON.parse(
            JSON.stringify(this.datosFormadores)
          );

          this.getNumTutor();

          sessionStorage.setItem(
            "datosFormadoresInit",
            JSON.stringify(this.datosFormadores)
          );

          if (
            sessionStorage.getItem("formador") != null ||
            sessionStorage.getItem("formador") != undefined
          ) {
            sessionStorage.removeItem("formador");
            this.tableFormadores.reset();
          }

          this.pressNewFormador = false;

          this.progressSpinner = false;
        },
        err => {
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        }
      );
  }

  getColsResultsFormadores() {
    this.colsFormadores = [
      {
        field: "nombre",
        header: "administracion.parametrosGenerales.literal.nombre"
      },
      {
        field: "apellidos",
        header: "gratuita.mantenimientoTablasMaestra.literal.apellidos"
      },
      {
        select: "idRol",
        field: "rol",
        header: "administracion.usuarios.literal.rol"
      },
      {
        select: "idTipoCoste",
        field: "tipoCoste",
        header: "censo.busquedaClientesAvanzada.literal.tipoCliente"
      },
      {
        field: "tarifa",
        header: "censo.alterMutua.literal.tarifa"
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

  isSelectMultipleFormadores() {
    this.selectMultipleFormadores = !this.selectMultipleFormadores;
    if (!this.selectMultipleFormadores) {
      this.selectedDatosFormadores = [];
      this.numSelectedFormadores = 0;
    } else {
      this.selectAllFormadores = false;
      this.selectedDatosFormadores = [];
      this.numSelectedFormadores = 0;
    }
  }

  onChangeSelectAllFormadores(event) {
    this.selectMultipleFormadores = !this.selectMultipleFormadores;
    if (this.selectAllFormadores === true) {
      this.selectedDatosFormadores = this.datosFormadores;
      this.numSelectedFormadores = this.datosFormadores.length;
    } else {
      this.selectAllFormadores = false;
      this.selectedDatosFormadores = [];
      this.numSelectedFormadores = 0;
    }
  }

  getComboRoles() {
    this.sigaServices.get("fichaCursos_getRolesTrainers").subscribe(
      n => {
        this.comboRoles = n.combooItems;
        this.arregloTildesCombo(this.comboRoles);
      },
      err => {
        console.log(err);
      }
    );
  }

  compruebaInstitucionCurso() {
    let institucionPersona = this.authenticationService.getInstitucionSession();
    let institucionCurso = this.curso.idInstitucion;
    if (
      (institucionPersona != institucionCurso &&
        institucionCurso != undefined) ||
      this.isLetrado
    ) {
      this.activacionEditar = false;
      this.otraInstitucion = true;
    }
    // Cargamos el tooltip de número de sesiones (minimo asistencia) aquí para asegurarnos de que se realiza tras la búsqueda.
    if (
      this.curso.numeroSesiones != null &&
      this.curso.numeroSesiones != undefined
    ) {
      this.sesionesExistentes =
        "Número de sesiones: " + this.curso.numeroSesiones;
    }
  }

  getComboTipoCoste() {
    this.sigaServices.get("fichaCursos_getTypeCostTrainers").subscribe(
      n => {
        this.comboTipoCoste = n.combooItems;
        this.arregloTildesCombo(this.comboTipoCoste);
      },
      err => {
        console.log(err);
      }
    );
  }

  irEditarFormador() {
    if (this.editFormador) {
      this.editFormador = false;
    } else {
      this.editFormador = true;
    }
    this.numSelectedFormadores = this.datosFormadores.length;
  }

  restTrainer() {
    this.datosFormadores = JSON.parse(
      sessionStorage.getItem("datosFormadoresInit")
    );
    this.selectedDatosFormadores = [];
    this.numSelectedFormadores = 0;
    this.getNumTutor();
    this.selectMultipleFormadores = false;
    this.pressNewFormador = false;
    this.editFormador = false;
    this.formadoresUpdate = [];
    this.tableFormadores.reset();
  }

  getNumTutor() {
    //Buscamos el formador que tiene asignado ese rol
    let idFormador = this.datosFormadores.findIndex(x => x.tutor === 1);

    if (idFormador == -1) {
      this.numCheckedTutor = 0;
    } else {
      this.numCheckedTutor = 1;
    }
  }

  newTrainer() {
    sessionStorage.setItem("abrirFormador", "true");
    sessionStorage.setItem("vuelveForm", "true");

    this.pressNewFormador = true;
    this.modoEdicionFormador = false;
    this.editFormador = true;
    this.newFormadorCourse = new FormadorCursoItem();
    let newFormadorCourse = {
      idCurso: "",
      idRol: "",
      rol: "",
      nombre: "",
      apellidos: "",
      tarifa: "",
      idTipoCoste: "",
      tipoCoste: "",
      idPersona: "",
      idInstitucion: ""
    };

    this.datosFormadores = [newFormadorCourse, ...this.datosFormadores];
    sessionStorage.setItem(
      "datosFormadores",
      JSON.stringify(this.datosFormadores)
    );

    sessionStorage.removeItem("menuProcede");
    sessionStorage.removeItem("migaPan");
    sessionStorage.removeItem("migaPan2");
    let migaPan = this.translateService.instant("menu.formacion.buscarCursos");
    let migaPan2 = this.translateService.instant("formacion.fichaCurso.cabecera");
    let menuProcede = this.translateService.instant("menu.formacion");
    sessionStorage.setItem("migaPan", migaPan);
    sessionStorage.setItem("migaPan2", migaPan2);
    sessionStorage.setItem("menuProcede", menuProcede);

    this.router.navigate(["/busquedaGeneral"]);
  }

  loadNewTrainer(newformador) {
    this.datosFormadores = JSON.parse(
      sessionStorage.getItem("datosFormadores")
    );

    this.fichasPosibles[2].activa = true;
    this.newFormadorCourse = new FormadorCursoItem();
    if (newformador.idPersona != null && newformador.idPersona != undefined) {
      this.datosFormadores[0].nombre = newformador.nombre;
      this.datosFormadores[0].apellidos = newformador.apellidos;
      this.datosFormadores[0].idPersona = newformador.idPersona;
      this.datosFormadores[0].idInstitucion = newformador.colegio;
      this.datosFormadores[0].idRol = "";
      this.datosFormadores[0].idTipoCoste = "";
      this.datosFormadores[0].idCurso = this.curso.idCurso;
      this.newFormadorCourse.apellidos = newformador.apellidos;
      this.newFormadorCourse.nombre = newformador.nombre;
    } else {
      this.newFormadorCourse.nif = newformador.nif;
      this.newFormadorCourse.tipoIdentificacion =
        newformador.tipoIdentificacion;
    }

    this.getNumTutor();
  }

  actualizaSeleccionadosFormadores(selectedDatosFormadores) {
    this.numSelectedFormadores = selectedDatosFormadores.length;
    if(this.numSelectedFormadores <= 1){
      this.selectMultipleFormadores = false;
    }
  }

  saveTrainers() {
    this.editFormador = false;
    let formador;
    let formadores;
    let url = "";
    let mess;

    if (this.modoEdicionFormador) {
      //Enviamos al back todos los formadores editados
      url = "fichaCursos_updateTrainersCourse";
      formador = new FormadorCursoObject();
      formador.error = new ErrorItem();
      formador.formadoresCursoItem = JSON.parse(
        JSON.stringify(this.formadoresUpdate)
      );
      this.formadoresUpdate = [];
      this.sigaServiceSaveTrainer(url, formador);
    } else {
      if (this.numCheckedTutor > 1 && this.newFormadorCourse.idRol == "1") {
        mess = this.translateService.instant(
          "formacion.fichaCurso.formadores.confirmacion.cambiarTutor"
        );

        let icon = "fa fa-edit";
        this.confirmationService.confirm({
          message: mess,
          icon: icon,
          accept: () => {
            //Mapeamos el formador que queremos insertar nuevo
            url = "fichaCursos_saveTrainersCourse";
            formadores = new FormadorCursoObject();
            formadores.error = new ErrorItem();

            formador = this.tableFormadores.value[0];
            formador.idRol = this.newFormadorCourse.idRol;
            formador.idTipoCoste = this.newFormadorCourse.idTipoCoste;
            formador.tarifa = this.newFormadorCourse.tarifa;
            formador.nif = this.newFormadorCourse.nif;
            formador.tipoIdentificacion = this.newFormadorCourse.tipoIdentificacion;
            formador.idCurso = this.curso.idCurso;
            formador.nombre = this.newFormadorCourse.nombre;
            formador.apellidos = this.newFormadorCourse.apellidos;
            formador.idInstitucion = null;

            if (this.newFormadorCourse.idRol == "1") {
              formador.tutor = 1;
            } else {
              formador.tutor = 0;
            }

            formadores.formadoresCursoItem.push(formador);
            this.sigaServiceSaveTrainer(url, formadores);
          },
          reject: () => {
            this.msgs = [
              {
                severity: "info",
                summary: this.translateService.instant(
                  "general.message.cancelado"
                ),
                detail: this.translateService.instant(
                  "general.message.accion.cancelada"
                )
              }
            ];
          }
        });
      } else {
        //Mapeamos el formador que queremos insertar nuevo
        url = "fichaCursos_saveTrainersCourse";
        formadores = new FormadorCursoObject();
        formadores.error = new ErrorItem();

        formador = this.tableFormadores.value[0];
        formador.idRol = this.newFormadorCourse.idRol;
        formador.idTipoCoste = this.newFormadorCourse.idTipoCoste;
        formador.tarifa = this.newFormadorCourse.tarifa;
        formador.nif = this.newFormadorCourse.nif;
        formador.tipoIdentificacion = this.newFormadorCourse.tipoIdentificacion;
        formador.idCurso = this.curso.idCurso;
        formador.nombre = this.newFormadorCourse.nombre;
        formador.apellidos = this.newFormadorCourse.apellidos;
        formador.idInstitucion = null;

        if (this.newFormadorCourse.idRol == "1") {
          formador.tutor = 1;
        } else {
          formador.tutor = 0;
        }

        formadores.formadoresCursoItem.push(formador);
        this.sigaServiceSaveTrainer(url, formadores);
      }
    }
  }

  sigaServiceSaveTrainer(url, formadores) {
    this.sigaServices.post(url, formadores).subscribe(
      data => {
        let error = JSON.parse(data.body).error;

        if (error.message != "" && error.message != null) {
          this.showFail(error.message);
        } else {
          this.showSuccess();
        }
        this.editFormador = false;
        this.pressNewFormador = false;
        this.modoEdicionFormador = true;
        sessionStorage.setItem("formador", "true");
        this.getTrainers();
        this.selectedDatosFormadores = [];
      },
      err => {
        this.progressSpinner = false;
      }
    );
  }

  //Funciones que controlan los formadores editados
  //Si se edita un campo input de la tabla
  editFormadorTable(event, data) {
    this.editFormador = true;
    this.modoEdicionFormador = true;

    let idFindFormador = this.formadoresUpdate.findIndex(
      x => x.idPersona === data.idPersona && x.idRol === data.idRol
    );

    if (idFindFormador == -1) {
      this.addTrainerUpdateList(idFindFormador, data);
    } else {
      let id = this.datosFormadores.findIndex(
        x => x.idPersona === data.idPersona && x.idRol === data.idRol
      );

      this.formadoresUpdate[idFindFormador] = this.datosFormadores[id];
    }

    this.getNumTutor();
  }

  //Si se selecciona un select de la tabla
  onChangeEdit(event, dato) {
    this.editFormador = true;

    let idFindFormador = this.formadoresUpdate.findIndex(
      x => x.idPersona === dato.idPersona && x.idRol === dato.idRol
    );

    if (idFindFormador == -1) {
      this.addTrainerUpdateList(idFindFormador, dato);
    } else {
      let id = this.datosFormadores.findIndex(
        x => x.idPersona === dato.idPersona && x.idRol === dato.idRol
      );

      this.formadoresUpdate[idFindFormador] = this.datosFormadores[id];
    }

    this.getNumTutor();
  }

  deleteTrainer(selectedFormadores) {
    this.progressSpinner = true;
    let deleteTrainer = new FormadorCursoObject();

    selectedFormadores.forEach(f => {
      let formador = new FormadorCursoItem();
      formador = f;
      deleteTrainer.formadoresCursoItem.push(formador);
    });

    this.sigaServices
      .post("fichaCursos_deleteTrainersCourse", deleteTrainer)
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.showSuccessDelete();
          this.getTrainers();
          this.selectMultipleFormadores = false;
        },
        err => {
          this.showMessage(
            "error",
            this.translateService.instant("general.message.incorrect"),
            JSON.parse(err.error).error.description
          );
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        }
      );
  }

  onChangeTutor(event, dato) {
    let mess = "";
    this.editFormador = true;

    //COMPROBAMOS QUE SI YA EXISTE UN FORMADOR ASIGNADO COMO TUTOR Y SE QUIERE MARCAR A OTRO FORMADOR SE CAMBIA LA ASIGNACION
    if (
      (this.numCheckedTutor == 1 &&
        event.value == "1" &&
        this.modoEdicionFormador) ||
      (this.numCheckedTutor == 1 && event == "1" && this.modoEdicionFormador)
    ) {
      mess = this.translateService.instant(
        "formacion.fichaCurso.formadores.confirmacion.cambiarTutor"
      );

      let icon = "fa fa-edit";
      this.confirmationService.confirm({
        message: mess,
        icon: icon,
        accept: () => {
          //1. Eliminamos el tutor asignado

          //1.1 Buscamos el formador que tiene asignado ese rol
          let idFormadorUnSelect = this.datosFormadores.findIndex(
            x => x.tutor === 1
          );

          //1.2 Buscamos si ese formador se encuentra en la lista de formadores modificados
          let id = this.formadoresUpdate.findIndex(
            x =>
              x.idFormador ==
              this.datosFormadores[idFormadorUnSelect].idFormador
          );

          //1.3 Si no se encuentre en la lista de modificados, se añade el formador modificado
          if (id == -1) {
            this.datosFormadores[idFormadorUnSelect].tutor = 0;
            this.datosFormadores[idFormadorUnSelect].idRol = undefined;
            this.datosFormadores[idFormadorUnSelect].rol = "";
            this.formadoresUpdate.push(
              this.datosFormadores[idFormadorUnSelect]
            );
            //1.4 Si se encuentra en la lista, modificamos el formador tanto en la lista de formadores modificados
            //y en la lista de formadores
          } else {
            this.formadoresUpdate[id].tutor = 0;
            this.formadoresUpdate[id].idRol = undefined;
            this.formadoresUpdate[id].rol = "";
            this.datosFormadores[idFormadorUnSelect].tutor = 0;
            this.datosFormadores[idFormadorUnSelect].idRol = undefined;
            this.datosFormadores[idFormadorUnSelect].rol = "";
          }

          //2. Añadimos el nuevo formador

          //2.1 Buscamos SI el formador que le vamos asignar el tutor se encuentra en la lista de formadores modificados
          let idFindFormador = this.formadoresUpdate.findIndex(
            x => x.idFormador === dato.idFormador
          );

          //2.2 Buscamos al formador que le vamos asignar el tutor en la tabla de formadores
          let idUpdateFormador = this.datosFormadores.findIndex(
            x => x.idFormador === dato.idFormador
          );

          //2.3 Si el formador no se encuentra en la tabla de formadores modificados se añade
          if (idFindFormador == -1) {
            this.datosFormadores[idUpdateFormador].tutor = 1;
            this.datosFormadores[idUpdateFormador].idRol = "1";
            this.addTrainerUpdateList(idFindFormador, dato);
            //2.4 Si se encuentra, se le asigna el valor de tutor en ambas tablas
          } else {
            this.formadoresUpdate[idFindFormador].tutor = 1;
            this.formadoresUpdate[idFindFormador].idRol = "1";
            this.datosFormadores[idUpdateFormador].tutor = 1;
            this.datosFormadores[idUpdateFormador].idRol = "1";
          }

          if (this.changeTutor) {
            let formadores = new FormadorCursoObject();
            formadores.error = new ErrorItem();
            formadores.formadoresCursoItem = this.formadoresUpdate;

            this.sigaServiceSaveTrainer(
              "fichaCursos_saveTrainersCourse",
              formadores
            );
          }

          this.getNumTutor();
          this.tableFormadores.reset();
        },
        reject: () => {
          //Si cancela la operacion, se restablece los valores
          let id = this.datosFormadores.findIndex(
            x => x.idPersona === dato.idPersona && x.idRol === dato.idRol
          );

          if (!this.changeTutor) {
            this.datosFormadores = this.datosFormadoresInit;
          }

          this.getNumTutor();

          this.msgs = [
            {
              severity: "info",
              summary: this.translateService.instant(
                "general.message.cancelado"
              ),
              detail: this.translateService.instant(
                "general.message.accion.cancelada"
              )
            }
          ];
        }
      });
      //SE COMPRUEBA SI SE DESASIGNA UN FORMADOR QUE ES TUTOR
    } else if (this.numCheckedTutor == 1 && dato.idRol != "1") {
      //1.1 Se le desasigna en la tabla de formadores
      let id = this.datosFormadores.findIndex(
        x => x.idFormador === dato.idFormador
      );

      this.datosFormadores[id].tutor = 0;

      //1.1 Buscamos el formador que tiene asignado ese rol
      let idFormadorUnSelect = this.datosFormadores.findIndex(
        x => x.tutor === 1
      );

      if (idFormadorUnSelect == -1) {
        this.numCheckedTutor = 0;
      }

      //1.1 Se busca si ese formador se encuentra en la lista de formadores modificados
      let idFindFormador = this.formadoresUpdate.findIndex(
        x => x.idFormador === dato.idFormador
      );

      //1.2 Si no existe se añade a la lista de formadores modificados y se le asigna en la tabla de formadores
      if (idFindFormador == -1) {
        this.formadoresUpdate.push(this.datosFormadores[id]);
        //1.3 Si existe se modifica en la tabla
      } else {
        this.formadoresUpdate[id].tutor = 0;
      }

      this.getNumTutor();

      //SE COMPRUEBA SI NO HAY NINGUN FORMADOR ASIGNADO
    } else {
      // this.numCheckedTutor = 1;
      dato.tutor = 1;

      //1.1 Se le asigna en la tabla de formadores
      let id = this.datosFormadores.findIndex(
        x => x.idFormador === dato.idFormador
      );
      this.datosFormadores[id].tutor = 1;

      //1.2 Se busca si esta en la tabla formadores modificados
      let idFindFormador = this.formadoresUpdate.findIndex(
        x => x.idFormador === dato.idFormador
      );

      //1.2 Si no esta se añade
      if (idFindFormador == -1) {
        this.addTrainerUpdateList(idFindFormador, dato);
      } else {
        let id = this.datosFormadores.findIndex(
          x => x.idFormador === dato.idFormador
        );
        this.formadoresUpdate[idFindFormador].tutor = 1;
      }

      this.getNumTutor();
    }
  }

  addTrainerUpdateList(idFindFormador, dato) {
    let id = this.datosFormadores.findIndex(
      x => x.idFormador === dato.idFormador
    );
    this.formadoresUpdate.push(this.datosFormadores[id]);
  }

  validateTrainer() {
    if (this.newFormadorCourse != undefined) {
      if (
        this.newFormadorCourse.idTipoCoste == null ||
        this.newFormadorCourse.tarifa == null ||
        this.newFormadorCourse.idTipoCoste == "" ||
        this.newFormadorCourse.tarifa == ""
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  //Sesiones

  getColsResultsSessions() {
    this.colsSessions = [
      {
        field: "fechaHoraInicio",
        header: "agenda.fichaEventos.datosGenerales.fechaInicio"
      },
      {
        field: "fechaHoraFin",
        header: "agenda.fichaEventos.datosGenerales.fechaFin"
      },
      {
        field: "formadores",
        header: "agenda.fichaEventos.datosFormadores.cabecera"
      },
      {
        field: "lugar",
        header: "agenda.fichaEventos.datosGenerales.lugar"
      },
      {
        field: "estadoEvento",
        header: "form.busquedaCursos.literal.estado"
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

  getSessions() {
    this.curso.idTipoEvento = this.valorTipoSesion;
    this.sigaServices
      .post("fichaCursos_getSessionsCourse", this.curso)
      .subscribe(
        n => {
          this.datosSessions = JSON.parse(n.body).eventos;
          this.progressSpinner = false;
        },
        err => {
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        }
      );
  }

  isSelectMultipleSessions() {
    this.selectMultipleSessions = !this.selectMultipleSessions;
    if (!this.selectMultipleSessions) {
      this.selectedDatosSessions = [];
      this.numSelectedSessions = 0;
    } else {
      this.selectAllSessions = false;
      this.selectedDatosSessions = [];
      this.numSelectedSessions = 0;
    }
  }

  onChangeSelectAllSessions() {
    if (this.selectAllSessions === true) {
      this.selectMultipleSessions = false;
      this.selectedDatosSessions = this.datosSessions;
      this.numSelectedSessions = this.datosSessions.length;
    } else {
      this.selectedDatosSessions = [];
      this.numSelectedSessions = 0;
    }
  }

  newSession() {
    sessionStorage.setItem("isFormacionCalendar", "true");
    sessionStorage.setItem("idCurso", this.curso.idCurso);
    sessionStorage.setItem("isSession", "true");
    this.router.navigate(["/fichaEventos"]);
  }

  duplicateSession() {
    this.progressSpinner = true;

    let session = this.selectedDatosSessions[0];
    session.idEvento = null;
    session.idCurso = this.curso.idCurso;

    if (session.idRepeticionEvento != null && session.idRepeticionEvento != undefined) {
      session.valoresRepeticion = JSON.parse(session.valoresRepeticionString);

    }

    this.sigaServices
      .post("fichaCursos_duplicateSessionsCourse", session)
      .subscribe(
        data => {
          this.getSessions();
          this.selectMultipleSessions = false;
          if (JSON.parse(data.body).error.code == null) {
            this.showMessage(
              "info",
              this.translateService.instant("general.message.informacion"),
              JSON.parse(data.body).error.description
            );
          } else if (JSON.parse(data.body).error.code == 200) {
            this.showMessage(
              "success",
              this.translateService.instant("general.message.correct"),
              this.translateService.instant(
                "formacion.fichaCurso.sesiones.duplicadas.correctamente"
              )
            );
          } else if (JSON.parse(data.body).error.code == 400) {
            this.showMessage(
              "error",
              this.translateService.instant("general.message.incorrect"),
              JSON.parse(data.body).error.description
            );
          }
        },
        err => {
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        }
      );
  }

  cancelSessions() {

    this.callCancelSession();

    // let mess = "";

    // if (this.selectedDatosSessions.length > 1) {
    //   mess = "¿Desea comunicar la cancelación de las sesiones?";
    // } else {
    //   mess = "¿Desea comunicar la cancelación de la sesión?";
    // }

    // let icon = "fa fa-edit";
    // this.confirmationService.confirm({
    //   message: mess,
    //   icon: icon,
    //   accept: () => {
    //     this.curso.aviso = "4";
    //     this.callCancelSession();
    //   },
    //   reject: () => {
    //     this.msgs = [
    //       {
    //         severity: "info",
    //         summary: this.translateService.instant("general.message.cancelado"),
    //         detail: "Aviso cancelado"
    //       }
    //     ];
    //     this.callCancelSession();
    //   }
    // }); 

  }

  callCancelSession() {

    this.progressSpinner = true;

    let sessionsCancel = new EventoObject();
    sessionsCancel.eventos = this.selectedDatosSessions;

    //Pasar aviso guardo en this.curso.aviso = "4" por parametro
    this.sigaServices
      .post("fichaCursos_cancelSessionsCourse", sessionsCancel)
      .subscribe(
        data => {
          if (JSON.parse(data.body).error.code == null) {
            this.showMessage(
              "info",
              this.translateService.instant("general.message.informacion"),
              JSON.parse(data.body).error.description
            );
          } else if (JSON.parse(data.body).error.code == 200) {
            this.showMessage(
              "success",
              this.translateService.instant("general.message.correct"),
              JSON.parse(data.body).error.description
            );
            this.searchCourse(this.curso.idCurso);
          } else if (JSON.parse(data.body).error.code == 400) {
            this.showMessage(
              "error",
              this.translateService.instant("general.message.incorrect"),
              JSON.parse(data.body).error.description
            );
          }

          this.getSessions();
          this.selectMultipleSessions = false;
          this.selectedDatosSessions = [];
        },
        err => {
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        }
      );
  }

  disabledDuplicate() {
    if (
      (this.selectedDatosSessions != null &&
        this.selectedDatosSessions.length == 1)
    )
      return false;
    else return true;
  }

  irEditarSession(id) {
    if (
      id.length >= 1 &&
      this.selectMultipleSessions == false &&
      this.selectMultiplePrices == false
    ) {
      sessionStorage.setItem("modoEdicionSession", "true");
      sessionStorage.removeItem("eventoSelected");
      sessionStorage.setItem("eventoSelected", JSON.stringify(id[0]));
      sessionStorage.setItem("idCurso", this.curso.idCurso);
      sessionStorage.setItem("sessions", JSON.stringify(this.datosSessions));
      sessionStorage.setItem("isSession", "true");
      sessionStorage.setItem("fichaAbierta", "true");
      this.router.navigate(["/fichaEventos"]);
    }
    this.numSelectedPrices = this.selectedDatosPrices.length;
    this.numSelectedSessions = this.selectedDatosSessions.length;
  }

  actualizaSeleccionadosSessions(selectedDatosSessions) {
    this.numSelectedSessions = selectedDatosSessions.length;
  }

  onChangeRowsPerPagesSessions(event) {
    this.selectedSessions = event.value;
    this.changeDetectorRef.detectChanges();
    this.tableSessions.reset();
  }

  onChangeRowsPerPagesFormadores(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.tableFormadores.reset();
  }

  //Inscripciones
  irBusquedaInscripcciones() {
    if (!this.otraInstitucion) {
      sessionStorage.setItem("pantallaFichaCurso", "true");
      sessionStorage.setItem("cursoSelected", JSON.stringify(this.curso));
      this.router.navigate(["/buscarInscripciones"]);
    }
  }

  getCountInscriptions() {
    this.inscription = new DatosInscripcionItem();
    this.progressSpinner = true;
    this.sigaServices
      .getParam(
        "fichaCursos_getCountIncriptions",
        "?idCurso=" + this.curso.idCurso
      )
      .subscribe(
        n => {
          this.inscription = n;

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

  //Certificados

  getColsResultsCertificates() {
    this.colsCertificates = [
      {
        field: "idProducto",
        fieldClave: "clave",
        header: "menu.certificados",
        value: "nombreCertificado"
      },
      {
        field: "precio",
        header: "form.busquedaCursos.literal.precio"
      },
      {
        field: "idCalificacion",
        header: "formacion.busquedaInscripcion.calificacion",
        value: "calificacion"
      }
    ];

    this.getComboCalificaciones();
    this.getComboCertificados();
  }

  getCertificatesCourse() {
    // obtener certificaciones
    this.sigaServices
      .getParam(
        "fichaCursos_getCertificatesCourse",
        "?idCurso=" + this.curso.idCurso
      )
      .subscribe(
        n => {
          this.datosCertificates = n.certificadoCursoItem;
          this.progressSpinner = false;
          sessionStorage.setItem(
            "datosCertificatesInit",
            JSON.stringify(this.datosCertificates)
          );
        },
        err => {
          console.log(err);
        }
      );
  }

  isSelectMultipleCertificates() {
    this.selectMultipleCertificates = !this.selectMultipleCertificates;
    if (!this.selectMultipleCertificates) {
      this.selectedDatosCertificates = [];
      this.numSelectedCertificates = 0;
    } else {
      this.selectAllCertificates = false;
      this.selectedDatosCertificates = [];
      this.numSelectedCertificates = 0;
    }
  }

  onChangeSelectAllCertificates() {
    if (this.selectAllCertificates === true) {
      this.selectMultipleCertificates = false;
      this.selectedDatosCertificates = this.datosCertificates;
      this.numSelectedCertificates = this.datosCertificates.length;
    } else {
      this.selectedDatosCertificates = [];
      this.numSelectedCertificates = 0;
    }
  }

  getComboCertificados() {
    // obtener certificaciones
    this.sigaServices.get("fichaCursos_getTypesCertificatesCourse").subscribe(
      n => {
        this.comboCertificates = n.certificadoCursoItem;
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboCalificaciones() {
    // obtener calificaciones
    this.sigaServices.get("fichaCursos_getQualificationsCourse").subscribe(
      n => {
        this.comboCalificaciones = n.combooItems;
        this.arregloTildesCombo(this.comboCalificaciones);
      },
      err => {
        console.log(err);
      }
    );
  }

  selectPriceModeNew(event) {
    let certificado = this.comboCertificates.find(x => x.value === event.value);

    this.newCertificate.precio = certificado.precio;
    this.newCertificate.idProductoInstitucion =
      certificado.idProductoInstitucion;
    this.newCertificate.idTipoProducto = certificado.idTipoProducto;
    this.newCertificate.idProducto = certificado.idProducto;
  }

  selectPriceModeEdit(event, dato) {
    let certificado = this.comboCertificates.find(x => x.value === event.value);

    let idCertificate = this.datosCertificates.findIndex(
      x => x.clave === event.value
    );

    if (idCertificate != -1) {
      this.datosCertificates[idCertificate].precio = certificado.precio;
      this.datosCertificates[idCertificate].idProductoInstitucion =
        certificado.idProductoInstitucion;
      this.datosCertificates[idCertificate].idTipoProducto =
        certificado.idTipoProducto;
      this.datosCertificates[idCertificate].nombreCertificado =
        certificado.descripcion;
      this.datosCertificates[idCertificate].idProducto = certificado.idProducto;
    }

    this.editCertificateTable(event, dato);
  }

  saveCertificateCourse() {
    this.editCertificate = false;
    let url = "";
    let certificados: any = undefined;
    let certicatedRepeat: boolean = false;

    if (this.pressNewCertificate) {
      //Mapeamos el certificado que queremos insertar nuevo

      certificados = this.newCertificate;
      this.newCertificate.idCurso = this.curso.idCurso;
      url = "fichaCursos_saveCertificateCourse";
    } else {
      //Enviamos al back todos los certificados editados
      certificados = new CertificadoCursoObject();
      certificados.certificadoCursoItem = JSON.parse(
        JSON.stringify(this.certificatesUpdate)
      );

      url = "fichaCursos_updateCertificatesCourse";

      //Comprobar que no se repiten certificados con las mismas calificaciones
      this.datosCertificates.forEach((elem1, index) => {
        elem1;
        this.certificatesUpdate.forEach((elem2, index) => {
          elem2;
          if (
            elem1.idProducto === elem2.idProducto &&
            elem1.idProductoInstitucion === elem2.idProductoInstitucion &&
            elem1.idTipoProducto === elem2.idTipoProducto &&
            elem1.idCalificacion === elem2.idCalificacion &&
            elem1.idCertificadoCurso != elem2.idCertificadoCurso
          ) {
            certicatedRepeat = true;
          }
        });
      });

      this.certificatesUpdate.forEach((elem1, index) => {
        elem1;
        this.certificatesUpdate.forEach((elem2, index) => {
          elem2;
          if (
            elem1.idProducto === elem2.idProducto &&
            elem1.idProductoInstitucion === elem2.idProductoInstitucion &&
            elem1.idTipoProducto === elem2.idTipoProducto &&
            elem1.idCalificacion === elem2.idCalificacion &&
            elem1.idCertificadoCurso != elem2.idCertificadoCurso
          ) {
            certicatedRepeat = true;
          }
        });
      });
    }

    this.certificatesUpdate = [];

    if (!certicatedRepeat) {
      this.sigaServices.post(url, certificados).subscribe(
        data => {
          this.progressSpinner = false;

          if (this.pressNewCertificate) {
            this.pressNewCertificate = false;
            this.modoEdicionCertificate = true;
          }

          this.getCertificatesCourse();

          if (JSON.parse(data.body).error.code == null) {
            this.showMessage(
              "info",
              this.translateService.instant("general.message.informacion"),
              JSON.parse(data.body).error.description
            );
          } else if (JSON.parse(data.body).error.code == 200) {
            this.showMessage(
              "success",
              this.translateService.instant("general.message.correct"),
              JSON.parse(data.body).error.description
            );
            this.getSessions();
            this.getCountInscriptions();
          } else if (JSON.parse(data.body).error.code == 400) {
            this.showMessage(
              "error",
              this.translateService.instant("general.message.incorrect"),
              JSON.parse(data.body).error.description
            );
          }
        },
        err => {
          this.progressSpinner = false;
          this.showFail(
            this.translateService.instant(
              "general.message.error.realiza.accion"
            )
          );
        },
        () => {
          this.progressSpinner = false;
        }
      );
    } else {
      this.editCertificate = true;
      this.showMessage(
        "info",
        this.translateService.instant("general.message.informacion"),
        this.translateService.instant(
          "formacion.mensaje.fichaCurso.certificados.misma.calificacion"
        )
      );
    }
  }

  deleteCertificates(selectedDatosCertificates) {
    let certificados = new CertificadoCursoObject();
    certificados.certificadoCursoItem = selectedDatosCertificates;

    this.sigaServices
      .post("fichaCursos_deleteCertificatesCourse", certificados)
      .subscribe(
        data => {
          this.getCertificatesCourse();
          this.selectMultipleCertificates = false;

          if (JSON.parse(data.body).error.code == null) {
            this.showMessage(
              "info",
              this.translateService.instant("general.message.informacion"),
              JSON.parse(data.body).error.description
            );
          } else if (JSON.parse(data.body).error.code == 200) {
            this.showMessage(
              "success",
              this.translateService.instant("general.message.correct"),
              JSON.parse(data.body).error.description
            );
            this.getSessions();
            this.getCountInscriptions();
          } else if (JSON.parse(data.body).error.code == 400) {
            this.showMessage(
              "error",
              this.translateService.instant("general.message.incorrect"),
              JSON.parse(data.body).error.description
            );
          }
        },
        err => {
          this.progressSpinner = false;
          this.showFail(
            this.translateService.instant(
              "general.message.error.realiza.accion"
            )
          );
        },
        () => {
          this.progressSpinner = false;
        }
      );
  }

  irEditarCertificate() {
    if (this.editCertificate) {
      this.editCertificate = false;
    } else {
      this.editCertificate = true;
    }
    this.numSelectedCertificates = this.datosCertificates.length;
  }

  restCertificates() {
    this.datosCertificates = JSON.parse(
      sessionStorage.getItem("datosCertificatesInit")
    );
    this.selectedDatosFormadores = [];
    this.numSelectedFormadores = 0;
    this.selectMultipleCertificates = false;
    this.pressNewCertificate = false;
    this.editCertificate = false;
    this.certificatesUpdate = [];
    this.tableCertificates.reset();
  }

  newCertificates() {
    this.pressNewCertificate = true;
    this.modoEdicionCertificate = false;
    this.editCertificate = true;
    this.newCertificate = new CertificadoCursoItem();
    let newCertificate = {
      idProducto: "",
      precio: "",
      idCalificacion: ""
    };

    this.datosCertificates = [newCertificate, ...this.datosCertificates];
    sessionStorage.setItem(
      "datosCertificates",
      JSON.stringify(this.datosCertificates)
    );
  }

  actualizaSeleccionadosCertificates(selectedDatos) {
    this.numSelectedCertificates = selectedDatos.length;
    if(this.numSelectedCertificates <= 1){
      this.selectMultipleCertificates = false;
    }
  }

  validateCertificate() {
    if (this.newCertificate != undefined) {
      if (
        this.newCertificate.idCalificacion == null ||
        this.newCertificate.idProducto == null ||
        this.newCertificate.idCalificacion == "" ||
        this.newCertificate.idProducto == ""
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  //Si se edita un campo input de la tabla
  editCertificateTable(event, dato) {
    this.editCertificate = true;
    this.modoEdicionCertificate = true;

    let idFindCertificate = this.certificatesUpdate.findIndex(
      x => x.idCertificadoCurso === dato.idCertificadoCurso
    );

    if (idFindCertificate == -1) {
      this.addCertificatesUpdateList(idFindCertificate, dato);
    } else {
      let id = this.datosCertificates.findIndex(
        x => x.idCertificadoCurso === dato.idCertificadoCurso
      );

      this.certificatesUpdate[idFindCertificate] = this.datosCertificates[id];
    }
  }

  addCertificatesUpdateList(idFindCertificate, dato) {
    let id = this.datosCertificates.findIndex(
      x => x.idCertificadoCurso === dato.idCertificadoCurso
    );
    this.certificatesUpdate.push(this.datosCertificates[id]);
  }

  onChangeRowsPerPagesCertificates(event) {
    this.selectedCertificates = event.value;
    this.changeDetectorRef.detectChanges();
    this.tableCertificates.reset();
  }

  //Cargas

  getColsResultsCargas() {
    this.colsCargas = [
      {
        field: "nombreFichero",
        header: "administracion.parametrosGenerales.literal.nombre"
      },
      {
        field: "fechaCarga",
        header: "censo.resultadosSolicitudesModificacion.literal.fecha"
      },
      {
        field2: "inscripcionesCorrectas",
        field: "numeroLineasTotales",
        header:
          "formacion.fichaCursos.cargaMasivaInscripciones.totalesCorrectas"
      }
    ];
  }

  setItalic(datoH) {
    if (datoH != null && datoH.fechaBaja == null) return false;
    else return true;
  }

  getHistoricoCargas() {
    this.progressSpinner = true;
    this.historico = true;

    this.sigaServices
      .getParam(
        "fichaCursos_getHistoricMassiveLoadInscriptions",
        "?idCurso=" + this.curso.idCurso
      )
      .subscribe(
        n => {
          this.datosCargas = n.cargaMasivaInscripcionesItem;
          this.progressSpinner = false;
        },
        err => {
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        }
      );
  }

  getMassiveLoadInscriptions() {
    this.progressSpinner = true;
    this.historico = false;
    this.sigaServices
      .getParam(
        "fichaCursos_getMassiveLoadInscriptions",
        "?idCurso=" + this.curso.idCurso
      )
      .subscribe(
        n => {
          this.datosCargas = n.cargaMasivaInscripcionesItem;
          this.getCountInscriptions();

          this.progressSpinner = false;
        },
        err => {
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        }
      );
  }

  downloadTemplateFile() {
    this.progressSpinner = true;
    this.sigaServices
      .postDownloadFiles("fichaCursos_downloadTemplateFile", this.curso)
      .subscribe(
        data => {
          const blob = new Blob([data], { type: "text/csv" });
          saveAs(blob, "PlantillaInscripciones.xls");
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

  downloadFile(selectedDatosCargas) {
    this.progressSpinner = true;
    let downloadFileInscriptions = new CargaMasivaInscripcionObject();
    downloadFileInscriptions.cargaMasivaInscripcionesItem = selectedDatosCargas;
    this.sigaServices
      .postDownloadFiles("fichaCursos_downloadFile", downloadFileInscriptions)
      .subscribe(
        data => {

          if (data.size != 0) {
            const blob = new Blob([data], { type: "text/csv" });
            saveAs(blob, "FicheroCargaInscripciones.xls");
          } else {
            let msg = this.translateService.instant("messages.general.error.ficheroNoExiste");
            this.showFail(msg);
          }

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
  actualizaSeleccionadosCargas(selectedDatosCargas) {
    if (selectedDatosCargas != undefined) {
      if(selectedDatosCargas.length == 1){
        // this.activacionEditar = true;
      }
      this.numSelectedCargas = selectedDatosCargas.length;
    } else {
      selectedDatosCargas = [];
    }
  }
  
  onChangeRowsPerPagesCargas(event) {
    this.selectedCargas = event.value;
    this.changeDetectorRef.detectChanges();
    this.tableCargas.reset();
  }

  onChangeSelectAllCargas() {
    if (this.selectAllCargas === true) {
      this.selectMultipleCargas = true;
      this.selectedDatosCargas = this.datosCargas;
      this.numSelectedCargas = this.datosCargas.length;
    } else {
      this.selectedDatosCargas = [];
      this.numSelectedCargas = 0;
      this.selectMultipleCargas = false;
    }
  }

  getFile(event: any) {
    let fileList: FileList = event.files;

    let nombreCompletoArchivo = fileList[0].name;
    let extensionArchivo = nombreCompletoArchivo.substring(
      nombreCompletoArchivo.lastIndexOf("."),
      nombreCompletoArchivo.length
    );

    if (
      extensionArchivo == null ||
      extensionArchivo.trim() == "" ||
      !/\.(xls)$/i.test(extensionArchivo.trim().toUpperCase())
    ) {
      this.file = undefined;
      this.archivoDisponible = false;
      this.existeArchivo = false;
      this.showMessage(
        "info",
        this.translateService.instant("general.message.informacion"),
        this.translateService.instant(
          "formacion.mensaje.extesion.fichero.erronea"
        )
      );
    } else {
      // se almacena el archivo para habilitar boton guardar
      this.file = fileList[0];
      this.archivoDisponible = true;
      this.existeArchivo = true;

      this.uploadFile();
    }
  }

  uploadFile() {
    this.numSelectedCargas = 0;
    this.progressSpinner = true;

    if (this.file != undefined) {
      this.sigaServices
        .postSendContentAndParameter(
          "fichaCursos_uploadFile",
          "?idCurso=" + this.curso.idCurso,
          this.file
        )
        .subscribe(
          data => {
            this.file = null;
            this.progressSpinner = false;

            this.showSuccess();
            this.getMassiveLoadInscriptions();
          },
          error => {
            console.log(error);
            this.showFail(
              this.translateService.instant(
                "formacion.mensaje.subida.fichero.erronea"
              )
            );
            this.progressSpinner = false;
          },
          () => {
            this.pUploadFile.clear();
            this.progressSpinner = false;
          }
        );
    }
  }
  disabledDownload() {
    if (
      this.selectedDatosCargas != null &&
      this.selectedDatosCargas.length == 1
    )
      return false;
    else return true;
  }

  disabledOthersCargas() {
    if (this.selectedDatosCargas != null && this.selectedDatosCargas.length > 0)
      return false;
    else return true;
  }

  isSelectMultipleCargas() {
    this.selectMultipleCargas = !this.selectMultipleCargas;
    if (!this.selectMultipleCargas) {
      this.selectedDatosCargas = [];
      this.numSelectedCargas = 0;
    } else {
      this.selectAllCargas = false;
      this.selectedDatosCargas = [];
      this.numSelectedCargas = 0;
    }
  }

  deleteInscriptions(selectedDatosCargas) {
    this.progressSpinner = true;
    let deleteInscriptions = new CargaMasivaInscripcionObject();
    deleteInscriptions.cargaMasivaInscripcionesItem = selectedDatosCargas;

    this.sigaServices
      .post("fichaCursos_deleteInscriptionsCourse", deleteInscriptions)
      .subscribe(
        data => {
          this.progressSpinner = false;

          this.getCountInscriptions();
          this.getMassiveLoadInscriptions();

          if (JSON.parse(data.body).error.code == null) {
            this.showMessage(
              "info",
              this.translateService.instant("general.message.informacion"),
              JSON.parse(data.body).error.description
            );
          } else if (JSON.parse(data.body).error.code == 200) {
            this.showMessage(
              "success",
              this.translateService.instant("general.message.correct"),
              JSON.parse(data.body).error.description
            );
          } else if (JSON.parse(data.body).error.code == 400) {
            this.showMessage(
              "error",
              this.translateService.instant("general.message.incorrect"),
              JSON.parse(data.body).error.description
            );
          }

          this.selectMultipleCargas = false;
          this.selectAllCargas = false;
        },
        err => {
          this.showFail(
            this.translateService.instant(
              "general.message.error.realiza.accion"
            )
          );
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        }
      );
  }

  autovalidateInscriptions(selectedDatosCargas) {
    this.numSelectedCargas = 0;
    this.progressSpinner = true;
    let autovalidateInscriptions = new CargaMasivaInscripcionObject();
    autovalidateInscriptions.cargaMasivaInscripcionesItem = selectedDatosCargas;

    this.sigaServices
      .post(
        "fichaCursos_autovalidateInscriptionsCourse",
        autovalidateInscriptions
      )
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.getCountInscriptions();

          if (JSON.parse(data.body).error.code == null) {
            this.showMessage(
              "info",
              this.translateService.instant("general.message.informacion"),
              JSON.parse(data.body).error.description
            );
          } else if (JSON.parse(data.body).error.code == 200) {
            this.showMessage(
              "success",
              this.translateService.instant("general.message.correct"),
              JSON.parse(data.body).error.description
            );
          } else if (JSON.parse(data.body).error.code == 400) {
            this.showMessage(
              "error",
              this.translateService.instant("general.message.incorrect"),
              JSON.parse(data.body).error.description
            );
          }

          this.selectMultipleCargas = false;
          this.selectAllCargas = false;
        },
        err => {
          this.showFail(
            this.translateService.instant(
              "general.message.error.realiza.accion"
            )
          );
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        }
      );
  }

  //FUNCIONES GENERALES
  getFichasPosibles() {
    this.fichasPosibles = [
      {
        key: "generales",
        activa: true
      },
      {
        key: "price",
        activa: true
      },
      {
        key: "descripcion",
        activa: true
      },
      {
        key: "formadores",
        activa: true
      },
      {
        key: "inscription",
        activa: true
      },
      {
        key: "certificate",
        activa: true
      },
      {
        key: "session",
        activa: true
      },
      {
        key: "carga",
        activa: true
      }
    ];
  }

  //Funciones controlan las fichas
  esFichaActiva(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    return fichaPosible.activa;
  }

  abrirFicha(key) {
    this.onlyCheckDatos();
    let fichaPosible = this.getFichaPosibleByKey(key);
    fichaPosible.activa = !fichaPosible.activa;
  }

  abreCierraFicha(key) {
    
    if(!this.openFicha){
      this.onlyCheckDatos();
    }
    let fichaPosible = this.getFichaPosibleByKey(key);
    if (this.modoEdicion) {
      fichaPosible.activa = !fichaPosible.activa;
    }
    this.openFicha = !this.openFicha;
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

  backTo() {
    // sessionStorage.removeItem("filtrosBusquedaCursos");

    if (this.persistenciaFichaCurso != undefined) {
      sessionStorage.setItem(
        "filtrosBusquedaCursosFichaCursos",
        JSON.stringify(this.persistenciaFichaCurso)
      );
    }

    if (
      sessionStorage.getItem("isInscripcion") != null &&
      sessionStorage.getItem("isInscripcion") != undefined
    ) {
      sessionStorage.removeItem("isInscripcion");
      this.router.navigate(["/buscarCursos"]);
    } else {
      if (sessionStorage.getItem("rutaVolver")) {
        this.router.navigate([sessionStorage.getItem("rutaVolver")]);
      } else {
        this.location.back();
      }
    }
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

  getRandomColor() {
    var color = Math.floor(0x1000000 * Math.random()).toString(16);
    return "#" + ("000000" + color).slice(-6);
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  showSuccessDelete() {
    this.msgs = [];
    this.msgs.push({
      severity: "success",
      summary: this.translateService.instant("general.message.correct"),
      detail: this.translateService.instant("general.message.accion.realizada")
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

  clear() {
    this.msgs = [];
  }

  arreglarFecha(fecha) {
    let jsonDate = JSON.stringify(fecha);
    let rawDate;
    if (jsonDate.length == 30) {
      rawDate = jsonDate.slice(3, -3);
    } else {
      rawDate = jsonDate.slice(1, -1);
    }
    if (rawDate.length < 14) {
      let splitDate = rawDate.split("/");
      let arrayDate = splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0];
      fecha = new Date((arrayDate += "T00:00:00.001Z"));
    } else {
      fecha = new Date(rawDate);
    }

    return fecha;
  }

  showFail(mensaje: string) {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: this.translateService.instant("general.message.incorrect"),
      detail: mensaje
    });
  }

  irInscripcion() {
    sessionStorage.setItem(
      "idCursoInscripcion",
      JSON.stringify(this.curso.idCurso)
    );
    sessionStorage.setItem("pantallaFichaCurso", "true");
    this.router.navigate(["/fichaInscripcion"]);
  }

  controlBotonesEstado(button: string) {
    let estado = this.curso.idEstado;
    if (this.modoEdicion && this.activacionEditar) {
      if (button == "Cancelar")
        if (
          estado != this.valorEstadoFinalizado &&
          estado != this.valorEstadoCancelado
        )
          return true;

      if (button == "Finalizar")
        if (estado == this.valorEstadoImpartido) return true;

      if (button == "Desanunciar")
        if (estado == this.valorEstadoAnunciado) return true;

      if (button == "Anunciar")
        if (estado == this.valorEstadoAbierto) return true;

      if (button == "Inscripcion") {
        if (this.controlFechaInscripcion()) {
          if (
            estado == this.valorEstadoAnunciado ||
            estado == this.valorEstadoEnCurso
          )
            return true;
        } else if (
          this.modoEdicion &&
          button == "Inscripcion" &&
          this.otraInstitucion
        ) {
          if (
            estado == this.valorEstadoAnunciado ||
            estado == this.valorEstadoEnCurso
          )
            return true;
        }
      }

      if (button == "DescargarPlantilla") return true;

      // Solo debería de entrar en el caso de ser el botón de inscripcion, para controlar la casuística de entrar desde otro colegio
    } else if (
      this.otraInstitucion &&
      this.modoEdicion &&
      button == "Inscripcion"
    ) {
      if (this.controlFechaInscripcion()) {
        if (
          estado == this.valorEstadoAnunciado ||
          estado == this.valorEstadoEnCurso
        )
          return true;
      }
    } else if (
      this.otraInstitucion &&
      this.modoEdicion &&
      button == "DescargarPlantilla"
    ) {
      return true;
    }
  }

  controlFechaInscripcion() {
    let fechaActual = new Date();
    let fechaInicioInscripcion = this.curso.fechaInscripcionDesdeDate;
    let fechaFinIncripcion = this.curso.fechaInscripcionHastaDate;

    if (fechaActual <= fechaFinIncripcion && fechaActual >= fechaInicioInscripcion) {
      return true;
    } else {
      return false;
    }
  }

  comprobarFecha(newValue) {
    let hoy = new Date();
    let fecha = moment(newValue, 'DD/MM/YYYY').toDate();
    let year = hoy.getFullYear();
    let yearFecha = fecha.getFullYear();
    if (yearFecha >= year - 80 && yearFecha <= year + 20) {
      return true;
    } else {
      return false;
    }
  }

  comprobarFechaFinInscripcion() {

    if (this.curso.fechaInscripcionDesdeDate < new Date()) {
      return false;
    } else {
      return true;
    }
  }

  fillFechaInicioImparticion(event) {
    this.curso.fechaImparticionDesdeDate = event;
  }

  fillFechaFinImparticion(event) {
    this.curso.fechaImparticionHastaDate = event;
  }

  arreglarFechaString(fecha) {
    let jsonDate = JSON.stringify(fecha);
    let rawDate = jsonDate.slice(1, -15);
    let splitDate = rawDate.split("-");
    let arrayDate = splitDate[2] + "/" + splitDate[1] + "/" + splitDate[0];
    // fecha = new Date((arrayDate += "T00:00:00.001Z"));
    // fecha = new Date(rawDate);
    return arrayDate;
  }

  styleObligatorio(evento) {
    if (this.resaltadoDatos && (evento == undefined || evento == null || evento == "")) {
      return this.commonsService.styleObligatorio(evento);
    }
  }

  muestraCamposObligatorios() {
    this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios') }];
    this.resaltadoDatos = true;
  }

  checkDatos() {
    if (this.validateCourse()) {
      this.muestraCamposObligatorios();
    } else {
      this.saveCourse();
    }
  }

  ngOnDestroy() {
    // sessionStorage.removeItem("isCancelado");
  }

  isOpenReceive(event) {
    let fichaPosible = this.esFichaActiva(event);
    if (fichaPosible == false) {
      this.abreCierraFicha(event);
    }
    // window.scrollTo(0,0);
  }

  clickFilaFormadores(event) {
    if (event.data != undefined) {
      this.numSelectedFormadores = this.selectedDatosFormadores.length
      if(this.numSelectedFormadores > 1){
        this.selectMultipleFormadores = true;
      }
    }
  }

  clickFilaCertificados(event) {
    if (event != undefined) {
      this.numSelectedCertificates = this.selectedDatosCertificates.length
      if(this.numSelectedCertificates > 1){
        this.selectMultipleCertificates = true;
      }
    }
  }

  CheckClick(event){
    this.selectedDatosFormadores = [];
    this.numSelectedFormadores = 0;
  }

  onlyCheckDatos() {
    if (!this.validateCourse()) {
      this.resaltadoDatos=true;
    } 
  }
}
