import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-tarjeta-datos-generales',
  templateUrl: './tarjeta-datos-generales.component.html',
  styleUrls: ['./tarjeta-datos-generales.component.scss']
})
export class TarjetaDatosGeneralesComponent implements OnInit {

  datePickers1 = ["Fecha Apertura *"];
  inputs1 = [
    {
      nombre: "Año",
      valor: ""
    },
    {
      nombre: "Número",
      valor: ""
    }];

  datePickers2 = ["Fecha Presentación", "Fecha Límite Presentación"];
  selectores2 = [
    {
      nombre: "Tipo EJG",
      opciones: [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
        { label: '6', value: 6 },
        { label: '7', value: 7 },
        { label: '8', value: 8 },
        { label: '9', value: 9 },
        { label: '10', value: 10 },
      ]
    },
    {
      nombre: "Tipo EJG Colegio",
      opciones: [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
        { label: '6', value: 6 },
        { label: '7', value: 7 },
        { label: '8', value: 8 },
        { label: '9', value: 9 },
        { label: '10', value: 10 },
      ]
    },
    {
      nombre: "Prestaciones",
      opciones: [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
        { label: '6', value: 6 },
        { label: '7', value: 7 },
        { label: '8', value: 8 },
        { label: '9', value: 9 },
        { label: '10', value: 10 },
      ]
    }
  ];

  inputs3 = [
    {
      nombre: "Año",
      valor: ""
    },
    {
      nombre: "Número Expediente",
      valor: ""
    }];

  constructor() { }
  dgForm = new FormGroup({
  });
  ngOnInit(): void {
  }

}
