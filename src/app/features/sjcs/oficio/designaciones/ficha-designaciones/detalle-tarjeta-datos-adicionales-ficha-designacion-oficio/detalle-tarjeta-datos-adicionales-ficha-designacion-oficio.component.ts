import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';

@Component({
  selector: 'app-detalle-tarjeta-datos-adicionales-ficha-designacion-oficio',
  templateUrl: './detalle-tarjeta-datos-adicionales-ficha-designacion-oficio.component.html',
  styleUrls: ['./detalle-tarjeta-datos-adicionales-ficha-designacion-oficio.component.scss']
})
export class DetalleTarjetaDatosAdicionalesFichaDesignacionOficioComponent implements OnInit {

  msgs: Message[] = [];

  bloques = [
    {
      datePicker: 'Fecha Oficio Juzgado',
      textArea: 'Observaciones'
    },
    {
      datePicker: 'Fecha Recepción Colegio',
      textArea: 'Observaciones'
    },
    {
      datePicker: 'Fecha Juicio',
      time: true,
      textArea: 'Observaciones Defensa Jurídica'
    }
  ];

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
