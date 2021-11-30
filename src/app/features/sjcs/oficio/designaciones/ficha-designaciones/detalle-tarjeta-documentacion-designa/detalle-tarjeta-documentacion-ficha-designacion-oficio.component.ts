import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild, OnChanges, ChangeDetectorRef } from '@angular/core';
import { Sort } from '@angular/material';
import { Message } from 'primeng/components/common/api';
import { DesignaItem } from '../../../../../../models/sjcs/DesignaItem';
import { DocumentoDesignaItem } from '../../../../../../models/sjcs/DocumentoDesignaItem';
import { CommonsService } from '../../../../../../_services/commons.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { Cell, Row, TablaResultadoMixDocDesigService } from './tabla-resultado-mix-doc-desig.service';
import { TranslateService } from '../../../../../../commons/translate/translation.service';
import { saveAs } from "file-saver/FileSaver";
import { SigaStorageService } from '../../../../../../siga-storage.service';
import { UsuarioLogado } from '../detalle-tarjeta-actuaciones-designa/ficha-actuacion/ficha-actuacion.component';
import { ActuacionDesignaItem } from '../../../../../../models/sjcs/ActuacionDesignaItem';
import { procesos_oficio } from '../../../../../../permisos/procesos_oficio';
import { Router } from '@angular/router';

interface Cabecera {
  id: string;
  name: string;
  width: string;
}
@Component({
  selector: 'app-detalle-tarjeta-documentacion-ficha-designacion-oficio',
  templateUrl: './detalle-tarjeta-documentacion-ficha-designacion-oficio.component.html',
  styleUrls: ['./detalle-tarjeta-documentacion-ficha-designacion-oficio.component.scss']
})
export class DetalleTarjetaDocumentacionFichaDesignacionOficioComponent implements OnInit, OnChanges {

  @Input() documentos: DocumentoDesignaItem[];
  @Input() campos: DesignaItem;
  @Input() isLetrado: boolean;
  @Input() actuacionesDesignaItems: ActuacionDesignaItem[];
  usuarioLogado: UsuarioLogado;
  @Output() buscarDocDesignaEvent = new EventEmitter<any>();
  @ViewChild('table') table: ElementRef;
  deseleccionarTodo: boolean = false;
  cabeceras: Cabecera[] = [
    {
      id: "fecha",
      name: "Fecha",
      width: '20%'
    },
    {
      id: "asociado",
      name: "Asociado",
      width: '20%'
    },
    {
      id: "tipoDoc",
      name: "Tipo documentación",
      width: '20%'
    },
    {
      id: "nombre",
      name: "Nombre",
      width: '20%'
    },
    {
      id: "observaciones",
      name: "Observaciones",
      width: '20%'
    }
  ];
  rowGroups: Row[];
  rowGroupsAux: Row[];
  totalRegistros = 0;
  progressSpinner: boolean = false;
  msgs: Message[] = [];
  selectedArray = [];
  from = 0;
  to = 10;
  numperPage = 10;
  searchText = [];
  numCabeceras = 0;
  numColumnas = 0;
  emptyResults: boolean = false;
  comboTipoDoc = [];
  textFilter: string = "Seleccionar";
  comboAsociado = [];
  modoLectura: boolean = false;

