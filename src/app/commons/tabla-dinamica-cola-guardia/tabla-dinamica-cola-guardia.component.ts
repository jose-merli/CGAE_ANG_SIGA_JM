import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tabla-dinamica-cola-guardia',
  templateUrl: '../tabla-dinamica/tabla-dinamica/tabla-dinamica.component.html',
  styleUrls: ['./tabla-dinamica-cola-guardia.component.scss']
})
export class TablaDinamicaColaGuardiaComponent implements OnInit {

  rowsPerPage: any = [];
  msgs;
  selectedItem = 10;
  selectedDatos = [];
  seleccion: boolean = false;

  message;
  cols = [];

  @Input() datos;
  @Input() botActivos: true;


  progressSpinner: boolean = false;



  constructor() { }

  ngOnInit() {
    this.getCols()

  }


  sube(selected) {
    let index = this.datos.indexOf(selected);
    if (index != 0) {
      [this.datos[index], this.datos[index - 1]] = [this.datos[index - 1], this.datos[index]];

      //Esto es en caso que se quiera mover a un primer puesto
      if (index == 1) {
        if (this.datos[this.datos.length - 1].grupo = "1") {
          this.datos[0].grupo = "2";
          if (this.datos[1].grupo = "2")
            this.datos[1].grupo = "3"
        } else {
          this.datos[0].grupo = "1";
          if (this.datos[1].grupo == "1")
            this.datos[1].grupo = "2";
        }
      } else {// Esto es cambiar la ordenacion de normal si no se cambia al primer puesto
        this.datos[index - 1].grupo = this.datos[index - 2].grupo + 1;
        this.datos[index].grupo = this.datos[index].grupo + 2;
      }
    }
  }

  baja(selected) {
    let index = this.datos.indexOf(selected);
    if (index != this.datos.length - 1) {
      [this.datos[index], this.datos[index + 1]] = [this.datos[index + 1], this.datos[index]];
      //Esto es en caso que se quiera mover a un primer puesto
      if (index == 0) {
        if (this.datos[this.datos.length - 1].grupo = "1") {
          this.datos[0].grupo = "2";
          this.datos[1].grupo = "3"
        } else {
          this.datos[0].grupo = "1";
          if (this.datos[1].grupo == "1")
            this.datos[1].grupo = "2";
        }
      } else {// Esto es cambiar la ordenacion de normal si no se cambia al primer puesto
        this.datos[index].grupo = this.datos[index - 1].grupo + 1;
        this.datos[index + 1].grupo = this.datos[index].grupo + 2;
      }
    }
  }
  getCols() {
    this.cols = [
      { field: "ordenCola", header: "dato.jgr.guardia.guardias.grupo", editable: false },
      { field: "grupo", header: "dato.jgr.guardia.guardias.grupo", editable: true },
      { field: "orden", header: "administracion.informes.literal.orden", editable: true },
      { field: "nColegiado", header: "censo.busquedaClientesAvanzada.literal.nColegiado", editable: false },
      { field: "nombreApe", header: "administracion.parametrosGenerales.literal.nombre.apellidos", editable: false },
      { field: "fechaValidacion", header: "dato.jgr.guardia.guardias.fechaValidez", editable: false },
      { field: "fechabaja", header: "dato.jgr.guardia.guardias.fechaBaja", editable: false },
      { field: "compensaciones", header: "justiciaGratuita.oficio.turnos.compensaciones", editable: false },
      { field: "saltos", header: "justiciaGratuita.oficio.turnos.saltos", editable: false },
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
  onChangeRowsPerPages(event) {

  }
}


