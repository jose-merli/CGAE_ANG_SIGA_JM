import { Component, Input, OnInit } from '@angular/core';
import { SerieFacturacionItem } from '../../../../../models/SerieFacturacionItem';
import { PersistenceService } from '../../../../../_services/persistence.service';

@Component({
  selector: 'app-observaciones-series-factura',
  templateUrl: './observaciones-series-factura.component.html',
  styleUrls: ['./observaciones-series-factura.component.scss']
})
export class ObservacionesSeriesFacturaComponent implements OnInit {

  msgs;
  progressSpinner: boolean = false;

  @Input() datos: SerieFacturacionItem;
  @Input() tarjetaDatosGenerales: string;
  @Input() openTarjetaDatosGenerales;

  bodyInicial: SerieFacturacionItem;
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
    private persistenceService: PersistenceService
  ) { }

  ngOnInit() {
    this.progressSpinner = false;

    if (sessionStorage.getItem("tinyApiKey") != null) {
      this.apiKey = sessionStorage.getItem("tinyApiKey");
    }
    
    if (this.persistenceService.getDatos()) {
      this.body = this.persistenceService.getDatos();
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));
    }

    this.progressSpinner = false;
  }

  // Restablecer

  restablecer(): void {
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));
  }

  esFichaActiva(): boolean {
    return true;// this.fichaPosible.activa;
  }

}
