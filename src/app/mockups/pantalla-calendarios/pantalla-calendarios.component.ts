import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';

@Component({
  selector: 'app-pantalla-calendarios',
  templateUrl: './pantalla-calendarios.component.html',
  styleUrls: ['./pantalla-calendarios.component.scss']
})
export class PantallaCalendariosComponent implements OnInit {

  msgs: Message[] = [];
  rutas: string[] = ['SJCS', 'Guardia', 'Calendarios programados'];
  show = false;

  constructor() { }

  ngOnInit() {
  }

  showResponse() {
    this.show = true;
  }
  
  hideResponse() {
    this.show = false;
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
