import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';

@Component({
  selector: 'app-detalle-tarjeta-datos-facturacion-ficha-designacion-oficio',
  templateUrl: './detalle-tarjeta-datos-facturacion-ficha-designacion-oficio.component.html',
  styleUrls: ['./detalle-tarjeta-datos-facturacion-ficha-designacion-oficio.component.scss']
})
export class DetalleTarjetaDatosFacturacionFichaDesignacionOficioComponent implements OnInit {

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