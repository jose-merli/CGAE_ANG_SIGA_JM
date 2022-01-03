import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ConfirmationService, Message } from 'primeng/api';
import { TranslateService } from '../../../../../commons/translate';
import { FacFacturacionprogramadaItem } from '../../../../../models/FacFacturacionprogramadaItem';
import { SerieFacturacionItem } from '../../../../../models/SerieFacturacionItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { SigaServices } from '../../../../../_services/siga.service';

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
  porProgramar: boolean = true;
  porConfirmar: boolean = false;
  porConfirmarError: boolean = false;
  confirmada: boolean = false;

  constructor(
    private commonsService: CommonsService,
    private sigaServices: SigaServices,
    private translateService: TranslateService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
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
    this.resaltadoDatos = false;

    this.porProgramar = !this.modoEdicion || this.body.idEstadoConfirmacion == "20" || this.body.idEstadoConfirmacion == "2";
    this.porConfirmar = this.body.idEstadoConfirmacion == "18" || this.body.idEstadoConfirmacion == "19" || this.body.idEstadoConfirmacion == "1" || this.body.idEstadoConfirmacion == "17";
    this.porConfirmarError = this.body.idEstadoConfirmacion == "21";
    this.confirmada = this.body.idEstadoConfirmacion == "3";

    console.log(this.body);
  }

  // Dehabilitar guardado cuando no cambien los campos
  deshabilitarGuardado(): boolean {
    return this.notChangedString(this.body.descripcion, this.bodyInicial.descripcion)
        && this.body.fechaPrevistaGeneracion == this.bodyInicial.fechaPrevistaGeneracion
        && this.body.fechaPrevistaConfirm == this.bodyInicial.fechaPrevistaConfirm
        && this.body.fechaInicioServicios == this.bodyInicial.fechaInicioServicios
        && this.body.fechaInicioProductos == this.bodyInicial.fechaInicioProductos
        && this.body.fechaFinServicios == this.bodyInicial.fechaFinServicios
        && this.body.fechaFinProductos == this.bodyInicial.fechaFinProductos;
  }

  notChangedString(value1: string, value2: string): boolean {
    return value1 == value2 || (value1 == undefined || value1.trim().length == 0) && (value2 == undefined || value2.trim().length == 0);
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

    let fechaGeneracion: boolean = this.body.fechaPrevistaGeneracion > new Date();
    if (!fechaGeneracion) {
      this.showMessage("error", "Error", "La Fecha de generación debe ser posterior a la fecha actual");
      return false;
    }

    let fechaConfirmacion: boolean = this.body.fechaPrevistaConfirm == undefined || this.body.fechaPrevistaConfirm > this.body.fechaRealGeneracion;
    if (!fechaConfirmacion) {
      this.showMessage("error", "Error", "La Fecha de confirmación debe ser posterior a la fecha de generación");
      return false;
    }

    let intervaloProductos: boolean = this.body.fechaInicioProductos != undefined || this.body.fechaFinProductos != undefined;
    if (intervaloProductos) {
      let intervalo: boolean = this.body.fechaInicioProductos < this.body.fechaFinProductos;
      if (!intervalo) {
        this.showMessage("error", "Error", "El intervalo de compras de productos es inválido");
        return false;
      }
    } else if (this.serie.tiposProductos != undefined && this.serie.tiposProductos.length > 0) {
      this.showMessage("error", "Error", "La serie contiene tipos de productos");
      return false;
    }

    let intervaloServicios: boolean = this.body.fechaInicioServicios != undefined || this.body.fechaFinServicios != undefined;
    if (intervaloServicios) {
      let intervalo: boolean = this.body.fechaInicioServicios < this.body.fechaFinServicios;
      if (!intervalo) {
        this.showMessage("error", "Error", "El intervalo de cuotas y suscripciones es inválido");
        return false;
      }
    } else if (this.serie.tiposServicios != undefined && this.serie.tiposServicios.length > 0) {
      this.showMessage("error", "Error", "La serie contiene tipos de servicios");
      return false;
    }

    if (!intervaloProductos && !intervaloServicios) {
      this.showMessage("error", "Error", "Se debe rellenar al menos uno de los dos periodos");
      return false;
    }

    return  true;
  }

  checkSave(): void {
    if (this.isValid() && !this.deshabilitarGuardado()) {
      this.body.esDatosGenerales = true;
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
    if (this.resaltadoDatos  && (evento == undefined || evento >= new Date())) {
      return this.commonsService.styleObligatorio(evento);
    }
  }

  styleFechaConfirmacion(evento) {
    if (this.resaltadoDatos && this.body.fechaPrevistaGeneracion != undefined && evento != undefined && this.body.fechaPrevistaGeneracion >= evento) {
      return this.commonsService.styleObligatorio(evento);
    }
  }

  styleFechaProductos(evento) {
    if (this.resaltadoDatos && this.serie.tiposProductos != undefined && this.serie.tiposProductos.length > 0 && !(this.body.fechaInicioProductos != undefined && this.body.fechaFinProductos != undefined && this.body.fechaInicioProductos < this.body.fechaFinProductos)) {
      return this.commonsService.styleObligatorio(evento);
    }
  }

  styleFechaServicios(evento) {
    if (this.resaltadoDatos && this.serie.tiposServicios != undefined && this.serie.tiposServicios.length > 0 && !(this.body.fechaInicioServicios != undefined && this.body.fechaFinServicios != undefined || this.body.fechaInicioServicios < this.body.fechaFinServicios)) {
      return this.commonsService.styleObligatorio(evento);
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

  clear() {
    this.msgs = [];
  }

}
