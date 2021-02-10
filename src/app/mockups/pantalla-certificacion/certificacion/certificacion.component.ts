import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-certificacion2',
  templateUrl: './certificacion.component.html',
  styleUrls: ['./certificacion.component.scss']
})
export class CertificacionComponent2 implements OnInit {
  isDisabled = true;
  cFormValidity = true;
  show = false;
  allSelected = false;
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
  saveForm($event) {
    this.cFormValidity = $event;
  }
  showResponse() {
    this.show = true;
  }
  hideResponse() {
    this.show = false;
  }
  selectedAll(event){
    this.allSelected = event;
    this.isDisabled = !event;
  }
  notifyAnySelected(event){
    if (this.allSelected || event){
      this.isDisabled = false;
    } else {
      this.isDisabled = true;
    }
  }
}
