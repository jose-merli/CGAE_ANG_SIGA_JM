import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';

@Component({
  selector: 'app-detalle-tarjeta-datos-generales-ficha-actuacion',
  templateUrl: './detalle-tarjeta-datos-generales-ficha-actuacion.component.html',
  styleUrls: ['./detalle-tarjeta-datos-generales-ficha-actuacion.component.scss']
})
export class DetalleTarjetaDatosGeneralesFichaActuacionComponent implements OnInit {
  numActuacion = 3;
  estado = 'ACTIVA';

  msgs: Message[] = [];

  selectores1 = [
    {
      nombre: "Tipo Actuación (*)",
      opciones: [
        { label: 'XXXXXXXXXX', value: 1 },
        { label: 'XXXXXXXXXX', value: 2 },
        { label: 'XXXXXXXXXX', value: 3 },
      ]
    },
    {
      nombre: "Coste",
      opciones: [
        { label: 'XXXXXXXXXX', value: 1 },
        { label: 'XXXXXXXXXX', value: 2 },
        { label: 'XXXXXXXXXX', value: 3 },
      ]
    },
  ];

  selectores2 = [
    {
      nombre: "Comisaría",
      opciones: [
        { label: 'XXXXXXXXXX', value: 1 },
        { label: 'XXXXXXXXXX', value: 2 },
        { label: 'XXXXXXXXXX', value: 3 },
      ]
    },
    {
      nombre: "Juzgado",
      opciones: [
        { label: 'XXXXXXXXXX', value: 1 },
        { label: 'XXXXXXXXXX', value: 2 },
        { label: 'XXXXXXXXXX', value: 3 },
      ]
    },
    {
      nombre: "Prisión",
      opciones: [
        { label: 'XXXXXXXXXX', value: 1 },
        { label: 'XXXXXXXXXX', value: 2 },
        { label: 'XXXXXXXXXX', value: 3 },
      ]
    },
  ];

  constructor() { }

  ngOnInit() {
  }

  showMsg(severity, summary, detail) {
    this.msgs = [];
    this.msgs.push({
      severity,
      summary,
      detail
    });
  }

  clear() {
    this.msgs = [];
  }

}
