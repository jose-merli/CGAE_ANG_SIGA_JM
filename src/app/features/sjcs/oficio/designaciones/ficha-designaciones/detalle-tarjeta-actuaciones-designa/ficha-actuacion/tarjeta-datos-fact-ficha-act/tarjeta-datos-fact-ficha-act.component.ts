import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';

@Component({
  selector: 'app-tarjeta-datos-fact-ficha-act',
  templateUrl: './tarjeta-datos-fact-ficha-act.component.html',
  styleUrls: ['./tarjeta-datos-fact-ficha-act.component.scss']
})
export class TarjetaDatosFactFichaActComponent implements OnInit {

  selector =
    {
      nombre: "Partida Presepuestaria",
      opciones: [
        { label: 'XXXXXXXXXXXXXX', value: 1 },
        { label: 'XXXXXXXXXXXXXX', value: 2 },
        { label: 'XXXXXXXXXXXXXX', value: 3 },
      ]
    };

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
