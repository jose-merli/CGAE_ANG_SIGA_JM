import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-tarjeta-dictamen',
  templateUrl: './tarjeta-dictamen.component.html',
  styleUrls: ['./tarjeta-dictamen.component.scss']
})
export class TarjetaDictamenComponent implements OnInit {

  dForm = new FormGroup({
  });
  constructor() { }
  datePickers1 = ["Fecha"];
  inputs1 = [
    {
      nombre: "Observaciones",
      valor: ""
    }];

  selectores1 = [
    {
      nombre: "Tipo Dictamen",
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
      nombre: "Fundamento Calificación",
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
  ngOnInit(): void {
  }

}
