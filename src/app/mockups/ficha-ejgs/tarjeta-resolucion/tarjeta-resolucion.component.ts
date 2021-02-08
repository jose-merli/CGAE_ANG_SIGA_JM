import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-tarjeta-resolucion',
  templateUrl: './tarjeta-resolucion.component.html',
  styleUrls: ['./tarjeta-resolucion.component.scss']
})
export class TarjetaResolucionComponent implements OnInit {
  rForm = new FormGroup({
  });
  constructor() { }
  datePickers1 = ["Fecha Presentación ponente", "Fecha Resolución CAJG", "Fecha Notificación", "Fecha Resolución Firme"];
  selectores1 = [
    {
      nombre: "Año/Acta - Fecha Resolución",
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
      nombre: "Resolución del expediente",
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
      nombre: "Fundamento Resolución",
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
      nombre: "Origen (en caso traslado)",
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
      nombre: "Ponente",
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
  inputs1 = [
    {
      nombre: "Observaciones",
      valor: ""
    },
    {
      nombre: "Notas",
      valor: ""
    }];
  inputs2 = [
    {
      nombre: "Ref. Auto",
      valor: ""
    }];
  inputsDivididos = ["CAJG Año / Número"];
  checkboxTexts = [
    "Requiere turnado de profesionales",
    "Notificar al procurador contrario"
  ];
  textoInformativo = "Importante: El expediente se considera 'Resuelto' cuando se consigne, al menos, la Fecha de Resolución y el sentido de la Resolución.";

  ngOnInit(): void {
  }

}
