import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Message } from 'primeng/api';
import { Table } from 'primeng/table';
import { ExpedienteItem } from '../../../../models/ExpedienteItem';

@Component({
  selector: 'app-ficha-exp-exea-historico',
  templateUrl: './ficha-exp-exea-historico.component.html',
  styleUrls: ['./ficha-exp-exea-historico.component.scss']
})
export class FichaExpExeaHistoricoComponent implements OnInit, OnChanges {

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
  constructor(private changeDetectorRef : ChangeDetectorRef,
    private datePipe : DatePipe) { }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes.expediente.currentValue){
      this.expediente.hitos.forEach(element => {
        if(element.fecha){
          element.fecha = this.datePipe.transform(new Date(element.fecha), 'dd/MM/yyyy HH:mm');
        }
      });
    }
  }

  ngOnInit() {
    this.initTabla();
  }

  initTabla(){

    this.cols = [
      { field: "estado", header: "censo.fichaIntegrantes.literal.estado", width: '3%' },
      { field: "fecha", header: "censo.resultadosSolicitudesModificacion.literal.fecha", width: "3%" },
      { field: "descripcion", header: "administracion.parametrosGenerales.literal.descripcion", width: "3%" }
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

    if (this.selectAll) {
      this.selectMultiple = true;
      this.selectedDatos = this.expediente.hitos;
      this.numSelected = this.expediente.hitos.length;
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
