import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, ViewChild } from '@angular/core';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { SigaServices } from '../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { EstadoEJGItem } from '../../../../../models/sjcs/EstadoEJGItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { TranslateService } from '../../../../../commons/translate';
import { ConfirmationService } from 'primeng/api';
import { DataTable } from "primeng/datatable";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-estados',
  templateUrl: './estados.component.html',
  styleUrls: ['./estados.component.scss']
})
export class EstadosComponent implements OnInit {

  @Input() datos: EJGItem;
  @Input() modoEdicion;
  @Input() tarjetaEstados: string;
  @Input() permisoEscritura: boolean = false;
  @Input() openTarjetaEstados;
  @Output() guardadoSend = new EventEmitter<any>();

  openFicha: boolean = false;
  rowsPerPage: any = [];
  cols;
  msgs;
  selectedItem: number = 10;
  selectAll;
  selectedDatos = [];
  buscadores = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;
  historico: boolean = false;
  estados: any[] = [];
  guardar: boolean = false;

  datosEstados: any[] = [];
  checkEstados: any[] = [];
  comboEstadoEJG = [];
  valueComboEstado: string = "";
  observacionesEstado: string = "";
  fechaEstado: Date = new Date();
  fechaIni: string = "";
  showModalAnadirEstado: boolean;

  datosFamiliares = [];

  selectionMode: string = "single";
  editMode: boolean;

  progressSpinner: boolean = false;
  editaEstado: boolean = false;
  estadoAutomatico: boolean = false;
  resaltadoDatosGenerales: boolean = false;

  inserCol: any[] = [];

  activacionTarjeta: boolean = false;

  @ViewChild("table") table: DataTable;

  creaEstado: boolean = false;
  numSelectedEstados: number;
  restablecer: boolean;
  esColegioZonaComun: boolean = false;

  constructor(private sigaServices: SigaServices,
    private persistenceService: PersistenceService, private commonsServices: CommonsService,
    private translateService: TranslateService, private confirmationService: ConfirmationService,
    private changeDetectorRef: ChangeDetectorRef, private datepipe: DatePipe) { }

  ngOnInit() {
    this.modoEdicion = true;
    this.creaEstado = true;
    this.getEstados(this.datos);
    this.getCols();
    this.getComboEstado();
    this.esZonaComun().then(value => this.esColegioZonaComun = value).catch(() => this.esColegioZonaComun = false);
  }

  getEstados(selected) {
    this.sigaServices.post("gestionejg_getEstados", selected).subscribe(
      n => {
        this.estados = JSON.parse(n.body).estadoEjgItems;

        if(this.datos.estadoEJG != this.estados[0].descripcion){
          this.datos.estadoEJG = this.estados[0].descripcion;
          this.guardadoSend.emit(this.datos);
        }

        this.datosEstados = this.estados;
        this.checkEstados = JSON.parse(JSON.stringify(this.estados));
      }
    );
    for (let i in this.datosEstados) {
      this.datosEstados[i].isMod = false;
    }
  }

  setItalic(dato) {
    if (dato.fechabaja == null) return false;
    else return true;
  }

