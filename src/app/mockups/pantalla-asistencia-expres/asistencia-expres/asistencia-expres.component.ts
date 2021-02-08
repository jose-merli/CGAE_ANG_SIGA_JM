import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-asistencia-expres',
  templateUrl: './asistencia-expres.component.html',
  styleUrls: ['./asistencia-expres.component.scss']
})
export class AsistenciaExpresComponent implements OnInit {
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

}
