import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Message } from 'primeng/components/common/message';
import { ComboItem } from '../../../../../models/ComboItem';
import { FacFacturacionprogramadaItem } from '../../../../../models/FacFacturacionprogramadaItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { saveAs } from "file-saver/FileSaver";

@Component({
  selector: 'app-gen-factura-fact-programadas',
  templateUrl: './gen-factura-fact-programadas.component.html',
  styleUrls: ['./gen-factura-fact-programadas.component.scss']
})
export class GenFacturaFactProgramadasComponent implements OnInit, OnChanges {

  msgs: Message[] = [];
  progressSpinner: boolean = false;
  @Input() permisoEscritura: boolean;

  @Input() modoEdicion: boolean;
  @Input() openTarjetaGenFactura;
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
  logDisponible:boolean = false;

  comboModelosFactura: ComboItem[] = [];
  comboModelosFacturaRectificativa: ComboItem[] = [];

  constructor(
    private commonsService: CommonsService,
    private sigaServices: SigaServices
  ) { }

  ngOnInit() {
    this.progressSpinner = true;

    Promise.all([
      this.getComboModelosComunicacion(),
      this.getComboModelosComunicacionRectificativa()
    ]).then(() => this.progressSpinner = false);
    
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.bodyInicial != undefined && changes.bodyInicial.currentValue != undefined)
      this.restablecer();
  }

  getComboModelosComunicacion() {
    return this.sigaServices.get("facturacionPyS_comboModelosComunicacion").toPromise().then(
      n => {
        this.comboModelosFactura = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboModelosFactura);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboModelosComunicacionRectificativa() {
    return this.sigaServices.getParam("facturacionPyS_comboModelosComunicacion", "?esRectificativa=true").toPromise().then(
      n => {
        this.comboModelosFacturaRectificativa = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboModelosFacturaRectificativa);
      },
      err => {
        console.log(err);
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

    this.noAplica = this.body.idEstadoPDF == "5";
    this.finalizado = this.body.idEstadoPDF == "6" || this.body.idEstadoPDF == "7" || this.body.idEstadoPDF == "8" || this.body.idEstadoPDF == "9";
    this.finalizadoError = this.body.idEstadoPDF == "10";
    this.logDisponible = true;
  }

  // Dehabilitar guardado cuando no cambien los campos
  deshabilitarGuardado(): boolean {
    return this.body.generaPDF == this.bodyInicial.generaPDF
      && this.body.idModeloFactura == this.bodyInicial.idModeloFactura
      && this.body.idModeloRectificativa == this.bodyInicial.idModeloRectificativa;
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
    return this.openTarjetaGenFactura;
  }

  abreCierraFicha(key): void {
    this.openTarjetaGenFactura = !this.openTarjetaGenFactura;
    this.opened.emit(this.openTarjetaGenFactura);
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
