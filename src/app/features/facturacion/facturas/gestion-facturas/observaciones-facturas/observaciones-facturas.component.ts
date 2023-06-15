import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Message } from 'primeng/primeng';
import { FacturasItem } from '../../../../../models/FacturasItem';
import { procesos_facturacionPyS } from '../../../../../permisos/procesos_facturacionPyS';
import { SigaStorageService } from '../../../../../siga-storage.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-observaciones-facturas',
  templateUrl: './observaciones-facturas.component.html',
  styleUrls: ['./observaciones-facturas.component.scss']
})
export class ObservacionesFacturasComponent implements OnInit, OnChanges {

  msgs: Message[] = [];
  progressSpinner: boolean = false;

  @Input() openTarjetaObservaciones;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Output() guardadoSend = new EventEmitter<FacturasItem>();

  @Input() bodyInicial: FacturasItem;
  body: FacturasItem = new FacturasItem();
  
  apiKey: string = "";
  editorConfig1: any = {
    selector: "#observacionesFactura",
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
    selector: "#observacionesFicheroFactura",
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

  permisoEscritura: boolean = false;

  constructor(
    private localStorageService : SigaStorageService, private commonsService: CommonsService
  ) { }

  async ngOnInit() {
    this.progressSpinner = true;

    if (this.localStorageService.isLetrado)
      this.permisoEscritura = false;
    else
      await this.getPermisoFacturas();

    if (sessionStorage.getItem("tinyApiKey") != null) {
      this.apiKey = sessionStorage.getItem("tinyApiKey");
    }

    console.log(this.permisoEscritura)
  
    this.progressSpinner = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.bodyInicial != undefined)
      this.restablecer();
  }

  async getPermisoFacturas() {
    await this.commonsService
      .checkAcceso(procesos_facturacionPyS.facturasTarjetaObservaciones)
      .then((respuesta) => {
        this.permisoEscritura = respuesta;
      })
      .catch((error) => console.error(error));
  }

  // Restablecer

  restablecer(): void {
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));
    if (!this.body.observacionesFactura) this.body.observacionesFactura = "";
    if (!this.body.observacionesFicheroFactura) this.body.observacionesFicheroFactura = "";
  }

  // Dehabilitar guardado cuando no cambien los campos
  deshabilitarGuardado(): boolean {
    return this.notChangedString(this.body.observacionesFactura, this.bodyInicial.observacionesFactura)
      && this.notChangedString(this.body.observacionesFicheroFactura, this.bodyInicial.observacionesFicheroFactura);
  }

  notChangedString(value1: string, value2: string): boolean {
    return value1 == value2 || (value1 == undefined || value1.trim().length == 0) && (value2 == undefined || value2.trim().length == 0);
  }

  // Guardar

  save(): void {
    if (this.permisoEscritura && !this.deshabilitarGuardado()) {
      this.guardadoSend.emit(this.body);
    }
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
