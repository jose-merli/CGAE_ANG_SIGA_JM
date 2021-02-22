import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { Row, TablaResultadoMixDAService } from '../../shared/tabla-resultado-mix/tabla-resultado-mix-da.service';

@Component({
  selector: 'app-detalle-tarjeta-documentacion-ficha-designacion-oficio',
  templateUrl: './detalle-tarjeta-documentacion-ficha-designacion-oficio.component.html',
  styleUrls: ['./detalle-tarjeta-documentacion-ficha-designacion-oficio.component.scss']
})
export class DetalleTarjetaDocumentacionFichaDesignacionOficioComponent implements OnInit {
  showResponse = true;
  msgs: Message[] = [];
  rowGroups: Row[];
  rowGroupsAux: Row[];
  showDatos: boolean = false;
  modoBusqueda: string = 'b';
  modoBusquedaB: boolean = true;
  selectAll = false;
  isDisabled = true;
  selectMultiple = false;
  titulo = "Documentación";
  cabeceras = [
    {
      id: "fecha",
      name: "Fecha"
    },
    {
      id: "asociado",
      name: "Asociado"
    },
    {
      id: "tipoDocumentación",
      name: "Tipo documentación"
    },
    {
      id: "nombre",
      name: "Nombre"
    },
    {
      id: "observaciones",
      name: "Observaciones"
    }
  ];
  seleccionarTodo = false;

  constructor(
    private trmService: TablaResultadoMixDAService,
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