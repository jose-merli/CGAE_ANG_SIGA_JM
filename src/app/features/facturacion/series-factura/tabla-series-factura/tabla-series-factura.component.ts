import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DataTable } from 'primeng/primeng';

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

  constructor() { }

  ngOnInit() {
  }

  getCols() {

  }

  clear() { }
  
}
