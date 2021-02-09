import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';

@Component({
  selector: 'app-asuntos',
  templateUrl: './asuntos.component.html',
  styleUrls: ['./asuntos.component.scss']
})
export class AsuntosComponent implements OnInit {
  msgs: Message[] = [];
  show = false;
  cFormValidity = true;
  modoBusqueda = 'a';
  radios = [
    { label: 'Designaciones', value: 'a' },
    { label: 'SOJ', value: 'b' },
    { label: 'Asistencias', value: 'c' }
  ];
  cabeceras = [
    {
      id: "nif",
      name: "NIF/CIF"
    },
    {
      id: "nombre",
      name: "Nombre"
    },
    {
      id: "apellidos",
      name: "Apellidos"
    },
    {
      id: "colegio",
      name: "Colegio"
    },
    {
      id: "numColegiado",
      name: "Número de Colegiado"
    },
    {
      id: "estado",
      name: "Estado colegial"
    },
    {
      id: "residencia",
      name: "Residencia"
    }
  ];
  elementos = [
    ["78909876R", "JUAN", "ASNDADBH AHDBHAJD", 'ALCALÁ DE HENARES', "1702", "Ejerciente", "No"],
    ["23909876R", "ANA", "ASNDADBH AHDBHAJD", 'BALCALÁ DE HENARES', "1402", "Ejerciente", "Si"]
  ];
  elementosAux = [
    ["78909876R", "JUAN", "ASNDADBH AHDBHAJD", 'ALCALÁ DE HENARES', "1702", "Ejerciente", "No"],
    ["23909876R", "ANA", "ASNDADBH AHDBHAJD", 'BALCALÁ DE HENARES', "1402", "Ejerciente", "Si"]
  ];

  selectores1 = [
    {
      nombre: "Tipo Designación",
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
      nombre: "Estado Designación",
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
      nombre: "Juzgado",
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
  datePickers1 = ["Fecha Apertura Designación"];


  selectores2 = [
    {
      nombre: "Turno",
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
      nombre: "Guardia",
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
      nombre: "Colegio",
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
  datePickers2 = [];
  selectores = [this.selectores1, this.selectores2];
  datePickers = [this.datePickers1, this.datePickers2];
  emptyAccordions = ["Datos Defensa", "CAJG"];
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
