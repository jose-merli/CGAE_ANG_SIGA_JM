import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-tarjeta-impugnacion',
  templateUrl: './tarjeta-impugnacion.component.html',
  styleUrls: ['./tarjeta-impugnacion.component.scss']
})
export class TarjetaImpugnacionComponent implements OnInit {
  iForm = new FormGroup({
  });
  constructor() { }
  datePickers1 = ["Fecha Auto *", "Fecha Publicación"];
  inputs1 = [
    {
      nombre: "Observaciones",
      valor: ""
    }];
  inputs2 = [
    {
      nombre: "Número de Impugnación",
      valor: ""
    }];
  selectores1 = [
    {
      nombre: "Auto Resolutorio",
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
      nombre: "Sentido del Auto",
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
  checkboxTexts = [
    "Bis",
    "Requiere turnado de profesionales"
  ];
  ngOnInit(): void {
  }


}
