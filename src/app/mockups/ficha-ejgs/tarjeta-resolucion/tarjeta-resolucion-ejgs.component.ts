import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Message } from 'primeng/components/common/api';

@Component({
  selector: 'app-tarjeta-resolucion-ejgs',
  templateUrl: './tarjeta-resolucion-ejgs.component.html',
  styleUrls: ['./tarjeta-resolucion-ejgs.component.scss']
})
export class TarjetaResolucionEjgsComponent implements OnInit {

  msgs: Message[] = [];
  msgInfo: boolean = false;
  rForm = new FormGroup({
  });

  constructor() { }

  bloque1 = {
    titulo: 'Datos resolución',
    datePickers: ["Fecha Resolución CAJG"],
    selectores: [
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
      }
    ],
    inputsDivididos: ["CAJG Año / Número"],
    textoInformativo: "Importante: El expediente se considera 'Resuelto'\ncuando se consigne, al menos, la Fecha de\nResolución y el sentido de la Resolución."
  };

  bloque2 = {
    titulo: 'Observaciones',
    textAreas: ["Observaciones", "Notas"]
  };

  bloque3 = {
    titulo: 'Otros datos',
    datePickers: ["Fecha Presentación ponente", "Fecha Notificación", "Fecha Resolución Firme"],
    selectores: [
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
    ],
    inputs: ["Ref. Auto"],
    checkboxs: ["Requiere turnado de profesionales", "Notificar al procurador contrario"]
  };


  ngOnInit(): void {
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
