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
  cabeceras = [
    {
      id: "anio",
      name: "Año/Número Designación"
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
      opciones: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    },
    {
      nombre: "Actuaciones Validadas",
      opciones: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    },
    {
      nombre: "Incluir sin EJG",
      opciones: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    },
    {
      nombre: "Con EJG no favorables",
      opciones: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    },
    {
      nombre: "EJG's sin resolución",
      opciones: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    },
    {
      nombre: "EJG's Resolución PTE CAJG",
      opciones: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
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
