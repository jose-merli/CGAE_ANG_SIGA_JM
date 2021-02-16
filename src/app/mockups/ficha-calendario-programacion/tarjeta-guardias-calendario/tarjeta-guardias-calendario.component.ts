import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { TablaResultadoMixFCService, Row } from '../../shared/tabla-resultado-mix/tabla-resultado-mix-fc.service';

@Component({
  selector: 'app-tarjeta-guardias-calendario',
  templateUrl: './tarjeta-guardias-calendario.component.html',
  styleUrls: ['./tarjeta-guardias-calendario.component.scss']
})
export class TarjetaGuardiasCalendarioComponent implements OnInit {
  msgs: Message[] = [];
  rowGroups: Row[];
  rowGroupsAux: Row[];
  showDatos: boolean = false;
  modoBusqueda: string = 'b';
  modoBusquedaB: boolean = true;
  selectAll = false;
  isDisabled = true;
  selectMultiple = false;
  showResponse = true;
  titulo = "Guardias Calendario";
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
      id: "generado",
      name: "Generado"
    },
    {
      id: "nGuardias",
      name: "Nº Guardias"
    }
  ];
  seleccionarTodo = false;

  constructor(
    private trmService: TablaResultadoMixFCService,
  ) { }

  ngOnInit(): void {
    this.rowGroups = this.trmService.getTableData();
    this.rowGroupsAux = this.trmService.getTableData();
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

