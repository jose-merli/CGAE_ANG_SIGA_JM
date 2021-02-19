import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';

@Component({
  selector: 'app-ficha-calendario-programacion',
  templateUrl: './ficha-calendario-programacion.component.html',
  styleUrls: ['./ficha-calendario-programacion.component.scss']
})
export class FichaCalendarioProgramacionComponent implements OnInit {

  isDisabled = true;
  msgs: Message[] = [];
  cFormValidity = true;
  show = true;
  allSelected = false;

  listaTarjetas = [
    {
      id: 'sjcsGuardiaFicCalProDatGen',
      nombre: "Datos Generales",
      imagen: "",
      icono: 'fa fa-user',
      fixed: false,
      detalle: true,
      opened: true,
      campos: []
    },
    {
      id: 'sjcsGuardiaFicCalProGuarCalen',
      nombre: "Guardias Calendario",
      imagen: "",
      icono: 'fa fa-pencil-square',
      fixed: false,
      detalle: true,
      opened: true,
      campos: []
    },
  ];


  cabeceras = [
    {
      id: "periodo",
      name: "Periodo"
    },
    {
      id: "nombre",
      name: "Nombre"
    },
    {
      id: "turno",
      name: "Turno"
    },
    {
      id: "guardia",
      name: "Guardia"
    },
    {
      id: "ejg",
      name: "EJG"
    },
    {
      id: "soj",
      name: "SOJ"
    },
    {
      id: "total",
      name: "Total"
    },
    {
      id: "estado",
      name: "Estado"
    }
  ]
  elementos = [
    ['02/01/2007 - 01/01/2008', "T.O. Primer Trimestre", "78.000,45€", "78.000,45€", "200,45€", "78.000,45€", "88.000,45€", "Enviado"],
    ['01/01/2007 - 01/01/2008', "T.O. Primer Trimestre", "38.000,45€", "38.000,45€", "200,45€", "78.000,45€", "88.000,45€", "Enviado"]
  ];

  elementosAux = [
    ['02/01/2007 - 01/01/2008', "T.O. Primer Trimestre", "78.000,45€", "78.000,45€", "200,45€", "78.000,45€", "88.000,45€", "Enviado"],
    ['01/01/2007 - 01/01/2008', "T.O. Primer Trimestre", "38.000,45€", "38.000,45€", "200,45€", "78.000,45€", "88.000,45€", "Enviado"]
  ];
  constructor() { }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    this.goTop();
  }

  saveForm($event) {
    this.cFormValidity = $event;
  }
  showResponse() {
    this.show = true;
  }
  hideResponse() {
    this.show = false;
  }

  selectedAll(event) {
    this.allSelected = event;
    this.isDisabled = !event;
  }
  notifyAnySelected(event) {
    if (this.allSelected || event) {
      this.isDisabled = false;
    } else {
      this.isDisabled = true;
    }
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

  goTop() {
    let top = document.getElementById("top");
    if (top) {
      top.scrollIntoView();
      top = null;
    }
  }
}
