import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Message } from 'primeng/primeng';
import { FacturasItem } from '../../../../../models/FacturasItem';

@Component({
  selector: 'app-observaciones-rectificativa-facturas',
  templateUrl: './observaciones-rectificativa-facturas.component.html',
  styleUrls: ['./observaciones-rectificativa-facturas.component.scss']
})
export class ObservacionesRectificativaFacturasComponent implements OnInit, OnChanges {

  msgs: Message[] = [];
  progressSpinner: boolean = false;

  @Input() openTarjetaObservacionesRectificativa;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Output() guardadoSend = new EventEmitter<FacturasItem>();

  @Input() bodyInicial: FacturasItem;
  body: FacturasItem;
  
  apiKey: string = "";
  editorConfig1: any = {
    selector: "#motivosAbono",
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
  editorConfig2: any = {
    selector: "#observacionesAbono",
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

  constructor() { }

  ngOnInit() {
    this.progressSpinner = true;

    if (sessionStorage.getItem("tinyApiKey") != null) {
      this.apiKey = sessionStorage.getItem("tinyApiKey");
    }
  
    this.progressSpinner = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.bodyInicial != undefined)
      this.restablecer();
  }

  // Restablecer

  restablecer(): void {
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));
  }

  // Guardar

  save(): void {
    this.guardadoSend.emit(this.body);
  }

  // Abrir y cerrar la ficha

  esFichaActiva(): boolean {
    return this.openTarjetaObservacionesRectificativa;
  }

  abreCierraFicha(key): void {
    this.openTarjetaObservacionesRectificativa = !this.openTarjetaObservacionesRectificativa;
    this.opened.emit(this.openTarjetaObservacionesRectificativa);
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
