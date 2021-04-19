import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';

@Component({
  selector: 'app-tarjeta-justificacion-ficha-act',
  templateUrl: './tarjeta-justificacion-ficha-act.component.html',
  styleUrls: ['./tarjeta-justificacion-ficha-act.component.scss']
})
export class TarjetaJustificacionFichaActComponent implements OnInit {

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
