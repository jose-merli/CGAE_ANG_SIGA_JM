import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-datos-cola-guardia',
  templateUrl: './datos-cola-guardia.component.html',
  styleUrls: ['./datos-cola-guardia.component.scss']
})
export class DatosColaGuardiaComponent implements OnInit {

  openFicha: boolean = false;
  rowsPerPage;
  cols = [];
  fecha;
  @Input() modoEdicion = false;
  constructor() { }

  ngOnInit() {
    this.getCols();
  }

  abreCierraFicha() {
    if (this.modoEdicion)
      this.openFicha = !this.openFicha
  }

  disabledSave() {

  }
  save() { }

  getCols() {

    this.cols = [
      { field: "grupo", header: "dato.jgr.guardia.guardias.grupo" },
      { field: "orden", header: "administracion.informes.literal.orden" },
      { field: "nColegiado", header: "censo.busquedaClientesAvanzada.literal.nColegiado" },
      { field: "nombreApe", header: "administracion.parametrosGenerales.literal.nombre.apellidos" },
      { field: "fechaValidez", header: "dato.jgr.guardia.guardias.fechaValidez" },
      { field: "fechabaja", header: "dato.jgr.guardia.guardias.fechaBaja" },
      { field: "compensaciones", header: "justiciaGratuita.oficio.turnos.compensaciones" },
      { field: "saltos", header: "justiciaGratuita.oficio.turnos.saltos" },
    ];
    // this.cols.forEach(it => this.buscadores.push(""))
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

  transformDate(fecha) {
    if (fecha)
      fecha  =  new Date(fecha).toLocaleDateString();
  }


}
