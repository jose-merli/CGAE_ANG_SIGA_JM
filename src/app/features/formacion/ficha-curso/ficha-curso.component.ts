import { Location } from "@angular/common";
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from "@angular/core";
import { saveAs } from "file-saver/FileSaver";
import { Router } from "../../../../../node_modules/@angular/router";
import { ConfirmationService } from "../../../../../node_modules/primeng/api";
import {
  AutoComplete,
  Dropdown
} from "../../../../../node_modules/primeng/primeng";
import { TranslateService } from "../../../commons/translate";
import { CertificadoItem } from "../../../models/CertificadoItem";
import { DatosCursosItem } from "../../../models/DatosCursosItem";
import { DatosCursosObject } from "../../../models/DatosCursosObject";
import { DatosInscripcionItem } from "../../../models/DatosInscripcionItem";
import { ErrorItem } from "../../../models/ErrorItem";
import { FormadorCursoItem } from "../../../models/FormadorCursoItem";
import { FormadorCursoObject } from "../../../models/FormadorCursoObject";
import { esCalendar } from "../../../utils/calendar";
import { AuthenticationService } from "../../../_services/authentication.service";
import { SigaServices } from "../../../_services/siga.service";
import { DomSanitizer } from "../../../../../node_modules/@angular/platform-browser";
import { CargaMasivaInscripcionObject } from "../../../models/CargaMasivaInscripcionObject";

