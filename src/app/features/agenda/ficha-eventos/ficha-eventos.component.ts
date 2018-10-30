import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  Renderer2,
  ElementRef,
  Output,
  EventEmitter
} from "@angular/core";
import { CalendarItem } from "../../../models/CalendarItem";
import { PermisosCalendarioItem } from "../../../models/PermisosCalendarioItem";
import {
  DataTable,
  AutoComplete
} from "../../../../../node_modules/primeng/primeng";
import { Router } from "../../../../../node_modules/@angular/router";
import { SigaServices } from "../../../_services/siga.service";
import { NotificacionEventoObject } from "../../../models/NotificacionEventoObject";
import { NotificacionEventoItem } from "../../../models/NotificacionEventoItem";
import { ViewEncapsulation } from "@angular/core";

@Component({
  selector: "app-ficha-eventos",
  templateUrl: "./ficha-eventos.component.html",
  styleUrls: ["./ficha-eventos.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class FichaEventosComponent implements OnInit {
  comboEstados: any[];
  saveCalendarFlag: boolean = false;
  calendar: CalendarItem = new CalendarItem();

  comboCalendarType;
  // map con los permisos {data, ObjectoPermisosBack}
  permisosChange: PermisosCalendarioItem[] = [];

  @ViewChild("table")
  table: DataTable;

  @ViewChild("autocomplete")
  autoComplete: AutoComplete;

  selectedDatos;
  selectMultiple: boolean = false;
  rowsPerPage: any = [];
  cols: any = [];
  datos: any[];
  selectedItem: number = 10;
  sortO: number = 1;
  numSelected: number = 0;

  historico: boolean = false;
  openFicha: boolean = false;
  progressSpinner: boolean = false;
  closeFicha: boolean = true;
  selectAllNotifications: any;

  datosFormadores: any[] = [];
  formadoresSuggest: any[] = [];
  formadores: any[] = [];
  results: any[] = [];
  backgroundColor: string;

  colsAsistencia;
  fichasPosibles;
  datosAsistencia = [];
  selectedDatosAsistencia;
  selectAllAsistencias: any;

  marginPx = "4px";
  bw = "white";

  idCurso = "1";

  constructor(
    private sigaServices: SigaServices,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.getComboEstado();
    this.getColsResults();
    this.getEventNotifications();
    this.getFichasPosibles();
    this.getColsResultsAsistencia();
    this.getResultsFormadores();
    this.formadores = [
      {
        id: "1",
        nombre: "JOSE FRANCISCO LOPEZ GARCIA",
        color: ""
      },
      {
        id: "2",
        nombre: "CARLOS PEREZ LOPEZ",
        color: ""
      },
      {
        id: "3",
        nombre: "MARTA GARCIA FORTE",
        color: ""
      }
    ];

    this.formadoresSuggest = this.formadores;
  }

  //FUNCIONES FICHA DATOS GENERALES

  getComboEstado() {
    this.comboEstados = [
      { label: "Planificado", value: "1" },
      { label: "Cumplido", value: "2" },
      { label: "Cancelado", value: "3" }
    ];
  }

  //FUNCIONES FICHA NOTIFICACIONES

  getColsResults() {
    this.cols = [
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
    this.getEventNotifications();
  }

  getEventNotifications() {
    this.progressSpinner = true;
    this.historico = false;
    let idCalendario = sessionStorage.getItem("idCalendario");
    this.sigaServices
      .getParam(
        "fichaCalendario_getEventNotifications",
        "?idCalendario=" + idCalendario
      )
      .subscribe(
        n => {
          this.datos = n.eventNotificationItems;
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
    if (id.length >= 1 && this.selectMultiple == false) {
      sessionStorage.setItem("modoEdicionNotify", "true");
      sessionStorage.removeItem("notifySelected");
      sessionStorage.setItem("notifySelected", JSON.stringify(id));
      this.router.navigate(["/editarNotificacion"]);
      sessionStorage.setItem("fichaAbierta", "true");
    }
  }

  actualizaSeleccionados(selectedDatos) {
    this.numSelected = selectedDatos.length;
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  newNotification() {
    sessionStorage.setItem("modoEdicionNotify", "false");
    sessionStorage.setItem("fichaAbierta", "true");
    this.router.navigate(["/editarNotificacion"]);
  }

  onChangeSelectAllNotifications() {
    if (this.selectAllNotifications === true) {
      this.selectMultiple = false;
      this.selectedDatos = this.datos;
      this.numSelected = this.datos.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  isSelectMultiple() {
    this.selectMultiple = !this.selectMultiple;
    if (!this.selectMultiple) {
      this.selectedDatos = [];
      this.numSelected = 0;
    } else {
      this.selectAllNotifications = false;
      this.selectedDatos = [];
      this.numSelected = 0;
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
          this.selectMultiple = false;
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
    let idCalendario = sessionStorage.getItem("idCalendario");
    this.sigaServices
      .getParam(
        "fichaCalendario_getHistoricEventNotifications",
        "?idCalendario=" + idCalendario
      )
      .subscribe(
        n => {
          this.datos = n.eventNotificationItems;
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

  getResultsFormadores() {
    this.datosFormadores = [
      {
        idFormador: "1",
        nombre: "JOSE RAMIREZ PEREZ",
        rol: "S",
        tipoCoste: "?",
        tarifa: "10€"
      },
      {
        idFormador: "2",
        nombre: "JOSE RAMIREZ PEREZ",
        rol: "S",
        tipoCoste: "?",
        tarifa: "10€"
      },
      {
        idFormador: "3",
        nombre: "JOSE RAMIREZ PEREZ",
        rol: "S",
        tipoCoste: "?",
        tarifa: "10€"
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
          let findFormador = this.results.find(x => x.id === element.id);
          if (findFormador == undefined) {
            this.formadoresSuggest.push(element);
          }
        });
      } else {
        this.formadoresSuggest = this.formadores;
      }

      this.autoComplete.focusInput();
    } else {
      this.autoComplete.panelVisible = true;
      this.formadoresSuggest = [];
      this.formadoresSuggest.push({
        id: "0",
        nombre: "No hay más formadores"
      });
      this.autoComplete.focusInput();
    }
  }

  resetSuggestTrainers() {
    this.autoComplete.panelVisible = false;
    this.formadores.forEach(element => {
      let findFormador = this.results.find(x => x.id === element.id);
      console.log(findFormador);
      if (findFormador == undefined) {
        this.formadoresSuggest.push(element);
      }
    });
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

  restTrainers() {}

  //FUNCIONES FICHA ASISTENCIA

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
}
