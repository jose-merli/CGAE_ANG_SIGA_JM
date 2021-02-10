import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-asistencia-expres',
  templateUrl: './asistencia-expres.component.html',
  styleUrls: ['./asistencia-expres.component.scss']
})
export class AsistenciaExpresComponent implements OnInit {
  show = true;
  cFormValidity = true;
  modoBusqueda = 'a';
  modoBusquedaB = false;
  rutas:string[] = ['SJCS', 'Guardia', 'Asistencias'];
  radios = [
    { label: 'Búsqueda de Asistencias', value: 'a' },
    { label: 'Asistencia Exprés', value: 'b' }
  ];
  selectores1 = [
    {
      nombre : "Turno",
      opciones: [1,2,3,4,5,6,7,8,9,10]
    },
    {
      nombre : "Guardia",
      opciones: [1,2,3,4,5,6,7,8,9,10]
    },
    {
      nombre : "Tipo Asistencia Colegio",
      opciones: [1,2,3,4,5,6,7,8,9,10]
    },
    {
      nombre : "Letrado de Guardia",
      opciones: [1,2,3,4,5,6,7,8,9,10]
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }
  showResponse() {
    this.show = true;
  }
  hideResponse() {
    this.show = false;
  }
  saveForm($event) {
    this.cFormValidity = $event;
  }

  changeTab() {
    this.hideResponse();
    if (this.modoBusqueda === 'b') {
      this.modoBusquedaB = true;
    } else if (this.modoBusqueda === 'a') {
      this.modoBusquedaB = false;
    }
  }

}
