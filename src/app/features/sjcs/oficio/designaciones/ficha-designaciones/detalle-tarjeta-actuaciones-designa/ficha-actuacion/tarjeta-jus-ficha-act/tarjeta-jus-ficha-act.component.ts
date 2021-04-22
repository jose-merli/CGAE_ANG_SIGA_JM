import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';

@Component({
  selector: 'app-tarjeta-jus-ficha-act',
  templateUrl: './tarjeta-jus-ficha-act.component.html',
  styleUrls: ['./tarjeta-jus-ficha-act.component.scss']
})
export class TarjetaJusFichaActComponent implements OnInit {

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
