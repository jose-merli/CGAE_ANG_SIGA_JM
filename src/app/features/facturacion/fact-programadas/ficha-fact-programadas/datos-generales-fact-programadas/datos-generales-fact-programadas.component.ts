import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import moment = require('moment');
import { ConfirmationService, Message } from 'primeng/api';
import { DataTable } from 'primeng/primeng';
import { TranslateService } from '../../../../../commons/translate';
import { FacFacturacionprogramadaItem } from '../../../../../models/FacFacturacionprogramadaItem';
import { FichaEstadoFacFacturacionItem } from '../../../../../models/FichaEstadoFacFacturacionItem';
import { SerieFacturacionItem } from '../../../../../models/SerieFacturacionItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { saveAs } from "file-saver/FileSaver";

@Component({
  selector: 'app-datos-generales-fact-programadas',
  templateUrl: './datos-generales-fact-programadas.component.html',
  styleUrls: ['./datos-generales-fact-programadas.component.scss']
})
export class DatosGeneralesFactProgramadasComponent implements OnInit, OnChanges {

  msgs: Message[] = [];
  progressSpinner: boolean = false;

  @Input() modoEdicion: boolean;
  @Input() openTarjetaDatosGenerales;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Output() guardadoSend = new EventEmitter<FacFacturacionprogramadaItem>();
  @Output() refreshData = new EventEmitter<void>();

  @Input() bodyInicial: FacFacturacionprogramadaItem;
  body: FacFacturacionprogramadaItem = new FacFacturacionprogramadaItem();
  @Input() serie: SerieFacturacionItem;

  resaltadoDatos: boolean = false;

  // Estados de confirmación
  porProgramar: boolean = true;
  porConfirmar: boolean = false;
  porConfirmarError: boolean = false;
  confirmada: boolean = false;

  // Fecha para la restricción de fecha de generación
  fechaActual: Date;

  // Estados
  dialogVisible: boolean = false;

  // Modal
  @ViewChild("table") table : DataTable;
  selectedItem: number = 10;
  modalCols = [];
  buscadores = [];
  rowsPerPage = [];
  datosMostrados: FichaEstadoFacFacturacionItem[];

  constructor(
    private commonsService: CommonsService,
    private sigaServices: SigaServices,
    private translateService: TranslateService,
    private confirmationService: ConfirmationService
  ) { }

