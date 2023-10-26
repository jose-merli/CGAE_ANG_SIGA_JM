import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Actuacion, Col } from '../../detalle-tarjeta-actuaciones-designa.component';
import { SigaServices } from '../../../../../../../../_services/siga.service';
import { Message } from 'primeng/components/common/api';
import { TranslateService } from '../../../../../../../../commons/translate/translation.service';
import { DatePipe } from '@angular/common';
import { saveAs } from "file-saver/FileSaver";
import { UsuarioLogado } from '../ficha-actuacion.component';
import { ParametroRequestDto } from '../../../../../../../../models/ParametroRequestDto';
import { SigaStorageService } from '../../../../../../../../siga-storage.service';
import { ParametroItem } from '../../../../../../../../models/ParametroItem';
import { DocumentoDesignaItem } from '../../../../../../../../models/sjcs/DocumentoDesignaItem';
import { CommonsService } from '../../../../../../../../_services/commons.service';
import { procesos_oficio } from '../../../../../../../../permisos/procesos_oficio';
import { Router } from '@angular/router';
import { TurnosItem } from '../../../../../../../../models/sjcs/TurnosItem';

export class Documento extends DocumentoDesignaItem {
  file: File;
  nuevo: boolean = false;
  extension: string;
  asociado: string;
}

@Component({
  selector: 'app-tarjeta-doc-ficha-act',
  templateUrl: './tarjeta-doc-ficha-act.component.html',
  styleUrls: ['./tarjeta-doc-ficha-act.component.scss']
})
export class TarjetaDocFichaActComponent implements OnInit, OnChanges {

  @Input() documentos: DocumentoDesignaItem[];
  @Input() actuacionDesigna: Actuacion;
  @Input() usuarioLogado: UsuarioLogado;
  @Input() isColegiado;
  @Input() isAnulada;
  // Este modo lectura se produce cuando:
  // - Es colegiado y la actuación está validada y el turno no permite la modificación o la actuación no pertenece al colegiado
  // - La actuación está facturada
  modoLectura2 : boolean = false;
  permiteTurno : boolean = false;

  @Output() buscarDocumentosEvent = new EventEmitter<any>();

