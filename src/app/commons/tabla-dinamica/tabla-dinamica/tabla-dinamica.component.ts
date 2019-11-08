import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DataTable } from '../../../../../node_modules/primeng/primeng';

@Component({
  selector: 'app-tabla-dinamica',
  templateUrl: './tabla-dinamica.component.html',
  styleUrls: ['./tabla-dinamica.component.scss']
})
export class TablaDinamicaComponent implements OnInit {

  @Input() cols = []
  rowsPerPage: any = [];
  msgs;
  @ViewChild("table") tabla: DataTable;
  selectedItem = 10;
  selectedDatos = [];
  seleccion: boolean = false;

  message;

  @Input() datos
  progressSpinner: boolean = false;



  constructor() { }

  ngOnInit() {
    this.getCols()
    this.datos = [
      {
        "turno": 1
      },
      {
        "turno": 2
      },
      {
        "turno": 3
      },
      {
        "turno": 4
      },
      {
        "turno": 5
      },
      {
        "turno": 6
      },
      {
        "turno": 7
      },
      {
        "turno": 8
      },
      {
        "turno": 9
      },
      {
        "turno": 10
      },
      {
        "turno": 11
      },
      {
        "turno": 12
      }

    ]
  }


  sube(selected) {
    let index = this.datos.indexOf(selected);
    if (index != 0)
      [this.datos[index], this.datos[index - 1]] = [this.datos[index - 1], this.datos[index]];
  }

  baja(selected) {
    let index = this.datos.indexOf(selected);
    if (index != this.datos.length - 1)
      [this.datos[index], this.datos[index + 1]] = [this.datos[index + 1], this.datos[index]];

  }
  getCols() {

    this.cols = [
      { field: "turno", header: "dato.jgr.guardia.guardias.turno" },
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
