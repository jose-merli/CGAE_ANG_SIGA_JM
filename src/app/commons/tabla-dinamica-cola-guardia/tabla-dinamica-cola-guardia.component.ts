import { Component, OnInit, Input, Output } from '@angular/core';
import { EventEmitter } from 'events';
import { SigaServices } from '../../_services/siga.service';

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
  @Input() botActivos: boolean = true;
  @Input() porGrupos: boolean = false;
  @Input() selectionMode: string = "single";
  progressSpinner: boolean = false;



  constructor(private sigaService: SigaServices) { }

  ngOnInit() {
    this.getCols()

  }


  sube(selected) {
    let index = this.datos.indexOf(selected);
    if (this.porGrupos) { // MOVIMIENTO CUANDO ESTAN AGRUPADOS
      let seMueve = this.datos.filter(it => selected.numeroGrupo == it.numeroGrupo); // Los que se desplazan
      let primero = this.datos.indexOf(seMueve[0]);
      if (primero != 0) {
        let primeroMovido = this.datos[primero - 1];
        let esMovido = this.datos.filter(it => primeroMovido.numeroGrupo == it.numeroGrupo); // Los que se mueven
        this.datos = this.datos.slice(0, this.datos.indexOf(esMovido[0])).concat(seMueve).concat(esMovido).concat(this.datos.slice(this.datos.indexOf(seMueve[seMueve.length - 1]) + 1));

        if (this.datos.indexOf(esMovido[0]) != 0) {// MOVIMIENTO CUANDO NO IMPLICA AL PRIMER GRUPO
          let valorG = +this.datos[this.datos.indexOf(seMueve[0]) - 1].numeroGrupo + 1
          seMueve = seMueve.map(it => {
            it.numeroGrupo = valorG.toString();
            return it;
          })
          esMovido = esMovido.map(it => {
            it.numeroGrupo = (valorG + 1).toString();
            return it;
          })
        }
        else if (esMovido[0].numeroGrupo == "1") { // MOVIMIENTO DEL PRIMER GRUPO CON GRUPO 1
          esMovido = esMovido.map(it => {
            it.numeroGrupo = "2";
            return it;
          });
          seMueve = seMueve.map(it => {
            it.numeroGrupo = "1";
            return it;
          });
        } else if (esMovido[0].numeroGrupo == "2") {
          esMovido = esMovido.map(it => {
            it.numeroGrupo = "3";
            return it;
          });
          seMueve = seMueve.map(it => {
            it.numeroGrupo = "2";
            return it;
          });
        }

      }

    } else {
      if (index != 0) {
        [this.datos[index], this.datos[index - 1]] = [this.datos[index - 1], this.datos[index]];

        //Esto es en caso que se quiera mover a un primer puesto
        if (index == 1) {
          if (this.datos[this.datos.length - 1].numeroGrupo == "1") {
            this.datos[0].numeroGrupo = "2";
            if (this.datos[1].numeroGrupo = "2")
              this.datos[1].numeroGrupo = "3"
          } else {
            this.datos[0].numeroGrupo = "1";
            if (this.datos[1].numeroGrupo == "1")
              this.datos[1].numeroGrupo = "2";
          }
        } else {// Esto es cambiar la ordenacion de normal si no se cambia al primer puesto
          if (this.datos[index - 1].numeroGrupo != this.datos[index].numeroGrupo) {
            this.datos[index - 1].numeroGrupo = +this.datos[index - 2].numeroGrupo + 1;
            this.datos[index].numeroGrupo = +this.datos[index - 1].numeroGrupo + 1;
          }
        }
      }
    }
  }

  baja(selected) {
    let index = this.datos.indexOf(selected);
    if (this.porGrupos) { // MOVIMIENTO CUANDO ESTAN AGRUPADOS
      let seMueve = this.datos.filter(it => selected.numeroGrupo == it.numeroGrupo); // Los que se desplazan
      let ultimo = this.datos.indexOf(seMueve[seMueve.length - 1]);
      if (ultimo != this.datos.length - 1) {
        let primeroMovido = this.datos[ultimo + 1];
        let esMovido = this.datos.filter(it => primeroMovido.numeroGrupo == it.numeroGrupo); // Los que se mueven
        this.datos = this.datos.slice(0, this.datos.indexOf(seMueve[0])).concat(esMovido).concat(seMueve).concat(this.datos.slice(this.datos.indexOf(esMovido[esMovido.length - 1]) + 1));

        if (this.datos.indexOf(esMovido[esMovido.length - 1]) != (this.datos.length - 1)) {
          let valorG = +this.datos[this.datos.indexOf(esMovido[0]) - 1].numeroGrupo + 1
          seMueve = seMueve.map(it => {
            it.numeroGrupo = (valorG + 1).toString();
            return it;
          })
          esMovido = esMovido.map(it => {
            it.numeroGrupo = valorG.toString();
            return it;
          })
        }
      }

    } else {
      if (index != this.datos.length - 1) {
        [this.datos[index], this.datos[index + 1]] = [this.datos[index + 1], this.datos[index]];
        //Esto es en caso que se quiera mover a un primer puesto
        if (index == 0) {
          if (this.datos[this.datos.length - 1].numeroGrupo == "1") {
            this.datos[0].numeroGrupo = "2";
            this.datos[1].numeroGrupo = "3"
          } else {
            this.datos[0].numeroGrupo = "1";
            if (this.datos[1].numeroGrupo == "1")
              this.datos[1].numeroGrupo = "2";
          }
        } else {// Esto es cambiar la ordenacion de normal si no se cambia al primer puesto
          if (this.datos[index + 1].numeroGrupo != this.datos[index].numeroGrupo) {
            this.datos[index].numeroGrupo = +this.datos[index + 1].numeroGrupo - 1;
            this.datos[index + 1].numeroGrupo = +this.datos[index].numeroGrupo - 1;
          }
        }
      }
    }
  }
  getCols() {
    this.cols = [
      { field: "ordenCola", header: "dato.jgr.guardia.guardias.grupo", editable: false },
      { field: "numeroGrupo", header: "dato.jgr.guardia.guardias.grupo", editable: true },
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

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode >= 48 && charCode <= 57) {
      return true;
    }
    else {
      return false;

    }
  }
  // zuletzt() {
  //   // this.progressSpinner = true;
  //   this.sigaService.post(
  //     "busquedaGuardias_getUltimo", this.selectedDatos).subscribe(
  //       data => {
  //         this.getColaGuardias.emit("");
  //       },
  //       err => {
  //         console.log(err);
  //         this.progressSpinner = false;
  //       }
  //     )
  // }


  onChangeRowsPerPages(event) { }
}