@Component({
  selector: "app-ficha-curso",
  templateUrl: "./ficha-curso.component.html",
  styleUrls: ["./ficha-curso.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class FichaCursoComponent implements OnInit {
  openFicha;
  fichasPosibles;
  msgs;
  results;
  es: any = esCalendar;
  marginPx = "4px";
  bw = "white";

  modoEdicion: boolean = false;
  fieldNoEditable: boolean = true;
  progressSpinner: boolean = false;
  curso: DatosCursosItem = new DatosCursosItem();

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

  //Formadores
  @ViewChild("tableFormadores")
  tableFormadores;

  //Formadores
  @ViewChild("tableCertificates")
  tableCertificates;

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

  @ViewChild("autocompleteService")
  autocompleteService: AutoComplete;

  @ViewChild("autocompleteTopics")
  autocompleteTopics: AutoComplete;

  //Generales
  valorEstadoAbierto = "0";
  valorEstadoAnunciado = "1";
  valorTipoInicioIncripcion = "4";
  valorTipoFinIncripcion = "5";
  valorTipoSesion = "8";
  asignarTutor = 1;
  desasignarTutor = 0;
  comboTopics: any[] = [];
  comboService: any[] = [];
  suggestService: any[] = [];
  suggestTopics: any[] = [];
  resultsService: any[] = [];
  resultsTopics: any[] = [];
  edicionDocumentoAdjunto:boolean = true;
  edicionEncuestaSatisfaccion:boolean = true;
  edicionInformacionAdicional:boolean = true;


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
  colsSessions;
  selectedItemSessions;
  datosSessions = [];
  selectedDatosSessions;
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
  selectedDatosCertificates;
  selectAllCertificates: any;
  selectedCertificates: number = 10;
  selectMultipleCertificates: boolean = false;
  numSelectedCertificates: number = 0;
  comboCertificates;
  editCertificate: boolean = false;
  modoEdicionCertificate: boolean = true;
  pressNewCertificate: boolean = false;
  newCertificate: CertificadoItem;
  comboCalificaciones;
  certificatesUpdate = [];

  //Cargas
  colsCargas;
  selectedItemCargas;
  datosCargas = [];
  selectedDatosCargas;
  selectAllCargas: any;
  selectedCargas: number = 10;
  selectMultipleCargas: boolean = false;
  numSelectedCargas: number = 0;
  comboCargas;
  archivoDisponible: boolean = false;
  existeArchivo: boolean = false;
  save_file: any;

  file: File = undefined;

  constructor(
    private sigaServices: SigaServices,
    private router: Router,
    private location: Location,
    private translateService: TranslateService,
    private confirmationService: ConfirmationService,
    private authenticationService: AuthenticationService,
    private changeDetectorRef: ChangeDetectorRef,
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.progressSpinner = true;
    this.getFichasPosibles();
    this.getCombosDatosGenerales();
    this.getCombosFormadores();
    this.getColsResultsFormadores();
    this.getColsResultsSessions();
    this.getColsResultsCertificates();
    this.getColsResultsCargas();

    sessionStorage.removeItem("isFormacionCalendar");
    sessionStorage.removeItem("abrirFormador");

    //1.Proviene de la creacion evento Incripcion Inicio
    if (
      sessionStorage.getItem("isFormacionCalendarByStartInscripcion") == "true"
    ) {
      this.curso = new DatosCursosItem();
      this.curso = JSON.parse(sessionStorage.getItem("courseCurrent"));

      this.curso.idEventoInicioInscripcion = sessionStorage.getItem(
        "idEventoInicioInscripcion"
      );
      sessionStorage.removeItem("idEventoInicioInscripcion");

      if (this.curso.idCurso != null && this.curso.idCurso != undefined) {
        this.searchCourse(this.curso.idCurso);
        this.modoEdicion = true;
      } else {
        //Si no se ha guardado el evento limpiamos la fecha introducida
        if (this.curso.idEventoInicioInscripcion == "undefined") {
          this.curso.fechaInscripcionDesdeDate = null;
        }
      }

      this.arreglarFechasEvento();
      this.getMassiveLoadInscriptions();
      this.configurationInformacionAdicional();

      //2.Proviene de la creacion evento Incripcion Fin
    } else if (
      sessionStorage.getItem("isFormacionCalendarByStartInscripcion") == "false"
    ) {
      this.curso = new DatosCursosItem();
      this.curso = JSON.parse(sessionStorage.getItem("courseCurrent"));
      this.curso.idEventoFinInscripcion = sessionStorage.getItem(
        "idEventoFinInscripcion"
      );
      sessionStorage.removeItem("idEventoFinInscripcion");

      if (this.curso.idCurso != null && this.curso.idCurso != undefined) {
        this.searchCourse(this.curso.idCurso);
        this.modoEdicion = true;
      } else {
        //Si no se ha guardado el evento limpiamos la fecha introducida
        if (this.curso.idEventoFinInscripcion == "undefined") {
          this.curso.fechaInscripcionHastaDate = null;
        }
      }

      this.arreglarFechasEvento();
      this.getMassiveLoadInscriptions();
      this.configurationInformacionAdicional();

      //3. Estamos en modo edicion
    } else if (sessionStorage.getItem("modoEdicionCurso") == "true") {
      this.modoEdicion = true;
      this.curso = JSON.parse(sessionStorage.getItem("courseCurrent"));

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

      if (this.curso.fechaInscripcionDesde != null) {
        this.curso.fechaInscripcionDesdeDate = this.arreglarFecha(
          this.curso.fechaInscripcionDesde
        );
      }

      if (this.curso.fechaInscripcionHasta != null) {
        this.curso.fechaInscripcionHastaDate = this.arreglarFecha(
          this.curso.fechaInscripcionHasta
        );
      }

      if (this.curso.autovalidacionInscripcion == "1") {
        this.curso.autovalidacion = true;
      } else {
        this.curso.autovalidacion = false;
      }

      if (
        (sessionStorage.getItem("formador") != null ||
          sessionStorage.getItem("formador") != undefined) &&
        sessionStorage.getItem("toBackNewFormador") == "true"
      ) {
        sessionStorage.removeItem("toBackNewFormador");
        this.pressNewFormador = true;
        this.modoEdicionFormador = false;
        this.editFormador = true;
        this.loadNewTrainer(JSON.parse(sessionStorage.getItem("formador")));
      } else {
        this.getTrainers();
      }

      this.getSessions();
      this.getServicesCourse();
      this.getTopicsCourse();
      this.getCountInscriptions();
      this.getMassiveLoadInscriptions();
      this.configurationInformacionAdicional();

      //4. Viene de la ficha de inscripcion
    } else if (sessionStorage.getItem("isInscripcion") == "true") {
      this.curso = new DatosCursosItem();
      this.curso.idCurso = JSON.parse(
        sessionStorage.getItem("codigoCursoInscripcion")
      );
      this.searchCourse(this.curso.idCurso);
      this.getMassiveLoadInscriptions();
      this.configurationInformacionAdicional();

      sessionStorage.removeItem("isInscripcion");
      sessionStorage.removeItem("codigoCursoInscripcion");

      //5. Modo nuevo
    } else {
      this.modoEdicion = false;
      this.curso = new DatosCursosItem();
      //Obligamos a que sea el curso nuevo privado
      this.curso.idVisibilidad = "1";
      this.curso.idEstado = this.valorEstadoAbierto;
      let colegio = 1;
      this.onChangeSelectVisibilidadObligate(colegio);
    }

    this.getNumTutor();
  }

  //TARJETA DATOS GENERALES

  configurationInformacionAdicional(){
    if(this.curso.adjunto != null && this.curso.adjunto != undefined && this.curso.adjunto != ""){
      this.edicionDocumentoAdjunto = false;
    } else{
      this.edicionDocumentoAdjunto = true;
    }

    if(this.curso.adicional != null && this.curso.adicional != undefined && this.curso.adicional != ""){
      this.edicionInformacionAdicional = false;
    } else{
      this.edicionInformacionAdicional = true;
    }

    if(this.curso.encuesta != null && this.curso.encuesta != undefined && this.curso.encuesta != ""){
      this.edicionEncuestaSatisfaccion = false;
    } else{
      this.edicionEncuestaSatisfaccion = true;
    }
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
      this.curso.fechaInscripcionDesdeDate = this.arreglarFecha(
        this.curso.fechaInscripcionDesdeDate
      );
    }

    if (this.curso.fechaInscripcionHastaDate != null) {
      this.curso.fechaInscripcionHastaDate = this.arreglarFecha(
        this.curso.fechaInscripcionHastaDate
      );
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
    this.backgroundColor = this.getRandomColor();
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

  getServicesCourse() {
    this.progressSpinner = true;
    this.sigaServices
      .getParam(
        "fichaCursos_getServicesSpecificCourse",
        "?idCurso=" + this.curso.idCurso
      )
      .subscribe(
        n => {
          this.resultsService = n.combooItems;

          this.resultsService.forEach(e => {
            if (e.color == undefined) {
              e.color = this.getRandomColor();
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
              e.color = this.getRandomColor();
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
    if (event.value == 1) {
      this.deshabilitarCombCol = true;
      this.curso.colegio = this.authenticationService.getInstitucionSession();
    } else {
      this.deshabilitarCombCol = false;
    }
  }

  onChangeSelectVisibilidadObligate(colegio) {
    if (colegio == 1) {
      this.deshabilitarCombCol = true;
      this.curso.colegio = this.authenticationService.getInstitucionSession();
      this.progressSpinner = false;

    } else {
      this.deshabilitarCombCol = false;
    }
  }

  onChangeSelectColegio(event) {
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

    this.curso.tipoServicios = this.resultsService;
    this.curso.temasCombo = this.resultsTopics;

    if (this.modoEdicion) {
      //Enviamos al back todos los formadores editados
      url = "fichaCursos_updateCourse";
    } else {
      //Mapeamos el formador que queremos insertar nuevo
      url = "fichaCursos_saveCourse";
    }

    this.sigaServices.post(url, this.curso).subscribe(
      data => {
        this.progressSpinner = false;

        this.showSuccess();

        if (!this.modoEdicion) {
          this.curso.idCurso = JSON.parse(data.body).id;
          this.getCountInscriptions();
        }
        this.modoEdicion = true;
        this.configurationInformacionAdicional();
      },
      err => {
        this.progressSpinner = false;
        this.showFail("La acción no se ha realizado correctamente");
      },
      () => {
        this.progressSpinner = false;
      }
    );
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
      this.showFail("El curso debe tener el estado abierto para ser anunciado");
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
      this.showFail(
        "El curso debe tener el estado anunciado para ser desanunciado"
      );
    }
  }

  selectStartDateInscription(event) {
    if (this.curso.fechaInscripcionDesdeDate != null) {
      this.curso.idTipoEvento = this.valorTipoInicioIncripcion;
    }

    this.curso.fechaInscripcionDesdeDate = event;
    sessionStorage.setItem("courseCurrent", JSON.stringify(this.curso));
    sessionStorage.setItem("isFormacionCalendarByStartInscripcion", "true");
    sessionStorage.setItem("curso", JSON.stringify(this.curso));
    this.router.navigate(["/fichaEventos"]);
  }

  selectEndDateInscription(event) {
    if (this.curso.idEventoFinInscripcion != null) {
      this.curso.idTipoEvento = this.valorTipoFinIncripcion;
    }

    this.curso.fechaInscripcionHastaDate = event;
    sessionStorage.setItem("courseCurrent", JSON.stringify(this.curso));
    sessionStorage.setItem("isFormacionCalendarByStartInscripcion", "false");
    sessionStorage.setItem("curso", JSON.stringify(this.curso));
    this.router.navigate(["/fichaEventos"]);
  }

  searchCourse(idCurso) {
    this.progressSpinner = true;
    this.sigaServices.post("fichaCursos_searchCourse", idCurso).subscribe(
      data => {
        this.progressSpinner = false;
        this.curso = JSON.parse(data.body);

        if (this.curso.fechaInscripcionDesdeDate != null) {
          this.curso.fechaInscripcionDesdeDate = new Date(
            this.curso.fechaInscripcionDesdeDate
          );
        }

        if (this.curso.fechaInscripcionHastaDate != null) {
          this.curso.fechaInscripcionHastaDate = new Date(
            this.curso.fechaInscripcionHastaDate
          );
        }

        this.getSessions();
        this.getServicesCourse();
        this.getTopicsCourse();
        this.getCountInscriptions();
      },
      err => {
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
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
            e.color = this.getRandomColor();
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
            e.color = this.getRandomColor();
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
        let findTopic = this.resultsTopics.find(
          x => x.value === element.value
        );
        if (findTopic == undefined) {
          this.suggestTopics.push(element);
        }
      }
    });

    this.resultsTopics.forEach(e => {
      if (e.color == undefined) {
        e.color = this.getRandomColor();
      }
    });
  }

  resetSuggestServicesTopics() {
    this.autocompleteTopics.panelVisible = false;
  }

  visiblePanelBlurTopics(event) {
    if (this.autocompleteTopics.highlightOption != undefined) {
      this.autocompleteTopics.highlightOption.color = this.getRandomColor();
      this.resultsTopics.push(this.autocompleteTopics.highlightOption);
      this.autocompleteTopics.highlightOption = undefined;
    }
    this.autocompleteTopics.panelVisible = false;
  }

  visiblePanelOnSelectTopics() {
    this.autocompleteTopics.panelVisible = false;
  }

  filterServices(event) {
    let query = event.query;

    if (
      this.comboService.length > 0 &&
      this.comboService.length != this.resultsService.length
    ) {
      if (this.resultsService.length > 0) {
        this.suggestService = [];

        this.comboService.forEach(element => {
          let findService = this.resultsService.find(
            x => x.value === element.value
          );
          if (findService == undefined) {
            this.suggestService.push(element);
          }
        });

        this.resultsService.forEach(e => {
          if (e.color == undefined) {
            e.color = this.getRandomColor();
          }
        });
      } else {
        this.suggestService = JSON.parse(JSON.stringify(this.comboService));
      }
      this.autocompleteService.suggestionsUpdated = true;
      this.autocompleteService.panelVisible = true;
      this.autocompleteService.focusInput();
    } else {
      if (this.autocompleteService.highlightOption != undefined) {
        this.resultsService.forEach(e => {
          if (e.color == undefined) {
            e.color = this.getRandomColor();
          }
        });
      }

      this.autocompleteService.panelVisible = false;
      this.autocompleteService.focusInput();
    }
  }

  filterLabelsMultiple(event) {
    let query = event.query;
    this.suggestService = [];

    this.comboService.forEach(element => {
      if (element.label.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        let findService = this.resultsService.find(
          x => x.value === element.value
        );
        if (findService == undefined) {
          this.suggestService.push(element);
        }
      }
    });

    this.resultsService.forEach(e => {
      if (e.color == undefined) {
        e.color = this.getRandomColor();
      }
    });
  }

  resetSuggestServices() {
    this.autocompleteService.panelVisible = false;
  }

  visiblePanelBlur(event) {
    if (this.autocompleteService.highlightOption != undefined) {
      this.autocompleteService.highlightOption.color = this.getRandomColor();
      this.resultsService.push(this.autocompleteService.highlightOption);
      this.autocompleteService.highlightOption = undefined;
    }
    this.autocompleteService.panelVisible = false;
  }

  visiblePanelOnSelect() {
    this.autocompleteService.panelVisible = false;
  }

  showInfoServices() {
    this.msgs = [];
    this.msgs.push({
      severity: "info",
      summary: "Información",
      detail: "No hay servicios definidos para este curso."
    });
  }

  editDocumentoAdjunto(){
    if(this.edicionDocumentoAdjunto)
    this.edicionDocumentoAdjunto = false;
    else
    this.edicionDocumentoAdjunto = true;
  }

  editInformacionAdicional(){
    if(this.edicionInformacionAdicional)
    this.edicionInformacionAdicional = false;
    else
    this.edicionInformacionAdicional = true;
  }

  editEncuestaSatisfaccion(){
    if(this.edicionEncuestaSatisfaccion)
    this.edicionEncuestaSatisfaccion = false;
    else
    this.edicionEncuestaSatisfaccion = true;
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
        header: "general.boton.actualizarTarifa"
      }
      // {
      //   field: "flagTutor",
      //   header: "form.busquedaCursos.literal.tutorResponsable"
      // }
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
  }

  restTrainer() {
    this.datosFormadores = JSON.parse(
      sessionStorage.getItem("datosFormadoresInit")
    );

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
    this.router.navigate(["/busquedaGeneral"]);
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

  actualizaSeleccionados(selectedDatos) {
    this.numSelectedFormadores = selectedDatos.length;
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
      if (this.numCheckedTutor == 1 && this.newFormadorCourse.idRol == "1") {
        mess = "¿Estás seguro que desea cambiar el tutor del curso?";

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
                summary: "Cancel",
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
      },
      err => {
        this.progressSpinner = false;
      }
    );
  }

  //Funciones que controlan los formadores editados
  //Si se edita un campo input de la tabla
  editFormadorTable(event) {
    this.editFormador = true;
    this.modoEdicionFormador = true;

    let idFindFormador = this.formadoresUpdate.findIndex(
      x => x.idPersona === event.data.idPersona && x.idRol === event.data.idRol
    );

    if (idFindFormador == -1) {
      this.addTrainerUpdateList(idFindFormador, event.data);
    } else {
      let id = this.datosFormadores.findIndex(
        x =>
          x.idPersona === event.data.idPersona && x.idRol === event.data.idRol
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
      mess = "¿Estás seguro que desea cambiar el tutor del curso?";

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
              summary: "Cancel",
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
    this.selectMultipleFormadores = !this.selectMultipleSessions;
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
    this.router.navigate(["/fichaEventos"]);
  }

  irEditarSession(id) {
    if (id.length >= 1 && this.selectMultipleSessions == false) {
      sessionStorage.setItem("modoEdicionSession", "true");
      sessionStorage.removeItem("eventoSelected");
      sessionStorage.setItem("eventoSelected", JSON.stringify(id[0]));
      sessionStorage.setItem("sessions", JSON.stringify(this.datosSessions));
      this.router.navigate(["/fichaEventos"]);
      sessionStorage.setItem("fichaAbierta", "true");
    }
  }

  actualizaSeleccionadosSessions(selectedDatosSessions) {
    this.numSelectedSessions = selectedDatosSessions.length;
  }

  onChangeRowsPerPagesSessions(event) {
    this.selectedSessions = event.value;
    this.changeDetectorRef.detectChanges();
    this.tableSessions.reset();
  }

  //Inscripciones
  irBusquedaInscripcciones() {
    this.router.navigate(["/buscarInscripciones"]);
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
        field: "tipoCertificado",
        header: "menu.certificados",
        value: "labelTipoCertificado"
      },
      {
        field: "precio",
        header: "form.busquedaCursos.literal.precio"
      },
      {
        field: "idCalificacion",
        header: "formacion.busquedaInscripcion.calificacion",
        value: "labelCalificacion"
      }
    ];

    let certificado = new CertificadoItem();
    certificado.tipoCertificado = "1";
    certificado.precio = "20";
    certificado.idCalificacion = "1";
    certificado.labelCalificacion = "SOBRESALIENTE";
    certificado.labelTipoCertificado = "Prueba 1";

    this.datosCertificates.push(certificado);

    this.getComboCalificaciones();
    this.getComboCertificados();
  }

  isSelectMultipleCertificates() {
    this.selectMultipleFormadores = !this.selectMultipleCertificates;
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
    this.comboCertificates = [
      {
        label: "Prueba 1",
        value: "1"
      },
      {
        label: "Prueba 2",
        value: "2"
      }
    ];
  }

  getComboCalificaciones() {
    this.comboCalificaciones = [
      {
        label: "SOBRESALIENTE",
        value: "1"
      },
      {
        label: "SUSPENSO",
        value: "2"
      }
    ];
  }

  irEditarCertificate() {
    if (this.editCertificate) {
      this.editCertificate = false;
    } else {
      this.editCertificate = true;
    }
  }

  restCertificates() {
    this.datosCertificates = JSON.parse(
      sessionStorage.getItem("datosCertificatesInit")
    );
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
    this.newCertificate = new CertificadoItem();
    let newCertificate = {
      tipoCertificado: "",
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
  }

  validateCertificate() {
    if (
      this.newCertificate.idCalificacion == null ||
      this.newCertificate.tipoCertificado == null ||
      this.newCertificate.precio == null ||
      this.newCertificate.idCalificacion == "" ||
      this.newCertificate.tipoCertificado == "" ||
      this.newCertificate.precio == ""
    ) {
      return true;
    } else {
      return false;
    }
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
        header: "formacion.fichaCursos.cargaMasivaInscripciones.totalesCorrectas"
      }
    ];
  }

  getMassiveLoadInscriptions() {
    this.progressSpinner = true;
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

  actualizaSeleccionadosCargas(selectedDatosCargas) {
    this.numSelectedCargas = selectedDatosCargas.length;
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
      !/\.(xls|xlsx)$/i.test(extensionArchivo.trim().toUpperCase())
    ) {
      // Mensaje de error de formato de imagen y deshabilitar boton guardar
      this.file = undefined;
      this.archivoDisponible = false;
      this.existeArchivo = false;
    } else {
      // se almacena el archivo para habilitar boton guardar
      this.file = fileList[0];
      this.archivoDisponible = true;
      //
      this.existeArchivo = true;
      let urlCreator = window.URL;
      this.save_file = this.domSanitizer.bypassSecurityTrustUrl(
        urlCreator.createObjectURL(this.file)
      );

      this.uploadFile();
    }
  }

  uploadFile() {
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
            this.showFail("Error en la subida del fichero.");
            this.progressSpinner = false;
          },
          () => {
            this.pUploadFile.clear();
            this.progressSpinner = false;
          }
        );
    }
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

          if(JSON.parse(data.body).error.code == null){
            this.showMessage("info", "Información", JSON.parse(data.body).error.description);
          }else if(JSON.parse(data.body).error.code == 200){
            this.showMessage("success", "Correcto", JSON.parse(data.body).error.description);
          }else if(JSON.parse(data.body).error.code == 400){
            this.showMessage("error", "Incorrecto", JSON.parse(data.body).error.description);
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
    this.progressSpinner = true;
    let autovalidateInscriptions = new CargaMasivaInscripcionObject();
    autovalidateInscriptions.cargaMasivaInscripcionesItem = selectedDatosCargas;

    this.sigaServices
      .post("fichaCursos_autovalidateInscriptionsCourse", autovalidateInscriptions)
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.getCountInscriptions();

          if(JSON.parse(data.body).error.code == null){
            this.showMessage("info", "Información", JSON.parse(data.body).error.description);
          }else if(JSON.parse(data.body).error.code == 200){
            this.showMessage("success", "Correcto", JSON.parse(data.body).error.description);
          }else if(JSON.parse(data.body).error.code == 400){
            this.showMessage("error", "Incorrecto", JSON.parse(data.body).error.description);
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
        activa: false
      },
      {
        key: "formadores",
        activa: false
      },
      {
        key: "inscription",
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
        key: "communications",
        activa: false
      },
      {
        key: "carga",
        activa: false
      }
    ];
  }

  //Funciones controlan las fichas
  esFichaActiva(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    return fichaPosible.activa;
  }

  abrirFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    fichaPosible.activa = !fichaPosible.activa;
  }

  abreCierraFicha(key) {
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
    this.location.back();
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
      summary: "Correcto",
      detail: this.translateService.instant("general.message.accion.realizada")
    });
  }

  showSuccess() {
    this.msgs = [];
    this.msgs.push({
      severity: "success",
      summary: "Correcto",
      detail: this.translateService.instant("general.message.accion.realizada")
    });
  }

  clear() {
    this.msgs = [];
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

  showInfo(message: string) {
    this.msgs = [];
    this.msgs.push({
      severity: "info",
      summary: "Error",
      detail: message
    });
  }

  showFail(mensaje: string) {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Incorrecto",
      detail: mensaje
    });
  }
}
