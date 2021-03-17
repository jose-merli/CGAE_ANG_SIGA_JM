import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';

@Component({
  selector: 'app-detalle-tarjeta-detalle-ficha-designacion-oficio',
  templateUrl: './detalle-tarjeta-detalle-ficha-designacion-oficio.component.html',
  styleUrls: ['./detalle-tarjeta-detalle-ficha-designacion-oficio.component.scss']
})
export class DetalleTarjetaDetalleFichaDesignacionOficioComponent implements OnInit {

  msgs: Message[] = [];

  inputs = ['NIG', 'Nº Procedimiento'];

  datePickers = ['Fecha estado', 'Fecha cierre'];

  selectores = [
    {
      nombre: 'Estado',
      opciones: [
        { label: 'XXXXXXXXXXXX', value: 1 },
        { label: 'XXXXXXXXXXXX', value: 2 },
        { label: 'XXXXXXXXXXXX', value: 3 }
      ]
    },
    {
      nombre: 'Juzgado',
      opciones: [
        { label: 'XXXXXXXXXXXX', value: 1 },
        { label: 'XXXXXXXXXXXX', value: 2 },
        { label: 'XXXXXXXXXXXX', value: 3 }
      ]
    },
    {
      nombre: 'Procedimiento',
      opciones: [
        { label: 'XXXXXXXXXXXX', value: 1 },
        { label: 'XXXXXXXXXXXX', value: 2 },
        { label: 'XXXXXXXXXXXX', value: 3 }
      ]
    },
    {
      nombre: 'Módulo',
      opciones: [
        { label: 'XXXXXXXXXXXX', value: 1 },
        { label: 'XXXXXXXXXXXX', value: 2 },
        { label: 'XXXXXXXXXXXX', value: 3 }
      ]
    },
    {
      nombre: 'Delitos',
      opciones: [
        { label: 'XXXXXXXXXXXX', value: 1 },
        { label: 'XXXXXXXXXXXX', value: 2 },
        { label: 'XXXXXXXXXXXX', value: 3 }
      ]
    }
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
