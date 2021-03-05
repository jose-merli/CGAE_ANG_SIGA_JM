import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { Location } from '@angular/common';

@Component({
  selector: 'app-pantalla-buscador-procurador',
  templateUrl: './pantalla-buscador-procurador.component.html',
  styleUrls: ['./pantalla-buscador-procurador.component.scss']
})
export class PantallaBuscadorProcuradorComponent implements OnInit {

  msgs: Message[] = [];
  show = false;

  datos = {

    selectores: [
      {
        nombre: "Colegio",
        opciones: [
          { label: 'XXXXXXXXXXX', value: 1 },
          { label: 'XXXXXXXXXXX', value: 2 },
          { label: 'XXXXXXXXXXX', value: 3 },
        ]
      }
    ],

    inputs: ['Apellidos', 'Nombre', 'Número de colegiado']

  };

  constructor(private location: Location) { }

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

  showResponse() {
    this.show = true;
  }

  hideResponse() {
    this.show = false;
  }

  goBack() {
    this.location.back();
  }

}
