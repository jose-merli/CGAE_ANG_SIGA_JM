import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';

@Component({
  selector: 'app-tarjeta-actuaciones',
  templateUrl: './tarjeta-actuaciones.component.html',
  styleUrls: ['./tarjeta-actuaciones.component.scss']
})
export class TarjetaActuacionesComponent implements OnInit {
  allSelected = false;
  isDisabled = true;
  msgs: Message[] = [];

  cabeceras = [
    {
      id: "nActuaciones",
      name: "Nº Actuaciones"
    },
    {
      id: "fActuacion",
      name: "Fecha Actuación"
    },
    {
      id: "fDesde",
      name: "Fecha desde"
    },
    {
      id: "nAsunto",
      name: "Nº Asunto"
    },
    {
      id: "tipoAct",
      name: "Tipo Actuación"
    },
    {
      id: "justificada",
      name: "Justificada"
    },
    {
      id: "validada",
      name: "Validada"
    },
    {
      id: "facturación",
      name: "Facturación"
    }
  ];
  elementos = [
    ['7890', "10/08/2018", "10/08/2018", "0602/14", "Declaración Judicial", "10/08/2018", "Si", "papelera@redabogacia.com"],
    ['2376', "12/08/2017", "12/08/2017", "9632/14", "Declaración Policial", "12/08/2017", "No", ""]
  ];
  elementosAux = [
    ['7890', "10/08/2018", "10/08/2018", "0602/14", "Declaración Judicial", "10/08/2018", "Si", "papelera@redabogacia.com"],
    ['2376', "12/08/2017", "12/08/2017", "9632/14", "Declaración Policial", "12/08/2017", "No", ""]
  ];

  constructor() { }

  ngOnInit() {
  }
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

}
