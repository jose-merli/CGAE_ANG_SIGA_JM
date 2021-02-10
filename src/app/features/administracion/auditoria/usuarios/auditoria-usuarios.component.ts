import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ChangeDetectorRef,
  HostListener
} from "@angular/core";

import { SigaServices } from "./../../../../_services/siga.service";
import { Router } from "@angular/router";
import { ConfirmationService } from "primeng/api";
import { TranslateService } from "../../../../commons/translate/translation.service";
import { USER_VALIDATIONS } from "../../../../properties/val-properties";
import { SigaWrapper } from "../../../../wrapper/wrapper.class";

import { Message } from "primeng/components/common/api";
import { esCalendar } from "./../../../../utils/calendar";

import { HistoricoUsuarioDto } from "../../../../models/HistoricoUsuarioDto";
import { HistoricoUsuarioRequestDto } from "../../../../models/HistoricoUsuarioRequestDto";
import { DataTable } from "primeng/datatable";
import { CommonsService } from '../../../../_services/commons.service';


export enum KEY_CODE {
  ENTER = 13
}

@Component({
  selector: "app-auditoria-usuarios",
  templateUrl: "./auditoria-usuarios.component.html",
  styleUrls: ["./auditoria-usuarios.component.scss"],
  host: {
    "(document:keypress)": "onKeyPress($event)"
  },
  encapsulation: ViewEncapsulation.None
})
export class AuditoriaUsuarios extends SigaWrapper implements OnInit {
  usuario: any;
  persona: any;
  showDatosGenerales: boolean = true;
  buscar: boolean = false;
  valorCheckUsuarioAutomatico: boolean = false;
  selectedTipoAccion: any;
  tipoAcciones: any[];
  fechaDesdeCalendar: Date;
  fechaHastaCalendar: Date;
  es: any = esCalendar;
  selectedItem: number = 10;
  columnasTabla: any = [];
  rowsPerPage: any = [];
  datosUsuarios: any[];
  bodySearch: HistoricoUsuarioRequestDto = new HistoricoUsuarioRequestDto();
  searchParametros: HistoricoUsuarioDto = new HistoricoUsuarioDto();
  msgs: Message[] = [];
  habilitarInputUsuario: boolean = false;
  returnDesde: string;
  returnHasta: string;
  arrayDesde: any[];
  arrayHasta: any[];
  progressSpinner: boolean = false;
  volver: boolean = false;
  pButton;
  first: number = 0;
  idPerReal: any;

  constructor(
    private sigaServices: SigaServices,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private commonsService: CommonsService,
    private translateService: TranslateService
  ) {
    super(USER_VALIDATIONS);
  }

  @ViewChild("table") table: DataTable;
  selectedDatos;

  @ViewChild("tableModelos") tableModelos: DataTable;
  selectedModelos;


