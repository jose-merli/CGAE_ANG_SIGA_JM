import { Component, OnInit, Input, ViewChild, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.scss']
})
export class PagosComponent implements OnInit {
  progressSpinner: boolean = false;
  cols;
  msgs; 
  rowsPerPage: any = [];
  buscadores = [];
  body = [];
  selectedItem: number = 10;

  @Input() cerrada;
  @Input() idFacturacion;
  @Input() idEstadoFacturacion;
  @Input() modoEdicion;
  @Input() permisos;

  @ViewChild("tabla") tabla;
  
  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.progressSpinner = true;    
    this.getCols();
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
  }

  seleccionaFila(evento){
    console.debug(evento.data.nombre);
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

  setItalic(dato) {
    if (dato.fechabaja == null) return false;
    else return true;
  }

  getCols() {
    this.cols = [
      { field: "nombre", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.nombre" },
      { field: "descConcepto", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.concepto" },
      { field: "porcentaje", header: "facturacionSJCS.facturacionesYPagos.porcentaje" },
      { field: "cantidad", header: "facturacionSJCS.facturacionesYPagos.cantidad" },
      { field: "fechaEstado", header: "facturacionSJCS.facturacionesYPagos.fechaEstado" },
       { field: "estado", header: "facturacionSJCS.facturacionesYPagos.estado" }
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
}
