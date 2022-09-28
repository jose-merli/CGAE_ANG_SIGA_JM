import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-servicios-tramitacion-detalle-soj',
  templateUrl: './servicios-tramitacion-detalle-soj.component.html',
  styleUrls: ['./servicios-tramitacion-detalle-soj.component.scss']
})
export class ServiciosTramitacionDetalleSojComponent implements OnInit {

  progressSpinner: boolean = false;
  msgs: any[];

  constructor() { }

  ngOnInit() {
  }

  clear() {
    this.msgs = [];
  }

}
