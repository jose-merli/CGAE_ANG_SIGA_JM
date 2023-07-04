import { Location } from "@angular/common";
import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from "@angular/core";
import { Router, NavigationEnd } from '@angular/router';
import { saveAs } from "file-saver/FileSaver";
import {
  AutoComplete,
  Calendar,
  ConfirmationService,
  DataTable
} from "primeng/primeng";
import { TranslateService } from "../../../commons/translate";
import { CalendarItem } from "../../../models/CalendarItem";
import { EventoItem } from "../../../models/EventoItem";
import { EventoObject } from "../../../models/EventoObject";
import { NotificacionEventoItem } from '../../../models/NotificacionEventoItem';
import { NotificacionEventoObject } from "../../../models/NotificacionEventoObject";
import { esCalendar } from "../../../utils/calendar";
import { SigaServices } from "../../../_services/siga.service";
import { AsistenciaEventoObject } from "../../../models/AsistenciaEventoObject";
import { DatosPersonaEventoItem } from "../../../models/DatosPersonaEventoItem";
import { DatosPersonaEventoObject } from "../../../models/DatosPersonaEventoObject";
import { DatosCursosItem } from "../../../models/DatosCursosItem";
import { FechaComponent } from "../../../commons/fecha/fecha.component";
import { find } from "../../../../../node_modules/rxjs/operators";
import { CommonsService } from '../../../_services/commons.service';

