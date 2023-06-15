import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Message } from 'primeng/components/common/message';
import { FacFacturacionprogramadaItem } from '../../../../../models/FacFacturacionprogramadaItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { saveAs } from "file-saver/FileSaver";
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-traspaso-fact-programadas',
  templateUrl: './traspaso-fact-programadas.component.html',
  styleUrls: ['./traspaso-fact-programadas.component.scss']
})
export class TraspasoFactProgramadasComponent implements OnInit, OnChanges {

  msgs: Message[] = [];
  progressSpinner: boolean = false;
  @Input() permisoEscritura: boolean;

  @Input() modoEdicion: boolean;
  @Input() openTarjetaTraspaso;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Output() guardadoSend = new EventEmitter<FacFacturacionprogramadaItem>();

  @Input() bodyInicial: FacFacturacionprogramadaItem;
  body: FacFacturacionprogramadaItem = new FacFacturacionprogramadaItem();

  resaltadoDatos: boolean = false;
  porProgramar: boolean = true;
  porConfirmar: boolean = false;
  porConfirmarError: boolean = false;
  confirmada: boolean = false;
  noAplica: boolean = false;
  finalizado: boolean = false;
  finalizadoError: boolean = false;
  logDisponible: boolean = false;

  constructor(
    private commonsService: CommonsService,
    private sigaServices: SigaServices
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
    this.resaltadoDatos = false;

    this.porProgramar = this.body.idEstadoConfirmacion == "20" || this.body.idEstadoConfirmacion == "2";
    this.porConfirmar = this.body.idEstadoConfirmacion == "18" || this.body.idEstadoConfirmacion == "19" || this.body.idEstadoConfirmacion == "1" || this.body.idEstadoConfirmacion == "17";
    this.porConfirmarError = this.body.idEstadoConfirmacion == "21";
    this.confirmada = this.body.idEstadoConfirmacion == "3";

    this.noAplica = this.body.idEstadoTraspaso == "22";
    this.finalizado = this.body.idEstadoTraspaso == "23" || this.body.idEstadoTraspaso == "24" || this.body.idEstadoTraspaso == "25" || this.body.idEstadoTraspaso == "26";
    this.finalizadoError = this.body.idEstadoTraspaso == "27";
    this.logDisponible = this.body.logTraspaso != undefined && this.body.logTraspaso.trim().length != 0;
  }

  // Dehabilitar guardado cuando no cambien los campos
  deshabilitarGuardado(): boolean {
    return this.body.traspasoFacturas == this.bodyInicial.traspasoFacturas
        && this.notChangedString(this.body.traspasoPlantilla, this.bodyInicial.traspasoPlantilla)
        && this.notChangedString(this.body.traspasoCodAuditoriaDef, this.bodyInicial.traspasoCodAuditoriaDef);
  }

  notChangedString(value1: string, value2: string): boolean {
    return value1 == value2 || (value1 == undefined || value1.trim().length == 0) && (value2 == undefined || value2.trim().length == 0);
  }

  // Guardar

  checkSave(): void {
    this.msgs = this.commonsService.checkPermisos(this.permisoEscritura, undefined);

    if (this.msgs == undefined && !this.deshabilitarGuardado()) {
      this.body.esDatosGenerales = false;
      this.guardadoSend.emit(this.body);
    }
  }

  // Descargar LOG
  descargarLog(){
    let resHead ={ 'response' : null, 'header': null };

    if (this.bodyInicial.logError) {
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

  // Estilo obligatorio
  styleObligatorio(evento: string) {
    if (this.resaltadoDatos && (evento == undefined || evento == null || evento.trim() == "")) {
      return this.commonsService.styleObligatorio(evento);
    }
  }

  // Abrir y cerrar la ficha

  esFichaActiva(): boolean {
    return this.openTarjetaTraspaso;
  }

  abreCierraFicha(key): void {
    this.openTarjetaTraspaso = !this.openTarjetaTraspaso;
    this.opened.emit(this.openTarjetaTraspaso);
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
