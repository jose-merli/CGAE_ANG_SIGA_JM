import { Location } from "@angular/common";
import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { Router } from "../../../../../node_modules/@angular/router";
import { ConfirmationService } from "../../../../../node_modules/primeng/api";
import { Dropdown } from "../../../../../node_modules/primeng/primeng";
import { TranslateService } from "../../../commons/translate";
import { CertificadoItem } from "../../../models/CertificadoItem";
import { DatosCursosItem } from "../../../models/DatosCursosItem";
import { ErrorItem } from "../../../models/ErrorItem";
import { FormadorCursoItem } from "../../../models/FormadorCursoItem";
import { FormadorCursoObject } from "../../../models/FormadorCursoObject";
import { esCalendar } from "../../../utils/calendar";
import { AuthenticationService } from "../../../_services/authentication.service";
import { SigaServices } from "../../../_services/siga.service";
import { DatosCursosObject } from "../../../models/DatosCursosObject";

@Component({
  selector: "app-ficha-curso",
  templateUrl: "./ficha-curso.component.html",
  styleUrls: ["./ficha-curso.component.scss"]
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
  temasSuggest;

  // COMBOS
  comboVisibilidad: any[];
  comboColegios: any[];
  comboEstados: any[];
  comboDisponibilidadPlazas: any[];
  comboTemas: any[];

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

  //Colegios
  @ViewChild("colegio")
  colegio: Dropdown;

  //Generales
  valorEstadoAbierto = "0";
  valorEstadoAnunciado = "1";
  valorTipoInicioIncripcion = "4";
  valorTipoFinIncripcion = "5";
  valorTipoSesion = "8";

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

  constructor(
    private sigaServices: SigaServices,
    private router: Router,
    private location: Location,
    private translateService: TranslateService,
    private confirmationService: ConfirmationService,
    private authenticationService: AuthenticationService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.progressSpinner = true;
    this.getFichasPosibles();
    this.getCombosDatosGenerales();
    this.getColsResultsFormadores();
    this.getColsResultsSessions();
    this.getColsResultsCertificates();
    this.getComboRoles();
    this.getComboTipoCoste();
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
      this.progressSpinner = false;

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
      this.progressSpinner = false;

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

      this.progressSpinner = false;

      //4. Modo nuevo
    } else {
      this.modoEdicion = false;
      this.curso = new DatosCursosItem();
      //Obligamos a que sea el curso nuevo privado
      this.curso.idVisibilidad = "1";
      this.curso.idEstado = this.valorEstadoAbierto;
      let colegio = 1;
      this.onChangeSelectVisibilidadObligate(colegio);
      this.progressSpinner = false;
    }
  }

  //TARJETA DATOS GENERALES

  getCombosDatosGenerales() {
    this.getComboEstados();
    this.getComboVisibilidad();
    this.getComboColegios();
    this.getTemas();
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

  getTemas() {
    this.backgroundColor = this.getRandomColor();
    this.temasSuggest = [
      {
        idTema: "1",
        nombre: "Cocina",
        color: ""
      },
      {
        idTema: "2",
        nombre: "Astrología",
        color: ""
      },
      {
        idTema: "3",
        nombre: "Estética",
        color: ""
      }
    ];
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
        this.modoEdicion = true;

        if (JSON.parse(data.body).error.code == 200) {
          this.showSuccess();
        } else {
          this.showFail(JSON.parse(data.body).error.description);
        }

        this.curso.idCurso = JSON.parse(data.body).id;
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
      },
      err => {
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );
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

          for (let i = 0; this.datosFormadores.length > i; i++) {
            if (this.datosFormadores[i].tutor == 1) {
              this.datosFormadores[i].flagTutor = true;
              this.numCheckedTutor = 1;
            } else {
              this.datosFormadores[i].flagTutor = false;
            }
          }

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
      },
      {
        field: "flagTutor",
        header: "form.busquedaCursos.literal.tutorResponsable"
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
    this.selectMultipleFormadores = false;
    this.pressNewFormador = false;
    this.editFormador = false;
    this.formadoresUpdate = [];
    this.tableFormadores.reset();
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

    for (let i = 0; this.datosFormadores.length > i; i++) {
      if (this.datosFormadores[i].tutor == 1) {
        this.datosFormadores[i].flagTutor = true;
        this.numCheckedTutor = 1;
      } else {
        this.datosFormadores[i].flagTutor = false;
      }
    }

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
  }

  actualizaSeleccionados(selectedDatos) {
    this.numSelectedFormadores = selectedDatos.length;
  }

  saveTrainers() {
    this.editFormador = false;
    let formador;
    let url = "";

    if (this.modoEdicionFormador) {
      //Enviamos al back todos los formadores editados
      url = "fichaCursos_updateTrainersCourse";
      formador = new FormadorCursoObject();
      formador.error = new ErrorItem();
      formador.formadoresCursoItem = this.formadoresUpdate;
    } else {
      //Mapeamos el formador que queremos insertar nuevo
      url = "fichaCursos_saveTrainersCourse";
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
    }

    this.sigaServices.post(url, formador).subscribe(
      data => {
        let error = JSON.parse(data.body).error;

        if (error.message != "" && error.message != null) {
          this.showFail(error.message);
        } else {
          this.showSuccess();
        }
        this.editFormador = true;
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
    if (this.numCheckedTutor == 1 && dato.flagTutor == true) {
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
              x.idPersona ==
                this.datosFormadores[idFormadorUnSelect].idPersona &&
              x.idRol == this.datosFormadores[idFormadorUnSelect].idRol
          );

          //1.3 Si no se encuentre en la lista de moficiados, se añade el formador modificado
          if (id == -1) {
            this.datosFormadores[idFormadorUnSelect].tutor = 0;
            this.datosFormadores[idFormadorUnSelect].flagTutor = false;
            this.formadoresUpdate.push(
              this.datosFormadores[idFormadorUnSelect]
            );
            //1.4 Si se encuentra en la lista, modificamos el formador tanto en la lista de formadores modificados
            //y en la lista de formadores
          } else {
            this.formadoresUpdate[id].tutor = 0;
            this.datosFormadores[idFormadorUnSelect].tutor = 0;
            this.datosFormadores[idFormadorUnSelect].flagTutor = false;
          }

          //2. Añadimos el nuevo formador

          //2.1 Buscamos SI el formador que le vamos asignar el tutor se encuentra en la lista de formadores modificados
          let idFindFormador = this.formadoresUpdate.findIndex(
            x => x.idPersona === dato.idPersona && x.idRol === dato.idRol
          );

          //2.2 Buscamos al formador que le vamos asignar el tutor en la tabla de formadores
          let idUpdateFormador = this.datosFormadores.findIndex(
            x => x.idPersona === dato.idPersona && x.idRol === dato.idRol
          );

          //2.3 Si el formador no se encuentra en la tabla de formadores modificados se añade
          if (idFindFormador == -1) {
            this.datosFormadores[idUpdateFormador].tutor = 1;
            this.datosFormadores[idUpdateFormador].flagTutor = true;
            this.addTrainerUpdateList(idFindFormador, dato);
            //2.4 Si se encuentra, se le asigna el valor de tutor en ambas tablas
          } else {
            this.formadoresUpdate[idFindFormador].tutor = 1;
            this.formadoresUpdate[idFindFormador].flagTutor = true;
            this.datosFormadores[idUpdateFormador].tutor = 1;
            this.datosFormadores[idUpdateFormador].flagTutor = true;
          }
        },
        reject: () => {
          //Si cancela la operacion, se restablece los valores
          let id = this.datosFormadores.findIndex(
            x => x.idPersona === dato.idPersona && x.idRol === dato.idRol
          );

          if (this.datosFormadores[id].flagTutor) {
            this.datosFormadores[id].flagTutor = false;
          } else {
            this.datosFormadores[id].flagTutor = true;
          }

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
    } else if (this.numCheckedTutor == 1 && dato.flagTutor == false) {
      this.numCheckedTutor = 0;

      //1.1 Se le desasigna en la tabla de formadores
      let id = this.datosFormadores.findIndex(
        x => x.idPersona === dato.idPersona && x.idRol === dato.idRol
      );

      this.datosFormadores[id].tutor = 0;
      this.datosFormadores[id].flagTutor = false;

      //1.1 Se busca si ese formador se encuentra en la lista de formadores modificados
      let idFindFormador = this.formadoresUpdate.findIndex(
        x => x.idPersona === dato.idPersona && x.idRol === dato.idRol
      );

      //1.2 Si no existe se añade a la lista de formadores modificados y se le asigna en la tabla de formadores
      if (idFindFormador == -1) {
        this.formadoresUpdate.push(this.datosFormadores[id]);
        //1.3 Si existe se modifica en la tabla
      } else {
        this.formadoresUpdate[id].tutor = 0;
      }
      //SE COMPRUEBA SI NO HAY NINGUN FORMADOR ASIGNADO
    } else {
      this.numCheckedTutor = 1;
      dato.tutor = 1;

      //1.1 Se le asigna en la tabla de formadores
      let id = this.datosFormadores.findIndex(
        x => x.idPersona === dato.idPersona && x.idRol === dato.idRol
      );
      this.datosFormadores[id].tutor = 1;
      this.datosFormadores[id].flagTutor = true;

      //1.2 Se busca si esta en la tabla formadores modificados
      let idFindFormador = this.formadoresUpdate.findIndex(
        x => x.idPersona === dato.idPersona && x.idRol === dato.idRol
      );

      //1.2 Si no esta se añade
      if (idFindFormador == -1) {
        this.addTrainerUpdateList(idFindFormador, dato);
      } else {
        let id = this.datosFormadores.findIndex(
          x => x.idPersona === dato.idPersona && x.idRol === dato.idRol
        );
        this.formadoresUpdate[idFindFormador].tutor = 1;
      }
    }
  }

  addTrainerUpdateList(idFindFormador, dato) {
    let id = this.datosFormadores.findIndex(
      x => x.idPersona === dato.idPersona && x.idRol === dato.idRol
    );
    this.formadoresUpdate.push(this.datosFormadores[id]);
  }

  validateForm() {
    if (
      this.newFormadorCourse.idRol == null ||
      this.newFormadorCourse.idTipoCoste == null ||
      this.newFormadorCourse.tarifa == null ||
      this.newFormadorCourse.nombre == null ||
      this.newFormadorCourse.apellidos == null ||
      this.newFormadorCourse.tarifa == "" ||
      this.newFormadorCourse.nombre == "" ||
      this.newFormadorCourse.apellidos == ""
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
      // sessionStorage.setItem("modoEdicionNotify", "true");
      sessionStorage.removeItem("eventoSelected");
      sessionStorage.setItem("eventoSelected", JSON.stringify(id));
      sessionStorage.setItem("sessions", JSON.stringify(this.datosSessions));
      this.router.navigate(["/editarNotificacion"]);
      sessionStorage.setItem("fichaAbierta", "true");
    }
  }

  actualizaSeleccionadosNotifications(selectedDatosNotifications) {
    this.numSelectedSessions = selectedDatosNotifications.length;
  }

  onChangeRowsPerPagesNotifications(event) {
    this.selectedSessions = event.value;
    this.changeDetectorRef.detectChanges();
    this.tableSessions.reset();
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
    fichaPosible.activa = !fichaPosible.activa;
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

  showFail(msg) {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Información",
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
}
