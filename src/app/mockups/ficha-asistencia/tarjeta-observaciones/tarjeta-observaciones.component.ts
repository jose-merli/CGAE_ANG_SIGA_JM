import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Message } from 'primeng/components/common/api';

@Component({
  selector: 'app-tarjeta-observaciones',
  templateUrl: './tarjeta-observaciones.component.html',
  styleUrls: ['./tarjeta-observaciones.component.scss']
})
export class TarjetaObservacionesComponent implements OnInit {
  msgs: Message[] = [];
  msgInfo: boolean = false;
  rForm = new FormGroup({
  });
  constructor() { }
  datePickers1 = ["Fecha Cierre"];
  
  inputs1 = [
    {
      nombre: "Observaciones",
      valor: ""
    },
    {
      nombre: "Incidencias",
      valor: ""
    }];
  campos1 = [
      {
        nombre: "Estado",
        valor: "ACTIVA"
      },
      {
        nombre: "Fecha estado",
        valor: "28/02/2018"
      }];

  ngOnInit(): void {
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
