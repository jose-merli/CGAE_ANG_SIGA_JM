import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ConfirmationService, Message } from 'primeng/api';
import { DataTable } from 'primeng/primeng';
import { TranslateService } from '../../../../../../commons/translate';
import { DocumentacionAsistenciaItem } from '../../../../../../models/guardia/DocumentacionAsistenciaItem';
import { CommonsService } from '../../../../../../_services/commons.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { saveAs } from "file-saver/FileSaver";
import { SigaStorageService } from '../../../../../../siga-storage.service';

@Component({
  selector: 'app-ficha-asistencia-tarjeta-documentacion',
  templateUrl: './ficha-asistencia-tarjeta-documentacion.component.html',
  styleUrls: ['./ficha-asistencia-tarjeta-documentacion.component.scss']
})
export class FichaAsistenciaTarjetaDocumentacionComponent implements OnInit, OnChanges {

  msgs: Message[] = [];
  @Input() modoLectura: boolean;
  @Input() idAsistencia: string;
  @Input() editable: boolean;
  @Output() refreshTarjetas = new EventEmitter<string>();
  rows: number = 10;
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
  columnas = [
  ];

  seleccionMultiple: boolean = false;
  seleccionarTodo: boolean = false;
  progressSpinner: boolean = false;
  numSeleccionado: number = 0;
  selectedDatos: DocumentacionAsistenciaItem[] = [];
  selectedDatosPadre: DocumentacionAsistenciaItem[] = [];
  documentaciones: DocumentacionAsistenciaItem[] = [];
  disableDelete: boolean = true;
  comboTipoDoc = [];
  comboAsociado = [];
  isLetrado: boolean;
  idPersonaUsuario: string;

  @ViewChild("table") table: DataTable;
  constructor(private changeDetectorRef: ChangeDetectorRef,
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private commonServices: CommonsService,
    private datePipe: DatePipe,
    private confirmationService: ConfirmationService,
    private sigaStorageService: SigaStorageService) { }


  ngOnInit() {
    this.isLetrado = this.sigaStorageService.isLetrado;
    this.idPersonaUsuario = this.sigaStorageService.idPersona;
    this.getComboTipoDoc();
    if (this.idAsistencia) {
      this.getDocumentacion();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.idAsistencia) { //En caso de que el valor del idAsistencia cambie si ya está inicializado el componente
      this.getComboAsociado();
    }
  }

  getDocumentacion() {

    this.progressSpinner = true;
    this.sigaServices.getParam("busquedaGuardias_searchDocumentacion", "?anioNumero=" + this.idAsistencia).subscribe(
      n => {
        this.documentaciones = n.documentacionAsistenciaItems;
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      }, () => {
        this.progressSpinner = false;
      }
    );
  }

  getComboTipoDoc() {

    this.sigaServices.get("combo_comboTipoDocAsistencia").subscribe(
      n => {
        this.comboTipoDoc = n.combooItems;
      },
      err => {
        //console.log(err);

      }, () => {
        this.commonServices.arregloTildesCombo(this.comboTipoDoc);
      }
    );

  }
  getComboAsociado() {
    if (this.idAsistencia) {
      this.comboAsociado.push({
        label: 'Asistencia',
        value: '0'
      });
      //Llamada servicio
      this.sigaServices.getParam("combo_comboAsociadoAsistencia", "?anioNumero=" + this.idAsistencia).subscribe(
        n => {
          let comboItems: any[] = n.combooItems;
          if (comboItems) {
            comboItems.forEach(comboItem => {
              this.comboAsociado.push(comboItem);
            });
          }
        },
        err => {
          //console.log(err);

        }, () => {
          this.commonServices.arregloTildesCombo(this.comboAsociado);
        }
      );
    }
  }

