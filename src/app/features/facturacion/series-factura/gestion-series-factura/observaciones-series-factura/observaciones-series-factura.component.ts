import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TranslateService } from '../../../../../commons/translate';
import { SerieFacturacionItem } from '../../../../../models/SerieFacturacionItem';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-observaciones-series-factura',
  templateUrl: './observaciones-series-factura.component.html',
  styleUrls: ['./observaciones-series-factura.component.scss']
})
export class ObservacionesSeriesFacturaComponent implements OnInit, OnChanges {

  msgs;
  progressSpinner: boolean = false;

  @Input() openTarjetaObservaciones;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Output() guardadoSend = new EventEmitter<SerieFacturacionItem>();

  @Input() bodyInicial: SerieFacturacionItem;
  body: SerieFacturacionItem = new SerieFacturacionItem();
  
  apiKey: string = "";
  editorConfig: any = {
    selector: "textarea",
    plugins:
      "autoresize pagebreak table save charmap media contextmenu paste directionality noneditable visualchars nonbreaking spellchecker template searchreplace lists link image insertdatetime textcolor code hr",
    toolbar:
      "newdocument | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify formatselect fontselect fontsizeselect | cut copy paste pastetext | searchreplace | bullist numlist | indent blockquote | undo redo | link unlink image code | insertdatetime preview | forecolor backcolor",
    menubar: false,
    autoresize_on_init: true,
    statusbar: false,
    paste_data_images: true,
    images_upload_handler: function (blobInfo, success, failure) {
      // no upload, just return the blobInfo.blob() as base64 data
      success("data:" + blobInfo.blob().type + ";base64," + blobInfo.base64());
    }
  };

  constructor(
    private persistenceService: PersistenceService,
    private translateService: TranslateService,
    private sigaServices: SigaServices
  ) { }

  ngOnInit() {
    this.progressSpinner = false;

    if (sessionStorage.getItem("tinyApiKey") != null) {
      this.apiKey = sessionStorage.getItem("tinyApiKey");
    }
  
    this.progressSpinner = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.bodyInicial) {
      this.restablecer();
    }
  }

  // Dehabilitar guardado cuando no cambien los campos
  deshabilitarGuardado(): boolean {
    return this.body.observaciones == this.bodyInicial.observaciones || (this.body.observaciones == undefined || this.body.observaciones.trim().length == 0) && (this.bodyInicial.observaciones == undefined || this.bodyInicial.observaciones.trim().length == 0);
  }

  // Restablecer

  restablecer(): void {
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));
  }


  // Guadar

  save(): void {
    this.guardadoSend.emit(this.body);
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

  esFichaActiva(): boolean {
    return this.openTarjetaObservaciones;// this.fichaPosible.activa;
  }

  abreCierraFicha(key): void {
    this.openTarjetaObservaciones = !this.openTarjetaObservaciones;
    this.opened.emit(this.openTarjetaObservaciones);
    this.idOpened.emit(key);
  }

}
