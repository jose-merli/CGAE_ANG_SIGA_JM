import { Component, OnInit, ViewChild } from '@angular/core';
import { Message } from 'primeng/components/common/message';
import { DataTable } from 'primeng/primeng';

@Component({
  selector: 'app-destinatarios-lista-series-factura',
  templateUrl: './destinatarios-lista-series-factura.component.html',
  styleUrls: ['./destinatarios-lista-series-factura.component.scss']
})
export class DestinatariosListaSeriesFacturaComponent implements OnInit {

  msgs: Message[];
  progressSpinner: boolean = false;

  consultas: any = [];
  selectedConsulta: string;

  // Tabla
  datos: any[];
  datosInit: any[];
  cols: any[];
  first: number = 0;
  selectedItem: number;
  selectAll: boolean = false;
  selectMultiple: boolean = false;
  numSelected: number = 0;
  rowsPerPage: any = [];

  @ViewChild('table') table: DataTable;
  selectedDatos;

  constructor() { }

  ngOnInit() {
    this.progressSpinner = true;

    this.getCols();

    this.progressSpinner = false;
  }

  getCols(): void {
    this.selectedItem = 10;
    this.selectedDatos = [];

    this.cols = [
      {
          field: "nombre",
          header: "administracion.parametrosGenerales.literal.nombre"
      },
      {
          field: 'objetivo',
          header: 'administracion.parametrosGenerales.literal.objetivo'
      }
    ];

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

  clear() {
    this.msgs = [];
  }

  esFichaActiva() {
    return true;
}

}
