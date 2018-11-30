import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { CalendarItem } from "../../models/CalendarItem";
import { Checkbox } from "primeng/primeng";
import { SigaServices } from "../../_services/siga.service";
import { EventoItem } from "../../models/EventoItem";
import { findIndex } from "../../../../node_modules/rxjs/operators";
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

  checked: boolean = true;

  fechaActual: Date = new Date();
  constructor(private router: Router, private sigaServices: SigaServices) {}

  ngOnInit() {
    this.listLecturaSelect = [];
    this.listAccesoSelect = [];
    sessionStorage.setItem("isFormacionCalendar", "false");

    this.options = {
      header: {
        left: "prev,next",
        center: "title",
        right: "month,agendaWeek,agendaDay",
        locale: "es"
      }
    };

    this.getCalendarios();

    this.events = [];
    sessionStorage.removeItem("eventoEdit");
    sessionStorage.removeItem("modoEdicionEventoByAgenda");
  }

  onClickCheckBox(calendario) {
    calendario.checked = !calendario.checked;
    this.getEventos(calendario);
    sessionStorage.setItem("calendarios", JSON.stringify(this.calendarios));
  }

  onClickLabelCheckbox(calendario: CalendarItem) {
    sessionStorage.setItem("modoEdicion", "true");
    sessionStorage.setItem("idCalendario", calendario.idCalendario);
    sessionStorage.setItem("calendarEdit", JSON.stringify(calendario));
    this.router.navigate(["/editarCalendario"]);
  }

  getCalendarios() {
    this.progressSpinner = true;

    this.sigaServices.get("agendaCalendario_getCalendarios").subscribe(
      res => {
        if (res.calendarItems) {
          this.calendarios = res.calendarItems;
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
    evento.fechaInicioRepeticion = event.calEvent.fechaInicioRepeticion;
    evento.fechaFinRepeticion = event.calEvent.fechaFinRepeticion;
    evento.tipoDiasRepeticion = event.calEvent.tipoDiasRepeticion;
    evento.tipoRepeticion = event.calEvent.tipoRepeticion;
    evento.valoresRepeticion = JSON.parse(
      event.calEvent.valoresRepeticionString
    );
    evento.tipoAcceso = event.calEvent.tipoAcceso;

    if (event.calEvent.end) {
      evento.end = event.calEvent.end;
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
    let evento: EventoItem = new EventoItem();
    evento.start = event.date;
    evento.end = event.date;

    sessionStorage.setItem("modoEdicionEventoByAgenda", "false");
    this.router.navigate(["/fichaEventos"]);
    sessionStorage.setItem("eventoEdit", JSON.stringify(evento));
  }
}
