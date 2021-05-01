import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Actuacion, Col } from '../../detalle-tarjeta-actuaciones-designa.component';
import { SigaServices } from '../../../../../../../../_services/siga.service';
import { Message } from 'primeng/components/common/api';
import { TranslateService } from '../../../../../../../../commons/translate/translation.service';
import { DocumentoActDesignaItem } from '../../../../../../../../models/sjcs/DocumentoActDesignaItem';
import { DatePipe } from '@angular/common';
import { saveAs } from "file-saver/FileSaver";

export class Documento extends DocumentoActDesignaItem {
  file: File;
  nuevo: boolean = false;
  extension: string;
}

@Component({
  selector: 'app-tarjeta-doc-ficha-act',
  templateUrl: './tarjeta-doc-ficha-act.component.html',
  styleUrls: ['./tarjeta-doc-ficha-act.component.scss']
})
export class TarjetaDocFichaActComponent implements OnInit, OnChanges {

  @Input() documentos: DocumentoActDesignaItem[];
  @Input() actuacionDesigna: Actuacion;
  @Output() buscarDocumentosEvent = new EventEmitter<any>();
  documentos2: Documento[];
  cols: Col[] = [
    {
      field: 'fechaEntrada',
      header: 'Fecha',
      width: '20%'
    },
    {
      field: 'asociado',
      header: 'Asociado',
      width: '20%'
    },
    {
      field: 'nombreTipoDocumento',
      header: 'Tipo documentación',
      width: '20%'
    },
    {
      field: 'nombreFichero',
      header: 'Nombre',
      width: '20%'
    },
    {
      field: 'observaciones',
      header: 'Observaciones',
      width: '20%'
    }
  ];

  rowsPerPage = [
    {
      label: 10,
      value: 10
    },
    {
      label: 20,
      value: 20
    },
    {
      label: 30,
      value: 30
    },
    {
      label: 40,
      value: 40
    }
  ];

  progressSpinner: boolean = false;
  msgs: Message[] = [];
  selectedItem: number = 10;
  selectedDatos: any = [];
  selectAll: boolean = false;
  selectionMode: string = "multiple";
  numSelected = 0;
  @ViewChild("table") tabla;

