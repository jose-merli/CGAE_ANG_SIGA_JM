import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  OnDestroy
} from "@angular/core";
import {
  DataTable,
  AutoComplete,
  Calendar,
  ConfirmationService
} from "primeng/primeng";
import { Router } from "@angular/router";
import { SigaServices } from "../../../_services/siga.service";
import { NotificacionEventoObject } from "../../../models/NotificacionEventoObject";
import { NotificacionEventoItem } from "../../../models/NotificacionEventoItem";
import { ViewEncapsulation } from "@angular/core";
import { saveAs } from "file-saver/FileSaver";
import { AsistenciaCursoObject } from "../../../models/AsistenciaCursoObject";
import { EventoItem } from "../../../models/EventoItem";
import { Location } from "@angular/common";
import { EventoObject } from "../../../models/EventoObject";
import { TranslateService } from "../../../commons/translate";
import { esCalendar } from "../../../utils/calendar";
import { CalendarItem } from "../../../models/CalendarItem";

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
  idCalendario;
  tipoAccesoLectura: boolean = false;
  selectedTipoLaboral = false;

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
  disabledTipoEvento: boolean = false;
  comboCalendars;
  comboTipoEvento;
  selectRepeatDate;
  comboDays;
  comboRepeatEvery;
  comboRepeatOn;
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

  //Notificaciones
  selectedDatosNotifications;
  selectMultipleNotifications: boolean = false;
  selectAllNotifications: any;
  datosNotificaciones = [];
  selectedNotification: number = 10;
  numSelectedNotification: number = 0;
  rowsPerPage: any = [];
  colsNotifications: any = [];
  sortO: number = 1;

  historico: boolean = false;
  openFicha: boolean = false;
  progressSpinner: boolean = false;
  closeFicha: boolean = true;

  //Formadores
  datosFormadores: any[] = [];
  formadoresSuggest: any[] = [];
  formadores: any[] = [];
  results: any[] = [];
  backgroundColor: string;
  marginPx = "4px";
  bw = "white";
  idCurso;

  //Asistencia
  colsAsistencia;
  fichasPosibles;
  datosAsistencia = [];
  selectedDatosAsistencia;
  selectAllAsistencias: any;
  selectedAsistencia: number = 10;
  selectMultipleAsistencia: boolean = false;
  numSelectedAsistencia: number = 0;
  comboAsistencia;
  checkAsistencias: boolean = false;

  constructor(
    private sigaServices: SigaServices,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private location: Location,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.getComboEstado();
    this.getComboTipoEvento();
    this.getCombosRepeats();
    this.getColsResults();
    this.getComboAsistencia();
    this.getFichasPosibles();
    this.getColsResultsAsistencia();

    this.newEvent = new EventoItem();
    this.initEvent = new EventoItem();

    //Se comprueba de que pantalla llega y el modo Edicion/creacion

    //1. En caso de venir de la pantalla Agenda y en modo Edicion
    if (sessionStorage.getItem("modoEdicionEventoByAgenda") == "true") {
      //Indicamos que estamos en modo edicion
      this.modoEdicionEventoByAgenda = true;

      //Indicamos que el evento ya esta creado para que pueda acceder a todas las tarjetas
      this.createEvent = true;

      //Obtenemos el evento que recibimos de la pantalla calendario
      this.newEvent = JSON.parse(sessionStorage.getItem("eventoEdit"));
      this.newEvent.idTipoCalendario = JSON.parse(
        sessionStorage.getItem("calendarioEdit")
      ).idTipoCalendario;

      this.idCalendario = this.newEvent.idCalendario;

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
        this.getComboCalendar();
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
      } else {
        this.getComboCalendarLaboralGeneral();
      }

      //Si el tipo de ediccion es un evento perteneciente al calendario laboral se genera el combo de lugares
      if (this.newEvent.idTipoCalendario == this.valorTipoLaboral) {
        this.selectedTipoLaboral = true;
        this.getComboPartidoJudicial();

        //Obligamos al estado a ser Festivo
        this.newEvent.idTipoEvento = this.valorTipoEventoFestivo;
        //Si no, el lugar se introduce manualmente porque estamos en calendario general
      } else {
        this.selectedTipoLaboral = false;
        this.newEvent.idTipoEvento = this.valorTipoEventoGeneral;
      }

      this.getEventNotifications();

      //2. En caso de venir de agenda pero en modo creación
    } else if (sessionStorage.getItem("modoEdicionEventoByAgenda") == "false") {
      this.modoEdicionEventoByAgenda = false;
      this.disabledTipoEvento = true;
      // this.modoEdicionEvento = true;
      this.newModeConfiguration();

      //Se guarda el evento con los valores iniciales para restablecer los valores
      this.initEvent = JSON.parse(JSON.stringify(this.newEvent));

      //3. En caso de venir de la pantalla Formacion
    } else if (sessionStorage.getItem("isFormacionCalendar") == "true") {
      this.isFormacionCalendar = true;
      this.disabledTipoEvento = true;
      this.idCurso = sessionStorage.getItem("idCurso");
      // this.idCalendario =

      //Carga los formadores que pertenecen al curso que se va a crear el evento
      this.getTrainers();

      //Cargamos los tipo de calendarios que existen
      this.getComboCalendar();
      //Obligamos a que sea el tipo de calendario formacion
      this.newEvent.idTipoCalendario = this.valorTipoFormacion;
      this.newEvent.idTipoEvento = "8";

      //Inficamos que no estamos en modo edicion
      this.modoEdicionEvento = false;

      //Se guarda el evento con los valores iniciales para restablecer los valores
      this.initEvent = JSON.parse(JSON.stringify(this.newEvent));

      //limitamos tiempo de repeticion
      this.limitTimeEvent();

      //4. En caso de que venga notificaciones
    } else if (sessionStorage.getItem("isNotificaciones") == "true") {
      //Se deja la pantalla tal como estaba
      this.newEvent = JSON.parse(sessionStorage.getItem("evento"));
      sessionStorage.removeItem("evento");

      this.historico = JSON.parse(sessionStorage.getItem("historico"));
      sessionStorage.removeItem("historico");

      if (this.historico) {
        this.datosNotificaciones = JSON.parse(
          sessionStorage.getItem("notificaciones")
        );
        sessionStorage.removeItem("notificaciones");
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

      this.newEvent.idTipoCalendario = JSON.parse(
        sessionStorage.getItem("calendarioEdit")
      ).idTipoCalendario;

      this.idCalendario = JSON.parse(
        sessionStorage.getItem("calendarioEdit")
      ).idCalendario;

      //Indicamos que estamos en modo edicion
      this.modoEdicionEventoByAgenda = true;
      this.modoEdicionEvento = true;
      //Se comprueba el tipo de acceso que tiene el evento
      this.checkAcceso();

      //Se guarda el evento con los valores iniciales para restablecer los valores
      this.initEvent = JSON.parse(JSON.stringify(this.newEvent));

      //5. Viene directo
    } else {
      this.isFormacionCalendar = false;
      this.newEvent = new EventoItem();
      this.disabledTipoEvento = false;
      //Obligamos que el tipo de evento sea Manual
      this.newEvent.idTipoEvento = "1";
      this.modoEdicionEvento = false;

      this.getComboCalendar();
    }
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
      this.tipoAccesoLectura = false;
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
    this.invalidDateMax.setHours(this.newEvent.start.getHours());
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
        this.newEvent.idEstadoEvento = this.comboEstados[0].value;
      },
      err => {
        console.log(err);
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
        console.log(err);
      }
    );

    this.sigaServices.get("fichaEventos_getDaysWeek").subscribe(
      n => {
        this.comboRepeatOn = n.combooItems;
      },
      err => {
        console.log(err);
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
        console.log(err);
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
        console.log(err);
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
        console.log(err);
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
        console.log(err);
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

    if (sessionStorage.getItem("modoEdicionEventoByAgenda") == "true") {
      url = "fichaEventos_updateEventCalendar";
    } else {
      url = "fichaEventos_saveEventCalendar";
    }

    this.sigaServices.post(url, this.newEvent).subscribe(
      data => {
        if (JSON.parse(data.body).error.description != null) {
          this.showUnSuccessBBDD();
        } else {
          if (url == "fichaEventos_updateEventCalendar") {
            this.initEvent = JSON.parse(JSON.stringify(this.newEvent));
            this.progressSpinner = false;
            this.showSuccess();
          } else {
            this.progressSpinner = false;
            this.showSuccess();
            this.modoEdicionEventoByAgenda = true;
            this.createEvent = true;
            //Obtenemos las notificaciones del evento del calendario especifico, dentro del message se ha guardado el idEvento creado
            if (JSON.parse(data.body).id != "") {
              let idEvento = JSON.parse(data.body).id;
              this.newEvent.idEvento = idEvento;
              this.getEventNotifications();
            }
          }
        }
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

  restEvent() {
    this.newEvent = JSON.parse(JSON.stringify(this.initEvent));
    this.newEvent.start = new Date(this.newEvent.start);
    this.newEvent.end = new Date(this.newEvent.end);
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
    this.newEvent.end = new Date(
      JSON.parse(JSON.stringify(this.newEvent.start))
    );
  }

  validatorDates(event) {
    if (this.newEvent.end < this.newEvent.start) {
      this.newEvent.end = new Date(
        JSON.parse(JSON.stringify(this.newEvent.start))
      );
      this.fechaFin.currentHour = this.fechaInicio.currentHour;
      this.fechaFin.currentMinute = this.fechaInicio.currentMinute;
      this.fechaFin.inputfieldViewChild.nativeElement.value = this.fechaInicio.inputfieldViewChild.nativeElement.value;
      this.fechaFin.inputFieldValue = this.fechaInicio.inputFieldValue;
      this.fechaFin.value = this.fechaInicio.value;
    }
  }

  unselectInvalidDates() {
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

  deleteEvent() {
    let mess = "¿Estás seguro que desea eliminar este evento?";

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
            this.backTo();
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

  validateForm() {
    let validateFormDatos: boolean = false;
    let validateFormRepeticion: boolean = false;

    if (
      !(
        this.newEvent.idTipoCalendario == null ||
        this.newEvent.idTipoCalendario == undefined ||
        this.newEvent.title == null ||
        this.newEvent.title == undefined ||
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

  isCheckFechaInicioRepeticion() {
    if (this.newEvent.fechaInicioRepeticion != null) {
      this.checkFechaInicioRepeticion = true;
    } else {
      this.checkFechaInicioRepeticion = false;
    }
  }

  isCheckFechaFinRepeticion() {
    if (this.newEvent.fechaFinRepeticion != null) {
      this.checkFechaFinRepeticion = true;
    } else {
      this.checkFechaFinRepeticion = false;
    }
  }

  isCheckTipoRepeticion() {
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
      this.selectedTipoLaboral
    ) {
      return true;
    } else {
      return false;
    }
  }

  //FUNCIONES FICHA NOTIFICACIONES

  getColsResults() {
    this.colsNotifications = [
      {
        field: "nombreTipoNotificacion",
        header: "formacion.datosNotificaciones.tipoNotificacion.cabecera"
      },
      {
        field: "descripcionCuando",
        header: "formacion.datosNotificaciones.cuando.cabecera"
      },
      {
        field: "nombrePlantilla",
        header: "menu.facturacion.plantillas"
      },
      {
        field: "tipoEnvio",
        header: "envios.plantillas.literal.tipoenvio"
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

  setItalic(datoH) {
    if (datoH.fechaBaja == null) return false;
    else return true;
  }

  irEditarNotificacion(id) {
    if (id.length >= 1 && this.selectMultipleNotifications == false) {
      sessionStorage.setItem("modoEdicionNotify", "true");
      sessionStorage.removeItem("notifySelected");
      sessionStorage.setItem("notifySelected", JSON.stringify(id));
      sessionStorage.setItem("evento", JSON.stringify(this.newEvent));
      sessionStorage.setItem(
        "notificaciones",
        JSON.stringify(this.datosNotificaciones)
      );
      sessionStorage.setItem("historico", JSON.stringify(this.historico));
      this.router.navigate(["/editarNotificacion"]);
      sessionStorage.setItem("fichaAbierta", "true");
    }
  }

  actualizaSeleccionadosNotifications(selectedDatosNotifications) {
    this.numSelectedNotification = selectedDatosNotifications.length;
  }

  onChangeRowsPerPagesNotifications(event) {
    this.selectedNotification = event.value;
    this.changeDetectorRef.detectChanges();
    this.tableNotifications.reset();
  }

  newNotification() {
    sessionStorage.setItem("notificacionByEvento", "true");
    sessionStorage.setItem("modoEdicionNotify", "false");
    sessionStorage.setItem("fichaAbierta", "true");
    sessionStorage.setItem("evento", JSON.stringify(this.newEvent));
    this.router.navigate(["/editarNotificacion"]);
  }

  onChangeSelectAllNotifications() {
    if (this.selectAllNotifications === true) {
      this.selectMultipleNotifications = true;
      this.selectedDatosNotifications = this.datosNotificaciones;
      this.numSelectedNotification = this.datosNotificaciones.length;
    } else {
      this.selectedDatosNotifications = [];
      this.numSelectedNotification = 0;
      this.selectMultipleNotifications = false;
    }
  }

  isSelectMultipleNotifications() {
    this.selectMultipleNotifications = !this.selectMultipleNotifications;
    if (!this.selectMultipleNotifications) {
      this.selectedDatosNotifications = [];
      this.numSelectedNotification = 0;
    } else {
      this.selectAllNotifications = false;
      this.selectedDatosNotifications = [];
      this.numSelectedNotification = 0;
    }
  }

  deleteNotification(selectedDatos) {
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
        },
        err => {
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        }
      );
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

  //FUNCIONES FICHA FORMADORES

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
      this.backgroundColor = this.getRandomColor();
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
      this.autoComplete.highlightOption.color = this.getRandomColor();
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
      summary: "Información",
      detail: "No hay formadores para este curso."
    });
  }

  restTrainers() {
    this.results = [];
    this.formadoresSuggest = this.formadores;
  }

  //FUNCIONES FICHA ASISTENCIA

  getComboAsistencia() {
    this.comboAsistencia = [
      { label: "Sí", value: "S" },
      { label: "No", value: "N" }
    ];
  }

  getColsResultsAsistencia() {
    this.datosAsistencia = [
      {
        idAsistencia: "1",
        nombre: "JOSE RAMIREZ PEREZ",
        asistencia: "S"
      },
      {
        idAsistencia: "2",
        nombre: "JUAN LOPEZ PEREZ",
        asistencia: "S"
      },
      {
        idAsistencia: "3",
        nombre: "JOSE RAMIREZ PEREZ",
        asistencia: "N"
      }
    ];

    this.colsAsistencia = [
      {
        field: "nombre",
        header: "administracion.parametrosGenerales.literal.nombre"
      },
      {
        field: "asistencia",
        header: "Asistencia"
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
        x => x.idAsistencia === element.idAsistencia
      );
      if (idFindAsistencia != undefined) {
        this.datosAsistencia[idFindAsistencia].asistencia = "S";
      }
    });
  }

  unCheckAsist() {
    this.selectedDatosAsistencia.forEach(element => {
      let idFindAsistencia = this.datosAsistencia.findIndex(
        x => x.idAsistencia === element.idAsistencia
      );
      if (idFindAsistencia != undefined) {
        this.datosAsistencia[idFindAsistencia].asistencia = "N";
      }
    });
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
    let asistencias = new AsistenciaCursoObject();
    asistencias.asistenciaCursoItem = this.datosAsistencia;

    this.sigaServices
      .postDownloadFiles("fichaEventos_downloadTemplateFile", asistencias)
      .subscribe(
        data => {
          const blob = new Blob([data], { type: "text/csv" });
          saveAs(blob, "PlantillaAsistencia.xls");
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
    this.location.back();
  }

  showSuccess() {
    this.msgs = [];
    this.msgs.push({
      severity: "success",
      summary: "Correcto",
      detail: "Acción realizada correctamente"
    });
  }

  showUnSuccess() {
    this.msgs = [];
    this.msgs.push({
      severity: "cancel",
      summary: "Incorrecto",
      detail: "Acción no realizada correctamente"
    });
  }

  showUnSuccessBBDD() {
    this.msgs = [];
    this.msgs.push({
      severity: "cancel",
      summary: "Incorrecto",
      detail: "Se ha producido un error en BBDD contacte con su administrador"
    });
  }
}
