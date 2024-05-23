import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { Router } from "../../../../../../../node_modules/@angular/router";
import { CommonsService } from "../../../../../_services/commons.service";
import { NotificationService } from "../../../../../_services/notification.service";
import { PersistenceService } from "../../../../../_services/persistence.service";
import { SigaServices } from "../../../../../_services/siga.service";
import { TranslateService } from "../../../../../commons/translate/translation.service";
import { JuzgadoItem } from "../../../../../models/sjcs/JuzgadoItem";
import { ModulosObject } from "../../../../../models/sjcs/ModulosObject";
import { ProcedimientoObject } from "../../../../../models/sjcs/ProcedimientoObject";

@Component({
  selector: "app-tabla-modulos",
  templateUrl: "./tabla-modulos.component.html",
  styleUrls: ["./tabla-modulos.component.scss"],
})
export class TablaModulosComponent implements OnInit {
  rowsPerPage: any = [];
  cols;
  colsPartidoJudicial;
  buscadores = [];
  juzgados: any[] = [];
  selectedItem: number = 10;
  selectAll;
  selectedDatos = [];
  numSelected = 0;

  nuevo: boolean = false;
  seleccion: boolean = false;
  historico: boolean = false;
  hayModulosUsados = false;
  selectMultiple: boolean = false;
  progressSpinner: boolean = false;
  esReactivar: boolean = false;
  showModalBajaLogicaFisica: boolean = false;
  showModalAsociarModulosAJuzgados: boolean = false;

  message;
  juzgadoProcedente;
  vieneDeJuzgados;

  textSelected: String = "{0} opciones seleccionadas";
  textFilter: string = "Seleccionar";
  filtros: JuzgadoItem = new JuzgadoItem();
  juzgadosList: any[] = [];
  bajaLogicaFisicaModuloRadioButton: String = "bajalogica";
  fechaBajaLogica: Date;
  modulosDelete = new ModulosObject();

  @Input() datos;
  @Input() permisos: boolean = false;
  @Output() searchModulos = new EventEmitter<any>();

  @ViewChild("tabla") tabla;

  constructor(private translateService: TranslateService, private changeDetectorRef: ChangeDetectorRef, private router: Router, private sigaServices: SigaServices, private persistenceService: PersistenceService, private notificationService: NotificationService, private commonsService: CommonsService, private pipe: DatePipe) {}

  ngOnInit() {
    this.getCols();
    this.juzgadoProcedente = JSON.parse(sessionStorage.getItem("datos"));
    this.vieneDeJuzgados = sessionStorage.getItem("vieneDeFichaJuzgado");
    this.permisos = this.persistenceService.getPermisos();
    this.tabla.filterConstraints["contains"] = this.customFilter.bind(this);
    this.searchJuzgados();
  }