  constructor(
    private sigaServices: SigaServices,
    private translateService: TranslateService,
    private datePipe: DatePipe,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.convertObject();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.documentos && changes.documentos.currentValue) {
      this.convertObject();
    }
  }

  getFile(dato: Documento, pUploadFile: any, event: any) {

    let fileList: FileList = event.files;
    let nombreCompletoArchivo = fileList[0].name;
    dato.file = fileList[0];
    pUploadFile.chooseLabel = nombreCompletoArchivo;
  }

  uploadFile() {

    if (!this.hayErrorCamposObligatorios()) {

      this.progressSpinner = true;

      this.sigaServices.postSendFileAndActuacion("actuaciones_designacion_subirDocumentoActDesigna", this.documentos2, this.actuacionDesigna.actuacion).subscribe(
        data => {

          let resp = data;

          if (resp.status == 'KO') {
            if (resp.error != null && resp.error.description != null && resp.error.description != '') {
              this.showMsg('error', 'Error', this.translateService.instant(resp.error.description));
            } else {
              this.showMsg('error', 'Error', this.translateService.instant('general.message.error.realiza.accion'));
            }
          } else if (resp.status == 'OK') {
            this.showMsg('success', this.translateService.instant('general.message.correct'), this.translateService.instant('general.message.accion.realizada'));
            this.buscarDocumentosEvent.emit();
          }

        },
        err => {
          console.log(err);
          this.progressSpinner = false;
          this.showMsg('error', 'Error', this.translateService.instant('general.mensaje.error.bbdd'));
        },
        () => {
          this.progressSpinner = false;
        }
      );
    }
  }

  nuevo() {

    let doc = new Documento();

    doc.file = null;
    doc.nuevo = true;
    doc.nombreTipoDocumento = 'Justificante Actuacion';
    doc.asociado = `${this.actuacionDesigna.actuacion.numeroAsunto} ${this.actuacionDesigna.actuacion.acreditacion} ${this.actuacionDesigna.actuacion.modulo}`;
    doc.anio = this.actuacionDesigna.actuacion.anio;
    doc.numero = this.actuacionDesigna.actuacion.numero;
    doc.idActuacion = this.actuacionDesigna.actuacion.numeroAsunto;

    this.documentos2.unshift(doc);
  }

  hayErrorCamposObligatorios() {
    let error = false;

    let elementosNuevos: Documento[] = this.documentos2.filter(el => el.nuevo);

    elementosNuevos.forEach(el => {

      if (el.file == undefined || el.file == null) {
        error = true;
        this.showMsg('error', 'Error', this.translateService.instant('general.boton.adjuntarFichero'));
      }

    });

    return error;
  }

  descargarArchivos() {

    this.progressSpinner = true;

    this.sigaServices.postDownloadFiles("actuaciones_designacion_descargarDocumentosActDesigna", this.selectedDatos).subscribe(
      data => {

        let blob = null;

        if (this.selectedDatos.length == 1) {

          let mime = this.getMimeType(this.selectedDatos[0].extension);
          blob = new Blob([data], { type: mime });
          saveAs(blob, this.selectedDatos[0].nombreFichero);
        } else {

          blob = new Blob([data], { type: "application/zip" });
          saveAs(blob, "documentos.zip");
        }
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      },
      () => {
        this.progressSpinner = false;
        this.selectedDatos = [];
      }
    );

  }

  showMsg(severity, summary, detail) {
    this.msgs = [];
    this.msgs.push({
      severity,
      summary,
      detail
    });
  }

  clear() {
    this.msgs = [];
  }

  convertObject() {

    this.documentos2 = [];

    this.documentos.forEach(el => {
      let doc = new Documento();

      doc.idDocumentacionasi = el.idDocumentacionasi;
      doc.idTipoDocumento = el.idTipoDocumento;
      doc.nombreTipoDocumento = el.nombreTipoDocumento;
      doc.idFichero = el.idFichero;
      doc.idInstitucion = el.idInstitucion;
      doc.usuModificacion = el.usuModificacion;
      doc.fechaModificacion = el.fechaModificacion;
      doc.fechaEntrada = this.datePipe.transform(new Date(el.fechaEntrada), 'dd/MM/yyyy');
      doc.anio = el.anio;
      doc.numero = el.numero;
      doc.idActuacion = el.idActuacion;
      doc.observaciones = el.observaciones;
      doc.nombreFichero = el.nombreFichero;
      doc.asociado = el.asociado;
      doc.file = null;
      doc.nuevo = false;
      doc.asociado = `${this.actuacionDesigna.actuacion.numeroAsunto} ${this.actuacionDesigna.actuacion.acreditacion} ${this.actuacionDesigna.actuacion.modulo}`;
      doc.extension = el.nombreFichero.substring(el.nombreFichero.lastIndexOf("."), el.nombreFichero.length);
      this.documentos2.push(doc);
    });
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.tabla.reset();
  }

  actualizaSeleccionados(event) {

    if (event.data.nuevo) {
      this.selectedDatos.pop();
    }

    if (this.selectedDatos == undefined) {
      this.selectedDatos = []
    }
    if (this.selectedDatos != undefined) {
      if (this.selectedDatos.length == undefined) this.numSelected = 1;
      else this.numSelected = this.selectedDatos.length;
    }
  }

  onChangeSelectAll() {
    if (this.selectAll === true) {
      this.selectedDatos = this.documentos2;
      this.numSelected = this.documentos2.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  getMimeType(extension: string): string {

    let mime: string = "";

    switch (extension.toLowerCase()) {

      case "doc":
        mime = "application/msword";
        break;
      case "docx":
        mime = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        break;
      case "pdf":
        mime = "application/pdf";
        break;
      case "jpg":
        mime = "image/jpeg";
        break;
      case "png":
        mime = "image/png";
        break;
      case "rtf":
        mime = "application/rtf";
        break;
      case "txt":
        mime = "text/plain";
        break;
    }

    return mime;
  }

}