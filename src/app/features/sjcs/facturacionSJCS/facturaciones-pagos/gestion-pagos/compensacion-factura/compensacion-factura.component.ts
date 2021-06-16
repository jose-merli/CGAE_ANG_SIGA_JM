import { Component, OnInit, ViewChild, Input, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-compensacion-factura',
  templateUrl: './compensacion-factura.component.html',
  styleUrls: ['./compensacion-factura.component.scss']
})
export class CompensacionFacturaComponent implements OnInit {
  selectedItem: number = 10;
  rowsPerPage: any = [];
  buscadores = [];
  selectedDatos = [];
  numSelected = 0;
  showFicha: boolean = false;
  selectAll: boolean = false;
  progressSpinnerCompensacion: boolean = false;

  selectionMode: String = "multiple";

  cols;
  msgs;

  @ViewChild("tabla") tabla;

  @Input() permisos;

  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.progressSpinnerCompensacion = false;
    this.getCols();
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
  }

  getCols() {
    this.cols = [
      { field: "descConcepto", header: "facturacionSJCS.facturacionesYPagos.conceptos" },
      { field: "importeTotal", header: "facturacionSJCS.facturacionesYPagos.importe" },
      { field: "importePendiente", header: "facturacionSJCS.facturacionesYPagos.importePendiente" },
      { field: "descGrupo", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.grupoTurnos" }
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

  seleccionaFila(evento) {
    this.numSelected = this.selectedDatos.length;
  }

  onChangeSelectAll() {
    if (this.selectAll === true) {
      // this.selectedDatos = this.datos;
      this.numSelected = this.selectedDatos.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  onHideFicha() {
    this.showFicha = !this.showFicha;
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
