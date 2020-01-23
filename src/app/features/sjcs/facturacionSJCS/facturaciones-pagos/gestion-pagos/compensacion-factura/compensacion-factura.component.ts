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
  selectMultiple: boolean = false;
  seleccion: boolean = false;
  showFicha: boolean = false;
  selectAll: boolean = false;
  progressSpinnerCompensacion: boolean = false;

  selectionMode: String = "single";

  cols; 

  @ViewChild("tabla") tabla;

  @Input() permisos;
  
  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.progressSpinnerCompensacion=false;
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

  seleccionaFila(evento){
    this.numSelected = evento.length;
    this.seleccion = true;
  }

  onChangeSelectAll() {
    this.selectMultiple = false;
    //this.selectedDatos = this.body;
    //this.numSelected = this.body.length;
    this.selectedDatos = [];
    this.numSelected = 0;
  }

  isSelectMultiple() {
    this.selectMultiple = !this.selectMultiple;
    
    if (!this.selectMultiple) {
      this.selectAll = false;
      this.selectedDatos = [];
      this.numSelected = 0;
      this.selectionMode="single";
    } else {
      this.selectAll = false;
      this.selectedDatos = [];
      this.numSelected = 0;
      this.selectionMode="multiple";
    }
  }

  onHideFicha() {
    this.showFicha = !this.showFicha;
  }
}
