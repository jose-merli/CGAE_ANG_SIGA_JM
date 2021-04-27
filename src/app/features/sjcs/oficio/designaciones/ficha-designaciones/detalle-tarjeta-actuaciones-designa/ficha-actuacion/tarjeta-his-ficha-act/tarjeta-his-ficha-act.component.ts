import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Col } from '../../detalle-tarjeta-actuaciones-designa.component';

export class AccionItem {
  fecha: string;
  accion: string;
  usuario: string;
  observaciones: string;
}

@Component({
  selector: 'app-tarjeta-his-ficha-act',
  templateUrl: './tarjeta-his-ficha-act.component.html',
  styleUrls: ['./tarjeta-his-ficha-act.component.scss']
})
export class TarjetaHisFichaActComponent implements OnInit {

  @Input() listaAcciones: AccionItem[] = [];
  cols: Col[] = [
    {
      field: 'fecha',
      header: 'dato.jgr.guardia.saltcomp.fecha',
      width: '16.666666666666%'
    },
    {
      field: 'accion',
      header: 'justiciaGratuita.oficio.inscripciones.accion',
      width: '16.666666666666%'
    },
    {
      field: 'usuario',
      header: 'censo.usuario.usuario',
      width: '33.333333333333%'
    },
    {
      field: 'observaciones',
      header: 'justiciaGratuita.Calendarios.Observaciones',
      width: '33.333333333333%'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
