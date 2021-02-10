import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';

@Component({
  selector: 'app-asistencia-expres',
  templateUrl: './asistencia-expres.component.html',
  styleUrls: ['./asistencia-expres.component.scss']
})
export class AsistenciaExpresComponent implements OnInit {
  msgs: Message[] = [];
  show = false;
  cFormValidity = true;
  modoBusqueda = 'b';
  rutas: string[] = ['SJCS', 'Guardia', 'Asistencias'];
  radios = [
    { label: 'Búsqueda de Asistencias', value: 'a' },
    { label: 'Asistencia Exprés', value: 'b' }
  ];
  selectores1 = [
    {
      nombre: "Turno",
      opciones: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    },
    {
      nombre: "Guardia",
      opciones: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    },
    {
      nombre: "Tipo Asistencia Colegio",
      opciones: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    },
    {
      nombre: "Letrado de Guardia",
      opciones: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }
  showResponse() {
    this.show = true;
  }
  hideResponse() {
    this.show = false;
  }
  saveForm($event) {
    this.cFormValidity = $event;
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
