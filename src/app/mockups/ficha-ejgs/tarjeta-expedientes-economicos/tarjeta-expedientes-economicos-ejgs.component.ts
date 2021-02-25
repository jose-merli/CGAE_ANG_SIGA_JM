import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';

@Component({
  selector: 'app-tarjeta-expedientes-economicos-ejgs',
  templateUrl: './tarjeta-expedientes-economicos-ejgs.component.html',
  styleUrls: ['./tarjeta-expedientes-economicos-ejgs.component.scss']
})
export class TarjetaExpedientesEconomicosEjgsComponent implements OnInit {

  msgs: Message[] = [];
  isDisabled = true;

  cabeceras2 = [
    {
      id: "justiciable",
      name: "Justiciable"
    },
    {
      id: "solicitado",
      name: "Solicitado por"
    },
    {
      id: "fechaSolicitud",
      name: "Fecha Solicitud"
    },
    {
      id: "fechaRecepcion",
      name: "Fecha Recepción"
    },
    {
      id: "estado",
      name: "Estado"
    }
  ];

  elementos2 = [
    ["JESUCRISTO DIOS MAGDALENA", "JUAN PERSONAL DE COLEGIO", "07/04/2017 13:37:40", "09/04/2017 15:37:40", "Pendiente Información"],
    ["MARIA MAGDALENA", "JUAN PERSONAL DE COLEGIO", "07/04/2017 13:37:40", "09/04/2017 15:37:40", "Pendiente Información"],
    ["JESUS EL NAZARENO", "JUAN PERSONAL DE COLEGIO", "07/04/2017 13:37:40", "09/04/2017 15:37:40", "Anulado"]
  ];

  constructor() { }

  ngOnInit() {
  }

  showMsg(severity, summary, detail) {
    this.msgs = [];
    this.msgs.push({
      severity,
      summary,
      detail,
    });
  }

  clear() {
    this.msgs = [];
  }

  notifyAnySelected(event) {
    if (event) {
      this.isDisabled = false;
    } else {
      this.isDisabled = true;
    }
  }

}
