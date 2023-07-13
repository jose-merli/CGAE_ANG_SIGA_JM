import {
    ChangeDetectorRef,
    Component,
    HostListener,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from "@angular/core";

import { Router } from "@angular/router";
import { ConfirmationService } from "primeng/api";
import { Message } from "primeng/components/common/api";
import { TranslateService } from "../../../../commons/translate/translation.service";
import { ParametroDeleteDto } from "../../../../models/ParametroDeleteDto";
import { ParametroDto } from "../../../../models/ParametroDto";
import { ParametroRequestDto } from "../../../../models/ParametroRequestDto";
import { ParametroUpdateDto } from "../../../../models/ParametroUpdateDto";
import { USER_VALIDATIONS } from "../../../../properties/val-properties";
import { SigaWrapper } from "../../../../wrapper/wrapper.class";
import { ControlAccesoDto } from "./../../../../../app/models/ControlAccesoDto";
import { SigaServices } from "./../../../../_services/siga.service";
export enum KEY_CODE {
  ENTER = 13
}

@Component({
  selector: "app-parametros-generales",
  templateUrl: "./parametros-generales.component.html",
  styleUrls: ["./parametros-generales.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class ParametrosGenerales extends SigaWrapper implements OnInit {
  showDatosGenerales: boolean = true;
  modulos: any[];
  selectedModulo: String;
  body: ParametroRequestDto = new ParametroRequestDto();
  bodySave: ParametroRequestDto = new ParametroRequestDto();
  bodyHistorico: ParametroRequestDto = new ParametroRequestDto();
  searchParametros: ParametroDto = new ParametroDto();
  historicoParametros: ParametroDto = new ParametroDto();
  datosBuscar: any[];
  datosHistorico: any[];
  filaSelecionadaTabla: any;
  buscar: boolean = false;
  botonBuscar: boolean = true;
  selectedItem: number = 10;
  columnasTabla: any = [];
  rowsPerPage: any = [];
  eliminar: boolean = true;
  modificandoValorFila: any;
  valorActualFila: any;
  bodyDelete: ParametroDeleteDto = new ParametroDeleteDto();
  bodyUpdate: ParametroUpdateDto = new ParametroUpdateDto();
  mapUpdate: Map<String, ParametroUpdateDto> = new Map<
    String,
    ParametroUpdateDto
    >();
  historico: boolean = false;
  msgs: Message[] = [];
  progressSpinner: boolean = false;
  isHabilitadoSave: boolean = false;
  valorParametroVacio: boolean = false;
  parametroVacio: String;

  controlAcceso: ControlAccesoDto = new ControlAccesoDto();
  permisos: any;
  permisosArray: any[];
  derechoAcceso: any;
  activacionEditar: boolean;

  constructor(
    private sigaServices: SigaServices,
    private changeDetectorRef: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService,
    private router: Router
  ) {
    super(USER_VALIDATIONS);
  }
  @ViewChild("table")
  table;
  ngOnInit() {
    this.checkAcceso();
    this.sigaServices.get("parametros_modulo").subscribe(
      n => {
        this.modulos = n.combooItems;
      },
      err => {
        //console.log(err);
      }
    );

    this.columnasTabla = [
      {
        field: "parametro",
        header: "administracion.parametrosGenerales.literal.parametro"
      },
      {
        field: "valor",
        header: "administracion.parametrosGenerales.literal.valor"
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

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  onChangeForm(event) {
    this.selectedModulo = event;
    this.isBuscar(this.selectedModulo);
  }

  confirmarBuscar() {
    if (this.selectedModulo != "") {
      this.isBuscar(this.selectedModulo);
    }
  }

  checkAcceso() {
    this.controlAcceso = new ControlAccesoDto();
    this.controlAcceso.idProceso = "111";
    this.sigaServices.post("acces_control", this.controlAcceso).subscribe(
      data => {
        this.permisos = JSON.parse(data.body);
        this.permisosArray = this.permisos.permisoItems;
        this.derechoAcceso = this.permisosArray[0].derechoacceso;
      },
      err => {
        //console.log(err);
      },
      () => {
        if (this.derechoAcceso == 3) {
          this.activacionEditar = true;
        } else if (this.derechoAcceso == 2) {
          this.activacionEditar = false;
        } else {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
          this.router.navigate(["/errorAcceso"]);
        }
      }
    );
  }

  isBuscar(selectedModulo) {
    if (selectedModulo != undefined) {
      this.body.modulo = selectedModulo;
    }
    this.progressSpinner = true;
    this.body.parametrosGenerales = "S";

    this.bodySave = this.body;
    this.sigaServices
      .postPaginado("parametros_search", "?numPagina=1", this.body)
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.searchParametros = JSON.parse(data["body"]);
          this.datosBuscar = this.searchParametros.parametrosItems;
        },
        err => {
          this.progressSpinner = false;
          //console.log(err);
        },
        () => {
          this.buscar = true;
          this.eliminar = true;
          this.historico = false;
        }
      );
  }

  isEliminar() {
    this.bodyDelete.modulo = this.filaSelecionadaTabla.modulo;
    this.bodyDelete.parametro = this.filaSelecionadaTabla.parametro;
    this.bodyDelete.valor = this.filaSelecionadaTabla.valor;
    this.bodyDelete.idInstitucion = this.filaSelecionadaTabla.idInstitucion;

    this.sigaServices.post("parametros_delete", this.bodyDelete).subscribe(
      data => {
        this.showSuccessDelete();
      },
      err => {
        //console.log(err);
        this.showFail();
      },
      () => {
        this.mapUpdate.clear();
        this.isBuscar(this.selectedModulo);
        this.table.reset();
        this.eliminar = true;
      }
    );
  }

  activarPaginacionBuscar() {
    if (this.datosBuscar == undefined) return false;
    else {
      if (this.datosBuscar.length == 0) return false;
      else return true;
    }
  }

  activarPaginacionHistorico() {
    if (this.datosHistorico == undefined) return false;
    else {
      if (this.datosHistorico.length == 0) return false;
      else return true;
    }
  }

  isGuardar() {
    let parametroVacio;
    let cerrojo = false;

    this.mapUpdate.forEach((value: ParametroUpdateDto, key: String) => {
      if ((value.valor == "" || value.valor == undefined) && !cerrojo) {
        parametroVacio = value.parametro;
        cerrojo = true;
      }
    });

    // si el cerrojo esta habilitado, quiere decir que hay valores vacios
    if (cerrojo) {
      this.showWarning(parametroVacio);
    }
    // si ningun valor es vacio, se actualizan
    else {
      this.mapUpdate.forEach((value: ParametroUpdateDto, key: String) => {
        this.sigaServices.post("parametros_update", value).subscribe(
          data => {
          },
          err => {
            //console.log(err);
            this.showFail();
          },
          () => {
            this.mapUpdate.clear();
            this.isBuscar(this.selectedModulo);
            this.table.reset();
            this.eliminar = true;
            this.isHabilitadoSave = false;
          }
        );
      });

      this.showSuccessEdit();
    }
  }

  guardar(event, dato) {
    this.bodyUpdate = new ParametroUpdateDto();
    this.bodyUpdate.idInstitucion = dato.idInstitucion;
    this.bodyUpdate.modulo = dato.modulo;
    this.bodyUpdate.parametro = dato.parametro;
    this.bodyUpdate.valor = event.target.value.trim();
    this.bodyUpdate.idRecurso = dato.idRecurso;
    this.mapUpdate.set(dato.parametro, this.bodyUpdate);

    if (this.mapUpdate.size > 0) this.isHabilitadoSave = true;
    else this.isHabilitadoSave = false;
  }

  isHistorico() {
    if (this.selectedModulo != undefined) {
      this.bodyHistorico.modulo = this.selectedModulo;
    } else this.bodyHistorico.modulo = "";

    this.bodyHistorico.parametrosGenerales = "S";

    this.sigaServices
      .postPaginado("parametros_historico", "?numPagina=1", this.bodyHistorico)
      .subscribe(
        data => {

          this.historicoParametros = JSON.parse(data["body"]);
          this.datosHistorico = this.historicoParametros.parametrosItems;
        },
        err => {
          //console.log(err);
        },
        () => {
          this.buscar = false;
          this.historico = true;
          this.eliminar = true;
          this.filaSelecionadaTabla = null;
          // se borra el contenedor de objetos a actualizar
          this.mapUpdate.clear();
          this.isHabilitadoSave = false;
        }
      );
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  onRowSelect(event) {
    if (
      event.idInstitucion == event.idinstitucionActual &&
      event.posibleEliminar == "S"
    ) {
      this.eliminar = false;
    } else this.eliminar = true;
  }

  isHabilitadoEliminar() {
    if (this.activacionEditar == true) {
      return this.eliminar;
    } else {
      return true;
    }
  }

  almacenaValorEditandose(event) {
    this.modificandoValorFila = event.target.value;
  }

  almacenaValorActual(valorActual) {
    this.almacenaValorActual = valorActual;
  }

  setItalic(datoH) {
    if (datoH.fechaBaja == null) return false;
    else return true;
  }

  isHabilitadoBuscar() {
    if (this.selectedModulo == "" || this.selectedModulo == null) {
      this.botonBuscar = true;
      return this.botonBuscar;
    } else {
      this.botonBuscar = false;
      return this.botonBuscar;
    }
  }

  confirmarEliminar(selectedDatos) {
    let mess = this.translateService.instant("messages.deleteConfirmation");
    let icon = "fa fa-trash-alt";

    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        this.isEliminar();
      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            summary: "info",
            detail: this.translateService.instant(
              "general.message.accion.cancelada"
            )
          }
        ];
      }
    });
  }

  showSuccessDelete() {
    this.msgs = [];
    this.msgs.push({
      severity: "success",
      summary: this.translateService.instant("general.message.correct"),
      detail: this.translateService.instant("messages.deleted.success")
    });
  }

  showSuccessEdit() {
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
      summary: "Error",
      detail: this.translateService.instant("general.message.accion.cancelada")
    });
  }

  showWarning(parametro) {
    let mensajeCompleto =
      this.translateService.instant(
        "administracion.parametrosGenerales.literal.faltaValor"
      ) +
      " " +
      parametro;
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Error",
      detail: mensajeCompleto
    });
  }

  isRestablecer() {
    this.mapUpdate.clear();
    this.body = this.bodySave;
    this.isBuscar(this.selectedModulo);
    this.isHabilitadoSave = false;
  }

  mostrarDatosTooltip(dato) {
    return dato.replace(/\\\\n/g, "").replace(/\./g, "\n");
  }
  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER && !this.botonBuscar) {
      this.isBuscar(this.selectedModulo);
    }
  }

  clear() {
    this.msgs = [];
  }
}

export class ComboItem {
  label: String;
  value: String;
  constructor() { }
}
