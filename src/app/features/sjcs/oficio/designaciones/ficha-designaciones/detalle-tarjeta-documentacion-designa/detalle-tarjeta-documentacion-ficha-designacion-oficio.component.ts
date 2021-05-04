import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, SimpleChanges, ViewChild, OnChanges } from '@angular/core';
import { Sort } from '@angular/material';
import { Message } from 'primeng/components/common/api';
import { DesignaItem } from '../../../../../../models/sjcs/DesignaItem';
import { DocumentoDesignaItem } from '../../../../../../models/sjcs/DocumentoDesignaItem';
import { CommonsService } from '../../../../../../_services/commons.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { Cell, Row, TablaResultadoMixDocDesigService } from './tabla-resultado-mix-doc-desig.service';
import { TranslateService } from '../../../../../../commons/translate/translation.service';
import { saveAs } from "file-saver/FileSaver";

interface Cabecera {
  id: string,
  name: string
}
@Component({
  selector: 'app-detalle-tarjeta-documentacion-ficha-designacion-oficio',
  templateUrl: './detalle-tarjeta-documentacion-ficha-designacion-oficio.component.html',
  styleUrls: ['./detalle-tarjeta-documentacion-ficha-designacion-oficio.component.scss']
})
export class DetalleTarjetaDocumentacionFichaDesignacionOficioComponent implements OnInit, OnChanges {

  @Input() documentos: DocumentoDesignaItem[];
  @Input() campos: DesignaItem;
  @Output() buscarDocDesignaEvent = new EventEmitter<any>();
  @ViewChild('table') table: ElementRef;
  cabeceras: Cabecera[] = [
    {
      id: "fecha",
      name: "Fecha"
    },
    {
      id: "asociado",
      name: "Asociado"
    },
    {
      id: "tipoDoc",
      name: "Tipo documentación"
    },
    {
      id: "nombre",
      name: "Nombre"
    },
    {
      id: "observaciones",
      name: "Observaciones"
    }
  ];
  rowGroups: Row[];
  rowGroupsAux: Row[];
  seleccionarTodo: boolean = false;
  totalRegistros = 0;
  progressSpinner: boolean = false;
  msgs: Message[] = [];
  selected = false;
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

  constructor(
    private renderer: Renderer2,
    private datepipe: DatePipe,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private trmDoc: TablaResultadoMixDocDesigService,
    private translateService: TranslateService
  ) {

    this.renderer.listen('window', 'click', (event: { target: HTMLInputElement; }) => {
      for (let i = 0; i < this.table.nativeElement.children.length; i++) {

        if (!event.target.classList.contains("selectedRowClass")) {
          this.selected = false;
          this.selectedArray = [];
        }
      }
    });
  }

  ngOnInit(): void {

    this.getComboTiposDoc();

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
        { type: 'text', value: 'Designación', header: this.cabeceras[1].id, disabled: false },
        { type: 'select', value: element.idTipodocumento, combo: this.comboTipoDoc, header: this.cabeceras[2].id, disabled: false },
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
        { type: 'invisible', value: element.numColegiado, header: 'numColegiado', disabled: false }
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
    this.seleccionarTodo = event;
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
        console.log('a: ', a.cells[i].value)
        console.log('b: ', b.cells[i].value)
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
        console.log(err);
        this.progressSpinner = false;
      }, () => {
        this.cargaInicial();
        this.progressSpinner = false;
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

    cell2.type = 'text';
    cell2.value = 'Designación';
    cell2.header = this.cabeceras[1].id;
    cell2.disabled = true;

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

    this.progressSpinner = true;

    let designa = {
      ano: this.campos.ano.toString().split('/')[0].replace('D', ''),
      numero: this.campos.numero,
      idTurno: this.campos.idTurno
    }

    this.sigaServices.postSendFileAndDesigna("designacion_subirDocumentoDesigna", this.rowGroups, designa).subscribe(
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
          this.buscarDocDesignaEvent.emit();
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

  eliminarArchivos() {

    this.progressSpinner = true;

    let docAeliminar = [];

    this.selectedArray.forEach(el => {
      let row: Row = this.rowGroups.slice(el, el + 1)[0];

      let doc = new DocumentoDesignaItem();
      doc.idDocumentaciondes = row.cells[6].value;
      doc.nombreFichero = row.cells[3].value;
      doc.idFichero = row.cells[7].value;

      docAeliminar.push(doc);
    });

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
          this.buscarDocDesignaEvent.emit();
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
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      },
      () => {
        this.progressSpinner = false;
        this.selectedArray = [];
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.documentos && changes.documentos.currentValue) {
      this.cargaInicial();
    }
  }

}

function compare(a: string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}