  openTab(evento) {
    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }
    if (!this.selectAll && !this.selectMultiple) {
    } else {
      if (evento.data.fechabaja == undefined && this.historico) {
        this.selectedDatos.pop();
      }
    }
  }

  getCols() {
    this.cols = [
      { field: "fechaInicio", header: "censo.nuevaSolicitud.fechaEstado", width: "10%" },
      { field: "fechaModificacion", header: "censo.resultadosSolicitudesModificacion.literal.fecha", width: "10%" },
      { field: "descripcion", header: "censo.fichaIntegrantes.literal.estado", width: "15%" },
      { field: "observaciones", header: "gratuita.mantenimientoLG.literal.observaciones", width: "25%" },
      { field: "automatico", header: "administracion.auditoriaUsuarios.literal.Automatico", width: "10%" },
      { field: "propietario", header: "justiciaGratuita.ejg.documentacion.Propietario", width: "5%" },
      { field: "user", header: "menu.administracion.auditoria.usuarios", width: "25%" },
    ];
    this.cols.forEach(it => this.buscadores.push(""));

    this.rowsPerPage = [
      { label: 10, value: 10 },
      { label: 20, value: 20 },
      { label: 30, value: 30 },
      { label: 40, value: 40 }
    ];
  }

  isSelectMultiple() {
    this.selectAll = false;
    if (this.permisoEscritura) {
      this.selectMultiple = !this.selectMultiple;
      if (!this.selectMultiple) {
        this.selectedDatos = [];
        this.numSelected = 0;
      } else {
        this.selectAll = false;
        this.selectedDatos = [];
        this.numSelected = 0;
      }
    }
  }
  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  onChangeSelectAll() {
    if (this.permisoEscritura) {
      if (!this.historico) {
        if (this.selectAll) {
          this.selectMultiple = true;
          this.selectedDatos = this.datosFamiliares;
          this.numSelected = this.datosFamiliares.length;
        } else {
          this.selectedDatos = [];
          this.numSelected = 0;
          this.selectMultiple = false;
        }
      } else {
        if (this.selectAll) {
          this.selectMultiple = true;
          this.selectedDatos = this.datosFamiliares.filter(
            (dato) => dato.fechaBaja != undefined && dato.fechaBaja != null
          );
          this.numSelected = this.selectedDatos.length;
        } else {
          this.selectedDatos = [];
          this.numSelected = 0;
          this.selectMultiple = false;
        }
      }
    }
  }

  actualizaSeleccionados(selectedDatos) {
    this.numSelected = selectedDatos.length;
    this.seleccion = false;
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  clear() {
    this.msgs = [];
  }

  confirmDelete() {
    this.confirmationService.confirm({
      key: 'delEstado',
      message: this.translateService.instant("justiciaGratuita.ejg.message.eliminarEstado"),
      icon: "fa fa-edit",
      accept: () => {
        this.delete();
      },
      reject: () => {
        this.showMessage("info", "Cancelar", this.translateService.instant("general.message.accion.cancelada"));
        this.activarRestablecerEstados();
      }
    });
  }

  delete() {
    this.progressSpinner = true;
    for (let i = 0; this.selectedDatos.length > i; i++) {
      if (this.selectedDatos[i].automatico != "0") {
        this.progressSpinner = false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("areasmaterias.materias.ficha.eliminarError"));
        this.activarRestablecerEstados();
        return;
      }
    }

    this.sigaServices.post("gestionejg_borrarEstado", this.selectedDatos).subscribe(
      n => {
        this.progressSpinner = false;
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.getEstados(this.datos);
      },
      err => {
        this.progressSpinner = false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );
    this.activarRestablecerEstados();
  }

  getComboEstado() {
    this.sigaServices.getParam("filtrosejg_comboEstadoEJG", "?filtroEstadoEjg=2").subscribe(
      n => {
        this.comboEstadoEJG = n.combooItems;
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      }
    );
  }

  changeEstado() {
    this.showModalAnadirEstado = true;
    this.getComboEstado();
  }

  nuevaFila() {
    this.guardar = true;
    this.creaEstado = true;
    this.editaEstado = false;
    this.restablecer = true;
    this.fechaIni = "";
    this.valueComboEstado = "";
    this.observacionesEstado = "";

    let dummy = {
      fechaInicio: "",
      fechaModificacion: "",
      descripcion: "",
      observaciones: "",
      automatico: "",
      propietario: "",
      user: "",
      nuevoRegistro: true,
      isMod: true
    };

    this.datosEstados = [dummy, ...this.datosEstados];
    this.datosEstados[0].isMod = false;
  }

  cancelaAnadirEstado() {
    this.showModalAnadirEstado = false;
  }

  checkAnadirEstado() {
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      let mess;
      if (this.creaEstado == true) {
        mess = this.translateService.instant("justiciaGratuita.ejg.datosGenerales.AddEstado");
      } else {
        mess = this.translateService.instant("general.message.aceptar");
      }
      this.confirmationService.confirm({
        key: 'addEstado',
        message: mess,
        icon: "fa fa-edit",
        accept: () => {
          this.anadirEstado();
        },
        reject: () => {
          this.showMessage("info", "Cancel", this.translateService.instant("general.message.accion.cancelada"));
          this.activarRestablecerEstados();
        }
      });
    }
  }

  async anadirEstado() {

    if (this.creaEstado == true) {
      let estadoNew = new EstadoEJGItem();
      if (this.fechaIni) {
        let fechaAux: number = this.formatDate4(this.formatDate3(this.fechaIni));
        estadoNew.fechaInicio = new Date(fechaAux);
      } else {
        estadoNew.fechaInicio = new Date();
      }

      estadoNew.idEstadoejg = this.valueComboEstado;
      estadoNew.observaciones = this.observacionesEstado;
      estadoNew.numero = this.datos.numero;
      estadoNew.anio = this.datos.annio;
      estadoNew.idinstitucion = this.datos.idInstitucion;
      estadoNew.idtipoejg = this.datos.tipoEJG;
      if (this.esColegioZonaComun && estadoNew.idEstadoejg === "7" && !(await this.confirmacionEnviarCAJGCambiarEstado())) {
        this.getEstados(this.datos);
        return;
      }

      this.sigaServices.post("gestionejg_nuevoEstado", estadoNew).subscribe(
        n => {
          this.progressSpinner = false;
          this.fechaIni = "";
          this.valueComboEstado = "";
          this.observacionesEstado = "";
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.getEstados(this.datos);
        },
        err => {
          this.progressSpinner = false;
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        }
      );

    } else {

      this.progressSpinner = true;
      if (this.selectedDatos[0].automatico != "0") {
        this.progressSpinner = false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("informesycomunicaciones.consultas.noPuedeEditarConsulta"));
      } else {
        let fechaAux: number = this.formatDate4(this.formatDate3(this.selectedDatos[0].fechaInicio));
        this.selectedDatos[0].fechaInicio = fechaAux;
        this.selectedDatos[0].idEstadoejg = this.valueComboEstado;
        this.selectedDatos[0].observaciones = this.observacionesEstado;

        this.sigaServices.post("gestionejg_editarEstado", this.selectedDatos[0]).subscribe(
          n => {
            this.progressSpinner = false;
            this.fechaIni = "";
            this.valueComboEstado = "";
            this.observacionesEstado = "";
            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
            this.getEstados(this.datos);
          },
          err => {
            this.progressSpinner = false;
            this.selectedDatos = [];
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
          }
        );
      }
    }
    this.activarRestablecerEstados();
  }

  confirmacionEnviarCAJGCambiarEstado(): Promise<boolean> {
    return new Promise((accept1, reject1) => {
      this.confirmationService.confirm({
        key: "confirmCAJG",
        message: this.translateService.instant("justiciaGratuita.ejg.listaIntercambios.confirmEnviarDoc"),
        icon: "fa fa-edit",
        accept: () => {
          accept1(true);
        },
        reject: () => {
          this.showMessage("info", "Cancel", this.translateService.instant("general.message.accion.cancelada"));
          this.activarRestablecerEstados();
          accept1(false);
        }
      });
    });
  }

  searchHistorical() {
    this.datos.historico = !this.datos.historico;
    this.historico = !this.historico;
    if (this.historico) {
      this.editMode = false;
      this.selectAll = false;
      this.numSelected = 0;
    }
    this.selectMultiple = false;
    this.selectionMode = "single";
    this.persistenceService.setHistorico(this.historico);
    this.getEstados(this.datos);
  }

  abreCierraFicha() {
    this.openTarjetaEstados = !this.openTarjetaEstados;
  }

  checkPermisosDelete() {
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      if (!this.permisoEscritura || (!this.selectMultiple && !this.selectAll) || this.selectedDatos.length == 0) {
        this.msgs = this.commonsServices.checkPermisoAccion();
      } else {
        this.confirmDelete();
      }
    }
  }

  checkPermisosActivate() {
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      //this.activate();
    }
  }

  styleObligatorio(resaltado, evento) {
    if (resaltado = 'estados') {
      if ((evento == null || evento == undefined || evento == "") && resaltado == "estados" && this.resaltadoDatosGenerales) {
        return "camposObligatorios";
      }
    }else {
      if (this.resaltadoDatosGenerales && (evento == undefined || evento == null || evento == "")) {
        return this.commonsServices.styleObligatorio(evento);
      }
    }
  }

  formatDate2(date) {
    const pattern = 'yyyy-MM-dd';
    return this.datepipe.transform(date, pattern);
  }

  formatDate3(date) {
    let year = date.substring(6, 10)
    let month = date.substring(3, 5)
    let day = date.substring(0, 2)
    let date2 = day + '-' + month + '-' + year;
    return date2;
  }
  
  formatDate4(date) {
    date = date.split("-");
    var newDate = new Date(date[2], date[1] - 1, date[0]);
    return newDate.getTime();
  }

  changeDateFormat(date1) {
    let year = date1.substring(0, 4)
    let month = date1.substring(5, 7)
    let day = date1.substring(8, 10)
    let date2 = day + '/' + month + '/' + year;
    return date2;
  }

  onRowSelectEstados(i) {
    let indice = parseInt(i);
    this.restablecer = true;
    this.editaEstado = false;
    if (this.datosEstados[0].nuevoRegistro == true) {
      this.creaEstado = true;
    } else if (this.datosEstados[indice] != undefined && this.datosEstados[indice].automatico != 1 && this.datosEstados[indice].fechabaja == null) {
      this.estadoAutomatico = false;
      this.editaEstado = true;
      this.creaEstado = false;
      this.guardar = true;
      for (let j = 0; j < this.datosEstados.length; j++) {
        if (j == indice) {
          this.datosEstados[indice].isMod = true;
        } else {
          this.datosEstados[j].isMod = false;
        }
      }
    } else {
      this.estadoAutomatico = true;
      this.datosEstados[indice].isMod = false;
      this.restablecer = false;
      this.editaEstado = false;
      this.guardar = false;
      this.creaEstado = true;
      this.selectedDatos = [];

    }

    if (this.editaEstado == true && this.fechaIni == "") {
      this.fechaIni = this.changeDateFormat(this.formatDate2(this.datosEstados[i].fechaInicio).toString());
    }
    if (this.editaEstado == true && this.valueComboEstado != "" && this.datosEstados[i].idEstadoejg != this.valueComboEstado) {
      this.datosEstados[i].idEstadoejg = this.valueComboEstado;
    } else if (this.editaEstado == true && this.valueComboEstado == "") {
      this.valueComboEstado = this.datosEstados[i].idEstadoejg;
    }
  }

  activarRestablecerEstados() {
    this.restablecer = false;
    this.editaEstado = false;
    this.creaEstado = true;
    this.guardar = false;
    this.selectedDatos = [];
    this.getEstados(this.datos);
    this.fechaIni = "";
    this.valueComboEstado = "";
    this.observacionesEstado = "";
  }

  onChangeObservaciones(event) {
    this.observacionesEstado = event.target.value;
  }

  fillFechaInicio(event, i) {
    this.fechaIni = this.changeDateFormat(this.formatDate2(event).toString());
    if (i != undefined) {
      this.datosEstados[i].fechaInicio = this.fechaIni;
    }
  }

  esZonaComun(): Promise<boolean> {
    return this.sigaServices.get("gestionejg_esColegioZonaComun").toPromise().then(
      n => {
        if (n.error != undefined) {
          return Promise.reject();
        } else {
          const result = n.data === 'true';
          return Promise.resolve(result);
        }
      },
      err => {
        return Promise.reject();
      }
    )
  }
}