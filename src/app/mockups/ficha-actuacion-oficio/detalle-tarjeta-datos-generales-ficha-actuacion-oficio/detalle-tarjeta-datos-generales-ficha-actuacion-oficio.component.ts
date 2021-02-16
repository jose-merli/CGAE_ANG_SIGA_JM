import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';

@Component({
  selector: 'app-detalle-tarjeta-datos-generales-ficha-actuacion-oficio',
  templateUrl: './detalle-tarjeta-datos-generales-ficha-actuacion-oficio.component.html',
  styleUrls: ['./detalle-tarjeta-datos-generales-ficha-actuacion-oficio.component.scss']
})
export class DetalleTarjetaDatosGeneralesFichaActuacionOficioComponent implements OnInit {

  msgs: Message[] = [];

  inputs1 = ['Número Actuación', 'Nº Colegiado', 'Letrado', 'Talonario', 'Talón'];

  selectores = [
    {
      nombre: "Juzgado (*)",
      opciones: [
        { label: 'XXXXXXXXXXX', value: 1 },
        { label: 'XXXXXXXXXXX', value: 2 },
        { label: 'XXXXXXXXXXX', value: 3 },
      ]
    },
    {
      nombre: "Procedimiento",
      opciones: [
        { label: 'XXXXXXXXXXX', value: 1 },
        { label: 'XXXXXXXXXXX', value: 2 },
        { label: 'XXXXXXXXXXX', value: 3 },
      ]
    },
    {
      nombre: "Motivo del cambio",
      opciones: [
        { label: 'XXXXXXXXXXX', value: 1 },
        { label: 'XXXXXXXXXXX', value: 2 },
        { label: 'XXXXXXXXXXX', value: 3 },
      ]
    },
    {
      nombre: "Módulo (*)",
      opciones: [
        { label: 'XXXXXXXXXXX', value: 1 },
        { label: 'XXXXXXXXXXX', value: 2 },
        { label: 'XXXXXXXXXXX', value: 3 },
      ]
    },
    {
      nombre: "Acreditación (*)",
      opciones: [
        { label: 'XXXXXXXXXXX', value: 1 },
        { label: 'XXXXXXXXXXX', value: 2 },
        { label: 'XXXXXXXXXXX', value: 3 },
      ]
    },
    {
      nombre: "Prisión",
      opciones: [
        { label: 'XXXXXXXXXXX', value: 1 },
        { label: 'XXXXXXXXXXX', value: 2 },
        { label: 'XXXXXXXXXXX', value: 3 },
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
