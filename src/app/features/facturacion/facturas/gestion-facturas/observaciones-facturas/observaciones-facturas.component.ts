import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Message } from 'primeng/primeng';
import { FacturasItem } from '../../../../../models/FacturasItem';

@Component({
  selector: 'app-observaciones-facturas',
  templateUrl: './observaciones-facturas.component.html',
  styleUrls: ['./observaciones-facturas.component.scss']
})
export class ObservacionesFacturasComponent implements OnInit {

  msgs: Message[] = [];
  progressSpinner: boolean = false;

  @Input() openTarjetaObservaciones;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Output() guardadoSend = new EventEmitter<FacturasItem>();
  
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

  constructor() { }

  ngOnInit() {
    this.progressSpinner = false;

    if (sessionStorage.getItem("tinyApiKey") != null) {
      this.apiKey = sessionStorage.getItem("tinyApiKey");
    }
  
    this.progressSpinner = false;
  }

  // Abrir y cerrar la ficha

  esFichaActiva(): boolean {
    return this.openTarjetaObservaciones;
  }

  abreCierraFicha(key): void {
    this.openTarjetaObservaciones = !this.openTarjetaObservaciones;
    this.opened.emit(this.openTarjetaObservaciones);
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
