import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';

@Component({
  selector: 'app-detalle-tarjeta-justificacion-ficha-actuacion',
  templateUrl: './detalle-tarjeta-justificacion-ficha-actuacion.component.html',
  styleUrls: ['./detalle-tarjeta-justificacion-ficha-actuacion.component.scss']
})
export class DetalleTarjetaJustificacionFichaActuacionComponent implements OnInit {

  msgs: Message[] = [];

  constructor() { }

  ngOnInit() {
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
