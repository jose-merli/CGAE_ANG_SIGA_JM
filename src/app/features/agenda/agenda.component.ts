import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { CalendarItem } from "../../models/CalendarItem";
import { Checkbox } from "primeng/primeng";
import { SigaServices } from "../../_services/siga.service";
import { EventoItem } from "../../models/EventoItem";
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
  }

  onClickCheckBox(calendario) {
    calendario.checked = !calendario.checked;
    this.getEventos(calendario);
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

    if (event.calEvent.end) {
      evento.end = event.calEvent.end;
    } else {
      evento.end = evento.start;
    }

    // alert(JSON.stringify(evento));

    sessionStorage.setItem("modoEdicion", "true");
    sessionStorage.setItem("eventoEdit", JSON.stringify(evento));
    this.router.navigate(["/fichaEventos"]);
  }

  onDayClickEvento(event) {
    let evento: EventoItem = new EventoItem();
    evento.start = event.date;

    sessionStorage.setItem("modoEdicion", "true");
    this.router.navigate(["/fichaEventos"]);
    sessionStorage.setItem("eventoEdit", JSON.stringify(evento));
  }
}
