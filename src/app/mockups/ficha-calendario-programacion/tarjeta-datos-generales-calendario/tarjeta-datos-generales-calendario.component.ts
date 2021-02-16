import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Message } from 'primeng/components/common/api';

@Component({
  selector: 'app-tarjeta-datos-generales-calendario',
  templateUrl: './tarjeta-datos-generales-calendario.component.html',
  styleUrls: ['./tarjeta-datos-generales-calendario.component.scss']
})
export class TarjetaDatosGeneralesCalendarioComponent implements OnInit {
  msgs: Message[] = [];
  datePickers1 = ["Fecha desde", "Fecha hasta", "Fecha programada"];
  inputs1 = [
    {
      nombre: "Observaciones",
      valor: ""
    }];

  selectores1 = [
    {
      nombre: "Listado Guardias",
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

  constructor() { }
  dgForm = new FormGroup({
  });
  ngOnInit(): void {
  }

  showMsg(severity, summary, detail) {
    this.msgs = [];
    this.msgs.push({
      severity,
      summary,
      detail,
    });
  }

  clear() {
    this.msgs = [];
  }

}
