import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DataTable } from 'primeng/primeng';
import { SerieFacturacionItem } from '../../../../models/SeriesFacturacionItem';

@Component({
  selector: 'app-tabla-series-factura',
  templateUrl: './tabla-series-factura.component.html',
  styleUrls: ['./tabla-series-factura.component.scss']
})
export class TablaSeriesFacturaComponent implements OnInit {

  //Resultados de la busqueda
  @Input() datos;
  
  @Output() searchHistoricalSend = new EventEmitter<boolean>();
  @Output() busqueda = new EventEmitter<boolean>();

  @ViewChild("table") table: DataTable;

  cols;
  msgs;

  rowsPerPage = [];
  selectedItem: number = 10;
  selectAll;
  selectedDatos = [];
  selectDatos: SerieFacturacionItem = new SerieFacturacionItem();
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;
  permisoEscritura: boolean = false;
  buscadores = [];
  initDatos;
  message;
  progressSpinner: boolean = false;

  constructor() { }

  ngOnInit() {
    this.getCols();
    this.initDatos = JSON.parse(JSON.stringify((this.datos)));
  }

  getCols() {
    this.cols = [
      { field: "abreviatura", header: "gratuita.definirTurnosIndex.literal.abreviatura", width: "10%" },
      { field: "descripcion", header: "enviosMasivos.literal.descripcion", width: "20%" },
      { field: "cuentaBancaria", header: "facturacion.seriesFactura.cuentaBancaria", width: "15%" },
      { field: "sufijo", header: "administracion.parametrosGenerales.literal.sufijo", width: "10%" },
      { field: "tiposIncluidos", header: "facturacion.seriesFactura.tipoProductos", width: "20%" },
      { field: "fasesAutomaticas", header: "Fases Automáticas", width: "20%" } // Por insertar
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

  clear() { }
  
}
