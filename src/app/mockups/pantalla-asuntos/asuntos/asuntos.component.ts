import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';

@Component({
  selector: 'app-asuntos',
  templateUrl: './asuntos.component.html',
  styleUrls: ['./asuntos.component.scss']
})
export class AsuntosComponent implements OnInit {
  allSelected = false;
  msgs: Message[] = [];
  show = false;
  cFormValidity = true;
  modoBusqueda = 'a';
  modoBusquedaB = false;
  radios = [
    { label: 'Designaciones', value: 'a' },
    { label: 'SOJ', value: 'b' },
    { label: 'Asistencias', value: 'c' }
  ];
  cabeceras = [
    {
      id: "anio",
      name: "Año"
    },
    {
      id: "num",
      name: "Número"
    },
    {
      id: "nProc",
      name: "Nº Procedimiento/Año/NIG"
    },
    {
      id: "juzgado",
      name: "Juzgado"
    },
    {
      id: "tipo",
      name: "Tipo"
    },
    {
      id: "turnoGuard",
      name: "Turno/Guardia"
    },
    {
      id: "letrado",
      name: "Letrado"
    }
  ];
  elementos = [
    ["2018", "345", "UH5657", 'SDEGFSAGDASG', "XXX", "111111", "SFSADG DFSGDFGDG ANA"],
    ["2020", "789", "JV8765", 'DASGSDGSG', "BBB", "222222", "EWRFASWF DGSDEG JESÚS"]
  ];
  elementosAux = [
    ["2018", "345", "UH5657", 'SDEGFSAGDASG', "XXX", "111111", "SFSADG DFSGDFGDG ANA"],
    ["2020", "789", "JV8765", 'DASGSDGSG', "BBB", "222222", "EWRFASWF DGSDEG JESÚS"]
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

  changeTab() {
    this.hideResponse();
    if (this.modoBusqueda === 'b') {
      this.modoBusquedaB = true;
    } else if (this.modoBusqueda === 'a') {
      this.modoBusquedaB = false;
    }
  }
  selectedAll(event){
    this.allSelected = event;
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
