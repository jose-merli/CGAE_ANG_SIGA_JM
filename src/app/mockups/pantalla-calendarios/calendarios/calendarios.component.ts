import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendarios',
  templateUrl: './calendarios.component.html',
  styleUrls: ['./calendarios.component.scss']
})
export class CalendariosComponent implements OnInit {
  isDisabled = true;
  show = true;
  cFormValidity = true;
  modoBusqueda = 'a';
  modoBusquedaB = false;
  allSelected = false;
  rutas: string[] = ['SJCS', 'Guardia', 'Calendarios programados'];
  cabeceras = [
    {
      id: "turno",
      name: "Turno"
    },
    {
      id: "guardia",
      name: "Guardia"
    },
    {
      id: "fechaCalendarioDesde",
      name: "Fecha Calendario Desde"
    },
    {
      id: "fechaCalendarioHasta",
      name: "Fecha Calendario Hasta"
    },
    {
      id: "fechaProgramada",
      name: "Fecha programada"
    },
    {
      id: "listaGuardias",
      name: "Lista de Guardias"
    },
    {
      id: "observaciones",
      name: "Observaciones"
    },
    {
      id: "estado",
      name: "Estado"
    },
    {
      id: "generado",
      name: "Generado"
    },
    {
      id: "nGuardias",
      name: "Nº Guardias"
    }
  ];
  elementos = [
    ["SERVICIOS ASESORAMIENTO AL JOVEN ALICANTE", "Asesoramiento al joven", "01/01/2019", '05/01/2019', "08/01/2019", "DELEGACIÓN ALICANTE", "3er Trim. 2018. Asesoramiento al joven", "Generada", "Si", "10"]
  ];
  elementosAux = [
    ["SERVICIOS ASESORAMIENTO AL JOVEN ALICANTE", "Asesoramiento al joven", "01/01/2019", '05/01/2019', "08/01/2019", "DELEGACIÓN ALICANTE", "3er Trim. 2018. Asesoramiento al joven", "Generada", "Si", "10"]
  ];

  selectores1 = [
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
      nombre: "Guardias",
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
      nombre: "Lista de guardias",
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
    }, {
      nombre: "Estado",
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
  datePickers1 = ["Fecha Calendario Desde", "Fecha Calendario Hasta", "Fecha Programada Desde", "Fecha Programada Hasta"];
  inputs1 = [];
  selectores2 = [];
  datePickers2 = [];
  inputs2 = [];
  selectores = [this.selectores1, this.selectores2];
  datePickers = [this.datePickers1, this.datePickers2];
  inputs = [this.inputs1, this.inputs2];
  emptyAccordions = [];
  constructor() { }
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

}
