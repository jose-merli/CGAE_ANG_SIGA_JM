import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-busqueda-pantalla-calendarios',
  templateUrl: './busqueda-pantalla-calendarios.component.html',
  styleUrls: ['./busqueda-pantalla-calendarios.component.scss']
})
export class BusquedaPantallaCalendariosComponent implements OnInit {
  expanded = true;

  selectores1 = [
    {
      nombre: "Turno",
      opciones: [
        { label: 'XXXXXXXXXXX', value: 1 },
        { label: 'XXXXXXXXXXX', value: 2 },
        { label: 'XXXXXXXXXXX', value: 3 },
      ]
    },
    {
      nombre: "Guardia",
      opciones: [
        { label: 'XXXXXXXXXXX', value: 1 },
        { label: 'XXXXXXXXXXX', value: 2 },
        { label: 'XXXXXXXXXXX', value: 3 },
      ]
    },
    {
      nombre: "Lista de Guardias",
      opciones: [
        { label: 'XXXXXXXXXXX', value: 1 },
        { label: 'XXXXXXXXXXX', value: 2 },
        { label: 'XXXXXXXXXXX', value: 3 },
      ]
    },
    {
      nombre: "Estado",
      opciones: [
        { label: 'XXXXXXXXXXX', value: 1 },
        { label: 'XXXXXXXXXXX', value: 2 },
        { label: 'XXXXXXXXXXX', value: 3 },
      ]
    },
  ];

  datePickers1 = ['Fecha Calendario', 'Fecha Programada'];

  constructor() { }

  ngOnInit() {
  }

}
