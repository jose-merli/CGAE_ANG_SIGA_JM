import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';

@Component({
  selector: 'app-detalle-tarjeta-datos-generales-ficha-designacion-oficio',
  templateUrl: './detalle-tarjeta-datos-generales-ficha-designacion-oficio.component.html',
  styleUrls: ['./detalle-tarjeta-datos-generales-ficha-designacion-oficio.component.scss']
})
export class DetalleTarjetaDatosGeneralesFichaDesignacionOficioComponent implements OnInit {

  msgs: Message[] = [];

  selectores = [
    {
      nombre: "Turno",
      opciones: [
        { label: 'XXXXXXXXXX', value: '1' },
        { label: 'XXXXXXXXXX', value: '2' },
        { label: 'XXXXXXXXXX', value: '3' },
      ]
    },
    {
      nombre: "Tipo",
      opciones: [
        { label: 'XXXXXXXXXX', value: '1' },
        { label: 'XXXXXXXXXX', value: '2' },
        { label: 'XXXXXXXXXX', value: '3' },
      ]
    }
  ];

  inputs = ['Número de colegiado', 'Apellidos', 'Nombre'];

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