  modoLectura: boolean;
  permiteSubidDescargaFicheros: boolean;

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
    private changeDetectorRef: ChangeDetectorRef,
    private sigaStorageService: SigaStorageService,
    private commonsService: CommonsService,
    private router: Router
  ) { }

  ngOnInit() {

    this.commonsService.checkAcceso(procesos_oficio.designaTarjetaActuacionesDocumentacion)
      .then(respuesta => {
        let permisoEscritura = respuesta;

        if (permisoEscritura == undefined) {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
          this.router.navigate(["/errorAcceso"]);
        }else if (permisoEscritura == false) {
          this.modoLectura = true;
        }else{
          this.modoLectura = false;
        }

        this.getParametro();

      }
      ).catch(error => console.error(error));

      this.getPermiteTurno();

  }

  getPermiteTurno() {

    this.progressSpinner = true;

    let turnoItem = new TurnosItem();
    turnoItem.idturno = this.actuacionDesigna.designaItem.idTurno;

    this.sigaServices.post("turnos_busquedaFichaTurnos", turnoItem).subscribe(
      data => {
        let resp: TurnosItem = JSON.parse(data.body).turnosItem[0];
        this.permiteTurno = resp.letradoactuaciones == "1";
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
        this.cargaInicial();
      }
    );

  }
  cargaInicial() {
    if ((!this.isColegiado && this.actuacionDesigna.actuacion.validada && (!this.permiteTurno || !this.actuacionDesigna.actuacion.permiteModificacion)) || (this.actuacionDesigna.actuacion.facturado)) {
      this.modoLectura2 = true;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.documentos && changes.documentos.currentValue) {
      this.selectedDatos = [];
      this.numSelected = 0;
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

      let error = false;

      let copiaDocumentos2: Documento[] = this.documentos2.slice();

       copiaDocumentos2.forEach((el, i) => {

        if (!el.nuevo && this.isColegiado == true && !(this.usuarioLogado.idPersona == el.idPersona)) {
          copiaDocumentos2.splice(i, 1);
          error = true;
        }

      }); 

      if (error) {
        this.showMsg('info', this.translateService.instant("general.message.informacion"), 'Alguno de los registros no puedo ser editado porque no es usted su creador');
      }

      this.progressSpinner = true;

      this.sigaServices.postSendFileAndActuacion("designacion_subirDocumentoDesigna", copiaDocumentos2, this.actuacionDesigna.actuacion).subscribe(
        data => {

          let resp = data;

          if (resp.status == 'KO') {
            if (resp.error != null && resp.error.description != null && resp.error.description != '') {
              this.showMsg('error', 'Error', this.translateService.instant(resp.error.description));
            } else {
              this.showMsg('error', 'Error', this.translateService.instant('general.message.error.realiza.accion'));
            }
          } else if (resp.status == 'OK') {
            this.progressSpinner = false;
            this.showMsg('success', this.translateService.instant('general.message.correct'), this.translateService.instant('general.message.accion.realizada'));
            this.selectedDatos = [];
            this.buscarDocumentosEvent.emit();
          }

        },
        err => {
          //console.log(err);
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
    doc.fechaEntrada = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
    doc.asociado = `${this.actuacionDesigna.actuacion.numeroAsunto} ${this.actuacionDesigna.actuacion.acreditacion} ${this.actuacionDesigna.actuacion.modulo}`;
    doc.anio = this.actuacionDesigna.actuacion.anio;
    doc.numero = this.actuacionDesigna.actuacion.numero;
    doc.idTurno = this.actuacionDesigna.actuacion.idTurno;
    doc.idActuacion = this.actuacionDesigna.actuacion.numeroAsunto;

    this.documentos2.unshift(doc);
  }

  hayErrorCamposObligatorios() {

    this.progressSpinner = true;

    let error = false;

    let elementosNuevos: Documento[] = this.documentos2.filter(el => el.nuevo);

    elementosNuevos.forEach(el => {

      if (el.file == undefined || el.file == null) {
        error = true;
        this.showMsg('error', 'Error', this.translateService.instant('general.boton.adjuntarFichero'));
      }

    });

    this.progressSpinner = false;

    return error;
  }

  descargarArchivos() {

    this.progressSpinner = true;

    this.sigaServices.postDownloadFiles("designacion_descargarDocumentosDesigna", this.selectedDatos).subscribe(
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
        //console.log(err);
      },
      () => {
        this.progressSpinner = false;
        this.selectedDatos = [];
      }
    );

  }

  eliminarArchivos() {

    let error = false;
    this.selectedDatos.forEach((el, i) => {

      if (this.isColegiado == true && !(this.usuarioLogado.idPersona == el.idPersona)) {
        this.selectedDatos.splice(i, 1);
        error = true;
      }

    });

    if (error) {
      this.showMsg('info', this.translateService.instant("general.message.informacion"), 'Alguno de los registros no puedo ser eliminado porque no es usted su creador');
    }

    this.progressSpinner = true;

    this.sigaServices.post("designacion_eliminarDocumentosDesigna", this.selectedDatos).subscribe(
      data => {
        let resp = JSON.parse(data.body);

        if (resp.status == 'KO') {
          if (resp.error != null && resp.error.description != null && resp.error.description != '') {
            this.showMsg('error', 'Error', this.translateService.instant(resp.error.description));
          } else {
            this.showMsg('error', 'Error', this.translateService.instant('general.message.error.realiza.accion'));
          }
        } else if (resp.status == 'OK') {
          this.progressSpinner = false;
          this.showMsg('success', this.translateService.instant('general.message.correct'), this.translateService.instant('general.message.accion.realizada'));
          this.selectedDatos = [];
          this.buscarDocumentosEvent.emit();
        }

      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
        this.showMsg('error', 'Error', this.translateService.instant('general.mensaje.error.bbdd'));
      },
      () => {
        this.progressSpinner = false;
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

      doc.idDocumentaciondes = el.idDocumentaciondes;
      doc.idTipodocumento = el.idTipodocumento;
      doc.nombreTipoDocumento = el.nombreTipoDocumento;
      doc.idFichero = el.idFichero;
      doc.idInstitucion = el.idInstitucion;
      doc.usuModificacion = el.usuModificacion;
      doc.fechaModificacion = el.fechaModificacion;
      doc.fechaEntrada = this.datePipe.transform(new Date(el.fechaEntrada), 'dd/MM/yyyy');
      doc.anio = el.anio;
      doc.numero = el.numero;
      doc.idTurno = el.idTurno;
      doc.idActuacion = el.idActuacion;
      doc.observaciones = el.observaciones;
      doc.nombreFichero = el.nombreFichero;
      doc.file = null;
      doc.nuevo = false;
      doc.asociado = `${this.actuacionDesigna.actuacion.numeroAsunto} ${this.actuacionDesigna.actuacion.acreditacion} ${this.actuacionDesigna.actuacion.modulo}`;

      if (el.nombreFichero != null && el.nombreFichero != '') {
        doc.extension = el.nombreFichero.substring(el.nombreFichero.lastIndexOf("."), el.nombreFichero.length);
      }
      
      doc.idPersona = el.idPersona;
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

  getParametro() {
    this.progressSpinner = true;

    let parametro = {
      valor: "ACTIVAR_SUBIDA_JUSTIFICACION_DESIGNA"
    };

    this.sigaServices
      .post("busquedaPerJuridica_parametroColegio", parametro)
      .subscribe(
        data => {
          if (JSON.parse(data.body).parametro == "1"){
            this.permiteSubidDescargaFicheros = true;
          }
          else{
            this.permiteSubidDescargaFicheros = false;
          }
      });
    
  }

}