  constructor(
    private datepipe: DatePipe,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private trmDoc: TablaResultadoMixDocDesigService,
    private translateService: TranslateService,
    private cdRef: ChangeDetectorRef,
    private localStorageService: SigaStorageService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.commonsService.checkAcceso(procesos_oficio.designasDocumentacion)
      .then(respuesta => {
        let permisoEscritura = respuesta;

        if (permisoEscritura == undefined) {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
          this.router.navigate(["/errorAcceso"]);
        }

        if (!permisoEscritura) {
          this.modoLectura = true;
        }

        this.isLetrado = this.localStorageService.isLetrado;

        if (this.isLetrado) {
          this.usuarioLogado.idPersona = this.localStorageService.idPersona;
          this.usuarioLogado.numColegiado = this.localStorageService.numColegiado;
        }

        this.getComboAsociado();

        if (this.comboTipoDoc == undefined || this.comboTipoDoc == null || this.comboTipoDoc.length == 0) {
          this.getComboTiposDoc();
        }

      })
      .catch(err => //console.log(err));

  }

  cargaInicial() {
    if (this.documentos.length > 0) {
      this.jsonToRow();
    } else {
      this.jsonToRowEmptyResults();
    }
  }

  jsonToRow() {
    let arr = [];
    this.documentos.forEach((element, index) => {

      let obj = [
        { type: 'text', value: this.datepipe.transform(new Date(element.fechaEntrada), 'dd/MM/yyyy'), header: this.cabeceras[0].id, disabled: false },
        { type: 'text', value: element.idActuacion == null ? 'Designación' : this.comboAsociado.find(el => el.value == element.idActuacion).label, header: this.cabeceras[1].id, disabled: false },
        { type: 'text', value: this.comboTipoDoc.find(el => el.value == element.idTipodocumento).label, header: this.cabeceras[2].id, disabled: false },
        { type: 'text', value: element.nombreFichero, header: this.cabeceras[3].id, disabled: false },
        { type: 'textarea', value: element.observaciones, header: this.cabeceras[4].id, disabled: false },
        { type: 'invisible', value: false, header: 'nuevo', disabled: false },
        { type: 'invisible', value: element.idDocumentaciondes, header: 'idDocumentaciondes', disabled: false },
        { type: 'invisible', value: element.idFichero, header: 'idFichero', disabled: false },
        { type: 'invisible', value: element.idInstitucion, header: 'idInstitucion', disabled: false },
        { type: 'invisible', value: element.idTurno, header: 'idTurno', disabled: false },
        { type: 'invisible', value: element.anio, header: 'anio', disabled: false },
        { type: 'invisible', value: element.numero, header: 'numero', disabled: false },
        { type: 'invisible', value: element.idPersona, header: 'idPersona', disabled: false },
        { type: 'invisible', value: element.idActuacion, header: 'idActuacion', disabled: false },
      ];


      let superObj = {
        id: index,
        row: obj
      };

      arr.push(superObj);
    });

    this.rowGroups = [];
    this.rowGroups = this.trmDoc.getTableData(arr);
    this.rowGroupsAux = [];
    this.rowGroupsAux = this.trmDoc.getTableData(arr);
    this.totalRegistros = this.rowGroups.length;
  }

  jsonToRowEmptyResults() {
    this.emptyResults = true;
    let arr = [
      {
        id: 0,
        italic: false,
        row: [{ type: 'empty', value: 'No hay resultados' }]
      }
    ];

    this.rowGroups = [];
    this.rowGroups = this.trmDoc.getTableData(arr);
    this.rowGroupsAux = [];
    this.rowGroupsAux = this.trmDoc.getTableData(arr);
    this.totalRegistros = this.rowGroups.length;
  }


  selectedAll(event) {
    this.selectedArray = [];

    if (event) {

      this.rowGroups.forEach(row => {
        if (row.cells[5].value != null && !row.cells[5].value) {
          this.selectedArray.push(row.id);
        }
      });
    }

  }

  selectRow(rowId, cells) {

    // comprobamos que el registro no sea nuevo
    if (!this.emptyResults && cells[5].value != null && !cells[5].value) {
      if (this.selectedArray.includes(rowId)) {
        const i = this.selectedArray.indexOf(rowId);
        this.selectedArray.splice(i, 1);
      } else {
        this.selectedArray.push(rowId);
      }
    }
  }

  isSelected(id) {
    if (this.selectedArray.includes(id)) {
      return true;
    } else {
      return false;
    }
  }

  sortData(sort: Sort) {
    let data: Row[] = [];
    this.rowGroups = this.rowGroupsAux.filter((row) => {
      data.push(row);
    });
    data = data.slice();
    if (!sort.active || sort.direction === '') {
      this.rowGroups = data;
      return;
    }
    this.rowGroups = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      let resultado;
      for (let i = 0; i < a.cells.length; i++) {
        resultado = compare(a.cells[i].value, b.cells[i].value, isAsc);
      }
      return resultado;
    });
    this.rowGroupsAux = this.rowGroups;
    this.totalRegistros = this.rowGroups.length;

  }


  searchChange(j: any) {
    let isReturn = true;
    this.rowGroups = this.rowGroupsAux.filter((row) => {
      if (
        this.searchText[j] != " " &&
        this.searchText[j] != undefined &&
        !row.cells[j].value.toString().toLowerCase().includes(this.searchText[j].toLowerCase())
      ) {
        isReturn = false;
      } else {
        isReturn = true;
      }
      if (isReturn) {
        return row;
      }
    });
    this.totalRegistros = this.rowGroups.length;
  }

  getFile(dato, pUploadFile: any, event: any) {

    let fileList: FileList = event.files;
    let nombreCompletoArchivo = fileList[0].name;
    dato.value = fileList[0];
    pUploadFile.chooseLabel = nombreCompletoArchivo;
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

  isPar(numero): boolean {
    return numero % 2 === 0;
  }

  fromReg(event) {
    this.from = Number(event) - 1;
  }

  toReg(event) {
    this.to = Number(event);
  }

  perPage(perPage) {
    this.numperPage = perPage;
  }

  getComboTiposDoc() {
    this.progressSpinner = true;

    this.sigaServices.get("combo_comboTipoDocDocumentacionDesigna").subscribe(
      n => {
        this.comboTipoDoc = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboTipoDoc);
        this.progressSpinner = false;
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      }, () => {
        this.progressSpinner = false;
        this.cargaInicial();
      }
    );
  }

  nuevo() {
    let row: Row = new Row();

    let cell1: Cell = new Cell();
    let cell2: Cell = new Cell();
    let cell3: Cell = new Cell();
    let cell4: Cell = new Cell();
    let cell5: Cell = new Cell();
    let cell6: Cell = new Cell();

    cell1.type = 'text';
    cell1.value = this.datepipe.transform(new Date(), 'dd/MM/yyyy');
    cell1.header = this.cabeceras[0].id;
    cell1.disabled = true;

    cell2.type = 'select';
    cell2.combo = this.comboAsociado;
    cell2.value = null;
    cell2.header = this.cabeceras[1].id;
    cell2.disabled = false;

    cell3.type = 'select';
    cell3.combo = this.comboTipoDoc;
    cell3.value = null;
    cell3.header = this.cabeceras[2].id;
    cell3.disabled = false;

    cell4.type = 'fichero';
    cell4.value = null;
    cell4.header = this.cabeceras[3].id;
    cell4.disabled = false;

    cell5.type = 'textarea';
    cell5.value = '';
    cell5.header = this.cabeceras[4].id;
    cell5.disabled = false;

    cell6.type = 'invisible';
    cell6.value = true;
    cell6.header = 'nuevo';
    cell6.disabled = true;

    row.cells = [cell1, cell2, cell3, cell4, cell5, cell6];
    row.id = this.totalRegistros;

    if (this.emptyResults) {
      this.rowGroups = [];
      this.rowGroupsAux = [];
      this.emptyResults = false;
    }

    this.rowGroups.unshift(row);
    this.rowGroupsAux = this.rowGroups;
    this.totalRegistros = this.rowGroups.length;
  }


  guardar() {

    if (!this.hayErrorCamposObligatorios(this.rowGroups)) {

      let error = false;

      let copiaRowGroups: Row[] = this.rowGroups.slice();

      copiaRowGroups.forEach((el, i) => {

        if (!el.cells[5].value && this.isLetrado && !(this.usuarioLogado.idPersona == el.cells[12].value)) {
          copiaRowGroups.splice(i, 1);
          error = true;
        }

      });

      if (error) {
        this.showMsg('info', this.translateService.instant("general.message.informacion"), 'Alguno de los registros no puedo ser editado porque no ser usted su creador');
      }
      if (copiaRowGroups.length > 0) {
        this.progressSpinner = true;

        let designa = {
          ano: this.campos.ano.toString().split('/')[0].replace('D', ''),
          numero: this.campos.numero,
          idTurno: this.campos.idTurno
        }

        this.sigaServices.postSendFileAndDesigna("designacion_subirDocumentoDesigna", copiaRowGroups, designa).subscribe(
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
              this.selectedArray = [];
              this.deseleccionarTodo = true;
              this.buscarDocDesignaEvent.emit();
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
  }

  eliminarArchivos() {

    this.progressSpinner = true;

    let docAeliminar = [];

    let error = false;

    this.selectedArray.forEach((el, i) => {
      let row: Row = this.rowGroups.slice(el, el + 1)[0];

      if (!row.cells[5].value && this.isLetrado && !(this.usuarioLogado.idPersona == row.cells[12].value)) {
        error = true;
      } else {

        let doc = new DocumentoDesignaItem();
        doc.idDocumentaciondes = row.cells[6].value;
        doc.nombreFichero = row.cells[3].value;
        doc.idFichero = row.cells[7].value;

        docAeliminar.push(doc);
      }
    });

    if (error) {
      this.showMsg('info', this.translateService.instant("general.message.informacion"), 'Alguno de los registros no puede ser editado porque no ser usted su creador');
    }

    if (docAeliminar.length > 0) {
      this.sigaServices.post("designacion_eliminarDocumentosDesigna", docAeliminar).subscribe(
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
            this.selectedArray = [];
            this.deseleccionarTodo = true;
            this.buscarDocDesignaEvent.emit();
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

  descargarArchivos() {

    this.progressSpinner = true;

    let docADescargar = [];

    this.selectedArray.forEach(el => {
      let row: Row = this.rowGroups.slice(el, el + 1)[0];

      let doc = new DocumentoDesignaItem();
      doc.idDocumentaciondes = row.cells[6].value;
      doc.nombreFichero = row.cells[3].value;
      doc.idFichero = row.cells[7].value;

      docADescargar.push(doc);
    });

    this.sigaServices.postDownloadFiles("designacion_descargarDocumentosDesigna", docADescargar).subscribe(
      data => {

        let blob = null;

        if (docADescargar.length == 1) {

          let mime = this.getMimeType(docADescargar[0].nombreFichero.substring(docADescargar[0].nombreFichero.lastIndexOf("."), docADescargar[0].nombreFichero.length));
          blob = new Blob([data], { type: mime });
          saveAs(blob, docADescargar[0].nombreFichero);
        } else {

          blob = new Blob([data], { type: "application/zip" });
          saveAs(blob, "documentos.zip");
        }
        this.selectedArray = [];
        this.deseleccionarTodo = true;
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
        //console.log(err);
      },
      () => {
        this.progressSpinner = false;
      }
    );

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

  hayErrorCamposObligatorios(documentos: Row[]) {

    this.progressSpinner = true;

    let error = false;

    documentos.forEach(doc => {

      if (doc.cells[5].value) {

        if ((doc.cells[1].value == undefined || doc.cells[1].value == null || (typeof doc.cells[1].value == 'string' && doc.cells[1].value.trim() == '')) ||
          (doc.cells[2].value == undefined || doc.cells[2].value == null || (typeof doc.cells[2].value == 'string' && doc.cells[2].value.trim() == ''))
        ) {
          error = true;
          this.showMsg('error', this.translateService.instant('general.message.incorrect'), this.translateService.instant('general.message.camposObligatorios'));
        }

      }

      if (!error && (doc.cells[3].value == undefined || doc.cells[3].value == null)) {
        error = true;
        this.showMsg('error', 'Error', this.translateService.instant('general.boton.adjuntarFichero'));
      }

    });

    this.progressSpinner = false;

    return error;
  }

  getComboAsociado() {
    this.comboAsociado.push({
      label: 'Designación',
      value: '0'
    });

    this.actuacionesDesignaItems.forEach(actuacion => {
      let asociado = `${actuacion.numeroAsunto} ${actuacion.acreditacion} ${actuacion.modulo}`;
      this.comboAsociado.push({
        label: asociado,
        value: actuacion.numeroAsunto
      });
    });

  }

  deseleccionarTodoFuntion(event) {
    this.deseleccionarTodo = event;
    this.cdRef.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.documentos && changes.documentos.currentValue) {

      if (this.comboTipoDoc != undefined && this.comboTipoDoc != null && this.comboTipoDoc.length > 0) {
        this.cargaInicial();
      } else {
        this.getComboTiposDoc();
      }

    }
  }

  getTamanioColumn(cell: Cell) {
    return cell.type == 'empty' ? '100%' : this.cabeceras.find(el => el.id == cell.header).width;
  }

  changeSelect(row: Row, cell: Cell) {

    if (cell.header == 'asociado' && cell.value != null && cell.value != '0') {
      row.cells[2].value = '1';
      row.cells[2].disabled = true;
    } else {
      row.cells[2].disabled = false;
    }

  }

}

function compare(a: string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}