  // Al inicializar el formulario se inicializa la fecha actual sin el tiempo
  // para facilitar la validación de la fecha de generación, la fecha de generación
  // prevista se establece antes de guardar (momento actual + 5 min.)
  ngOnInit() {
    this.fechaActual = new Date();
    this.fechaActual.setHours(0,0,0,0);

    this.getModalCols();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.bodyInicial != undefined)
      this.restablecer();
  }

  // Restablecer

  restablecer(): void {
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));
    this.body.fechaPrevistaGeneracion = this.transformDate(this.body.fechaPrevistaGeneracion);
    this.body.fechaPrevistaConfirm = this.transformDate(this.body.fechaPrevistaConfirm);
    this.body.fechaInicioProductos = this.transformDate(this.body.fechaInicioProductos);
    this.body.fechaFinProductos = this.transformDate(this.body.fechaFinProductos);
    this.body.fechaInicioServicios = this.transformDate(this.body.fechaInicioServicios);
    this.body.fechaFinServicios = this.transformDate(this.body.fechaFinServicios);
    this.body.fechaModificacion = this.transformDate(this.body.fechaModificacion);

    this.body.fechaCompraSuscripcionDesde = this.minDate(this.body.fechaInicioServicios, this.body.fechaInicioProductos);
    this.body.fechaCompraSuscripcionHasta = this.maxDate(this.body.fechaFinServicios, this.body.fechaFinProductos);
    this.resaltadoDatos = false;

    this.porProgramar = !this.modoEdicion || this.body.idEstadoConfirmacion == "20" || this.body.idEstadoConfirmacion == "2";
    this.porConfirmar = this.body.idEstadoConfirmacion == "18" || this.body.idEstadoConfirmacion == "19" || this.body.idEstadoConfirmacion == "1" || this.body.idEstadoConfirmacion == "17";
    this.porConfirmarError = this.body.idEstadoConfirmacion == "21";
    this.confirmada = this.body.idEstadoConfirmacion == "3";
  }

  // Dehabilitar guardado cuando no cambien los campos
  deshabilitarGuardado(): boolean {
    return this.notChangedString(this.body.descripcion, this.bodyInicial.descripcion)
        && this.notChangedDate(this.body.fechaPrevistaGeneracion, this.bodyInicial.fechaPrevistaGeneracion)
        && this.notChangedDate(this.body.fechaPrevistaConfirm, this.bodyInicial.fechaPrevistaConfirm)
        && this.notChangedDate(this.body.fechaInicioServicios, this.bodyInicial.fechaInicioServicios)
        && this.notChangedDate(this.body.fechaInicioProductos, this.bodyInicial.fechaInicioProductos)
        && this.notChangedDate(this.body.fechaFinServicios, this.bodyInicial.fechaFinServicios)
        && this.notChangedDate(this.body.fechaFinProductos, this.bodyInicial.fechaFinProductos);
  }

  getDatos() {
    this.datosMostrados = [
      {
        orden : 10,
        faseProcesoFacturacion : "Generación programada",
        fechaProgramacion : "18/08/2020 14:41",
        puestoCola : "1/5"
      },
      {
        orden: 20,
        faseProcesoFacturacion : "Confirmación programada",
        fechaProgramacion : "18/08/2020 14:41",
        puestoCola : "2/5"
      },
      {
        orden: 30,
        faseProcesoFacturacion : "Pago automático programado",
        fechaProgramacion : "18/08/2020 14:41",
        puestoCola : "3/5"
      }
    ]
  }

  notChangedString(value1: string, value2: string): boolean {
    return value1 == value2 || (value1 == undefined || value1.trim().length == 0) && (value2 == undefined || value2.trim().length == 0);
  }

  notChangedDate(value1: Date, value2: Date): boolean {
    return value1 == value2 || value1 == undefined && value2 == undefined || new Date(value1).getTime() == new Date(value2).getTime();
  }

  // Definición de las columnas del modal
  getModalCols() {
    this.modalCols = [
      { field: "orden", header: "administracion.informes.literal.orden", width: "10%" },
      { field: "faseProcesoFacturacion", header: "facturacionPyS.facturaciones.FaseProcesoFac", width: "20%" },
      { field: "fechaProgramacion", header: "informesycomunicaciones.comunicaciones.busqueda.fechaProgramada", width: "10%" },
      { field: "puestoCola", header: "facturacionPyS.facturaciones.PuestoCola", width: "10%" }
    ];

    this.modalCols.forEach(it => this.buscadores.push(""));
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

  // Guardar
  isValid(): boolean {
    let camposObligatorios: boolean = this.body.idSerieFacturacion != undefined && this.body.idSerieFacturacion.trim() != "" 
        && this.body.descripcion != undefined  && this.body.descripcion.trim() != "" && this.body.descripcion.length <= 255
        && this.body.fechaPrevistaGeneracion != undefined;

    if (!camposObligatorios) {
      this.showMessage("error", "Error", this.translateService.instant('general.message.camposObligatorios'));
      return false;
    }

    let fechaGeneracion: boolean = !this.porConfirmarError && this.body.fechaPrevistaGeneracion < this.fechaActual;
    if (fechaGeneracion) {
      this.showMessage("error", "Error", this.translateService.instant("facturacion.factProgramadas.fechaGeneracion.futura"));
      return false;
    }

    let fechaConfirmacion: boolean = this.body.fechaPrevistaConfirm == undefined || this.body.fechaPrevistaConfirm > this.body.fechaPrevistaGeneracion;
    if (!fechaConfirmacion) {
      this.showMessage("error", "Error", this.translateService.instant("facturacion.factProgramadas.fechaConfirmacion.posterior"));
      return false;
    }

    let intervaloProductos: boolean = this.body.fechaInicioProductos != undefined || this.body.fechaFinProductos != undefined;
    if (intervaloProductos) {
      let intervalo: boolean = this.body.fechaInicioProductos < this.body.fechaFinProductos;
      if (!intervalo) {
        this.showMessage("error", "Error", this.translateService.instant("facturacion.factProgramadas.intevaloCompras.invalido"));
        return false;
      }
    } else if (this.serie.tiposProductos != undefined && this.serie.tiposProductos.length > 0) {
      this.showMessage("error", "Error", this.translateService.instant("facturacion.factProgramadas.intevalo.tiposProductos"));
      return false;
    }

    let intervaloServicios: boolean = this.body.fechaInicioServicios != undefined || this.body.fechaFinServicios != undefined;
    if (intervaloServicios) {
      let intervalo: boolean = this.body.fechaInicioServicios < this.body.fechaFinServicios;
      if (!intervalo) {
        this.showMessage("error", "Error", this.translateService.instant("facturacion.factProgramadas.intevaloSuscripciones.invalido"));
        return false;
      }
    } else if (this.serie.tiposServicios != undefined && this.serie.tiposServicios.length > 0) {
      this.showMessage("error", "Error", this.translateService.instant("facturacion.factProgramadas.intevalo.tiposServicios"));
      return false;
    }

    if (!intervaloProductos && !intervaloServicios) {
      this.showMessage("error", "Error", this.translateService.instant("facturacion.factProgramadas.intervalo.obligatorio"));
      return false;
    }

    return  true;
  }

  checkSave(): void {
    if (this.isValid() && !this.deshabilitarGuardado()) {
      this.body.esDatosGenerales = true;

      // Corregir fecha de generación prevista si coincide con la fecha actual
      if (this.body.fechaPrevistaGeneracion.getTime() == this.fechaActual.getTime()) {
        this.body.fechaPrevistaGeneracion = moment(new Date()).add(5, 'm').toDate();
      }

      this.guardadoSend.emit(this.body);
    } else {
      this.resaltadoDatos = true;
    }
  }

  // Botón de eliminar
  confirmEliminar(): void {
    let mess = this.translateService.instant("justiciaGratuita.ejg.message.eliminarDocumentacion");
    let icon = "fa fa-eraser";

    this.confirmationService.confirm({
      // key: "confirmEliminar",
      message: mess,
      icon: icon,
      accept: () => {
        this.progressSpinner = true;
        this.eliminar();
      },
      reject: () => {
        this.showMessage("info", "Cancelar", this.translateService.instant("general.message.accion.cancelada"));
      }
    });
  }

  eliminar() {
    this.sigaServices.post("facturacionPyS_eliminarFacturacion", this.bodyInicial).subscribe(
      n => {
        this.refreshData.emit();
        this.progressSpinner = false;
      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        this.progressSpinner = false;
      }
    );
  }

  // Botón de archivar
  archivar(): void {
    this.progressSpinner = true;
    this.bodyInicial.archivarFact = true;

    this.sigaServices.post("facturacionPyS_archivarFacturacionesProgramadas", [this.bodyInicial]).subscribe(
      n => {
        this.refreshData.emit();
        this.progressSpinner = false;
      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        this.progressSpinner = false;
      }
    );
  }

  // Botón de desarchivar
  desarchivar(): void {
    this.progressSpinner = true;
    this.bodyInicial.archivarFact = false;

    this.sigaServices.post("facturacionPyS_archivarFacturacionesProgramadas", [this.bodyInicial]).subscribe(
      n => {
        this.refreshData.emit();
        this.progressSpinner = false;
      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        this.progressSpinner = false;
      }
    );
  }

  // Descargar LOG
  descargarLog(){
    let resHead ={ 'response' : null, 'header': null };

    if (this.bodyInicial.nombreFichero) {
      this.progressSpinner = true;
      let descarga =  this.sigaServices.getDownloadFiles("facturacionPyS_descargarFichaFacturacion", [{ idSerieFacturacion: this.bodyInicial.idSerieFacturacion, idProgramacion: this.bodyInicial.idProgramacion }]);
      descarga.subscribe(response => {
        this.progressSpinner = false;

        const file = new Blob([response.body], {type: response.headers.get("Content-Type")});
        let filename: string = response.headers.get("Content-Disposition");
        filename = filename.split(';')[1].split('filename')[1].split('=')[1].trim();

        saveAs(file, filename);
        this.showMessage('success', 'LOG descargado correctamente',  'LOG descargado correctamente' );
      },
      err => {
        this.progressSpinner = false;
        this.showMessage('error','El LOG no pudo descargarse',  'El LOG no pudo descargarse' );
      });
    } else {
      this.showMessage('error','El LOG no pudo descargarse',  'El LOG no pudo descargarse' );
    }
  }

  // Cambios en fechas

  fillFechaRealGeneracion(event) {
    this.body.fechaPrevistaGeneracion = event;
  }

  fillFechaConfirmacion(event) {
    this.body.fechaPrevistaConfirm = event;
  }

  fillFechaInicioProductos(event) {
    this.body.fechaInicioProductos = event;
  }

  fillFechaFinProductos(event) {
    this.body.fechaFinProductos = event;
  }

  fillFechaInicioServicios(event) {
    this.body.fechaInicioServicios = event;
  }

  fillFechaFinServicios(event) {
    this.body.fechaFinServicios = event;
  }

  // Transformar fecha
  transformDate(fecha) {
    if (fecha != undefined)
      fecha = new Date(fecha);
    else
      fecha = null;
    // fecha = this.datepipe.transform(fecha, 'dd/MM/yyyy');
    return fecha;
  }

  // Estilo de error

  styleObligatorio(evento: string) {
    if (this.resaltadoDatos && (evento == undefined || evento == null || evento.trim() == "")) {
      return this.commonsService.styleObligatorio(evento);
    }
  }

  styleFechaGeneracion(evento) {
    if (this.resaltadoDatos  && (evento == undefined || evento >= this.fechaActual)) {
      return this.commonsService.styleObligatorio(evento);
    }
  }

  styleFechaConfirmacion(evento) {
    if (this.resaltadoDatos && this.body.fechaPrevistaGeneracion != undefined && evento != undefined && this.body.fechaPrevistaGeneracion >= evento) {
      return 'camposObligatorios';
    }
  }

  styleFechaProductos() {
    if (this.resaltadoDatos) {
      let intervaloProductos: boolean = this.body.fechaInicioProductos != undefined || this.body.fechaFinProductos != undefined;
      if (intervaloProductos) {
        let intervalo: boolean = this.body.fechaInicioProductos < this.body.fechaFinProductos;
        if (!intervalo) {
          return 'camposObligatorios';
        }
      } else if (this.serie.tiposProductos != undefined && this.serie.tiposProductos.length > 0) {
        return 'camposObligatorios';
      }

      let intervaloServicios: boolean = this.body.fechaInicioServicios != undefined || this.body.fechaFinServicios != undefined;
      if (!intervaloProductos && !intervaloServicios) {
        return 'camposObligatorios';
      }
    }
  }

  styleFechaServicios() {
    if (this.resaltadoDatos) {
      let intervaloServicios: boolean = this.body.fechaInicioServicios != undefined || this.body.fechaFinServicios != undefined;
      if (intervaloServicios) {
        let intervalo: boolean = this.body.fechaInicioServicios < this.body.fechaFinServicios;
        if (!intervalo) {
          return 'camposObligatorios';
        }
      } else if (this.serie.tiposServicios != undefined && this.serie.tiposServicios.length > 0) {
        return 'camposObligatorios';
      }

      let intervaloProductos: boolean = this.body.fechaInicioProductos != undefined || this.body.fechaFinProductos != undefined;
      if (!intervaloProductos && !intervaloServicios) {
        return 'camposObligatorios';
      }
    }
  }

  // Fecha mínima para la columna 'desde'
  minDate(d1: Date, d2: Date) {
    if (d1 == undefined)
      return d2;
    if (d2 == undefined)
      return d1;

    if (d1 < d2) {
      return d1;
    } else {
      return d2;
    }
  }

  // Fecha máxima para la columna 'hasta'
  maxDate(d1: Date, d2: Date) {
    if (d1 == undefined)
      return d2;
    if (d2 == undefined)
      return d1;

    if (d1 > d2) {
      return d1;
    } else {
      return d2;
    }
  }

  // Abrir y cerrar la ficha

  esFichaActiva(): boolean {
    return this.openTarjetaDatosGenerales;
  }

  abreCierraFicha(key): void {
    this.openTarjetaDatosGenerales = !this.openTarjetaDatosGenerales;
    this.opened.emit(this.openTarjetaDatosGenerales);
    this.idOpened.emit(key);
  }

  // Mensajes en pantalla

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  cambiarEstadoDialogo(estado) {
    this.dialogVisible = estado;
    if (!estado) {
      this.datosMostrados = []
    }
    console.log(this.datosMostrados);
    console.log(estado);
  }

  clear() {
    this.msgs = [];
  }

}
