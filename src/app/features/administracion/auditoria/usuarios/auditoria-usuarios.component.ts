import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ChangeDetectorRef
} from "@angular/core";

import { SigaServices } from "./../../../../_services/siga.service";
import { Router } from "@angular/router";
import { MessageService } from "primeng/components/common/messageservice";
import { ConfirmationService } from "primeng/api";
import { TranslateService } from "../../../../commons/translate/translation.service";
import { USER_VALIDATIONS } from "../../../../properties/val-properties";
import { SigaWrapper } from "../../../../wrapper/wrapper.class";

import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";

import { InputTextModule } from "primeng/inputtext";
import { Message } from "primeng/components/common/api";
import { esCalendar } from "./../../../../utils/calendar";

import { HistoricoUsuarioDto } from "../../../../models/HistoricoUsuarioDto";
import { HistoricoUsuarioRequestDto } from "../../../../models/HistoricoUsuarioRequestDto";

@Component({
  selector: "app-etiquetas",
  templateUrl: "./auditoria-usuarios.component.html",
  styleUrls: ["./auditoria-usuarios.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class AuditoriaUsuarios extends SigaWrapper implements OnInit {
  usuario: any;
  persona: any;
  showDatosGenerales: boolean = true;
  buscarSeleccionado: boolean = false;
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
  jsonDate: string;
  selectedDatos: any;
  msgs: Message[] = [];
  habilitarInputUsuario: boolean = false;
  returnDesde: string;
  returnHasta: string;
  arrayDesde: any[];
  arrayHasta: any[];

  constructor(
    private sigaServices: SigaServices,
    private formBuilder: FormBuilder,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService
  ) {
    super(USER_VALIDATIONS);
  }

  @ViewChild("table") table;
  ngOnInit() {
    this.sigaServices.get("auditoriaUsuarios_tipoAccion").subscribe(
      n => {
        this.tipoAcciones = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );

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

    this.columnasTabla = [
      {
        field: "persona",
        header: "administracion.auditoriaUsuarios.persona"
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
        header: "administracion.auditoriaUsuarios.literal.fechaEfectiva"
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
  }

  isBuscar() {
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

    this.sigaServices
      .postPaginado("auditoriaUsuarios_search", "?numPagina=1", this.bodySearch)
      .subscribe(
        data => {
          console.log(data);

          this.searchParametros = JSON.parse(data["body"]);
          this.datosUsuarios = this.searchParametros.historicoUsuarioItem;
          this.buscarSeleccionado = true;
        },
        err => {
          console.log(err);
        }
      );
  }
  arreglarFechas() {
    this.returnDesde = JSON.stringify(this.bodySearch.fechaDesde);
    this.returnHasta = JSON.stringify(this.bodySearch.fechaHasta);
    this.returnDesde = this.returnDesde.substring(1, 11);
    this.returnHasta = this.returnHasta.substring(1, 11);
    this.arrayDesde = this.returnDesde.split("-");
    this.arrayHasta = this.returnHasta.split("-");
    this.arrayDesde[2] = parseInt(this.arrayDesde[2]) + 1;
    this.arrayHasta[2] = parseInt(this.arrayHasta[2]) + 1;
    this.returnDesde =
      this.arrayDesde[1] + "/" + this.arrayDesde[2] + "/" + this.arrayDesde[0];
    this.returnHasta =
      this.arrayHasta[1] + "/" + this.arrayHasta[2] + "/" + this.arrayHasta[0];
    this.fechaDesdeCalendar = new Date(this.returnDesde);
    this.fechaHastaCalendar = new Date(this.returnHasta);
  }

  construirObjetoBodySearch() {
    if (this.usuario != undefined) this.bodySearch.usuario = this.usuario;
    else this.usuario = undefined;

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
    var url = "/auditoriaUsuarios/";
    sessionStorage.setItem("auditoriaUsuarioBody", JSON.stringify(id));
    sessionStorage.setItem("urlAuditoriaUsuarios", JSON.stringify(url));
    sessionStorage.setItem(
      "searchBodyAuditoriaUsuarios",
      JSON.stringify(this.bodySearch)
    );

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
      summary: "Incorrecto",
      detail: this.translateService.instant(
        "general.message.error.realiza.accion"
      )
    });
  }
}
