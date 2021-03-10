import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { TablaResultadoMixFAService, Row } from '../../shared/tabla-resultado-mix/tabla-resultado-mix-fa.service';

@Component({
  selector: 'app-detalle-tarjeta-documentacion-ficha-actuacion',
  templateUrl: './detalle-tarjeta-documentacion-ficha-actuacion.component.html',
  styleUrls: ['./detalle-tarjeta-documentacion-ficha-actuacion.component.scss']
})
export class DetalleTarjetaDocumentacionFichaActuacionComponent implements OnInit {

  msgs: Message[] = [];
  allSelected = false;
  isDisabled = true;
  rowGroups: Row[];
  rowGroupsAux: Row[];
  showDatos: boolean = false;
  modoBusqueda: string = 'b';
  modoBusquedaB: boolean = true;
  selectAll = false;
  selectMultiple = false;
  showResponse = true;
  cabeceras = [
    {
      id: "fechaentrada",
      name: "Fecha entrada"
    },
    {
      id: "asociado",
      name: "Asociado a"
    },
    {
      id: "tipodocumentacion",
      name: "Tipo documentación"
    },
    {
      id: "nombre",
      name: "Nombre"
    },
    {
      id: "observaciones",
      name: "Observaciones"
    },
  ];

  constructor(
    private trmService: TablaResultadoMixFAService,
  ) { }

  ngOnInit(): void {
    this.rowGroups = this.trmService.getTableData();
    this.rowGroupsAux = this.trmService.getTableData();
  }

  selectedAll(event) {
    this.allSelected = event;
    this.isDisabled = !event;
  }
  notifyAnySelected(event) {
    if (this.allSelected || event) {
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