  save() {

    if (this.isLetrado && this.documentaciones.find(documento => !documento.nuevoRegistro && documento.idPersona != this.idPersonaUsuario)) {
      this.showMsg('error', 'Error', 'No puede editar documentación de la que usted no es su creador');
      this.progressSpinner = false;
    } else {

      this.progressSpinner = true;
      this.sigaServices.postSendFileAndIdAsistencia("busquedaGuardias_subirDocumentoAsistencia", this.documentaciones, this.idAsistencia).subscribe(
        n => {
          this.progressSpinner = false;
          let result = n;
          if (result.error) {
            this.showMsg('error', this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.errorguardar"), result.error.description);
          } else {
            this.showMsg('success', this.translateService.instant("general.message.accion.realizada"), '');
            this.getDocumentacion();
            this.refreshTarjetas.emit(result.id);
          }
        },
        err => {
          //console.log(err);
          this.progressSpinner = false;
        }, () => {
          this.commonServices.arregloTildesCombo(this.comboAsociado);
          this.progressSpinner = false;
        }
      );
    }

  }

  delete() {
    this.confirmationService.confirm({
      key: "confirmEliminar",
      message: this.translateService.instant("informesycomunicaciones.comunicaciones.mensaje.seguroEliminarDocumentos"),
      icon: "fa fa-question-circle",
      accept: () => { this.executeDelete(); },
      reject: () => { this.showMsg('info', "Cancelado", this.translateService.instant("general.message.accion.cancelada")); }
    });
  }

  executeDelete() {

    this.progressSpinner = true;
    let documentos: DocumentacionAsistenciaItem[] = [];
    if (Array.isArray(this.selectedDatos)) {
      documentos = this.selectedDatos;
    } else {
      documentos.push(this.selectedDatos);
    }

    if (this.isLetrado && documentos.find(documento => documento.idPersona != this.idPersonaUsuario)) {
      this.showMsg('error', 'Error', 'No puede borrar documentos de los que usted no es su creador');
      this.progressSpinner = false;
    } else {
      this.sigaServices
        .postPaginado("busquedaGuardias_eliminarDocumentoAsistencia", "?anioNumero=" + this.idAsistencia, documentos)
        .subscribe(
          n => {
            let result = n;
            if (result.error) {
              this.showMsg('error', this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.errorguardar"), result.error.description);
            } else {
              this.showMsg('success', this.translateService.instant("general.message.accion.realizada"), '');
              this.getDocumentacion();
              this.refreshTarjetas.emit(this.idAsistencia);
              this.disableDelete = true;
            }
          },
          err => {
            //console.log(err);
            this.progressSpinner = false;
          },
          () => {
            this.progressSpinner = false;
          }
        );
    }

  }

  download() {

    this.progressSpinner = true;
    let documentos: DocumentacionAsistenciaItem[] = [];
    if (Array.isArray(this.selectedDatos)) {
      documentos = this.selectedDatos;
    } else {
      documentos.push(this.selectedDatos);
    }

    this.sigaServices
      .postDownloadFiles("busquedaGuardias_descargarDocumentosAsistencia", documentos)
      .subscribe(
        data => {
          let blob = null;

          if (data.size == 0) { //Si size es 0 es que no trae nada
            this.showMsg('error', 'Error al descargar el documento', 'No se ha encontrado el documento indicado');
          } else if (documentos.length == 1) {

            let nombreFichero = documentos[0].nombreFichero;
            if (!nombreFichero) {
              nombreFichero = "default.pdf";
            }
            let mime = this.getMimeType(nombreFichero.substring(nombreFichero.lastIndexOf("."), nombreFichero.length));
            blob = new Blob([data], { type: mime });
            saveAs(blob, documentos[0].nombreFichero);
          } else {

            blob = new Blob([data], { type: "application/zip" });
            saveAs(blob, "documentos.zip");
          }
          this.selectedDatos = [];
          this.numSeleccionado = 0;
          this.progressSpinner = false;
          this.disableDelete = true;
        },
        err => {
          //console.log(err);
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        }
      );

  }

  isDatosObligatoriosRellenos() {

    let ok: boolean = true;

    if (this.documentaciones) {
      let nuevosDocumentos: DocumentacionAsistenciaItem[] = this.documentaciones.filter(documento => documento.nuevoRegistro);

      if (nuevosDocumentos) { //Comprobamos si se han rellenado los dos combos
        ok = nuevosDocumentos.every(documento => documento.idTipoDoc != ''
          && documento.idTipoDoc != null
          && documento.idTipoDoc != undefined
          && documento.asociado != ''
          && documento.asociado != null
          && documento.asociado != undefined);
        if (!ok) {
          this.showMsg('error', this.translateService.instant('general.message.incorrect'), this.translateService.instant('general.message.camposObligatorios'));
        } else if (!nuevosDocumentos.every(documento => documento.nombreFichero != null
          && documento.nombreFichero != ''
          && documento.nombreFichero != undefined)) { //Comprobamos si se ha adjuntado fichero
          this.showMsg('error', 'Error', this.translateService.instant('general.boton.adjuntarFichero'));
          ok = false;
        }
      }
    }

    return ok;

  }

  validateSizeFile() {
    if (this.idAsistencia && this.documentaciones && this.isDatosObligatoriosRellenos()) {
      this.progressSpinner = true;
      let nuevoDocumento: DocumentacionAsistenciaItem = this.documentaciones.find(documento => documento.nuevoRegistro);
      if (nuevoDocumento) {
        let fileData: File = nuevoDocumento.fileData;
        this.sigaServices.get("plantillasDoc_sizeFichero")
          .subscribe(
            response => {
              let tam = response.combooItems[0].value;
              let tamBytes = tam * 1024 * 1024;
              if (fileData.size < tamBytes) {
                this.save();
              } else {
                this.showMsg('error', 'Error', this.translateService.instant("informesYcomunicaciones.modelosComunicaciones.plantillaDocumento.mensaje.error.cargarArchivo") + tam + " MB");
                this.progressSpinner = false;
              }
            });
      } else {
        this.save();
      }
    }
  }


  nuevoDoc() {

    let nuevoDoc: DocumentacionAsistenciaItem = new DocumentacionAsistenciaItem();
    nuevoDoc.nuevoRegistro = true;
    nuevoDoc.fechaEntrada = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
    nuevoDoc.asociado = '';
    nuevoDoc.descAsociado = '';
    nuevoDoc.idDocumentacion = '';
    nuevoDoc.nombreFichero = '';
    nuevoDoc.idFichero = '';
    nuevoDoc.idTipoDoc = '';
    nuevoDoc.observaciones = '';
    nuevoDoc.disableIdTipoDoc = false;

    this.documentaciones = [nuevoDoc, ...this.documentaciones];

  }

  getMimeType(extension: string): string {

    let mime: string = "";

    switch (extension.toLowerCase()) {

      case ".doc":
        mime = "application/msword";
        break;
      case ".docx":
        mime = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        break;
      case ".pdf":
        mime = "application/pdf";
        break;
      case ".jpg":
        mime = "image/jpeg";
        break;
      case ".png":
        mime = "image/png";
        break;
      case ".rtf":
        mime = "application/rtf";
        break;
      case ".txt":
        mime = "text/plain";
        break;
    }

    return mime;
  }

  getFile(dato: DocumentacionAsistenciaItem, pUploadFile: any, event: any) {
    let fileList: FileList = event.files;
    let nombreCompletoArchivo = fileList[0].name;
    dato.nombreFichero = fileList[0].name;
    dato.fileData = fileList[0];
    pUploadFile.chooseLabel = nombreCompletoArchivo;
  }

  onChangeAsociado(documento: DocumentacionAsistenciaItem) {
    if (documento.asociado
      && documento.asociado != '0') {

      documento.disableIdTipoDoc = true;
      documento.idTipoDoc = '2';

    } else {
      documento.disableIdTipoDoc = false;
      documento.idTipoDoc = '';
    }
  }

  onChangeRowsPerPages(event) {
    this.rows = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  onChangeSeleccionMultiple() {
    if (this.table.selectionMode == 'single') {
      this.table.selectionMode = 'multiple';
      this.seleccionMultiple = true;
    } else {
      this.table.selectionMode = 'single';
      this.seleccionMultiple = false;
    }
    this.selectedDatos = [];
    this.numSeleccionado = 0;
    this.disableDelete = true;
  }

  onChangeSeleccionarTodo() {
    if (this.seleccionarTodo) {
      this.selectedDatos = this.documentaciones;
      this.numSeleccionado = this.selectedDatos.length;
      this.disableDelete = false;
    } else {
      this.selectedDatos = [];
      this.numSeleccionado = 0;
      this.disableDelete = true;
    }
  }

  onSelectRow(documentacion: DocumentacionAsistenciaItem) {

    if(this.table.selectionMode == 'single'){
      this.numSeleccionado = 1;
    }else{
      this.numSeleccionado = this.selectedDatos.length;
    }
    this.disableDelete = false;


  }

  actualizaSeleccionados() {
    if (this.table.selectionMode == 'single') {
      this.numSeleccionado = 0;
      this.disableDelete = true;
    } else {
      this.numSeleccionado = this.selectedDatos.length;
      if (this.numSeleccionado <= 0) {
        this.disableDelete = true;
      }
    }
  }

  styleObligatorio(evento) {
    if ((evento == undefined || evento == null || evento == "")) {
      return this.commonServices.styleObligatorio(evento);
    }
  }

  clear() {
    this.msgs = [];
  }

  showMsg(severityParam: string, summaryParam: string, detailParam: string) {
    this.msgs = [];
    this.msgs.push({
      severity: severityParam,
      summary: summaryParam,
      detail: detailParam
    });
  }




}
