import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { Router } from "../../../../node_modules/@angular/router";
import { CalendarItem } from "../../models/CalendarItem";
import { Checkbox } from "../../../../node_modules/primeng/primeng";
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

  //Para el calendario
  events: any[];
  header: any;
  calendarios: any[];
  selectedCalendario: any;
  color: any;
  selectedCalendarios: any[];

  checked: boolean = true;

  fechaActual: Date = new Date();
  constructor(private router: Router) {}

  ngOnInit() {
    this.listLecturaSelect = [];
    this.listAccesoSelect = [];
    this.header = {
      left: "prev,next",
      center: "title",
      right: "month,agendaWeek,agendaDay"
    };

    this.calendarios = [
      {
        idCalendario: "1",
        descripcion: "Calendario exámenes",
        color: "#ff9f89",
        checked: false
      },
      {
        idCalendario: "2",
        descripcion: "Calendario seminario",
        color: "#009414",
        checked: false
      },
      {
        idCalendario: "3",
        descripcion: "Calendario extraordinario",
        color: "#0de7e9",
        checked: false
      }
    ];

    this.events = [];
  }

  onClickCheckBox(calendario) {
    calendario.checked = !calendario.checked;
    this.getEventos(calendario);
  }

  onClickLabelCheckbox() {
    alert("Esta acción llevará a la ficha del calendario. Por desarrollar.");
  }

  showCalendar1() {
    return [
      {
        idCalendario: "1",
        title: "Reuniones iniciales",
        start: "2018-10-07",
        end: "2018-10-10",
        color: "#ff9f89"
      },
      {
        idCalendario: "1",
        title: "Evento repetido",
        start: "2018-10-15",
        color: "#ff9f89"
      },
      {
        idCalendario: "1",
        title: "Evento repetido",
        start: "2018-10-20",
        color: "#ff9f89"
      },
      {
        idCalendario: "1",
        title: "Conferencia",
        start: "2018-10-22",
        end: "2018-10-26",
        color: "#ff9f89"
      }
    ];
  }

  showCalendar2() {
    return [
      {
        idCalendario: "2",
        title: "Conferencia inicial",
        start: "2018-10-12",
        end: "2018-10-15",
        color: "#009414"
      },
      {
        idCalendario: "2",
        title: "Evento importante",
        start: "2018-10-16",
        color: "#009414"
      },
      {
        idCalendario: "2",
        title: "Examen",
        start: "2018-10-20",
        color: "#009414"
      },
      {
        idCalendario: "2",
        title: "Reuniones",
        start: "2018-10-25",
        end: "2018-10-26",
        color: "#009414"
      }
    ];
  }

  showCalendar3() {
    return [
      {
        idCalendario: "3",
        title: "Exámenes extrordinarios",
        start: "2018-10-02",
        end: "2018-10-03",
        color: "#0de7e9"
      },
      {
        idCalendario: "3",
        title: "Prácticas extraordinarias",
        start: "2018-10-05",
        color: "#0de7e9"
      }
    ];
  }

  getEventsByIdCalendario(id: string) {
    switch (id) {
      case "1":
        return this.showCalendar1();

      case "2":
        return this.showCalendar2();

      case "3":
        return this.showCalendar3();
    }
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

  getEventos(calendario) {
    if (calendario.checked) {
      let auxArray: any[] = this.getEventsByIdCalendario(
        calendario.idCalendario
      );
      this.events = this.events.concat(auxArray);
    } else {
      this.clearEventsByIdCalendario(calendario.idCalendario);
    }
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

  isEditar() {
    sessionStorage.setItem("modoEdicion", "true");
    sessionStorage.setItem("idCalendario", "44");
    let calendar = new CalendarItem();
    calendar.idTipoCalendario = "1";
    calendar.descripcion = "Prueba";
    calendar.color = "#43453";
    sessionStorage.setItem("calendarEdit", JSON.stringify(calendar));

    this.router.navigate(["/editarCalendario"]);
  }
}
