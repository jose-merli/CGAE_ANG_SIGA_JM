import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Message } from 'primeng/components/common/message';
import { ComboItem } from '../../../../../models/ComboItem';
import { FacFacturacionprogramadaItem } from '../../../../../models/FacFacturacionprogramadaItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { saveAs } from "file-saver/FileSaver";

@Component({
  selector: 'app-envio-fact-programadas',
  templateUrl: './envio-fact-programadas.component.html',
  styleUrls: ['./envio-fact-programadas.component.scss']
})
export class EnvioFactProgramadasComponent implements OnInit, OnChanges {

  msgs: Message[] = [];
  progressSpinner: boolean = false;
  @Input() permisoEscritura: boolean;

  @Input() modoEdicion: boolean;
  @Input() openTarjetaEnvio;
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

  comboPlantillas: ComboItem[] = [];

  constructor(
    private commonsService: CommonsService,
    private sigaServices: SigaServices
  ) { }

  ngOnInit() {
    this.getComboPlantillasEnvio();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.bodyInicial != undefined)
      this.restablecer();
  }

  // Combo de plantillas envío masivo

  getComboPlantillasEnvio() {
    this.progressSpinner = true;
    this.sigaServices.get("facturacionPyS_comboPlantillasEnvio").subscribe(
      n => {
        this.comboPlantillas = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboPlantillas);

        this.progressSpinner = false;
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      }
    );
  }

  // Restablecer

  restablecer(): void {
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));
    this.resaltadoDatos = false;

    this.porProgramar = this.body.idEstadoConfirmacion == "20" || this.body.idEstadoConfirmacion == "2";
    this.porConfirmar = this.body.idEstadoConfirmacion == "18" || this.body.idEstadoConfirmacion == "19" || this.body.idEstadoConfirmacion == "1" || this.body.idEstadoConfirmacion == "17";
    this.porConfirmarError = this.body.idEstadoConfirmacion == "21";
    this.confirmada = this.body.idEstadoConfirmacion == "3";

    this.noAplica = this.body.idEstadoEnvio == "11";
    this.finalizado = this.body.idEstadoEnvio == "12" || this.body.idEstadoEnvio == "13" || this.body.idEstadoEnvio == "14" || this.body.idEstadoEnvio == "15";
    this.finalizadoError = this.body.idEstadoEnvio == "16";
    this.logDisponible = true;
  }

  // Dehabilitar guardado cuando no cambien los campos
  deshabilitarGuardado(): boolean {
    return this.body.envio == this.bodyInicial.envio
      && this.body.idTipoPlantillaMail == this.bodyInicial.idTipoPlantillaMail;
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

  // Estilo obligatorio
  styleObligatorio(evento: string) {
    if (this.resaltadoDatos && (evento == undefined || evento == null || evento.trim() == "")) {
      return this.commonsService.styleObligatorio(evento);
    }
  }

  // Abrir y cerrar la ficha

  esFichaActiva(): boolean {
    return this.openTarjetaEnvio;
  }

  abreCierraFicha(key): void {
    this.openTarjetaEnvio = !this.openTarjetaEnvio;
    this.opened.emit(this.openTarjetaEnvio);
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
