import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';

@Component({
  selector: 'app-detalle-tarjeta-documentacion-ficha-actuacion',
  templateUrl: './detalle-tarjeta-documentacion-ficha-actuacion.component.html',
  styleUrls: ['./detalle-tarjeta-documentacion-ficha-actuacion.component.scss']
})
export class DetalleTarjetaDocumentacionFichaActuacionComponent implements OnInit {

  msgs: Message[] = [];
  allSelected = false;
  isDisabled = true;

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

  elementos = [
    ['28/08/2007', "2 Inic. DILIGENCIAS INDETERMINADAS", "Justificación Actuación", "jrbgjrbjrbjr.txt", ""],
    ['28/08/2007', "2 Inic. DILIGENCIAS INDETERMINADAS", "Justificación Actuación", "ththtrhtrh.txt", ""],
    ['28/08/2007', "2 Inic. DILIGENCIAS INDETERMINADAS", "Justificación Actuación", "grgergerg_frfger.doc", "grbejgberjgberj"],
    ['28/08/2007', "2 Inic. DILIGENCIAS INDETERMINADAS", "Justificación Actuación", "TOLEDO_30112015_REV2_59722.xls", ""],
  ];

  elementosAux = [
    ['28/08/2007', "2 Inic. DILIGENCIAS INDETERMINADAS", "Justificación Actuación", "jrbgjrbjrbjr.txt", ""],
    ['28/08/2007', "2 Inic. DILIGENCIAS INDETERMINADAS", "Justificación Actuación", "ththtrhtrh.txt", ""],
    ['28/08/2007', "2 Inic. DILIGENCIAS INDETERMINADAS", "Justificación Actuación", "grgergerg_frfger.doc", "grbejgberjgberj"],
    ['28/08/2007', "2 Inic. DILIGENCIAS INDETERMINADAS", "Justificación Actuación", "TOLEDO_30112015_REV2_59722.xls", ""],
  ];

  constructor() { }

  ngOnInit() {
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
