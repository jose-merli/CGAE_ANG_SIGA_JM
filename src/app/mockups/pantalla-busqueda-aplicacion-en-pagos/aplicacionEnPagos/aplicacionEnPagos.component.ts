import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-aplicacionEnPagos',
  templateUrl: './aplicacionEnPagos.component.html',
  styleUrls: ['./aplicacionEnPagos.component.scss']
})
export class AplicacionEnPagosComponent implements OnInit {
  isDisabled = true;
  show = true;
  cFormValidity = true;
  modoBusqueda = 'a';
  modoBusquedaB = false;
  allSelected = false;
  radios = [
    { label: 'Retención', value: 'b' },
    { label: 'Aplicación en Pagos', value: 'a' }
  ];
  cabeceras = [
    {
      id: "nColegiado",
      name: "Nº Colegiado"
    },
    {
      id: "ApsNombre",
      name: "Apellidos, Nombre"
    },
    {
      id: "fechIni",
      name: "Fecha Inicio"
    },
    {
      id: "destinatario",
      name: "Destinatario"
    },
    {
      id: "añoMes",
      name: "Año/Mes"
    },
    {
      id: "retenido",
      name: "Importe Retenido"
    },
    {
      id: "fechaRetencion",
      name: "Fecha Retención"
    },
    {
      id: "importePago",
      name: "Importe pago"
    },
    {
      id: "pago",
      name: "Pago"
    }
  ];
  elementos = [
    ["5553", "GARCÍA, PÉREZ, JUAN", "01/01/2019", 'AEAT', "2019/01", "-100,00", "06/12/2018", "5.437,34", "Pago primer trimestre TO 2019"]
  ];
  elementosAux = [
    ["5553", "GARCÍA, PÉREZ, JUAN", "01/01/2019", 'AEAT', "2019/01", "-100,00", "06/12/2018", "5.437,34", "Pago primer trimestre TO 2019"]
  ];

  selectores1 = [
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
  datePickers1 = [];
  inputs1 = ["NIF", "Apellidos", "Nombre", "Número de colegiado"];
  selectores2 = [
    {
      nombre: "Tipo retención",
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
      nombre: "Destinatario",
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
      nombre: "Pago de aplicación",
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
  inputs2 = ["Número de Abono"];
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
