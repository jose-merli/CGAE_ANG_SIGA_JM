import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from "@angular/core";
import { CommonsService } from "../../../_services/commons.service";
import { SigaServices } from "../../../_services/siga.service";
import { ColegiadosSJCSItem } from "../../../models/ColegiadosSJCSItem";
import { TranslateService } from "../../translate";

export enum KEY_CODE {
  ENTER = 13,
}

@Component({
  selector: "app-filtro-buscador-colegiados",
  templateUrl: "./filtro-buscador-colegiados.component.html",
  styleUrls: ["./filtro-buscador-colegiados.component.scss"],
})
export class FiltroBuscadorColegiadosComponent implements OnInit {
  institucionActual;
  msgs;
  @Input() filtroRecibido;
  filtro: ColegiadosSJCSItem = new ColegiadosSJCSItem();
  datosDesgina: any;
  expanded: boolean = true;
  progressSpinner: boolean = false;
  institucionGeneral: boolean = false;
  disabledEstado: boolean = false;
  fixedTurn: boolean = false;
  fixedGuard: boolean = false;
  nuevo: boolean = true;

  comboColegios: any;
  comboTurno: any;
  comboguardiaPorTurno: any;
  comboEstadoColegial: any;
  @ViewChild("estado") dropEstado;

  @Input("nuevaInscripcion") nuevaInscripcion;
  @Input("nuevaInscripcionGuardia") nuevaInscripcionGuardia;
  @Output() buscar = new EventEmitter<boolean>();

  constructor(private translateService: TranslateService, private sigaServices: SigaServices, private commonsService: CommonsService) {}

  ngOnInit() {
    //('this.filtroRecibido: ', this.filtroRecibido)
    if (this.filtroRecibido) {
      this.filtro.idGuardia = this.filtroRecibido.idGuardia;
      this.filtro.idTurno = this.filtroRecibido.idTurno;
    }
    this.progressSpinner = true;
    this.institucionGeneral = false;

    this.filtro = new ColegiadosSJCSItem();

    if (sessionStorage.getItem("usuarioBusquedaExpress")) {
      sessionStorage.removeItem("usuarioBusquedaExpress");
    }

    //Bloquear el desplegable del estado de colegiado y lo colocamos en ejerciente por defecto
    if (sessionStorage.getItem("pantalla") == "gestionEjg" && sessionStorage.getItem("tarjeta") == "ServiciosTramit") {
      this.disabledEstado = true;
    }
    this.filtro.idEstado = "20";

    this.sigaServices.get("institucionActual").subscribe((n) => {
      this.institucionActual = n.value;
      this.filtro.idInstitucion = n.value;
      this.getComboColegios();
      this.getComboTurno();
      this.getComboEstadoColegial();
    });

    //Comprobar si proviene de la tarjeta servicio de tramitacion de la ficha EJG.
    if (sessionStorage.getItem("pantalla") == "gestionEjg" && sessionStorage.getItem("tarjeta") == "ServiciosTramit") {
      if (sessionStorage.getItem("idTurno")) {
        this.filtro.idTurno = [];
        this.filtro.idTurno.push(sessionStorage.getItem("idTurno"));
        this.getComboguardiaPorTurno({ value: this.filtro.idTurno[0] });
      }
    }

    if (sessionStorage.getItem("idTurnoAsistencia")) {
      this.filtro.idTurno = [];
      this.filtro.idTurno.push(sessionStorage.getItem("idTurnoAsistencia"));
      this.getComboguardiaPorTurno({ value: this.filtro.idTurno[0] });

      if (sessionStorage.getItem("idGuardiaAsistencia")) {
        this.filtro.idGuardia = [];
        this.filtro.idGuardia.push(sessionStorage.getItem("idGuardiaAsistencia"));
        sessionStorage.removeItem("idGuardiaAsistencia");
      }
      sessionStorage.removeItem("idTurnoAsistencia");
    }

    let sizeOfDataColegiado = sessionStorage.getItem("sizedatacolegiado");
    sessionStorage.removeItem("sizedatacolegiado");
    let ncol = sessionStorage.getItem("numColegiado");
    sessionStorage.removeItem("numColegiado");
    if (sizeOfDataColegiado != undefined && sizeOfDataColegiado != null && +sizeOfDataColegiado > 1) {
      this.filtro.nColegiado = ncol;
      this.busquedaColegiado();
    }
    this.progressSpinner = false;
  }

