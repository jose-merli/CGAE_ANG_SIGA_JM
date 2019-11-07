import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabla-dinamica',
  templateUrl: './tabla-dinamica.component.html',
  styleUrls: ['./tabla-dinamica.component.scss']
})
export class TablaDinamicaComponent implements OnInit {

  cols = []
  rowsPerPage: any = [];
  msgs;

  selectedItem: number = 10;
  selectedDatos = [];
  seleccion: boolean = false;

  message;

  initDatos;
  progressSpinner: boolean = false;



  constructor() { }

  ngOnInit() {
    this.getCols()
  }



  getCols() {

    this.cols = [
      { field: "turno", header: "dato.jgr.guardia.guardias.turno" },
      { field: "nombre", header: "administracion.parametrosGenerales.literal.nombre" },
      { field: "tipoGuardia", header: "dato.jgr.guardia.guardias.tipoGuardia" },
      { field: "obligatoriedad", header: "dato.jgr.guardia.guardias.obligatoriedad" },
      { field: "tipoDia", header: "dato.jgr.guardia.guardias.tipoDia" },

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

}
