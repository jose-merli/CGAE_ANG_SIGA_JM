import { Component, EventEmitter, OnInit, Output, AfterViewInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { Enlace } from '../ficha-baremos-de-guardia.component';

@Component({
  selector: 'app-ficha-bar-datos-generales',
  templateUrl: './ficha-bar-datos-generales.component.html',
  styleUrls: ['./ficha-bar-datos-generales.component.scss']
})
export class FichaBarDatosGeneralesComponent implements OnInit, AfterViewInit {

  showTarjeta: boolean = false;
  cols: any[] = [];
  rowsPerPage: any[] = [];
  modoSeleccion = "multiple";
  selectedItem: number = 10;
  selectAll: boolean = false;
  selectedDatos: any[] = [];
  numSelected: number = 0;
  datos: any[] = [];

  @Output() addEnlace = new EventEmitter<Enlace>();

  @ViewChild("table") tabla: Table;

  constructor() { }

  ngOnInit() {
    this.getCols();
  }

  ngAfterViewInit() {

    const enlace: Enlace = {
      id: 'facSJCSFichaBarDatosGen',
      ref: document.getElementById('facSJCSFichaBarDatosGen')
    };

    this.addEnlace.emit(enlace);
  }

  onHideTarjeta() {
    // if (this.retencionesService.modoEdicion) {
    this.showTarjeta = !this.showTarjeta;
    // } else {
    //   this.showTarjeta = true;
    // }
  }

  getCols() {

    this.cols = [
      { field: "ncolegiado", header: "facturacionSJCS.retenciones.nColegiado", width: "50%" },
      { field: "nombre", header: "facturacionSJCS.retenciones.nombre", width: "50%" }
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

  actualizaSeleccionados() {
    this.numSelected = this.selectedDatos.length;
  }

  onChangeSelectAll() {

    if (this.selectAll === true) {
      this.selectedDatos = this.datos;
      this.numSelected = this.datos.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

}
