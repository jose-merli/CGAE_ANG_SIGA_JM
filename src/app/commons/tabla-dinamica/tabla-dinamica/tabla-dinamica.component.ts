import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tabla-dinamica',
  templateUrl: './tabla-dinamica.component.html',
  styleUrls: ['./tabla-dinamica.component.scss']
})
export class TablaDinamicaComponent implements OnInit {

  rowsPerPage: any = [];
  msgs;
  selectedItem = 10;
  selectedDatos = [];
  seleccion: boolean = false;
  selectionMode: string = "single";
  message;
  page: number = 0;

  @Input() datos;
  @Input() cols = [
    {
      header: "", field: ""
    }
  ]
  @Input() botActivos: true;


  progressSpinner: boolean = false;



  constructor() { }

  ngOnInit() {
    this.getCols()

  }
  cambiaInput() {

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
  onChangeRowsPerPages(event) { }
  rowSelect(evento) { }
}
