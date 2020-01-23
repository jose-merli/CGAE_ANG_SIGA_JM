import { Component, OnInit, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-datos-pagos',
  templateUrl: './datos-pagos.component.html',
  styleUrls: ['./datos-pagos.component.scss']
})
export class DatosPagosComponent implements OnInit {
  showDatosPagos: boolean = true;
  cols;
  msgs;
  
  estados = [];

  @ViewChild("tabla") tabla;

  @Input() permisos;

  constructor() { }

  ngOnInit() {

    this.getCols();
  }

  getCols() {
    this.cols = [
      { field: "fechaEstado", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.fechaEstado" },
      { field: "desEstado", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.estado" }
    ];
  }

  onHideDatosGenerales() {
    this.showDatosPagos = !this.showDatosPagos;
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