@Component({
  selector: "app-ficha-eventos",
  templateUrl: "./ficha-eventos.component.html",
  styleUrls: ["./ficha-eventos.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class FichaEventosComponent implements OnInit, OnDestroy {
  saveCalendarFlag: boolean = false;
  msgs;
  isFormacionCalendar: boolean = false;
  modoEdicionEventoByAgenda: boolean = false;
  modoEdicionEvento: boolean = false;
  modoTipoEventoInscripcion: boolean = false;
  modoSesionEdicionEvento: boolean = false;
  isEventoCumplidoOrCancelado: boolean = false;
  isEventoCancelado: boolean = false;
  idCalendario;
  tipoAccesoLectura: boolean = false;
  blockAsistencia: boolean = false;
  selectedTipoLaboral = false;
  path: string;
  disabledIsLetrado;
  filaEditable: boolean = false;
  progressSpinner2: boolean = false;

  resaltadoDatos: boolean = false;
  resaltadoDatosOpcionales: boolean = false;


  tipoInscripcionEvento: boolean = false;

  es: any = esCalendar;

  @ViewChild("tableAsistencia")
  tableAsistencia: DataTable;

  @ViewChild("tableNotifications")
  tableNotifications: DataTable;

  @ViewChild("autocomplete")
  autoComplete: AutoComplete;

  @ViewChild("fechaInicio")
  fechaInicio: Calendar;

  @ViewChild("fechaFin")
  fechaFin: Calendar;

  //Generales
  curso: DatosCursosItem = new DatosCursosItem();
  disabledTipoEvento: boolean = false;
  comboCalendars;
  comboTipoEvento;
  selectRepeatDate;
  comboDays = [];
  comboRepeatEvery = [];
  comboRepeatOn = [];
  comboPartidoJudicial;
  newEvent: EventoItem;
  calendarioEdit: CalendarItem;
  initEvent: EventoItem;
  invalidDateMin: Date;
  invalidDateMax: Date;
  invalidDateMinEditionMode: Date;
  invalidDateMaxEditionMode: Date;
  comboEstados: any[];
  createEvent: boolean = false;
  checkFechaInicioRepeticion: boolean = false;
  checkFechaFinRepeticion: boolean = false;
  checkTipoRepeticion: boolean = false;
  checkTipoDiasRepeticion: boolean = false;

  valorTipoGeneral = "1";
  valorTipoLaboral = "2";
  valorTipoFormacion = "3";
  valorTipoEventoFestivo = "9";
  valorTipoEventoGeneral = "1";
  valorTipoEventoInicioInscripcion = "4";
  valorTipoEventoFinInscripcion = "5";
  valorTipoEventoSesion = "8";
  valorEstadoEventoPlanificado = "1";
  valorEstadoEventoCancelado = "3";
  valorEstadoEventoCumplido = "2";
  valorEstadoCursoFinalizado = "4";


  //Notificaciones
  selectedDatosNotifications = [];
  selectMultipleNotifications: boolean = false;
  selectAllNotifications: any;
  datosNotificaciones = [];
  selectedNotification: number = 10;
  numSelectedNotification: number = 0;
  rowsPerPage: any = [];
  colsNotifications: any = [];
  sortO: number = 1;
  comboTemplates;
  comboMeasureUnit;
  comboAfterBefore;
  comboNotifyType;
  pressNewNotificacion: boolean = false;
  newNotificacion: NotificacionEventoItem;
  editNotificacion: boolean = false;
  updateNotificationList: NotificacionEventoItem[] = [];
  deleteNotificacion: boolean = false;

  historico: boolean = false;
  openFicha: boolean = false;
  progressSpinner: boolean = false;
  closeFicha: boolean = true;

  //Formadores
  datosFormadores: any[] = [];
  formadoresSuggest: any[] = [];
  formadores: any[] = [];
  checkFormadores: any[] = [];
  results: any[] = [];
  backgroundColor: string;
  marginPx = "4px";
  bw = "white";
  idCurso;
  listaPersonaEvento: any[] = [];

  //Asistencia
  colsAsistencia;
  fichasPosibles;
  datosAsistencia = [];
  selectedDatosAsistencia = [];
  selectAllAsistencias: any;
  selectedAsistencia: number = 10;
  selectMultipleAsistencia: boolean = false;
  numSelectedAsistencia: number = 0;
  comboAsistencia;
  checkAsistencias: boolean = false;
  asistenciasUpdate = [];
  archivoDisponible: boolean = false;
  existeArchivo: boolean = false;
  file: File = undefined;

  @ViewChild("pUploadFile")
  pUploadFile;

  disabledToday: boolean = true;

  @ViewChild("fechaFi") fechaFi: FechaComponent;
  @ViewChild("fechaIni") fechaIni: FechaComponent;

  constructor(
    private sigaServices: SigaServices,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private location: Location,
    private confirmationService: ConfirmationService,
    private commonsService: CommonsService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.getColsResults();
    this.getFichasPosibles();
    this.getColsResultsAsistencia();
    this.getComboNotificaciones();
    this.progressSpinner2 = true;

    this.newEvent = new EventoItem();
    this.initEvent = new EventoItem();

    //Se comprueba de que pantalla llega y el modo Edicion/creacion
    //1. En caso de venir de la pantalla Agenda y en modo Edicion
    if (sessionStorage.getItem("modoEdicionEventoByAgenda") == "true") {
      //Indicamos que estamos en modo edicion
      this.modoEdicionEventoByAgenda = true;
      this.path = "agenda";

      //Indicamos que el evento ya esta creado para que pueda acceder a todas las tarjetas
      this.createEvent = true;

      //Obtenemos el evento que recibimos de la pantalla calendario
      this.newEvent = JSON.parse(sessionStorage.getItem("eventoEdit"));
      this.newEvent.idTipoCalendario = JSON.parse(
        sessionStorage.getItem("calendarioEdit")
      ).idTipoCalendario;

      this.idCalendario = this.newEvent.idCalendario;
      this.idCurso = this.newEvent.idCurso;

      this.modoEdicionEvento = true;
      this.disabledTipoEvento = true;

      this.newEvent.start = new Date(this.newEvent.start);
      this.newEvent.end = new Date(this.newEvent.end);

      //Se comprueba el tipo de acceso que tiene el evento
      this.checkAcceso();

      //Se guarda el evento con los valores iniciales para restablecer los valores
      this.initEvent = JSON.parse(JSON.stringify(this.newEvent));

      //Se genera el combo tipo de Calendario,
      //Si el evento pertenece al calendario formacion
      if (this.newEvent.idTipoCalendario == this.valorTipoFormacion) {

        if (this.newEvent.idTipoEvento == this.valorTipoEventoInicioInscripcion ||
          this.newEvent.idTipoEvento == this.valorTipoEventoFinInscripcion) {
          this.tipoInscripcionEvento = true;
        } else {
          this.tipoInscripcionEvento = false;
        }

        this.getComboCalendar();
        this.limitTimeEvent();
        this.idCurso = this.newEvent.idCurso;
        this.getEntryListCourse();

        if (this.newEvent.fechaInicioRepeticion != null) {
          this.newEvent.fechaInicioRepeticion = new Date(
            this.newEvent.fechaInicioRepeticion
          );
        }

        if (this.newEvent.fechaFinRepeticion != null) {
          this.newEvent.fechaFinRepeticion = new Date(
            this.newEvent.fechaFinRepeticion
          );
        }

        this.getTrainers();
        this.getTrainersSession();
        this.getEntryListCourse();
        this.initEvent = JSON.parse(JSON.stringify(this.newEvent));
        //si no pertenece al calendario de formacion se genera el combo con solo laboral-general
      } else if (this.newEvent.idTipoCalendario == this.valorTipoGeneral) {
        this.getComboCalendarLaboralGeneral();
        this.limitTimeEvent();

        if (this.newEvent.fechaInicioRepeticion != null) {
          this.newEvent.fechaInicioRepeticion = new Date(
            this.newEvent.fechaInicioRepeticion
          );
        }

        if (this.newEvent.fechaFinRepeticion != null) {
          this.newEvent.fechaFinRepeticion = new Date(
            this.newEvent.fechaFinRepeticion
          );
        }
        this.initEvent = JSON.parse(JSON.stringify(this.newEvent));
      } else {
        this.getComboCalendarLaboralGeneral();
      }

      if (this.newEvent.idTipoEvento == this.valorTipoEventoSesion) {
        this.isFormacionCalendar = true;
      }

      if (this.newEvent.idTipoCalendario == this.valorTipoLaboral) {
        this.selectedTipoLaboral = true;
        this.getComboPartidoJudicial();
      }

      this.getEventNotifications();
      this.checkIsEventoCumplidoOrCancelado();
      this.progressSpinner2 = false;
      //2. En caso de venir de agenda pero en modo creación
    } else if (sessionStorage.getItem("modoEdicionEventoByAgenda") == "false") {
      this.modoEdicionEventoByAgenda = false;
      this.path = "agenda";
      this.disabledTipoEvento = false;
      // this.modoEdicionEvento = true;
      this.newModeConfiguration();

      //Se guarda el evento con los valores iniciales para restablecer los valores
      this.initEvent = JSON.parse(JSON.stringify(this.newEvent));

      //3. En caso de venir de la pantalla Formacion
    } else if (sessionStorage.getItem("isFormacionCalendar") == "true") {
      this.isFormacionCalendar = true;
      this.disabledTipoEvento = true;
      this.path = "agendaFormacion";
      this.idCurso = sessionStorage.getItem("idCurso");
      this.disabledToday = false;
      this.curso = JSON.parse(sessionStorage.getItem("courseCurrent"));
      //Cargamos los tipo de calendarios que existen
      this.getComboCalendar();
      //Obligamos a que sea el tipo de calendario formacion
      this.newEvent.idTipoCalendario = this.valorTipoFormacion;
      this.newEvent.idTipoEvento = this.valorTipoEventoSesion;
      this.newEvent.idCurso = this.idCurso;

      //Inficamos que no estamos en modo edicion
      this.modoEdicionEvento = false;

      //Se guarda el evento con los valores iniciales para restablecer los valores
      this.initEvent = JSON.parse(JSON.stringify(this.newEvent));

      //limitamos tiempo de repeticion
      if (this.newEvent.start != undefined && this.newEvent.end != undefined) {
        this.limitTimeEvent();
      }
      this.progressSpinner2 = false;

      //4. En caso de que venga notificaciones
    } else if (sessionStorage.getItem("isNotificaciones") == "true") {
      //Se deja la pantalla tal como estaba
      this.newEvent = JSON.parse(sessionStorage.getItem("evento"));
      this.path = "notificaciones";

      if (sessionStorage.getItem("historico")) {
        this.historico = JSON.parse(sessionStorage.getItem("historico"));
      }

      if (this.historico) {
        this.datosNotificaciones = JSON.parse(
          sessionStorage.getItem("notificaciones")
        );
      } else {
        this.getEventNotifications();
      }

      this.fichasPosibles[1].activa = true;

      this.getComboCalendar();

      //Indicamos que el evento ya esta creado para que pueda acceder a todas las tarjetas
      this.createEvent = true;

      this.disabledTipoEvento = true;

      this.newEvent.start = new Date(this.newEvent.start);

      this.newEvent.end = new Date(this.newEvent.end);

      if (this.newEvent.fechaInicioRepeticion) {
        this.newEvent.fechaInicioRepeticion = new Date(
          this.newEvent.fechaInicioRepeticion
        );
      }

      if (this.newEvent.fechaFinRepeticion) {
        this.newEvent.fechaFinRepeticion = new Date(
          this.newEvent.fechaFinRepeticion
        );
      }

      if (sessionStorage.getItem("isSession")) {
        this.isFormacionCalendar = true;
      } else {

        if (sessionStorage.getItem("calendarioEdit") != undefined) {
          this.newEvent.idTipoCalendario = JSON.parse(
            sessionStorage.getItem("calendarioEdit")
          ).idTipoCalendario;

          this.idCalendario = JSON.parse(
            sessionStorage.getItem("calendarioEdit")
          ).idCalendario;
        }
      }

      //Indicamos que estamos en modo edicion
      this.modoEdicionEventoByAgenda = true;
      this.modoEdicionEvento = true;
      //Se comprueba el tipo de acceso que tiene el evento
      this.checkAcceso();
      this.checkIsEventoCumplidoOrCancelado();

      //Se guarda el evento con los valores iniciales para restablecer los valores
      this.initEvent = JSON.parse(JSON.stringify(this.newEvent));
      this.progressSpinner2 = false;

      //5. En caso de que venga de creacion de nuevo curso, crear el evento inicio de inscripcion
    } else if (
      sessionStorage.getItem("isFormacionCalendarByStartInscripcion") == "true"
    ) {
      this.modoTipoEventoInscripcion = true;
      this.disabledTipoEvento = true;
      this.disabledToday = false;

      this.path = "formacionInicioInscripcion";

      this.curso = JSON.parse(sessionStorage.getItem("courseCurrent"));

      if (this.curso.idCurso != undefined && this.curso.idCurso != null) {
        this.idCurso = this.curso.idCurso;
        this.curso.idTipoEvento = this.valorTipoEventoInicioInscripcion;
        this.searchEvent(this.curso);

      } else if (this.curso.idEventoInicioInscripcion != undefined && this.curso.idEventoInicioInscripcion != "undefined") {
        this.searchEventByIdEvento(this.curso.idEventoInicioInscripcion);
      } else {
        this.newEvent = new EventoItem();
        //Obligamos a que sea tipo calendario formacion
        this.newEvent.idTipoCalendario = this.valorTipoFormacion;

        this.newEvent.start = undefined;
        this.newEvent.end = undefined;

        //Indicamos que el limite que puede durar el evento
        // this.invalidDateMin = new Date(
        //   JSON.parse(JSON.stringify(this.newEvent.start))
        // );
        // this.invalidDateMax = new Date(
        //   JSON.parse(JSON.stringify(this.newEvent.start))
        // );

        // this.invalidDateMin.setHours(this.newEvent.start.getHours());
        // this.invalidDateMin.setMinutes(this.newEvent.start.getMinutes());
        // this.invalidDateMax.setHours(23);
        // this.invalidDateMax.setMinutes(59);

        //Cargamos los tipo de calendarios que existen
        this.getComboCalendar();
        //Obligamos a que sea el tipo de calendario formacion
        this.newEvent.idTipoCalendario = this.valorTipoFormacion;
        this.newEvent.idTipoEvento = this.valorTipoEventoInicioInscripcion;

        //Inficamos que no estamos en modo edicion
        this.modoEdicionEvento = false;

        //Se guarda el evento con los valores iniciales para restablecer los valores
        this.initEvent = JSON.parse(JSON.stringify(this.newEvent));
        this.progressSpinner2 = false;

      }

      if (sessionStorage.getItem("courseCurrent")) {
        let curso = JSON.parse(sessionStorage.getItem("courseCurrent"));
        if (curso.idEstado != 2 && curso.idEstado != 3) {
          this.blockAsistencia = true;
        }
      }
      //6. En caso de que venga de creacion de nuevo curso, crear el evento fin de inscripcion
    } else if (
      sessionStorage.getItem("isFormacionCalendarByEndInscripcion") == "true"
    ) {
      this.modoTipoEventoInscripcion = true;
      this.disabledTipoEvento = true;
      this.path = "formacionFinInscripcion";
      this.disabledToday = false;

      this.curso = JSON.parse(sessionStorage.getItem("courseCurrent"));

      if (this.curso.idCurso != undefined && this.curso.idCurso != null) {
        this.idCurso = this.curso.idCurso;
        this.curso.idTipoEvento = this.valorTipoEventoFinInscripcion;
        this.searchEvent(this.curso);

      } else if (this.curso.idEventoFinInscripcion != undefined && this.curso.idEventoFinInscripcion != "undefined") {
        this.searchEventByIdEvento(this.curso.idEventoFinInscripcion);
      } else {
        this.newEvent = new EventoItem();
        //Obligamos a que sea tipo calendario formacion
        this.newEvent.idTipoCalendario = this.valorTipoFormacion;

        this.newEvent.start = undefined;
        this.newEvent.end = undefined;

        //Indicamos que el limite que puede durar el evento
        // this.invalidDateMin = new Date(
        //   JSON.parse(JSON.stringify(this.newEvent.start))
        // );
        // this.invalidDateMax = new Date(
        //   JSON.parse(JSON.stringify(this.newEvent.start))
        // );

        // this.invalidDateMin.setHours(this.newEvent.start.getHours());
        // this.invalidDateMin.setMinutes(this.newEvent.start.getMinutes());
        // this.invalidDateMax.setHours(23);
        // this.invalidDateMax.setMinutes(59);

        //Cargamos los tipo de calendarios que existen
        this.getComboCalendar();
        //Obligamos a que sea el tipo de calendario formacion
        this.newEvent.idTipoCalendario = this.valorTipoFormacion;
        this.newEvent.idTipoEvento = this.valorTipoEventoFinInscripcion;

        //Inficamos que no estamos en modo edicion
        this.modoEdicionEvento = false;

        //Se guarda el evento con los valores iniciales para restablecer los valores
        this.initEvent = JSON.parse(JSON.stringify(this.newEvent));
        this.progressSpinner2 = false;

      }

      if (sessionStorage.getItem("courseCurrent")) {
        let curso = JSON.parse(sessionStorage.getItem("courseCurrent"));
        if (curso.idEstado != 2 && curso.idEstado != 3) {
          this.blockAsistencia = true;
        }
      }
      //7. Viene en modo edicion sesion
    } else if (sessionStorage.getItem("modoEdicionSession") == "true") {
      //Inficamos que estamos en modo edicion
      this.modoEdicionEvento = true;
      this.modoSesionEdicionEvento = true;
      this.isFormacionCalendar = true;
      //Indicamos que el evento ya esta creado para que pueda acceder a todas las tarjetas
      this.createEvent = true;

      //Obtenemos el evento que recibimos de la pantalla calendario
      this.newEvent = JSON.parse(sessionStorage.getItem("eventoSelected"));
      this.newEvent.valoresRepeticion = JSON.parse(this.newEvent.valoresRepeticionString);
      this.idCalendario = this.newEvent.idCalendario;

      this.modoEdicionEvento = true;
      this.disabledTipoEvento = true;

      this.newEvent.start = new Date(this.newEvent.start);
      this.newEvent.end = new Date(this.newEvent.end);

      if (this.newEvent.fechaInicioRepeticion != null) {
        this.newEvent.fechaInicioRepeticion = new Date(
          this.newEvent.fechaInicioRepeticion
        );
      }

      if (this.newEvent.fechaFinRepeticion != null) {
        this.newEvent.fechaFinRepeticion = new Date(
          this.newEvent.fechaFinRepeticion
        );
      }

      //Se comprueba el tipo de acceso que tiene el evento
      this.checkAcceso();

      //Se comprueba si es letrado
      if (sessionStorage.getItem("disabledIsLetrado") == "true") {
        this.tipoAccesoLectura = true;
      } else {
        this.tipoAccesoLectura = false;
      }

      //Se guarda el evento con los valores iniciales para restablecer los valores
      this.initEvent = JSON.parse(JSON.stringify(this.newEvent));

      //Se genera el combo tipo de Calendario,
      //Si el evento pertenece al calendario formacion
      if (this.newEvent.idTipoCalendario == this.valorTipoFormacion) {
        this.getComboCalendar();
        this.limitTimeEvent();
      }

      this.curso = JSON.parse(sessionStorage.getItem("courseCurrent"));
      this.idCurso = this.newEvent.idCurso;
      this.getEntryListCourse();
      //Carga los formadores que pertenecen al curso que se va a crear el evento
      this.getTrainers();

      // Cargamos los formadores para la sesion
      this.getTrainersSession();
      this.getEventNotifications();
      if (sessionStorage.getItem("courseCurrent")) {
        let curso = JSON.parse(sessionStorage.getItem("courseCurrent"));
        if (curso.idEstado != 2 && curso.idEstado != 3) {
          this.blockAsistencia = true;
        }
      }

      this.checkIsEventoCumplidoOrCancelado();
      this.progressSpinner2 = false;

      //8. Viene directo
    } else {
      this.isFormacionCalendar = false;
      this.newEvent = new EventoItem();
      this.disabledTipoEvento = false;
      //Obligamos que el tipo de evento sea Manual
      this.newEvent.idTipoEvento = "1";
      this.modoEdicionEvento = false;
      this.progressSpinner2 = false;

      this.getComboCalendar();
    }

    this.getComboEstado();
    this.getComboTipoEvento();
    this.getComboAsistencia();
    this.getCombosRepeats();
  }

  ngAfterViewInit() {
    window.scrollTo(0, 0);
  }

  ngOnDestroy() {
    //Se eliminan las variables de la sessionStorage
    sessionStorage.removeItem("modoEdicionEventoByAgenda");
    sessionStorage.removeItem("eventoEdit");
    sessionStorage.removeItem("isNotificaciones");
  }

  checkAcceso() {
    if (this.newEvent.tipoAcceso == 2) {
      this.tipoAccesoLectura = true;
    } else {
      if (sessionStorage.getItem("fichaCursoPermisos")) {
        this.tipoAccesoLectura = !JSON.parse(
          sessionStorage.getItem("fichaCursoPermisos")
        );
      } else {
        this.tipoAccesoLectura = false;
      }
    }
  }

  checkIsEventoCumplidoOrCancelado() {
    if (this.newEvent.idEstadoEvento != undefined && this.newEvent.idEstadoEvento != this.valorEstadoEventoPlanificado) {
      this.isEventoCumplidoOrCancelado = true;

      if (this.newEvent.idEstadoEvento == this.valorEstadoEventoCancelado) {
        this.isEventoCancelado = true;
      } else {
        this.isEventoCancelado = false;
      }

    } else {
      this.isEventoCumplidoOrCancelado = false;
    }

  }

  newModeConfiguration() {
    //Blindeamos el evento recibido de la pantalla agenda
    this.newEvent = JSON.parse(sessionStorage.getItem("eventoEdit"));
    this.newEvent.start = new Date(this.newEvent.start);
    this.newEvent.start.setHours(0);
    this.newEvent.start.setMinutes(0);
    this.newEvent.end = new Date(this.newEvent.end);
    this.newEvent.end.setHours(0);
    this.newEvent.end.setMinutes(0);

    //Cargamos los combos que pueden ser
    this.getComboCalendarLaboralGeneral();

    //Cargamos el comboLugar por si se selecciona el tipo de calendario laboral
    this.getComboPartidoJudicial();

    //Indicamos que no estamos en modo edicion
    this.modoEdicionEventoByAgenda = false;

    this.limitTimeEvent();
    this.progressSpinner2 = false;

  }

  limitTimeEvent() {
    //Indicamos que el limite que puede durar el evento
    this.invalidDateMin = new Date(
      JSON.parse(JSON.stringify(this.newEvent.start))
    );
    this.invalidDateMax = new Date(
      JSON.parse(JSON.stringify(this.newEvent.start))
    );
    this.invalidDateMin.setHours(this.newEvent.start.getHours());
    this.invalidDateMin.setMinutes(this.newEvent.start.getMinutes());
    this.invalidDateMax.setHours(23);
    this.invalidDateMax.setMinutes(59);

    this.invalidDateMinEditionMode = new Date(
      JSON.parse(JSON.stringify(this.newEvent.start))
    );
    this.invalidDateMaxEditionMode = new Date(
      JSON.parse(JSON.stringify(this.newEvent.start))
    );

    this.invalidDateMinEditionMode.setHours(this.newEvent.start.getHours());
    this.invalidDateMinEditionMode.setMinutes(this.newEvent.start.getMinutes());
    this.invalidDateMaxEditionMode.setHours(23);
    this.invalidDateMaxEditionMode.setMinutes(59);
  }
  //FUNCIONES FICHA DATOS GENERALES

  getComboEstado() {
    this.sigaServices.get("fichaEventos_getEventStates").subscribe(
      n => {
        this.comboEstados = n.combooItems;

      },
      err => {
        //console.log(err);
      }
    );
  }

  //Funcion que recargar los combos relacionados con los datos de repetición
  getCombosRepeats() {
    this.sigaServices.get("fichaEventos_getRepeatEvery").subscribe(
      n => {
        this.comboRepeatEvery = n.combooItems;
      },
      err => {
        //console.log(err);
      }
    );

    this.sigaServices.get("fichaEventos_getDaysWeek").subscribe(
      n => {
        this.comboRepeatOn = n.combooItems;
        let dom = this.comboRepeatOn[0];
        this.comboRepeatOn.splice(0, 1);
        this.comboRepeatOn.push(dom);
      },
      err => {
        //console.log(err);
      }
    );

    this.comboDays = [
      { label: "1", value: 1 },
      { label: "2", value: 2 },
      { label: "3", value: 3 },
      { label: "4", value: 4 },
      { label: "5", value: 5 },
      { label: "6", value: 6 },
      { label: "7", value: 7 },
      { label: "8", value: 8 },
      { label: "9", value: 9 },
      { label: "10", value: 10 },
      { label: "11", value: 11 },
      { label: "12", value: 12 },
      { label: "13", value: 13 },
      { label: "14", value: 14 },
      { label: "15", value: 15 },
      { label: "16", value: 16 },
      { label: "17", value: 17 },
      { label: "18", value: 18 },
      { label: "19", value: 19 },
      { label: "20", value: 20 },
      { label: "21", value: 21 },
      { label: "22", value: 22 },
      { label: "23", value: 23 },
      { label: "24", value: 24 },
      { label: "25", value: 25 },
      { label: "26", value: 26 },
      { label: "27", value: 27 },
      { label: "28", value: 28 },
      { label: "29", value: 29 },
      { label: "30", value: 30 },
      { label: "31", value: 31 }
    ];
  }

  //Función obtiene los tipos de calendarios que hay
  getComboCalendar() {
    this.sigaServices.get("fichaCalendario_getCalendarType").subscribe(
      n => {
        this.comboCalendars = n.combooItems;
      },
      err => {
        //console.log(err);
      }
    );
  }

  //Funcion que obtiene los tipos de calendarios que se pueden crear si vienes de la pantalla Agenda
  getComboCalendarLaboralGeneral() {
    this.sigaServices.get("fichaCalendario_getCalendarType").subscribe(
      n => {
        let tipoGeneral = n.combooItems.find(
          x => x.value === this.valorTipoGeneral
        );

        this.comboCalendars = new Array();
        this.comboCalendars.push(tipoGeneral);

        let tipoLaboral = n.combooItems.find(
          x => x.value === this.valorTipoLaboral
        );

        this.comboCalendars.push(tipoLaboral);
      },
      err => {
        //console.log(err);
      }
    );
  }

  //Función obtiene los tipos de eventos que hay
  getComboTipoEvento() {
    this.sigaServices.get("fichaEventos_getTypeEvent").subscribe(
      n => {
        this.comboTipoEvento = n.combooItems;
      },
      err => {
        //console.log(err);
      }
    );
  }

  //Obtiene los partidos judiciales donde se puede realizar el evento
  getComboPartidoJudicial() {
    this.sigaServices.get("fichaEventos_getJudicialDistrict").subscribe(
      n => {
        this.comboPartidoJudicial = n.combooItems;
      },
      err => {
        //console.log(err);
      }
    );
  }

  onChangeSelectCalendar(event) {
    if (event == this.valorTipoLaboral) {
      this.selectedTipoLaboral = true;
      this.newEvent.tipoDiasRepeticion = null;
      this.newEvent.idTipoEvento = this.valorTipoEventoFestivo;
    } else {
      this.selectedTipoLaboral = false;
      this.newEvent.idTipoEvento = this.valorTipoEventoGeneral;
    }
  }

  saveEvent() {
    let url = "";
    if (this.curso != null) {
      this.newEvent.idCurso = this.curso.idCurso;
    }
    this.progressSpinner = true;
    this.resaltadoDatos = false;

    let dateStart = new Date(this.newEvent.start);
    if (this.newEvent.idEstadoEvento == null) {
      this.newEvent.idEstadoEvento = this.valorEstadoEventoPlanificado;
    }

    if (dateStart > new Date() && this.newEvent.idEstadoEvento == '2') {
      this.showMessage(
        "error",
        this.translateService.instant("general.message.incorrect"),
        this.translateService.instant("message.error.evento.cumplido")
      );
      this.progressSpinner = false;
    } else {
      if (
        sessionStorage.getItem("modoEdicionEventoByAgenda") == "true" ||
        (this.modoTipoEventoInscripcion && this.modoEdicionEvento) ||
        this.modoEdicionEvento
      ) {
        if (this.newEvent.idEvento != null) {
          url = "fichaEventos_updateEventCalendar";
          if (this.newEvent.idEventoOriginal != null && this.newEvent.idEventoOriginal != undefined) {
            let utcStart = new Date(dateStart.getUTCFullYear(), dateStart.getUTCMonth(), dateStart.getUTCDate(), dateStart.getUTCHours(), dateStart.getUTCMinutes(), dateStart.getUTCSeconds());
            let dateEnd = new Date(this.newEvent.end);
            let utcEnd = new Date(dateEnd.getUTCFullYear(), dateEnd.getUTCMonth(), dateEnd.getUTCDate(), dateEnd.getUTCHours(), dateEnd.getUTCMinutes(), dateEnd.getUTCSeconds());

            if (this.newEvent.start.toString() != dateStart.toString() || this.newEvent.end.toString() != dateEnd.toString()) {
              this.checkRepeatedEvents(url);
            } else {
              this.callSaveEvent(url);
            }
          } else {
            this.callSaveEvent(url);
          }
        } else {
          url = "fichaEventos_saveEventCalendar";
          this.callSaveEvent(url);
        }
      } else if (this.newEvent.idEvento != undefined) {
        url = "fichaEventos_updateEventCalendar";
        this.callSaveEvent(url);
      } else {
        url = "fichaEventos_saveEventCalendar";
        this.callSaveEvent(url);
      }
    }
  }

  checkRepeatedEvents(url) {

    this.sigaServices
      .getParam(
        "fichaEventos_getRepeteadEvents",
        "?idEvento=" + this.newEvent.idEvento
      ).subscribe(
        res => {
          if (res.eventos.length != 0) {
            this.progressSpinner = false;
            this.callServiceConfirmation(url);
          } else {
            this.callSaveEvent(url);
          }
        },
        err => {
          //console.log(err);
          this.progressSpinner = false;

        }
      );
  }

  callServiceConfirmation(url) {
    let mess = this.translateService.instant("message.confirmacion.eventos.datosRepeticion");
    let icon = "fa fa-edit";

    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        this.callSaveEvent(url);
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

  callServiceConfirmationModifyEvent(url) {
    this.progressSpinner = false;
    let mess = this.translateService.instant("message.confirmacion.eventos.datosRepeticion");
    let icon = "fa fa-edit";

    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        this.callEventSaveService(url);
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

        this.progressSpinner = false;
      }
    });
  }

  callEventSaveService(url) {
    this.progressSpinner = true;
    this.sigaServices.post(url, this.newEvent).subscribe(
      data => {
        this.progressSpinner = false;
        if (JSON.parse(data.body).error.description != null) {
          this.showMessage(
            "error",
            this.translateService.instant("general.message.incorrect"),
            JSON.parse(data.body).error.description
          );

          this.newEvent.idEstadoEvento = JSON.parse(
            JSON.stringify(this.initEvent)
          ).idEstadoEvento;

        } else {
          this.initEvent = JSON.parse(JSON.stringify(this.newEvent));

          if (url == "fichaEventos_updateEventCalendar") {
            this.progressSpinner = false;
          } else {
            this.modoEdicionEvento = true;
            this.createEvent = true;
            sessionStorage.setItem("evento", JSON.stringify(this.newEvent));
            this.curso = JSON.parse(sessionStorage.getItem("courseCurrent"));
            if (
              JSON.parse(
                sessionStorage.getItem("isFormacionCalendarByStartInscripcion")
              )
            ) {
              this.curso.idEventoInicioInscripcion = JSON.parse(data.body).id;
              this.curso.fechaInscripcionDesdeDate = this.newEvent.start;
              sessionStorage.setItem("courseCurrent", JSON.stringify(this.curso));

              // this.saveCourse();
            } else if (
              JSON.parse(
                sessionStorage.getItem("isFormacionCalendarByEndInscripcion")
              )
            ) {
              this.curso.idEventoFinInscripcion = JSON.parse(data.body).id;
              this.curso.fechaInscripcionHastaDate = this.newEvent.end;
              sessionStorage.setItem("courseCurrent", JSON.stringify(this.curso));

              // this.saveCourse();
            }
            //Obtenemos las notificaciones del evento del calendario especifico, dentro del id se ha guardado el idEvento creado
            if (JSON.parse(data.body).id != "") {
              let idEvento = JSON.parse(data.body).id;
              this.newEvent.idEvento = idEvento;
              this.getEventNotifications();
            }

            //Si estamos en un evento de sesión se carga los formadores
            if (this.isFormacionCalendar) {
              this.getTrainers();
              this.getEntryListCourse();
            }
          }
          this.showSuccess();
        }
      },
      err => {
        this.progressSpinner = false;
        this.showUnSuccess();
      },
      () => {
        this.resaltadoDatosOpcionales = false;
        this.resaltadoDatos = false;
        this.progressSpinner = false;
      }
    );
  }

  callSaveEvent(url) {

    if (this.checkFechasInscripcion()) {

      if (this.initEvent.fechaInicioRepeticion != null && this.initEvent.fechaInicioRepeticion != undefined) {
        this.initEvent.fechaInicioRepeticion = this.transformaFecha(this.initEvent.fechaInicioRepeticion);
      }

      if (this.initEvent.fechaFinRepeticion != null && this.initEvent.fechaFinRepeticion != undefined) {
        this.initEvent.fechaFinRepeticion = this.transformaFecha(this.initEvent.fechaFinRepeticion);
      }

      if (((this.initEvent.fechaInicioRepeticion != null && this.initEvent.fechaInicioRepeticion != undefined && this.newEvent.fechaFinRepeticion.getDate() != this.initEvent.fechaFinRepeticion.getDate())
        || (this.initEvent.fechaFinRepeticion != null && this.initEvent.fechaFinRepeticion != undefined && this.newEvent.fechaInicioRepeticion.getDate() != this.initEvent.fechaInicioRepeticion.getDate())
        || JSON.stringify(this.newEvent.valoresRepeticion) != JSON.stringify(this.initEvent.valoresRepeticion)
        || JSON.stringify(this.newEvent.tipoDiasRepeticion) != JSON.stringify(this.initEvent.tipoDiasRepeticion)
        || this.newEvent.tipoRepeticion != this.initEvent.tipoRepeticion) && this.newEvent.idRepeticionEvento != null && this.newEvent.idRepeticionEvento != undefined) {
        this.callServiceConfirmationModifyEvent(url);
      } else {
        this.callEventSaveService(url);
      }

    } else {
      this.progressSpinner = false;
    }


  }

  checkFechasInscripcion() {

    if (sessionStorage.getItem("isFormacionCalendarByStartInscripcion")) {
      if (this.curso.fechaInscripcionHastaDate != null &&
        this.curso.fechaInscripcionHastaDate != undefined) {
        let date = new Date(this.curso.fechaInscripcionHastaDate);
        let utc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());

        if (utc >= this.newEvent.start) {
          return true;
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("message.error.fechaInscripcionInicio"));
          return false;
        }
      } else {
        return true;
      }

    } else if (sessionStorage.getItem("isFormacionCalendarByEndInscripcion")) {

      if (this.curso.fechaInscripcionDesdeDate != null &&
        this.curso.fechaInscripcionDesdeDate != undefined) {
        let date = new Date(this.curso.fechaInscripcionDesdeDate);
        let utc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());

        if (utc <= this.newEvent.start) {
          return true;
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("message.error.fechaInscripcionFin"));
          return false;
        }
      } else {
        return true;
      }

    } else {
      return true;
    }
  }

  saveCourse() {
    this.sigaServices.post("fichaCursos_updateCourse", this.curso).subscribe(
      data => {
        this.showSuccess();
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

  restEvent() {
    this.newEvent = JSON.parse(JSON.stringify(this.initEvent));
    this.resaltadoDatos = false;
    this.resaltadoDatosOpcionales = false;
    if (this.initEvent.start != null) {
      this.newEvent.start = new Date(this.newEvent.start);
    } else {
      this.newEvent.start = undefined;
    }

    if (this.initEvent.end != null) {
      this.newEvent.end = new Date(this.newEvent.end);
    } else {
      this.newEvent.start = undefined;
    }

    this.checkFechaInicioRepeticion = false;
    this.checkFechaFinRepeticion = false;
    this.checkTipoRepeticion = false;
    this.checkTipoDiasRepeticion = false;

    if (this.newEvent.idTipoCalendario == this.valorTipoLaboral) {
      this.newEvent.fechaInicioRepeticion = undefined;
      this.newEvent.fechaFinRepeticion = undefined;
    } else {
      if (this.newEvent.fechaInicioRepeticion != null) {
        this.newEvent.fechaInicioRepeticion = new Date(
          this.newEvent.fechaInicioRepeticion
        );
      }

      if (this.newEvent.fechaFinRepeticion != null) {
        this.newEvent.fechaFinRepeticion = new Date(
          this.newEvent.fechaFinRepeticion
        );
      }
    }
  }

  selectInvalidDates() {

    this.invalidDateMin = new Date(
      JSON.parse(JSON.stringify(this.newEvent.start))
    );
    this.invalidDateMax = new Date(
      JSON.parse(JSON.stringify(this.newEvent.start))
    );
    this.invalidDateMin.setHours(this.newEvent.start.getHours());
    this.invalidDateMin.setMinutes(this.newEvent.start.getMinutes());
    this.invalidDateMax.setHours(23);
    this.invalidDateMax.setMinutes(59);

    if (this.newEvent.end == undefined) {
      this.newEvent.end = new Date(
        JSON.parse(JSON.stringify(this.newEvent.start))
      );
    }

    if (!(this.newEvent.end.getDay() == this.newEvent.start.getDay() && this.newEvent.end.getMonth() == this.newEvent.start.getMonth() &&
      this.newEvent.end.getFullYear() == this.newEvent.start.getFullYear()) || this.newEvent.end < this.newEvent.start) {
      this.newEvent.end = new Date(
        JSON.parse(JSON.stringify(this.newEvent.start))
      );
    }
  }

  validatorDates(event) {

    if (event == null || this.newEvent.end < this.newEvent.start) {
      this.newEvent.end = new Date(
        JSON.parse(JSON.stringify(this.newEvent.start))
      );
      this.fechaFi.calendar.currentHour = this.fechaIni.calendar.currentHour;
      this.fechaFi.calendar.currentMinute = this.fechaIni.calendar.currentMinute;
      this.fechaFi.calendar.inputfieldViewChild.nativeElement.value = this.fechaIni.calendar.inputfieldViewChild.nativeElement.value;
      this.fechaFi.calendar.inputFieldValue = this.fechaIni.calendar.inputFieldValue;
      this.fechaFi.calendar.value = this.fechaIni.calendar.value;
    }
  }

  unselectInvalidDates(event) {

    this.invalidDateMin = new Date(
      JSON.parse(JSON.stringify(this.newEvent.start))
    );
    this.invalidDateMax = new Date(
      JSON.parse(JSON.stringify(this.newEvent.start))
    );
    this.invalidDateMin.setHours(this.newEvent.start.getHours());
    this.invalidDateMin.setMinutes(this.newEvent.start.getMinutes());
    this.invalidDateMax.setHours(23);
    this.invalidDateMax.setMinutes(59);


    if (this.newEvent.end.getHours() == this.newEvent.start.getHours()) {
      if (this.newEvent.end.getMinutes() < this.newEvent.start.getMinutes()) {
        this.newEvent.end.setMinutes(this.newEvent.start.getMinutes());
      }

      this.invalidDateMin.setMinutes(this.newEvent.start.getMinutes());
      this.invalidDateMin.setHours(this.newEvent.start.getHours());
    } else {
      this.invalidDateMin.setMinutes(0);
    }
  }

  fillStart(event) {
    if (event != null) {
      this.newEvent.start = event;
    }
    this.validatorDates(event);
    this.selectInvalidDates();

    this.checkCumplido(this.newEvent.start);
  }

  fillStartEventInput(e) {
    let fecha = this.newEvent.start;
    let fechaIntroducida: Date = e;

    if (this.createEvent && e != null && fechaIntroducida.getMonth() == this.invalidDateMaxEditionMode.getMonth() &&
      fechaIntroducida.getFullYear() == this.invalidDateMaxEditionMode.getFullYear() &&
      fechaIntroducida.getDate() == this.invalidDateMaxEditionMode.getDate()) {
      this.newEvent.start = e;
      this.validatorDates(e);
    } else if (e == null) {
      this.newEvent.start = undefined;
      this.newEvent.end = undefined;
      this.validatorDates(e);
    } else if (!this.createEvent) {
      this.newEvent.start = e;
      this.validatorDates(e);
    } else {
      this.newEvent.start = fecha;
      this.fechaIni.calendar.currentYear = this.fechaFi.calendar.currentYear;
      this.fechaIni.calendar.currentMonth = this.fechaFi.calendar.currentMonth;
      this.fechaIni.calendar.currentHour = this.fechaFi.calendar.currentHour;
      this.fechaIni.calendar.currentMinute = this.fechaFi.calendar.currentMinute;
      this.fechaIni.calendar.inputfieldViewChild.nativeElement.value = this.fechaFi.calendar.inputfieldViewChild.nativeElement.value;
      this.fechaIni.calendar.inputFieldValue = this.fechaFi.calendar.inputFieldValue;
      this.fechaIni.calendar.value = this.fechaFi.calendar.value;
      this.validatorDates(e);

    }

  }

  fillStartEvent(event) {

    if (event == null) {
      this.newEvent.start = event;
      this.newEvent.end = event;
    }

    if (this.newEvent.end == undefined || this.newEvent.end == null) {
      this.newEvent.start = event;
      this.newEvent.end = event;
      this.unselectInvalidDates(event);
    } else {
      this.newEvent.start = event;
      if (this.newEvent.start != null && this.newEvent.start != undefined) {
        if (this.newEvent.start.getDate() != this.newEvent.end.getDate() ||
          this.newEvent.start.getMonth() != this.newEvent.end.getMonth() ||
          this.newEvent.start.getFullYear() != this.newEvent.end.getFullYear()) {
          this.newEvent.end = event;
        }
      }
      this.unselectInvalidDates(event);
    }
    this.validatorDates(event);
    this.checkCumplido(this.newEvent.start);

  }

  fillEndInput(event) {
    this.onlyCheckDatos();
    let fecha = this.newEvent.end;
    if (event != null) {
      this.newEvent.end = event;
    } else {
      this.newEvent.end = fecha;
    }
  }

  fillEnd(event) {

    if (event != null) {
      this.newEvent.end = event;
    }

    this.validatorDates(event);
    this.unselectInvalidDates(event);

    this.checkCumplido(this.newEvent.end);
  }


  deleteEvent() {
    let mess = this.translateService.instant("eventos.mensaje.eliminar.evento");

    let icon = "fa fa-edit";
    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        this.progressSpinner = true;
        let eventoDTO = new EventoObject();
        eventoDTO.eventos.push(this.newEvent);

        this.sigaServices.post("fichaEventos_deleteEvent", eventoDTO).subscribe(
          data => {
            this.progressSpinner = false;
            this.showSuccess();

            setTimeout(() => {
              this.backTo();
            }, 2000);
          },
          err => {
            this.progressSpinner = false;
            this.showUnSuccess();
          },
          () => {
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


  validateForm() {
    let validateFormDatos: boolean = false;
    let validateFormRepeticion: boolean = false;

    if (
      !(
        this.newEvent.idTipoCalendario == null ||
        this.newEvent.idTipoCalendario == undefined ||
        this.newEvent.title == null ||
        this.newEvent.title == undefined ||
        this.newEvent.title == "" ||
        this.newEvent.start == null ||
        this.newEvent.start == undefined ||
        this.newEvent.end == undefined ||
        this.newEvent.end == null
      )
    ) {
      validateFormDatos = true;
    }

    if (
      (validateFormDatos && this.checkFechaInicioRepeticion) ||
      (validateFormDatos && this.checkFechaFinRepeticion) ||
      (validateFormDatos && this.checkTipoRepeticion) ||
      (validateFormDatos && this.checkTipoDiasRepeticion)
    ) {
      if (
        !(
          this.newEvent.fechaInicioRepeticion == null ||
          this.newEvent.fechaInicioRepeticion == undefined ||
          this.newEvent.fechaFinRepeticion == null ||
          this.newEvent.fechaFinRepeticion == undefined ||
          this.newEvent.valoresRepeticion == undefined ||
          this.newEvent.valoresRepeticion == null ||
          this.newEvent.tipoRepeticion == undefined ||
          this.newEvent.tipoRepeticion == null
        )
      ) {
        validateFormRepeticion = true;
      } else {
        validateFormRepeticion = false;
      }
    } else {
      validateFormRepeticion = true;
    }

    if (validateFormDatos && validateFormRepeticion) {
      return false;
    } else {
      return true;
    }
  }

  isCheckFechaInicioRepeticion(event) {
    this.onlyCheckDatos();
    this.newEvent.fechaInicioRepeticion = event;

    if (this.newEvent.fechaInicioRepeticion != null) {
      this.checkFechaInicioRepeticion = true;
    } else {
      this.checkFechaInicioRepeticion = false;
    }
  }

  isCheckFechaFinRepeticion(event) {

    this.newEvent.fechaFinRepeticion = event;

    if (this.newEvent.fechaFinRepeticion != null) {
      this.checkFechaFinRepeticion = true;
    } else {
      this.checkFechaFinRepeticion = false;
    }
  }

  isCheckTipoRepeticion() {
    this.onlyCheckDatos();
    this.newEvent.valoresRepeticion = [];
    if (this.newEvent.tipoRepeticion != null) {
      this.checkTipoRepeticion = true;
    } else {
      this.checkTipoRepeticion = false;
    }
  }

  isCheckTipoDiasRepeticion() {
    if (this.newEvent.tipoDiasRepeticion != null) {
      this.checkTipoDiasRepeticion = true;
    } else {
      this.checkTipoDiasRepeticion = false;
    }
  }

  disabledRadioButton() {
    if (
      this.modoEdicionEventoByAgenda ||
      this.tipoAccesoLectura ||
      this.selectedTipoLaboral ||
      this.modoTipoEventoInscripcion
    ) {
      return true;
    } else {
      return false;
    }
  }

  searchEvent(curso) {
    this.progressSpinner = true;

    this.sigaServices.post("fichaEventos_searchEvent", curso).subscribe(
      n => {
        if (n.body != "") {
          this.newEvent = JSON.parse(n.body);
          let fechaIni = new Date(this.newEvent.start);
          let fechaFin = new Date(this.newEvent.end);
          this.newEvent.start = fechaIni;
          this.newEvent.end = fechaFin;

          this.newEvent.idCurso = this.idCurso;
          this.getEventNotifications();
          //Inficamos que estamos en modo edicion
          this.modoEdicionEvento = true;
          //Ya esta creado el evento
          this.createEvent = true;
          //Se guarda el evento con los valores iniciales para restablecer los valores
          this.initEvent = JSON.parse(JSON.stringify(this.newEvent));
        } else {
          this.newEvent = new EventoItem();
          this.createEvent = false;
          this.getComboCalendar();


        }

        this.checkIsEventoCumplidoOrCancelado();


        if (
          sessionStorage.getItem("isFormacionCalendarByStartInscripcion") ==
          "true"
        ) {

          this.isEventoCumplidoOrCancelado = false;
          this.isEventoCancelado = false;
          this.initEvent = JSON.parse(JSON.stringify(this.newEvent));
          this.newEvent.idTipoEvento = this.valorTipoEventoInicioInscripcion;
          this.newEvent.idTipoCalendario = this.valorTipoFormacion;

          this.checkCumplido(this.newEvent.end);

          if (this.newEvent.start != undefined) {
            //Indicamos que el limite que puede durar el evento
            this.invalidDateMin = new Date(
              JSON.parse(JSON.stringify(this.newEvent.start))
            );
            this.invalidDateMax = new Date(
              JSON.parse(JSON.stringify(this.newEvent.start))
            );

            this.invalidDateMin.setHours(this.newEvent.start.getHours());
            this.invalidDateMin.setMinutes(this.newEvent.start.getMinutes());
            this.invalidDateMax.setHours(23);
            this.invalidDateMax.setMinutes(59);
          }


        } else if (
          sessionStorage.getItem("isFormacionCalendarByEndInscripcion") ==
          "true"
        ) {

          this.isEventoCumplidoOrCancelado = false;
          this.isEventoCancelado = false;
          this.initEvent = JSON.parse(JSON.stringify(this.newEvent));
          this.newEvent.idTipoEvento = this.valorTipoEventoFinInscripcion;
          this.newEvent.idTipoCalendario = this.valorTipoFormacion;

          this.checkCumplido(this.newEvent.end);

          //Indicamos que el limite que puede durar el evento
          if (this.newEvent.start != undefined) {
            this.invalidDateMin = new Date(
              JSON.parse(JSON.stringify(this.newEvent.start))
            );
            this.invalidDateMax = new Date(
              JSON.parse(JSON.stringify(this.newEvent.start))
            );

            this.invalidDateMin.setHours(this.newEvent.start.getHours());
            this.invalidDateMin.setMinutes(this.newEvent.start.getMinutes());
            this.invalidDateMax.setHours(23);
            this.invalidDateMax.setMinutes(59);
          }

        }

        //Carga los formadores que pertenecen al curso que se va a crear el evento
        if (this.isFormacionCalendar) {
          this.getTrainers();
          //Obligamos a que sea el tipo de calendario formacion
          this.newEvent.idTipoCalendario = this.valorTipoFormacion;
        }
        //Cargamos los tipo de calendarios que existen
        this.getComboCalendar();
        this.progressSpinner = false;

      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
        this.progressSpinner2 = false;
      }
    );
  }

  searchEventByIdEvento(idEvento) {
    this.sigaServices
      .getParam(
        "fichaEventos_searchEventByIdEvento",
        "?idEvento=" + idEvento
      )
      .subscribe(
        evento => {

          if (evento != "") {
            this.newEvent = JSON.parse(JSON.stringify(evento));
            this.getComboCalendar();
            this.getEventNotifications();

            this.modoEdicionEvento = true;
            this.createEvent = true;
            if (
              sessionStorage.getItem("isFormacionCalendarByStartInscripcion") ==
              "true"
            ) {

              this.isEventoCumplidoOrCancelado = false;
              this.isEventoCancelado = false;

              this.initEvent = JSON.parse(JSON.stringify(this.newEvent));

              this.newEvent.start = new Date(this.curso.fechaInscripcionDesdeDate);
              this.newEvent.end = new Date(this.curso.fechaInscripcionDesdeDate);
              this.newEvent.idTipoEvento = this.valorTipoEventoInicioInscripcion;
              this.newEvent.idTipoCalendario = this.valorTipoFormacion;

              this.checkCumplido(this.newEvent.end);

              //Indicamos que el limite que puede durar el evento
              this.invalidDateMin = new Date(
                JSON.parse(JSON.stringify(this.newEvent.start))
              );
              this.invalidDateMax = new Date(
                JSON.parse(JSON.stringify(this.newEvent.start))
              );

              this.invalidDateMin.setHours(this.newEvent.start.getHours());
              this.invalidDateMin.setMinutes(this.newEvent.start.getMinutes());
              this.invalidDateMax.setHours(23);
              this.invalidDateMax.setMinutes(59);
            } else if (
              sessionStorage.getItem("isFormacionCalendarByEndInscripcion") ==
              "true"
            ) {

              this.isEventoCumplidoOrCancelado = false;
              this.isEventoCancelado = false;

              this.initEvent = JSON.parse(JSON.stringify(this.newEvent));

              this.newEvent.start = new Date(this.curso.fechaInscripcionHastaDate);
              this.newEvent.end = new Date(this.curso.fechaInscripcionHastaDate);
              this.newEvent.idTipoEvento = this.valorTipoEventoFinInscripcion;
              this.newEvent.idTipoCalendario = this.valorTipoFormacion;

              this.checkCumplido(this.newEvent.end);

              //Indicamos que el limite que puede durar el evento
              this.invalidDateMin = new Date(
                JSON.parse(JSON.stringify(this.newEvent.start))
              );
              this.invalidDateMax = new Date(
                JSON.parse(JSON.stringify(this.newEvent.start))
              );

              this.invalidDateMin.setHours(this.newEvent.start.getHours());
              this.invalidDateMin.setMinutes(this.newEvent.start.getMinutes());
              this.invalidDateMax.setHours(23);
              this.invalidDateMax.setMinutes(59);
            }

            //Se guarda el evento con los valores iniciales para restablecer los valores
            this.initEvent = JSON.parse(JSON.stringify(this.newEvent));
            // this.initEvent.start = new Date(evento.start);
            // this.initEvent.end = new Date(evento.end);


          } else {
            this.newEvent = new EventoItem();
            this.createEvent = false;
            this.getComboCalendar();
          }
          this.progressSpinner = false;
        },
        err => {
          //console.log(err);
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
          this.progressSpinner2 = false;
        }
      );
  }

  formadoresDistintosCheck() {
    if (JSON.stringify(this.checkFormadores) != JSON.stringify(this.results)) {
      return true;
    } else {
      return false;
    }
  }
  //FUNCIONES FICHA NOTIFICACIONES

  getColsResults() {

    this.colsNotifications = [
      {
        field: "idPlantilla",
        header: "menu.facturacion.plantillas",
        value: "nombrePlantilla"
      },
      {
        field: "tipoEnvio",
        header: "envios.plantillas.literal.tipoenvio"
      },
      {
        field: "cuando",
        header: "formacion.datosNotificaciones.cuando.cabecera"
      },
      {
        field: "idUnidadMedida",
        header: "formacion.datosNotificaciones.unidadMedida.literal",
        value: "descripcionMedida"
      },
      {
        field: "idTipoCuando",
        header: "formacion.datosNotificaciones.antesDespues.literal",
        value: "descripcionAntes"
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

  getEventNotifications() {
    this.progressSpinner = true;
    this.historico = false;

    this.sigaServices
      .getParam(
        "fichaEventos_getEventNotifications",
        "?idEvento=" + this.newEvent.idEvento
      )
      .subscribe(
        n => {
          this.datosNotificaciones = n.eventNotificationItems;

          this.datosNotificaciones.forEach(noti => {
            noti.isMod = false;
          });

          sessionStorage.setItem("datosNotificacionesInit", JSON.stringify(this.datosNotificaciones));

          this.progressSpinner = false;
        },
        err => {
          this.progressSpinner = false;
        },
        () => {
          window.scrollTo(0, 0);
          this.progressSpinner = false;
        }
      );
  }

  setItalic(datoH) {
    if (datoH.fechaBaja == null) return false;
    else return true;
  }

  editNotificaciones(dato) {
    this.editNotificacion = true;
    let datoFind = this.updateNotificationList.find(x => x.idNotificacion == dato.idNotificacion);

    if (datoFind == undefined) {
      let datoFindOriginal = this.datosNotificaciones.find(x => x.idNotificacion == dato.idNotificacion);
      this.updateNotificationList.push(datoFindOriginal);
    } else {
      let idDatoFind = this.updateNotificationList.findIndex(x => x.idNotificacion == dato.idNotificacion);
      this.updateNotificationList[idDatoFind] = dato;
    }
  }

  irEditarNotificacion(id) {
    if (id.length >= 1 && this.selectMultipleNotifications == false) {
      sessionStorage.setItem("modoEdicionNotify", "true");
      sessionStorage.removeItem("notifySelected");
      sessionStorage.setItem("notifySelected", JSON.stringify(id));
      sessionStorage.removeItem("isFormacionCalendar");
      sessionStorage.setItem("isFormacionCalendar", "false");
      sessionStorage.removeItem("evento");
      sessionStorage.setItem("evento", JSON.stringify(this.newEvent));
      sessionStorage.setItem(
        "notificaciones",
        JSON.stringify(this.datosNotificaciones)
      );
      sessionStorage.setItem("historico", JSON.stringify(this.historico));
      sessionStorage.setItem("fichaAbierta", "true");
      sessionStorage.setItem("isEventoCumplido", JSON.stringify(this.isEventoCumplidoOrCancelado));
      this.router.navigate(["/editarNotificacion"]);
    } else {
      this.numSelectedNotification = this.selectedDatosNotifications.length;
    }
  }

  actualizaSeleccionadosNotifications(selectedDatosNotifications) {
    this.deleteNotificacion = true;
    this.numSelectedNotification = selectedDatosNotifications.length;
  }

  actualizaSeleccionadosNotificationsEdit(selectedDatosNotifications) {

    this.datosNotificaciones.forEach(element => {
      element.isMod = false;
    });

    if (selectedDatosNotifications.length == 1) {
      let id = this.datosNotificaciones.findIndex(x => x.idNotificacion == this.selectedDatosNotifications[0].idNotificacion);
      this.datosNotificaciones[id].isMod = true;
    }

    this.numSelectedNotification = selectedDatosNotifications.length;
    this.tableNotifications.reset();
  }

  onChangeRowsPerPagesNotifications(event) {
    this.selectedNotification = event.value;
    this.changeDetectorRef.detectChanges();
    this.tableNotifications.reset();
  }

  onChangeRowsPerPagesAsistencia(event) {
    this.selectedAsistencia = event.value;
    this.changeDetectorRef.detectChanges();
    this.tableAsistencia.reset();
  }

  newNotification() {

    this.pressNewNotificacion = true;
    this.newNotificacion = new NotificacionEventoItem();
    this.newNotificacion.idEvento = this.newEvent.idEvento;
    let tipoEvento;
    if (this.newEvent.idTipoEvento == this.valorTipoEventoGeneral) {
      tipoEvento = "General";
    } else if (this.newEvent.idTipoEvento == this.valorTipoEventoFestivo) {
      tipoEvento = "Laboral";
    } else if (this.newEvent.idTipoEvento == this.valorTipoEventoSesion) {
      tipoEvento = "Sesión";
    } else {
      tipoEvento = this.newEvent.tipoEvento;
    }
    let findTipoNotificacion = this.comboNotifyType.find(x => x.label === tipoEvento);
    this.newNotificacion.idTipoNotificacion = findTipoNotificacion.value;

    let notificacion = {
      idNotificacion: "",
      nombreTipoNotificacion: this.newEvent.tipoEvento,
      idPlantilla: "",
      tipoEnvio: "",
      cuando: "",
      idUnidadMedida: "",
      idTipoCuando: ""
    };

    if (this.datosNotificaciones.length == 0) {
      this.datosNotificaciones.push(notificacion);
    } else {
      this.datosNotificaciones = [notificacion, ...this.datosNotificaciones];
    }
    // sessionStorage.setItem("notificacionByEvento", "true");
    // sessionStorage.setItem("modoEdicionNotify", "false");
    // sessionStorage.setItem("fichaAbierta", "true");
    // sessionStorage.removeItem("isFormacionCalendar");
    // sessionStorage.setItem("isFormacionCalendar", "false");
    // sessionStorage.removeItem("evento");
    // sessionStorage.setItem("evento", JSON.stringify(this.newEvent));
    // this.router.navigate(["/editarNotificacion"]);
  }

  restNotifications() {
    this.datosNotificaciones = JSON.parse(sessionStorage.getItem("datosNotificacionesInit"));
    this.pressNewNotificacion = false;
    this.editNotificacion = false;
    this.newNotificacion = undefined;
    this.updateNotificationList = [];
    this.numSelectedNotification = 0;
    this.tableNotifications.reset();
  }

  saveNotification() {
    this.progressSpinner = true;
    let url = "";
    let notification;

    if (this.pressNewNotificacion) {
      url = "datosNotificaciones_saveNotification";
      notification = this.newNotificacion;
    } else {
      url = "datosNotificaciones_updateNotification";

      notification = new NotificacionEventoObject();
      notification.eventNotificationItems = this.updateNotificationList;
    }

    this.sigaServices.post(url, notification).subscribe(
      data => {
        this.progressSpinner = false;
        this.pressNewNotificacion = false;
        this.editNotificacion = false;
        this.selectedDatosNotifications = [];
        this.newNotificacion = undefined;
        this.numSelectedNotification = 0;
        this.updateNotificationList = [];
        this.getEventNotifications();
        this.showSuccess();
      },
      err => {
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }

  onChangeSelectAllNotifications() {
    if (this.selectAllNotifications === true) {
      this.selectMultipleNotifications = true;
      this.selectedDatosNotifications = this.datosNotificaciones;
      this.numSelectedNotification = this.datosNotificaciones.length;
      this.deleteNotificacion = true;
    } else {
      this.selectedDatosNotifications = [];
      this.numSelectedNotification = 0;
      this.selectMultipleNotifications = false;
      this.deleteNotificacion = false;
    }
  }

  isSelectMultipleNotifications() {
    this.selectMultipleNotifications = !this.selectMultipleNotifications;
    if (!this.selectMultipleNotifications) {
      this.selectedDatosNotifications = [];
      this.numSelectedNotification = 0;
      this.deleteNotificacion = false;
    } else {
      this.selectAllNotifications = false;
      this.selectedDatosNotifications = [];
      this.numSelectedNotification = 0;
    }
  }

  deleteNotification(selectedDatos) {
    let mess = "";
    if (selectedDatos.length > 1) {
      mess = this.translateService.instant(
        "eventos.mensaje.eliminar.notificaciones"
      );
    } else {
      mess = this.translateService.instant(
        "eventos.mensaje.eliminar.notificacion"
      );
    }
    let icon = "fa fa-edit";
    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        this.progressSpinner = true;
        let deleteNotifications = new NotificacionEventoObject();
        selectedDatos.forEach(e => {
          let noti = new NotificacionEventoItem();
          noti = e;
          deleteNotifications.eventNotificationItems.push(noti);
        });
        this.sigaServices
          .post("fichaCalendario_deleteNotification", deleteNotifications)
          .subscribe(
            data => {
              this.progressSpinner = false;
              this.getEventNotifications();
              this.selectMultipleNotifications = false;
              this.selectAllNotifications = false;
              this.selectedDatosNotifications = [];
              this.deleteNotificacion = false;
              this.numSelectedNotification = 0;
            },
            err => {
              this.progressSpinner = false;
            },
            () => {
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

  getHistoricEventNotifications() {
    this.progressSpinner = true;
    this.historico = true;
    this.sigaServices
      .getParam(
        "fichaEventos_getHistoricEventNotifications",
        "?idEvento=" + this.newEvent.idEvento
      )
      .subscribe(
        n => {
          this.datosNotificaciones = n.eventNotificationItems;
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

  getComboNotificaciones() {
    this.getComboNotifyType();
    this.getComboTemplate();
    this.getComboMeasureUnit();
    this.getComboAfterBefore();
  }

  getComboNotifyType() {
    this.sigaServices.get("datosNotificaciones_getTypeNotifications").subscribe(
      n => {
        this.comboNotifyType = n.combooItems;
      },
      err => {
        //console.log(err);
      }
    );
  }

  getComboTemplate() {
    this.progressSpinner = true;
    this.sigaServices.get("datosNotificaciones_getPlantillas").subscribe(
      n => {
        this.comboTemplates = n.comboPlantillasItems;
        this.arregloTildesCombo(this.comboTemplates);
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

  getComboMeasureUnit() {
    this.sigaServices.get("datosNotificaciones_getMeasuredUnit").subscribe(
      n => {
        this.comboMeasureUnit = n.combooItems;
      },
      err => {
        //console.log(err);
      }
    );
  }

  getComboAfterBefore() {
    this.sigaServices.get("datosNotificaciones_getTypeWhere").subscribe(
      n => {
        this.comboAfterBefore = n.combooItems;
      },
      err => {
        //console.log(err);
      }
    );
  }

  onChangeTemplates(event, dato) {

    if (!this.pressNewNotificacion) {
      this.editNotificacion = true;
    }

    let plantilla = this.comboTemplates.find(
      x => x.value === event.value
    );

    let idPlantillaEnvio = event.value;
    let idTipoEnvio = plantilla.subValue;

    this.getTypeSend(idPlantillaEnvio, idTipoEnvio, dato);
  }

  getTypeSend(idPlantillaEnvio, idTipoEnvio, dato) {
    this.progressSpinner = true;
    let typeSend = [];
    this.sigaServices
      .getParam(
        "datosNotificaciones_getTypeSend",
        "?idPlantillaEnvio=" + idPlantillaEnvio + "&idTipoEnvio=" + idTipoEnvio
      )
      .subscribe(
        n => {
          typeSend = n.combooItems;

          if (typeSend.length != 0) {

            if (this.newNotificacion != undefined) {
              this.newNotificacion.idTipoEnvio = typeSend[0].value;
              this.newNotificacion.tipoEnvio = typeSend[0].label;
            } else {
              dato.tipoEnvio = typeSend[0].label;
              dato.idTipoEnvio = typeSend[0].value;
            }

          } else {
            dato.tipoEnvio = undefined;
            dato.idTipoEnvio = undefined;
          }

          if (!this.pressNewNotificacion) {
            this.editNotificaciones(dato);
          }
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

  validateNotification() {
    if (this.newNotificacion != undefined) {
      if (
        this.newNotificacion.idPlantilla == undefined ||
        this.newNotificacion.idTipoCuando == undefined ||
        this.newNotificacion.idUnidadMedida == undefined ||
        this.newNotificacion.idTipoCuando == undefined ||
        this.newNotificacion.cuando == undefined
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  //FUNCIONES FICHA FORMADORES

  getTrainersSession() {
    this.sigaServices
      .getParam(
        "fichaEventos_getTrainersSession",
        "?idEvento=" + this.initEvent.idEvento
      )
      .subscribe(
        n => {
          this.results = n.formadoresCursoItem;
          this.checkFormadores = JSON.parse(JSON.stringify(this.results));
          this.results.forEach(element => {
            if (element.color == undefined) {
              element.color = "#024eff";
            }
          });

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

  getTrainers() {
    this.sigaServices
      .getParam("fichaEventos_getTrainersLabels", "?idCurso=" + this.idCurso)
      .subscribe(
        n => {
          this.formadores = n.formadoresCursoItem;
          this.formadoresSuggest = this.formadores;
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

  filterTrainersMultiple(event) {
    if (
      this.formadoresSuggest.length > 0 &&
      this.formadores.length != this.results.length
    ) {
      this.autoComplete.panelVisible = true;
      this.backgroundColor = "#024eff";
      if (this.results.length > 0) {
        this.formadoresSuggest = [];

        this.formadores.forEach(element => {
          let findFormador = this.results.find(
            x => x.idPersona === element.idPersona
          );
          if (findFormador == undefined) {
            this.formadoresSuggest.push(element);
          }
        });
      } else {
        this.formadoresSuggest = this.formadores;
      }

      this.autoComplete.focusInput();
    } else {
      this.autoComplete.panelVisible = false;
      this.showInfoTrainers();
      this.autoComplete.focusInput();
    }
  }

  resetSuggestTrainers() {
    this.autoComplete.panelVisible = false;
  }

  visiblePanelBlur(event) {
    if (this.autoComplete.highlightOption != undefined) {
      this.autoComplete.highlightOption.color = "#024eff";
      this.results.push(this.autoComplete.highlightOption);
      this.autoComplete.highlightOption = undefined;
    }
    this.autoComplete.panelVisible = false;
  }

  visiblePanelOnSelect() {
    this.autoComplete.panelVisible = false;
  }

  showSuggestions() {
    this.autoComplete.panelVisible = true;
    this.autoComplete.suggestions = this.formadores;
  }

  getRandomColor() {
    var color = Math.floor(0x1000000 * Math.random()).toString(16);
    return "#" + ("000000" + color).slice(-6);
  }

  showInfoTrainers() {
    this.msgs = [];
    this.msgs.push({
      severity: "info",
      summary: this.translateService.instant("general.message.informacion"),
      detail: this.translateService.instant(
        "formacion.mensaje.noexiste.formadores.curso"
      )
    });
  }

  restTrainers() {
    if (this.checkFormadores != undefined) {
      this.results = JSON.parse(JSON.stringify(this.checkFormadores));
    } else {
      this.results = [];
    }
    this.formadoresSuggest = this.formadores;
  }

  //FUNCIONES FICHA ASISTENCIA

  getComboAsistencia() {
    this.comboAsistencia = [
      { label: "No", value: "0" },
      { label: "Sí", value: "1" }
    ];
  }

  getColsResultsAsistencia() {
    this.colsAsistencia = [
      {
        field: "nombrePersona",
        header: "administracion.parametrosGenerales.literal.nombre"
      },
      {
        field: "asistencia",
        header: "formacion.busquedaInscripcion.asistencia"
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

  getEntryListCourse() {
    this.sigaServices
      .getParam("fichaEventos_getEntryListCourse", "?idCurso=" + this.idCurso)
      .subscribe(
        n => {
          this.datosAsistencia = n.asistenciaEventoItem;
        },
        err => {
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        }
      );
  }

  setAssistanceUpdate(dato) {
    let idFindAssitance = this.asistenciasUpdate.findIndex(
      x => x.idPersona === dato.idPersona
    );

    if (idFindAssitance == -1) {
      this.addAssistanceUpdateList(idFindAssitance, dato);
    } else {
      let id = this.datosAsistencia.findIndex(
        x => x.idPersona === dato.idPersona
      );

      this.asistenciasUpdate[idFindAssitance] = this.datosAsistencia[id];
    }
  }

  addAssistanceUpdateList(idFindCertificate, dato) {
    let id = this.datosAsistencia.findIndex(
      x => x.idPersona === dato.idPersona
    );

    if (this.datosAsistencia[id].idEvento == null) {
      this.datosAsistencia[id].idEvento = this.newEvent.idEvento;
    }
    this.asistenciasUpdate.push(this.datosAsistencia[id]);
  }

  saveAssistancesCourse() {
    let asistencias = new AsistenciaEventoObject();
    asistencias.asistenciaEventoItem = this.asistenciasUpdate;

    this.sigaServices
      .post("fichaEventos_saveAssistancesCourse", asistencias)
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.showSuccess();
        },
        err => {
          this.progressSpinner = false;
          this.showUnSuccess();
        },
        () => {
          this.progressSpinner = false;
        }
      );
  }

  isSelectMultipleAsistencia() {
    this.selectMultipleAsistencia = !this.selectMultipleAsistencia;
    if (!this.selectMultipleAsistencia) {
      this.selectedDatosAsistencia = [];
      this.numSelectedAsistencia = 0;
      this.checkAsistencias = false;
    } else {
      this.selectAllAsistencias = false;
      this.selectedDatosAsistencia = [];
      this.numSelectedAsistencia = 0;
      this.checkAsistencias = true;
    }
  }

  checkAsist() {
    this.selectedDatosAsistencia.forEach(element => {
      let idFindAsistencia = this.datosAsistencia.findIndex(
        x => x.idPersona === element.idPersona
      );
      if (idFindAsistencia != undefined) {
        this.datosAsistencia[idFindAsistencia].asistencia = "1";
      }

      this.setAssistanceUpdate(element);
    });

    this.selectAllAsistencias = false;
  }

  unCheckAsist() {
    this.selectedDatosAsistencia.forEach(element => {
      let idFindAsistencia = this.datosAsistencia.findIndex(
        x => x.idPersona === element.idPersona
      );
      if (idFindAsistencia != undefined) {
        this.datosAsistencia[idFindAsistencia].asistencia = "0";
      }

      this.setAssistanceUpdate(element);
    });
    this.selectAllAsistencias = false;
  }

  onChangeSelectAllAsistencias() {
    if (this.selectAllAsistencias === true) {
      this.selectMultipleAsistencia = false;
      this.selectedDatosAsistencia = this.datosAsistencia;
      this.numSelectedAsistencia = this.datosAsistencia.length;
      this.checkAsistencias = true;
    } else {
      this.selectedDatosAsistencia = [];
      this.numSelectedAsistencia = 0;
      this.checkAsistencias = false;
    }
  }

  downloadTemplateFile() {
    this.progressSpinner = true;
    let asistencias = new AsistenciaEventoObject();
    asistencias.asistenciaEventoItem = this.datosAsistencia;

    this.sigaServices
      .postDownloadFiles("fichaEventos_downloadTemplateFile", asistencias)
      .subscribe(
        data => {
          const blob = new Blob([data], { type: "text/csv" });
          saveAs(blob, "PlantillaAsistencia.xls");
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
    this.progressSpinner = true;

    if (this.file != undefined) {
      this.sigaServices
        .postSendContentAndParameter(
          "fichaEventos_uploadFile",
          "?idEvento=" + this.newEvent.idEvento,
          this.file
        )
        .subscribe(
          data => {
            this.file = null;
            this.progressSpinner = false;

            this.showSuccess();
            this.getEntryListCourse();
          },
          error => {
            //console.log(error);
            this.showMessage("error", "Error", error.error.error.description
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

  //FUNCIONES GENERALES
  getFichasPosibles() {
    this.fichasPosibles = [
      {
        key: "generales",
        activa: true
      },
      {
        key: "notify",
        activa: false
      },
      {
        key: "formadores",
        activa: false
      },
      {
        key: "asistencia",
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
    this.onlyCheckDatos();
    let fichaPosible = this.getFichaPosibleByKey(key);
    if (this.saveCalendarFlag) {
      fichaPosible.activa = !fichaPosible.activa;
    }

    if (key == "confi" && this.openFicha) {
      this.openFicha = false;
      this.closeFicha = true;
    } else if (key == "confi" && !this.openFicha) {
      this.openFicha = true;
      this.closeFicha = false;
    }
  }

  abreCierraFicha(key) {
    if (!this.openFicha) {
      this.onlyCheckDatos();
    }
    let fichaPosible = this.getFichaPosibleByKey(key);
    if (this.createEvent) {
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

  clear() {
    this.msgs = [];
  }

  backTo() {
    if (
      this.path == "formacionInicioInscripcion" &&
      sessionStorage.getItem("isFormacionCalendarByStartInscripcion") == "true"
    ) {
      sessionStorage.setItem(
        "idEventoInicioInscripcion",
        this.newEvent.idEvento
      );
      this.curso.fechaInscripcionDesdeDate = this.initEvent.start;
      sessionStorage.setItem("courseCurrent", JSON.stringify(this.curso));

    } else if (
      this.path == "formacionFinInscripcion" &&
      sessionStorage.getItem("isFormacionCalendarByEndInscripcion") == "true"
    ) {
      sessionStorage.setItem("idEventoFinInscripcion", this.newEvent.idEvento);
      this.curso.fechaInscripcionHastaDate = this.initEvent.end;
      sessionStorage.setItem("courseCurrent", JSON.stringify(this.curso));
      sessionStorage.setItem("modoEdicionCurso", "true");

    } else if (sessionStorage.getItem("isSession") == "true") {
      sessionStorage.setItem("modoEdicionCurso", "true");
    }

    this.location.back();
  }

  showSuccess() {
    this.msgs = [];
    this.msgs.push({
      severity: "success",
      summary: this.translateService.instant("general.message.correct"),
      detail: this.translateService.instant("general.message.accion.realizada")
    });
  }

  showUnSuccess() {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: this.translateService.instant("general.message.incorrect"),
      detail: this.translateService.instant(
        "general.message.error.realiza.accion"
      )
    });
  }

  showUnSuccessBBDD() {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: this.translateService.instant("general.message.incorrect"),
      detail: this.translateService.instant("general.mensaje.error.bbdd")
    });
  }

  guardarFormadores() {
    this.onlyCheckDatos();
    let url = "";

    this.progressSpinner = true;

    if (this.results.length == 0) {
      let personaEvento: DatosPersonaEventoItem = new DatosPersonaEventoItem();
      personaEvento.idEvento = this.newEvent.idEvento;

      this.listaPersonaEvento.push(personaEvento);
    } else {
      this.results.forEach(element => {
        let personaEvento: DatosPersonaEventoItem = new DatosPersonaEventoItem();

        personaEvento.idEvento = this.newEvent.idEvento;
        personaEvento.idPersona = element.idPersona;
        personaEvento.idInstitucion = this.newEvent.idInstitucion;

        this.listaPersonaEvento.push(personaEvento);
      });
    }

    let list = new DatosPersonaEventoObject();
    list.personaEventoItem = this.listaPersonaEvento;
    this.listaPersonaEvento = [];

    if (this.modoEdicionEvento) {
      //Enviamos al back todos los formadores editados
      url = "fichaEventos_updateFormadorEvent";
    } else {
      //Mapeamos el formador que queremos insertar nuevo
      url = "fichaEventos_saveFormadorEvent";
    }

    this.sigaServices.post(url, list).subscribe(
      data => {
        this.progressSpinner = false;
        this.showSuccess();
      },
      err => {
        this.progressSpinner = false;
        this.showUnSuccess();
      },
      () => {
        this.progressSpinner = false;
        this.checkFormadores = JSON.parse(JSON.stringify(this.results));
      }
    );
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  checkCumplido(fecha) {
    let fechaHoy = new Date();

    if (fecha < fechaHoy) {
      this.newEvent.idEstadoEvento = this.valorEstadoEventoCumplido;
    } else {
      this.newEvent.idEstadoEvento = this.valorEstadoEventoPlanificado;
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

  styleObligatorio(opcional, evento) {
    // if(opcional=='opcional'){
    //   if(this.resaltadoDatos && !(this.tipoAccesoLectura || this.selectedTipoLaboral || this.tipoInscripcionEvento || this.modoTipoEventoInscripcion || this.isEventoCumplidoOrCancelado)){
    //     return this.commonsService.styleObligatorio(evento);
    //   }
    // }else{
    if (this.resaltadoDatos && (evento == undefined || evento == null || evento == "")) {
      return this.commonsService.styleObligatorio(evento);
    }

  }
  styleObligatorioOpcional(opcional, evento) {
    if (opcional == 'opcional') {
      if (this.resaltadoDatosOpcionales && !(this.tipoAccesoLectura || this.selectedTipoLaboral || this.tipoInscripcionEvento || this.modoTipoEventoInscripcion || this.isEventoCumplidoOrCancelado)) {
        return this.commonsService.styleObligatorio(evento);
      }
    }
  }

  muestraCamposObligatorios() {
    this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios') }];
    this.resaltadoDatos = true;
  }

  muestraCamposObligatoriosOpcionales() {
    this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios') }];
    this.resaltadoDatosOpcionales = true;
  }

  muestraCamposObligatoriosTodos() {
    this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios') }];
    this.resaltadoDatosOpcionales = true;
    this.resaltadoDatos = true;
  }

  checkDatos() {
    if (this.validateForm()) {
      if (this.newEvent.fechaInicioRepeticion == undefined && this.newEvent.fechaFinRepeticion == undefined && this.newEvent.valoresRepeticion == undefined) {
        this.muestraCamposObligatorios();
      } else {
        if (this.newEvent.fechaInicioRepeticion != undefined || this.newEvent.fechaFinRepeticion != undefined || this.newEvent.valoresRepeticion != undefined) {
          this.muestraCamposObligatoriosTodos();
        } else {
          this.muestraCamposObligatoriosOpcionales();
        }
      }
    } else {
      this.saveEvent();
    }
  }

  onlyCheckDatos() {
    if (this.validateForm()) {
      if (this.newEvent.fechaInicioRepeticion == undefined && this.newEvent.fechaFinRepeticion == undefined && this.newEvent.valoresRepeticion == undefined) {
        this.resaltadoDatos = true;
      } else {
        if (this.newEvent.fechaInicioRepeticion != undefined || this.newEvent.fechaFinRepeticion != undefined || this.newEvent.valoresRepeticion != undefined) {
          this.resaltadoDatos = true;
        } else {
          this.resaltadoDatos = true;
        }
      }
    }
  }
}