  getComboColegios() {
    this.progressSpinner = true;

    this.sigaServices.getParam("busquedaCol_colegio", "?idInstitucion=" + this.institucionActual).subscribe(
      (n) => {
        this.comboColegios = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboColegios);

        if (this.institucionActual == "2000") {
          this.institucionGeneral = true;
        }

        this.progressSpinner = false;
      },
      (err) => {
        //console.log(err);
        this.progressSpinner = false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      },
    );
  }

  getComboTurno() {
    this.progressSpinner = true;
    //si la pantalla viene de ejg, se cargan unos turnos
    this.sigaServices.getParam("componenteGeneralJG_comboTurnos", "?pantalla=" + sessionStorage.getItem("pantalla")).subscribe(
      (n) => {
        this.comboTurno = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboTurno);
        this.progressSpinner = false;
      },
      (err) => {
        this.progressSpinner = false;
      },
    );
    this.progressSpinner = true;
    if (sessionStorage.getItem("turnoDesigna")) {
      this.datosDesgina = JSON.parse(sessionStorage.getItem("turnoDesigna"));
      if (this.datosDesgina != null && this.datosDesgina != undefined) {
        this.filtro.idTurno = [this.datosDesgina];
      }
      sessionStorage.removeItem("turnoDesigna");
    }
    if (sessionStorage.getItem("turnoEJG")) {
      this.datosDesgina = JSON.parse(sessionStorage.getItem("turnoEJG"));
      if (this.datosDesgina != null && this.datosDesgina != undefined) {
        this.filtro.idTurno = [this.datosDesgina];
      }
      sessionStorage.removeItem("turnoEJG");
    }
  }

  getComboguardiaPorTurno(evento) {
    this.progressSpinner = true;

    if (evento.value != undefined && evento.value.length != 0) {
      this.sigaServices.getParam("combo_guardiaPorTurno", "?idTurno=" + evento.value).subscribe(
        (n) => {
          this.comboguardiaPorTurno = n.combooItems;
          this.progressSpinner = false;
          if (this.comboguardiaPorTurno.length == 0) this.filtro.idGuardia = [];
          else if (sessionStorage.getItem("pantalla") == "gestionEjg" && sessionStorage.getItem("tarjeta") == "ServiciosTramit" && this.nuevo) {
            if (sessionStorage.getItem("idGuardia")) {
              this.filtro.idGuardia = [];
              this.filtro.idGuardia.push(sessionStorage.getItem("idGuardia"));
              this.nuevo = false;
            }
          }
        },
        (err) => {
          this.progressSpinner = false;
        },
      );
    } else {
      this.filtro.idGuardia = [];
      this.progressSpinner = false;
    }
  }

  getComboEstadoColegial() {
    this.progressSpinner = true;

    this.sigaServices.get("busquedaColegiados_situacion").subscribe(
      (n) => {
        this.comboEstadoColegial = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboEstadoColegial);
        this.progressSpinner = false;
      },
      (err) => {
        //console.log(err);
        this.progressSpinner = false;
      },
    );
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg,
    });
  }

  fillFechaEstado(event) {
    this.filtro.fechaestado = this.transformaFecha(event);
  }

  transformaFecha(fecha) {
    if (fecha != null) {
      let jsonDate = JSON.stringify(fecha);
      let rawDate = jsonDate.slice(1, -1);
      if (rawDate.length < 14) {
        let splitDate = rawDate.split("/");
        let arrayDate = splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0];
        fecha = new Date((arrayDate += "T00:00:00.001Z"));
      } else {
        fecha = new Date(fecha);
      }
    } else {
      fecha = undefined;
    }

    return fecha;
  }

  clearFilters() {
    let colegio = this.filtro.idInstitucion;
    let estado = this.filtro.idEstado;
    this.filtro = new ColegiadosSJCSItem();
    this.filtro.idInstitucion = colegio;
    //En el caso que se este buscando un colegiado para una nueva inscripcion
    this.filtro.idEstado = "20";
    if (this.dropEstado.disabled) this.filtro.idEstado = estado;
  }

  busquedaColegiado() {
    this.buscar.emit(false);
  }

  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      this.busquedaColegiado();
    }
  }
}
