import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Message } from 'primeng/components/common/api';

@Component({
  selector: 'app-tarjeta-asistido',
  templateUrl: './tarjeta-asistido.component.html',
  styleUrls: ['./tarjeta-asistido.component.scss']
})
export class TarjetaAsistidoComponent implements OnInit {
  msgs: Message[] = [];
  @Input() title = "";
  imagen = "assets/user.PNG";
  notarioForm = new FormGroup({
    id: new FormControl(''),
    tipo: new FormControl(''),
    nombre: new FormControl(''),
    ap1: new FormControl(''),
    ap2: new FormControl(''),
  });
  campos = [{
    id: "id",
    nombre: "Identificación (*)",
    tipo: "text"
  }, {
    id: "nombre",
    nombre: "Nombre",
    tipo: "text"
  }, {
    id: "ap1",
    nombre: "Primer apellido",
    tipo: "text"
  }, {
    id: "ap2",
    nombre: "Segundo apellido",
    tipo: "text"
  }];
  selectores = [
    {
      nombre: "Tipo (*)",
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