  ngOnInit() {

    if (sessionStorage.getItem("tarjeta") != null) {
      this.volver = true;
    }
    if (sessionStorage.getItem("idPersonaReal") != null) {
      this.idPerReal = JSON.parse(sessionStorage.getItem("idPersonaReal"));
      this.isBuscar();
    }

    this.sigaServices.get("auditoriaUsuarios_tipoAccion").subscribe(
      n => {
        this.tipoAcciones = n.combooItems;

        /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
      para poder filtrar el dato con o sin estos caracteres*/
        this.tipoAcciones.map(e => {
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
      },
      err => {
        console.log(err);
      }
    );
    this.columnasTabla = [
      {
        field: "persona",
        header: "administracion.auditoriaUsuarios.persona",
        width: "13%"
      },
      {
        field: "descripcionUsuario",
        header: "general.boton.usuario"
      },
      {
        field: "descTipoCambio",
        header: "administracion.auditoriaUsuarios.literal.tipoAccion"
      },
      {
        field: "fechaEfectiva",
        header: "administracion.auditoriaUsuarios.literal.fechaEfectiva",
        width: "13%"
      },
      {
        field: "motivo",
        header: "administracion.auditoriaUsuarios.literal.motivo"
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
    if (sessionStorage.getItem("AuditoriaSearch") != null) {
      this.bodySearch = new HistoricoUsuarioRequestDto();
      this.bodySearch = JSON.parse(sessionStorage.getItem("AuditoriaSearch"));
      this.usuario = this.bodySearch.usuario;
      this.persona = this.bodySearch.idPersona;
      if ((this.bodySearch.usuarioAutomatico = "N"))
        this.valorCheckUsuarioAutomatico = false;
      else this.valorCheckUsuarioAutomatico = true;
      this.selectedTipoAccion = this.bodySearch.idTipoAccion;
      sessionStorage.removeItem("AuditoriaSearch");
    }

    var registroActualizado = JSON.parse(
      sessionStorage.getItem("registroAuditoriaUsuariosActualizado")
    );
    if (registroActualizado) {
      this.showSuccess();
      sessionStorage.setItem(
        "registroAuditoriaUsuariosActualizado",
        JSON.stringify(false)
      );
    }

    sessionStorage.removeItem("urlAuditoriaUsuarios");

    if (sessionStorage.getItem("searchBodyAuditoriaUsuarios") != null) {
      this.bodySearch = JSON.parse(
        sessionStorage.getItem("searchBodyAuditoriaUsuarios")
      );

      this.isBuscar();
    }

    if (sessionStorage.getItem("editedUser") != null) {
      this.selectedDatos = JSON.parse(sessionStorage.getItem("editedUser"));
    }
    sessionStorage.removeItem("editedUser");
    sessionStorage.removeItem("auditoriaUsuarioBody");

  }

  volverAFicha() {
    this.router.navigate([sessionStorage.getItem("tarjeta")]);
    sessionStorage.removeItem("tarjeta");
  }

  isBuscar() {
    this.progressSpinner = true;
    // si no viene de la pantalla de editarAuditoriaUsuario contruye el objecto para el body de la consulta /search
    if (sessionStorage.getItem("searchBodyAuditoriaUsuarios") == null) {
      this.construirObjetoBodySearch();
    } else {
      // si viene de la pantalla de edicion, borra la variable session
      this.bodySearch = JSON.parse(
        sessionStorage.getItem("searchBodyAuditoriaUsuarios")
      );
      this.arreglarFechas();

      sessionStorage.removeItem("searchBodyAuditoriaUsuarios");
    }
    this.buscar = true;
    this.sigaServices
      .postPaginado("auditoriaUsuarios_search", "?numPagina=1", this.bodySearch)
      .subscribe(
        data => {
          this.searchParametros = JSON.parse(data["body"]);
          this.datosUsuarios = this.searchParametros.historicoUsuarioItem;
          this.buscar = true;
          this.progressSpinner = false;
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        },
        () => {
          if (sessionStorage.getItem("first") != null) {
            let first = JSON.parse(sessionStorage.getItem("first")) as number;
            this.table.first = first;
            sessionStorage.removeItem("first");
          }
          setTimeout(()=>{
            this.commonsService.scrollTablaFoco('tablaFoco');
          }, 5);
        }
      );
  }

  arreglarFechas() {
    this.returnDesde = JSON.stringify(this.bodySearch.fechaDesde);
    this.returnHasta = JSON.stringify(this.bodySearch.fechaHasta);
    
    this.fechaDesdeCalendar = this.transformaFecha(this.bodySearch.fechaDesde);
    this.fechaHastaCalendar = this.transformaFecha(this.bodySearch.fechaHasta);

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

  construirObjetoBodySearch() {
    if (this.usuario != undefined) this.bodySearch.usuario = this.usuario;
    else this.usuario = undefined;
    if (this.idPerReal != undefined) this.bodySearch.idPersonaReal = this.idPerReal;
    if (this.persona != undefined) this.bodySearch.idPersona = this.persona;
    else this.persona = undefined;

    if (this.selectedTipoAccion != "")
      this.bodySearch.idTipoAccion = this.selectedTipoAccion;
    else this.selectedTipoAccion = undefined;

    if (this.valorCheckUsuarioAutomatico == true)
      this.bodySearch.usuarioAutomatico = "S";
    else this.bodySearch.usuarioAutomatico = "N";

    if (this.fechaDesdeCalendar != undefined) {
      this.bodySearch.fechaDesde = this.fechaDesdeCalendar;
    } else this.bodySearch.fechaDesde = undefined;
    if (this.fechaHastaCalendar != undefined) {
      this.bodySearch.fechaHasta = this.fechaHastaCalendar;
    } else this.bodySearch.fechaHasta = undefined;
    sessionStorage.setItem("AuditoriaSearch", JSON.stringify(this.bodySearch));
  }

  isHabilitadoBuscar() {
    if (
      this.fechaDesdeCalendar != undefined &&
      this.fechaHastaCalendar != undefined
    )
      return false;
    else return true;
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  activarPaginacion() {
    if (this.datosUsuarios.length == 0) return false;
    else return true;
  }

  irEditarUsuario(id) {
    sessionStorage.removeItem("first");
    var url = "/auditoriaUsuarios/";
    sessionStorage.setItem("auditoriaUsuarioBody", JSON.stringify(id));
    sessionStorage.setItem("urlAuditoriaUsuarios", JSON.stringify(url));
    sessionStorage.setItem(
      "searchBodyAuditoriaUsuarios",
      JSON.stringify(this.bodySearch)
    );
    sessionStorage.setItem("first", JSON.stringify(this.table.first));
    sessionStorage.setItem("editedUser", JSON.stringify(this.selectedDatos));
    this.router.navigate(["/gestionAuditoria"]);
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  confirmarBuscar() {
    let diferenciaFechas = this.calcularRangoFechas();
    let diferenciaFechas1 = this.calcularRangoFechas();

    // con mas de 30 dias entre las fechas introducidas y los demas filtros vacios sale el mensaje de busqueda costosa
    if (
      (this.usuario == "" || this.usuario == undefined) &&
      (this.persona == "" || this.persona == undefined) &&
      (this.selectedTipoAccion == "" || this.selectedTipoAccion == undefined) &&
      diferenciaFechas > 30
    ) {
      this.confirmationService.confirm({
        message: this.translateService.instant(
          "administracion.auditoriaUsuarios.literal.busquedaCostosa"
        ),
        icon: "fa fa-search ",
        accept: () => {
          this.isBuscar();
        },
        reject: () => {
          this.msgs = [
            {
              severity: "info",
              summary: "Info",
              detail: this.translateService.instant(
                "general.message.accion.cancelada"
              )
            }
          ];
        }
      });
    } else {
      this.isBuscar();
    }
  }

  calcularRangoFechas() {
    // obtener 1 dia en milisegundos
    let one_day = 1000 * 60 * 60 * 24;

    // convertir fechas en milisegundos
    let fechaDesde = this.fechaDesdeCalendar.getTime();
    let fechaHasta = this.fechaHastaCalendar.getTime();

    // calcular las diferencias en milisegundos
    let msRangoFechas = fechaHasta - fechaDesde;

    // transformar los milisegundos en dias
    let rangoFechas = Math.round(msRangoFechas / one_day);

    return rangoFechas;
  }

  isHabilitadoInputUsuario() {
    if (this.valorCheckUsuarioAutomatico == true) {
      this.habilitarInputUsuario = true;
      this.usuario = undefined;
      return this.habilitarInputUsuario;
    } else {
      this.habilitarInputUsuario = false;
      return this.habilitarInputUsuario;
    }
  }

  // se controla la fecha cuando se introduce sin el grafico del calendario
  getFechaHastaCalendar() {
    if (
      this.fechaDesdeCalendar != undefined &&
      this.fechaHastaCalendar != undefined
    ) {
      let one_day = 1000 * 60 * 60 * 24;

      // convertir fechas en milisegundos
      let fechaDesde = this.fechaDesdeCalendar.getTime();
      let fechaHasta = this.fechaHastaCalendar.getTime();
      let msRangoFechas = fechaHasta - fechaDesde;

      if (msRangoFechas < 0) this.fechaHastaCalendar = undefined;
    }
    return this.fechaHastaCalendar;
  }

  // se controla la fecha cuando se introduce sin el grafico del calendario
  getFechaDesdeCalendar() {
    if (
      this.fechaDesdeCalendar != undefined &&
      this.fechaHastaCalendar != undefined
    ) {
      let one_day = 1000 * 60 * 60 * 24;

      // convertir fechas en milisegundos
      let fechaDesde = this.fechaDesdeCalendar.getTime();
      let fechaHasta = this.fechaHastaCalendar.getTime();
      let msRangoFechas = fechaHasta - fechaDesde;

      if (msRangoFechas < 0) this.fechaDesdeCalendar = undefined;
    }

    return this.fechaDesdeCalendar;
  }

  showSuccess() {
    this.msgs = [];
    this.msgs.push({
      severity: "success",
      summary: this.translateService.instant("general.message.correct"),
      detail: this.translateService.instant("general.message.accion.realizada")
    });
  }

  showFail() {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: this.translateService.instant("general.message.incorrect"),
      detail: this.translateService.instant(
        "general.message.error.realiza.accion"
      )
    });
  }

  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (
      event.keyCode === KEY_CODE.ENTER &&
      this.fechaDesdeCalendar != undefined &&
      this.fechaHastaCalendar != undefined
    ) {
      this.isBuscar();
    }
  }

  clear() {
    this.msgs = [];
  }

  fillFechaDesdeCalendar(event) {
    this.fechaDesdeCalendar = event;
  }

  fillFechaHastaCalendar(event) {
    this.fechaHastaCalendar = event;
  }

  ngOnDestroy() {
    sessionStorage.removeItem("idPersonaReal");
  }
}
