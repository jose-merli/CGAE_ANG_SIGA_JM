import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { RowGroup, TablaResultadoDesplegableAEService } from '../../tabla-resultado-desplegable/tabla-resultado-desplegable-ae.service';

@Component({
  selector: 'app-resultado-asistencia-expres',
  templateUrl: './resultado-asistencia-expres.component.html',
  styleUrls: ['./resultado-asistencia-expres.component.scss']
})
export class ResultadoAsistenciaExpresComponent implements OnInit {
  msgs: Message[] = [];
  rowGroups: RowGroup[];
  rowGroupsAux: RowGroup[];
  showDatos: boolean = false;
  modoBusqueda: string = 'b';
  modoBusquedaB: boolean = true;
  selectAll = false;
  isDisabled = true;
  selectMultiple = false;
  titulo = "Asistencias";
  cabeceras = [
    {
      id: "asistencia",
      name: "Asistencia"
    },
    {
      id: "idApNombreSexo",
      name: "Nº Identificación - Apellido 1 Apellido 2, Nombre - Sexo"
    },
    {
      id: "delitosYobservaciones",
      name: "Delitos / Observaciones"
    },
    {
      id: "ejg",
      name: "EJG"
    },
    {
      id: "actuacion",
      name: "Fecha Actuación"
    },
    {
      id: "lugar",
      name: "Lugar"
    },
    {
      id: "diligencia",
      name: "Nª Diligencia"
    }
  ];
  seleccionarTodo = false;

  constructor(
    private trdService: TablaResultadoDesplegableAEService,
  ) { }

  ngOnInit(): void {
    this.rowGroups = this.trdService.getTableData();
    this.rowGroupsAux = this.trdService.getTableData();
  }

  selectedAll(event) {
    this.seleccionarTodo = event;
    this.isDisabled = !event;
  }
  notifyAnySelected(event) {
    if (this.seleccionarTodo || event) {
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
