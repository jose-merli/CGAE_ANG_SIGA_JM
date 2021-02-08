import { Component, OnInit } from '@angular/core';
import { RowGroup, TablaResultadoDesplegableJEService } from '../tabla-resultado-desplegable-je.service';
@Component({
  selector: 'app-justificacion-expres',
  templateUrl: './justificacion-expres.component.html',
  styleUrls: ['./justificacion-expres.component.scss']
})
export class JustificacionExpresComponent implements OnInit {
  rowGroups: RowGroup[];
  rowGroupsAux: RowGroup[];
  show = true;
  numDesignas = 0;
  totalDesignas = 0;
  numActuaciones = 0;
  totalActuaciones = 0;
  cabeceras = [
    {
      value: "anio",
      label: "Año/Número Designación"
    },
    {
      value: "modulo",
      label: "Módulo"
    },
    {
      value: "actuacion",
      label: "Fecha Actuación"
    },
    {
      value: "justificacion",
      label: "Justificación"
    },
    {
      value: "acreditacion",
      label: "Acreditación"
    },
    {
      value: "validar",
      label: "Validar"
    }
  ];
  selectores1 = [
    {
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
    },
    {
      nombre: "Actuaciones Validadas",
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
      nombre: "Incluir sin EJG",
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
      nombre: "Con EJG no favorables",
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
      nombre: "EJG's sin resolución",
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
      nombre: "EJG's Resolución PTE CAJG",
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
  datePickers1 = ["Fecha de Justificación Desde", "Fecha de Justificación Hasta"];

  datePickers2 = ["Fecha de Designación Desde", "Fecha de Designación Hasta"];
  datePickers = [this.datePickers1, this.datePickers2];
  inputs1 = [
    "Año Designación", "Número Designación", "Apellidos", "Nombre", "Año EJG", "Número EJG"
  ]
  constructor(
    private trdService: TablaResultadoDesplegableJEService,
  ) { }

  ngOnInit(): void {
    this.rowGroups = this.trdService.getTableData();
    this.rowGroupsAux = this.trdService.getTableData();
  }
  showResponse() {
    this.show = true;
  }

}
