import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';

@Component({
  selector: 'app-detalle-tarjeta-justificacion-ficha-actuacion-oficio',
  templateUrl: './detalle-tarjeta-justificacion-ficha-actuacion-oficio.component.html',
  styleUrls: ['./detalle-tarjeta-justificacion-ficha-actuacion-oficio.component.scss']
})
export class DetalleTarjetaJustificacionFichaActuacionOficioComponent implements OnInit {

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
