import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Message } from 'primeng/primeng';
import { TranslateService } from '../../../../../../commons/translate';
import { FacturasItem } from '../../../../../../models/FacturasItem';
import { CommonsService } from '../../../../../../_services/commons.service';
import { SigaServices } from '../../../../../../_services/siga.service';

@Component({
  selector: 'app-observaciones-abonos-sjcs',
  templateUrl: './observaciones-abonos-sjcs.component.html',
  styleUrls: ['./observaciones-abonos-sjcs.component.scss']
})
export class ObservacionesAbonosSJCSComponent implements OnInit, OnChanges {

  msgs: Message[] = [];
  progressSpinner: boolean = false;

  @Input() bodyInicial: FacturasItem;
  body: FacturasItem= new FacturasItem();
  openFicha:boolean = false;
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

  constructor(  private translateService: TranslateService,private sigaServices: SigaServices,
    private commonsService: CommonsService,) { }

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
    if(this.bodyInicial != undefined ){
      this.body = JSON.parse(JSON.stringify(this.bodyInicial));
    }
    if (this.body.motivosAbono == undefined) this.body.motivosAbono = "";
    if (this.body.observacionesAbono == undefined) this.body.observacionesAbono = "";
  }

  // Dehabilitar guardado cuando no cambien los campos
  deshabilitarGuardado(): boolean {
    return this.notChangedString(this.body.motivosAbono, this.bodyInicial.motivosAbono)
      && this.notChangedString(this.body.observacionesAbono, this.bodyInicial.observacionesAbono);
  }

  notChangedString(value1: string, value2: string): boolean {
    return value1 == value2 || (value1 == undefined || value1.trim().length == 0) && (value2 == undefined || value2.trim().length == 0);
  }

   

  // Guardar

  save(): void {
    if (!this.deshabilitarGuardado()) {
      this.guardadoSend(this.body)
    }
  }

  // Abrir y cerrar la ficha

  abreCierraFicha(): void {
    this.openFicha = !this.openFicha;
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

  guardadoSend(event: FacturasItem): void {
    this.progressSpinner = true;

    this.sigaServices.post("facturacionPyS_guardaDatosFactura", event).toPromise().then(
      n => { 

        if(n.status == 200)
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("Actualizado Correctamente"));

      }, err => { 
        return Promise.reject(this.translateService.instant("general.mensaje.error.bbdd"));
      }
    ) .catch(error => {
      if (error != undefined) {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), error);
      } else {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    }).then(() => this.progressSpinner = false);
  }

  

}
