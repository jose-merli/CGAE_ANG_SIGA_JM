import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  OnDestroy
} from "@angular/core";
import { Router } from "@angular/router";
import { CalendarItem } from "../../models/CalendarItem";
import { Checkbox, Schedule } from "primeng/primeng";
import { SigaServices } from "../../_services/siga.service";
import { EventoItem } from "../../models/EventoItem";
import { findIndex } from "rxjs/operators";
import { esCalendar, catCalendar, euCalendar, glCalendar } from '../../utils/calendar';
import { TranslateService } from "../../commons/translate";
import { months } from "../../../../node_modules/moment";

@Component({
  selector: "app-agenda",
  templateUrl: "./agenda.component.html",
  styleUrls: ["./agenda.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class AgendaComponent implements OnInit {
  cols;
  datos;
  types;
  listLectura;
  listLecturaSelect;
  listAcceso;
  listAccesoSelect;
  currentLang;
  lectura: boolean = true;
  acceso: boolean = true;

  progressSpinner: boolean = false;

  //Para el calendario
  events: any[];
  eventosDTO;
  header: any;
  options: any;
  calendarios: any[];
  selectedCalendario: any;
  color: any;
  selectedCalendarios: any[];
  es: any;
  week: any;

  @ViewChild("calendario") calendarioSchedule;

  checked: boolean = true;

  fechaActual: Date = new Date();
  constructor(private router: Router, private sigaServices: SigaServices, private translateService: TranslateService) { }

  ngOnInit() {
    this.listLecturaSelect = [];
    this.listAccesoSelect = [];
    sessionStorage.setItem("isFormacionCalendar", "false");

    this.options = {
      header: {
        left: "prev,next",
        center: "title",
        right: "month,agendaWeek,agendaDay"
      },
      editable: false,
      views: {
        month: { buttonText: this.translateService.instant("menu.agenda.mes.literal") },
        agendaDay: {
          buttonText: this.translateService.instant("fichaEventos.datosRepeticion.repetirCada.dia")
        },
        agendaWeek: { buttonText: this.translateService.instant("fichaEventos.datosRepeticion.repetirCada.semana") }
      }
    }

    this.getLenguage();

    this.calendarioSchedule.timezone = "local";
    this.events = [];
    sessionStorage.removeItem("eventoEdit");
    sessionStorage.removeItem("modoEdicionEventoByAgenda");
    sessionStorage.removeItem("sessions");

    this.getCalendarios();
  }

  getLenguage() {

    this.sigaServices.get('usuario').subscribe((response) => {
      this.currentLang = response.usuarioItem[0].idLenguaje;

      if (this.currentLang == 1) {
        this.es = "es";
      } else if (this.currentLang == 2) {
        this.es = "ca_ES";
      } else if (this.currentLang == 3) {
        this.es = "eu_ES";
      } else if (this.currentLang == 4) {
        this.es = "gl_ES";
      } else {
        this.es = "es";
      }

    });

  }

  onClickCheckBox(calendario) {
    calendario.checked = !calendario.checked;
    this.getEventos(calendario);
    sessionStorage.setItem("calendarios", JSON.stringify(this.calendarios));
  }

  onClickLabelCheckbox(calendario: CalendarItem) {
    sessionStorage.setItem("modoEdicion", "true");
    sessionStorage.setItem("idCalendario", calendario.idCalendario);
    this.router.navigate(["/editarCalendario"]);
  }

  getCalendarios() {
    this.progressSpinner = true;

    this.sigaServices.get("agendaCalendario_getCalendarios").subscribe(
      res => {
        if (res.calendarItems) {
          this.calendarios = res.calendarItems;
        }

        if (sessionStorage.getItem("calendarios")) {
          JSON.parse(sessionStorage.getItem("calendarios")).forEach(element => {
            if (element.checked) {
              let posicion = this.calendarios.findIndex(
                x => x.idCalendario === element.idCalendario
              );

              this.calendarios[posicion].checked = true;
              this.getEventos(this.calendarios[posicion]);
            }
          });
        }
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      }
    );
  }

  getEventos(calendario) {
    if (calendario.checked) {
      this.getEventsByIdCalendario(calendario.idCalendario);
    } else {
      this.clearEventsByIdCalendario(calendario.idCalendario);
    }
  }

  getEventsByIdCalendario(id: string) {
    this.progressSpinner = true;

    this.sigaServices
      .getParam(
        "agendaCalendario_getEventosByIdCalendario",
        "?idCalendario=" + id
      )
      .subscribe(
        res => {
          if (res.eventos) {
            this.events = this.events.concat(res.eventos);
          }

          this.progressSpinner = false;
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        }
      );
  }

  clearEventsByIdCalendario(id: string) {
    let auxArray: any[] = [];

    this.events.forEach(element => {
      if (element.idCalendario !== id) {
        auxArray.push(element);
      }
    });

    this.events = auxArray;
  }

  activateLectura() {
    this.lectura = false;
    this.acceso = true;
  }

  activateAcceso() {
    this.acceso = false;
    this.lectura = true;
  }

  isNuevo() {
    sessionStorage.setItem("modoEdicion", "false");
    sessionStorage.setItem("calendarios", JSON.stringify(this.calendarios));
    this.router.navigate(["/editarCalendario"]);
  }

  onClickEvento(event) {
    let evento: EventoItem = new EventoItem();
    evento.idEvento = event.calEvent.idEvento;
    evento.idCalendario = event.calEvent.idCalendario;
    evento.idTipoEvento = event.calEvent.idTipoEvento;
    evento.idEstadoEvento = event.calEvent.idEstadoEvento;
    evento.title = event.calEvent.title;
    evento.allDay = event.calEvent.allDay;
    evento.color = event.calEvent.color;
    evento.descripcion = event.calEvent.descripcion;
    evento.recursos = event.calEvent.recursos;
    evento.lugar = event.calEvent.lugar;
    evento.start = event.calEvent.start;
    evento.idCurso = event.calEvent.idCurso;
    evento.fechaInicioRepeticion = event.calEvent.fechaInicioRepeticion;
    evento.fechaFinRepeticion = event.calEvent.fechaFinRepeticion;
    evento.tipoDiasRepeticion = event.calEvent.tipoDiasRepeticion;
    evento.tipoRepeticion = event.calEvent.tipoRepeticion;
    evento.valoresRepeticion = JSON.parse(
      event.calEvent.valoresRepeticionString
    );
    evento.tipoAcceso = event.calEvent.tipoAcceso;
    evento.estadoEvento = event.calEvent.estadoEvento;
    evento.tipoCalendario = event.calEvent.tipoCalendario;
    evento.tipoEvento = event.calEvent.tipoEvento;
    evento.fechaInicioString = event.calEvent.fechaInicioString;
    evento.idEventoOriginal = event.calEvent.idEventoOriginal;
    evento.idRepeticionEvento = event.calEvent.idRepeticionEvento;

    if (event.calEvent.realEnd) {
      evento.end = event.calEvent.realEnd;
    } else {
      evento.end = evento.start;
    }

    sessionStorage.setItem("modoEdicionEventoByAgenda", "true");
    sessionStorage.setItem("eventoEdit", JSON.stringify(evento));

    let pos = this.calendarios.findIndex(
      x => x.idCalendario === evento.idCalendario
    );

    sessionStorage.setItem(
      "calendarioEdit",
      JSON.stringify(this.calendarios[pos])
    );

    this.router.navigate(["/fichaEventos"]);
  }

  onDayClickEvento(event) {
    let calendar: CalendarItem = new CalendarItem();
    let encontrado: boolean = false;
    let contador: number = 0;

    while (!encontrado && contador < this.calendarios.length) {
      calendar = this.calendarios[contador];
      if (
        calendar.idTipoCalendario == '1' &&
        calendar.tipoAcceso == 3
      )
        encontrado = true;

      contador++;
    }

    if (encontrado) {
      let evento: EventoItem = new EventoItem();
      evento.start = event.date;
      evento.end = event.date;

      sessionStorage.setItem("calendarios", JSON.stringify(this.calendarios));
      sessionStorage.setItem("eventoEdit", JSON.stringify(evento));
      sessionStorage.setItem("modoEdicion", "true");
      sessionStorage.setItem("modoEdicionEventoByAgenda", "false");
      this.router.navigate(["/fichaEventos"]);
    }
  }
}