  normalizeString(str: string): string {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  customFilter(value: string, filter: string): boolean {
    if (!filter) {
      return true;
    }
    return this.normalizeString(value).includes(this.normalizeString(filter));
  }

  seleccionaFila(evento) {
    if (this.vieneDeJuzgados) {
      this.juzgados[0] = this.juzgadoProcedente.idJuzgado;
      this.guardarDialogAsociarModulosAJuzgados();
    } else {
      if (!this.selectAll && !this.selectMultiple) {
        this.persistenceService.setDatos(this.selectedDatos[0]);
        this.router.navigate(["/gestionModulos"], { queryParams: { idProcedimiento: this.selectedDatos[0].idProcedimiento } });
      } else {
        /* if (evento.data.fechabaja == undefined && this.historico == true) {
					this.selectedDatos.pop();
				} */
      }
    }
    if (this.vieneDeJuzgados) {
      this.volverFichaJuzgado();
    }
  }

  checkPermisosDelete() {
    if (this.commonsService.checkPermisosService(this.permisos, undefined)) {
      if (!this.permisos || ((!this.selectMultiple || !this.selectAll) && this.selectedDatos.length == 0)) {
        this.commonsService.checkPermisoAccionService();
      } else {
        this.checkModuloUsado();
      }
    }
  }

  checkModuloUsado() {
    this.modulosDelete.modulosItem = this.selectedDatos;
    this.hayModulosUsados = false;
    this.sigaServices.post("modulosybasesdecompensacion_checkModulos", this.modulosDelete).subscribe(
      (data) => {
        this.showModalBajaLogicaFisica = false;
        this.progressSpinner = false;
        this.selectAll = false;
        this.selectedDatos = JSON.parse(data.body).modulosItem;
        this.selectedDatos.forEach((element) => {
          if (element.usado) {
            this.hayModulosUsados = true;
          }
        });
        if (!this.hayModulosUsados) {
          this.dialogBajaLogicaFisica();
        } else {
          this.modulosDelete.baja = "bajalogica";
          this.delete();
        }
      },
      (err) => {
        this.progressSpinner = false;
        this.selectAll = false;
        if (err != undefined && JSON.parse(err.error).error.description != "") {
          this.notificationService.showError(this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.notificationService.showError(this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
      },
    );
  }

  dialogBajaLogicaFisica() {
    this.showModalBajaLogicaFisica = true;
  }

  cancelarDialogBajaLogicaFisica() {
    this.showModalBajaLogicaFisica = false;
    this.selectedDatos = [];
  }

  fillFechaBajaLogica(event) {
    this.fechaBajaLogica = this.transformaFecha(event);
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

  checkPermisosActivate() {
    if (this.commonsService.checkPermisosService(this.permisos, undefined)) {
      if (!this.permisos || this.selectedDatos.length == 0 || this.selectedDatos == undefined) {
        this.commonsService.checkPermisoAccionService();
      } else {
        this.delete();
      }
    }
  }

  delete() {
    if (this.esReactivar) {
      this.modulosDelete.baja = "reactivar";
    } else if (this.bajaLogicaFisicaModuloRadioButton == "bajalogica") {
      this.selectedDatos.forEach((modulo) => {
        modulo.fechahastavigor = this.fechaBajaLogica;
      });
      this.modulosDelete.baja = "bajalogica";
    } else {
      this.modulosDelete.baja = "bajafisica";
    }

    this.modulosDelete.modulosItem = this.selectedDatos;

    /*
    this.modulosDelete.modulosItem.forEach((modulo) => {
      if (modulo.fechadesdevigor != null && !(typeof modulo.fechadesdevigor == "number")) {
        modulo.fechadesdevigor = this.formatDate(modulo.fechadesdevigor).getTime();
      }
      if (modulo.fechahastavigor != null && !(typeof modulo.fechahastavigor == "number")) {
        modulo.fechahastavigor = this.formatDate(modulo.fechahastavigor).getTime();
      }
    });
    */

    this.sigaServices.post("modulosybasesdecompensacion_deleteModulos", this.modulosDelete).subscribe(
      (data) => {
        this.progressSpinner = false;
        this.showModalBajaLogicaFisica = false;
        this.selectedDatos = [];
        if (this.historico) {
          this.searchModulos.emit(true);
        } else {
          this.searchModulos.emit(false);
        }
        this.notificationService.showSuccess(this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
      },
      (err) => {
        this.progressSpinner = false;
        this.showModalBajaLogicaFisica = false;
        if (err != undefined && JSON.parse(err.error).error.description != "") {
          this.notificationService.showError(this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.notificationService.showError(this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
      },
      () => {
        this.showModalBajaLogicaFisica = false;
        this.progressSpinner = false;
        this.historico = false;
        this.selectAll = false;
      },
    );

    this.selectedDatos.forEach((modulo) => {
      const pattern = "dd/MM/yyyy";
      if (modulo.fechadesdevigor != null && typeof modulo.fechadesdevigor == "number") {
        modulo.fechadesdevigor = this.formatDate(modulo.fechadesdevigor);
        modulo.fechadesdevigor = this.pipe.transform(modulo.fechadesdevigor, pattern);
      }
      if (modulo.fechahastavigor != null && typeof modulo.fechahastavigor == "number") {
        modulo.fechahastavigor = this.formatDate(modulo.fechahastavigor);
        modulo.fechahastavigor = this.pipe.transform(modulo.fechahastavigor, pattern);
      }
    });
  }

  onChangeSelectAll() {
    if (this.permisos) {
      if (this.selectAll === true) {
        this.selectMultiple = false;
        this.selectedDatos = this.datos;
        this.numSelected = this.datos.length;
        if (this.historico) {
          this.selectedDatos = this.datos.filter((dato) => dato.fechabaja != undefined && dato.fechabaja != null);
        } else {
          this.selectedDatos = this.datos;
        }
      } else {
        this.selectedDatos = [];
        this.numSelected = 0;
      }
    }
  }

  searchModulo() {
    this.historico = !this.historico;
    this.searchModulos.emit(this.historico);
  }

  isHistorico(dato) {
    let historico = false;
    if (dato.fechabaja != null) {
      historico = true;
    }
    return historico;
  }

  formatDate(date) {
    if (date instanceof Date) {
      return date;
    } else if (typeof date == "number") {
      return new Date(date.valueOf());
    } else {
      var parts = date.split("/");
      var formattedDate = new Date(parts[1] + "/" + parts[0] + "/" + parts[2]);
      return formattedDate;
    }
  }

  getCols() {
    this.cols = [
      { field: "codigo", header: "general.boton.code", width: "12%" },
      { field: "nombre", header: "administracion.parametrosGenerales.literal.nombre", width: "42%" },
      { field: "fechadesdevigor", header: "facturacion.seriesFacturacion.literal.fInicio", width: "11%" },
      { field: "fechahastavigor", header: "censo.consultaDatos.literal.fechaFin", width: "11%" },
      { field: "importe", header: "formacion.fichaCurso.tarjetaPrecios.importe", width: "8%" },
      { field: "jurisdiccionDes", header: "menu.justiciaGratuita.maestros.Jurisdiccion", width: "16%" },
    ];
    this.cols.forEach((it) => this.buscadores.push(""));

    this.rowsPerPage = [
      { label: 10, value: 10 },
      { label: 20, value: 20 },
      { label: 30, value: 30 },
      { label: 40, value: 40 },
    ];
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.tabla.reset();
  }

  isSelectMultiple() {
    if (this.permisos) {
      this.selectAll = false;
      this.selectMultiple = !this.selectMultiple;
      if (!this.selectMultiple) {
        this.selectedDatos = [];
        this.numSelected = 0;
      } else {
        // this.pressNew = false;
        this.selectAll = false;
        this.selectedDatos = [];
        this.numSelected = 0;
      }
    }
    // this.volver();
  }

  actualizaSeleccionados(selectedDatos) {
    this.numSelected = selectedDatos.length;
    this.seleccion = false;
  }

  asociarModulosAJuzgados() {
    this.showModalAsociarModulosAJuzgados = true;
  }

  cancelarDialogAsociarModulosAJuzgados() {
    this.showModalAsociarModulosAJuzgados = false;
  }

  searchJuzgados() {
    this.progressSpinner = true;
    this.sigaServices.post("busquedaJuzgados_searchCourt", this.filtros).subscribe(
      (n) => {
        this.progressSpinner = false;
        JSON.parse(n.body).juzgadoItems.forEach((juzgados) => {
          this.juzgadosList.push({ label: juzgados.nombre + " (" + juzgados.codigoExt2 + ")", value: juzgados.idJuzgado });
        });
      },
      (err) => {
        this.progressSpinner = false;
      },
    );
  }

  guardarDialogAsociarModulosAJuzgados() {
    this.progressSpinner = true;
    this.juzgados.forEach((juzgado) => {
      let procedimientoDTO = new ProcedimientoObject();

      this.selectedDatos.forEach((modulo) => {
        if (modulo.fechadesdevigor != null && !(typeof modulo.fechadesdevigor == "number")) {
          modulo.fechadesdevigor = this.formatDate(modulo.fechadesdevigor).getTime();
        }

        if (modulo.fechahastavigor != null && !(typeof modulo.fechahastavigor == "number")) {
          modulo.fechahastavigor = this.formatDate(modulo.fechahastavigor).getTime();
        }
      });

      procedimientoDTO.procedimientosItems = this.selectedDatos;
      procedimientoDTO.idJuzgado = juzgado;

      this.sigaServices.post("gestionJuzgados_asociarModulosAJuzgados", procedimientoDTO).subscribe(
        (data) => {
          this.progressSpinner = false;
          this.notificationService.showSuccess(this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.showModalAsociarModulosAJuzgados = false;
        },
        (err) => {
          this.progressSpinner = false;
          this.showModalAsociarModulosAJuzgados = false;
          if (err.error != undefined && JSON.parse(err.error).error.description != "") {
            this.notificationService.showError(this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
          } else {
            this.notificationService.showError(this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          }
        },
      );

      this.selectedDatos.forEach((modulo) => {
        const pattern = "dd/MM/yyyy";
        if (modulo.fechadesdevigor != null && typeof modulo.fechadesdevigor == "number") {
          modulo.fechadesdevigor = this.formatDate(modulo.fechadesdevigor);
          modulo.fechadesdevigor = this.pipe.transform(modulo.fechadesdevigor, pattern);
        }
        if (modulo.fechahastavigor != null && typeof modulo.fechahastavigor == "number") {
          modulo.fechahastavigor = this.formatDate(modulo.fechahastavigor);
          modulo.fechahastavigor = this.pipe.transform(modulo.fechahastavigor, pattern);
        }
      });
    });
  }

  volverFichaJuzgado() {
    this.router.navigate(["gestionJuzgados"]);
  }
}
