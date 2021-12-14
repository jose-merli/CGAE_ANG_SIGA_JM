import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Message } from 'primeng/primeng';
import { Table } from 'primeng/table';
import { ExpedienteItem } from '../../../../models/ExpedienteItem';

@Component({
  selector: 'app-ficha-exp-exea-documentacion',
  templateUrl: './ficha-exp-exea-documentacion.component.html',
  styleUrls: ['./ficha-exp-exea-documentacion.component.scss']
})
export class FichaExpExeaDocumentacionComponent implements OnInit {

  msgs : Message [] = []

  rowsPerPage: any = [];
  cols;
  selectedItem: number = 10;
  selectAll;
  selectedDatos = [];
  buscadores = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;

  @Input() expediente : ExpedienteItem;
  @ViewChild("table") table : Table;
  constructor(private changeDetectorRef : ChangeDetectorRef) { }

  ngOnInit() {
    this.initTabla();
  }

  initTabla(){

    this.cols = [
      { field: "nombreFichero", header: "justiciaGratuita.ejg.datosGenerales.TipoExpediente", width: '3%' },
      { field: "descTipoDoc", header: "justiciaGratuita.ejg.datosGenerales.NumExpediente", width: "3%" },
    ];
    this.cols.forEach(it => this.buscadores.push(""));

    this.rowsPerPage = [
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

  }

  onChangeSelectAll() {

    if (this.selectAll && this.expediente.documentos) {
      this.selectMultiple = true;
      this.selectedDatos = this.expediente.documentos;
      this.numSelected = this.expediente.documentos.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
      this.selectMultiple = false;
    }
      
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

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
