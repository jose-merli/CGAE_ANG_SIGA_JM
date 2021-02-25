import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { RowGroup, TablaResultadoDesplegableJEService } from '../../tabla-resultado-desplegable/tabla-resultado-desplegable-je.service';
@Component({
  selector: 'app-justificacion-expres',
  templateUrl: './justificacion-expres.component.html',
  styleUrls: ['./justificacion-expres.component.scss']
})
export class JustificacionExpresComponent implements OnInit {
  msgs: Message[] = [];
  rowGroups: RowGroup[];
  rowGroupsAux: RowGroup[];
  show = false;
  numDesignas = 0;
  totalDesignas = 0;
  numActuaciones = 0;
  totalActuaciones = 0;
  isDisabled = true;
  modoBusqueda = 'b';
  radios = [
    { label: 'Designas', value: 'a' },
    { label: 'Justificación Exprés', value: 'b' }
  ];
  cabeceras = [
    {
      id: "anio",
      name: "Año/Número Designación"
    },
    {
      id: 'ejgs',
      name: "EJG's"
    },
    {
      id: 'clientes',
      name: 'Clientes'
    },
    {
      id: 'finalizado',
      name: 'Finalizado'
    },
    {
      id: 'juzgado',
      name: 'Juzgado'
    },
    {
      id: 'nig',
      name: 'NIG'
    },
    {
      id: 'nproced',
      name: 'Nº Proced'
    },
    {
      id: "modulo",
      name: "Módulo"
    },
    {
      id: "actuacion",
      name: "Fecha Actuación"
    },
    {
      id: "justificacion",
      name: "Justificación"
    },
    {
      id: "acreditacion",
      name: "Acreditación"
    },
    {
      id: "validar",
      name: "Validar"
    }
  ];
  selectores1 = [
    {
      nombre: "Estado",
      opciones: [{ label: 'XXXXXXXXXXX', value: 1 },
      { label: 'XXXXXXXXXXX', value: 2 },
      { label: 'XXXXXXXXXXX', value: 3 },]
    },
    {
      nombre: "Actuaciones Validadas",
      opciones: [{ label: 'XXXXXXXXXXX', value: 1 },
      { label: 'XXXXXXXXXXX', value: 2 },
      { label: 'XXXXXXXXXXX', value: 3 },]
    },
    {
      nombre: "Incluir sin EJG",
      opciones: [{ label: 'XXXXXXXXXXX', value: 1 },
      { label: 'XXXXXXXXXXX', value: 2 },
      { label: 'XXXXXXXXXXX', value: 3 },]
    },
    {
      nombre: "Con EJG no favorables",
      opciones: [{ label: 'XXXXXXXXXXX', value: 1 },
      { label: 'XXXXXXXXXXX', value: 2 },
      { label: 'XXXXXXXXXXX', value: 3 },]
    },
    {
      nombre: "EJG's sin resolución",
      opciones: [{ label: 'XXXXXXXXXXX', value: 1 },
      { label: 'XXXXXXXXXXX', value: 2 },
      { label: 'XXXXXXXXXXX', value: 3 },]
    },
    {
      nombre: "EJG's Resolución PTE CAJG",
      opciones: [{ label: 'XXXXXXXXXXX', value: 1 },
      { label: 'XXXXXXXXXXX', value: 2 },
      { label: 'XXXXXXXXXXX', value: 3 },]
    }
  ];
  datePickers1 = ["Fecha de Justificación Desde", "Fecha de Justificación Hasta"];

  datePickers2 = ["Fecha de Designación Desde", "Fecha de Designación Hasta"];
  datePickers = [this.datePickers1, this.datePickers2];
  inputs1 = [
    "Año Designación", "Número Designación", "Apellidos", "Nombre", "Año EJG", "Número EJG"
  ];
  seleccionarTodo = false;
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
  hideResponse() {
    this.show = false;
  }
  selectedAll(event) {
    this.seleccionarTodo = event;
    this.isDisabled = !event;
  }
  notifyAnySelected(event) {
    if (event) {
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

}
