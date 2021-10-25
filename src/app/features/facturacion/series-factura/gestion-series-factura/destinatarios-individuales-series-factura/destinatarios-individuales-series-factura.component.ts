import { Component, OnInit, ViewChild } from '@angular/core';
import { Message } from 'primeng/components/common/message';
import { DataTable } from 'primeng/primeng';

@Component({
  selector: 'app-destinatarios-individuales-series-factura',
  templateUrl: './destinatarios-individuales-series-factura.component.html',
  styleUrls: ['./destinatarios-individuales-series-factura.component.scss']
})
export class DestinatariosIndividualesSeriesFacturaComponent implements OnInit {

  msgs: Message[];
  progressSpinner: boolean = false;

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

  @ViewChild("table") table: DataTable;
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
        field: "nombreCompleto",
        header: "administracion.parametrosGenerales.literal.nombre"
      },
      {
        field: 'correoElectronico',
        header: 'censo.datosDireccion.literal.correo'
      },
      {
        field: 'movil',
        header: 'censo.datosDireccion.literal.movil'
      },
      {
        field: 'domicilio',
        header: 'solicitudModificacion.especifica.domicilio.literal'
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
  

  esFichaActiva(): boolean {
    return true;// this.fichaPosible.activa;
  }

}
