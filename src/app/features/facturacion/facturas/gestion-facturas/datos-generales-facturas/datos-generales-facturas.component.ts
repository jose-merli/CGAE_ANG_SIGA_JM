import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Message } from 'primeng/primeng';
import { FacturasItem } from '../../../../../models/FacturasItem';

@Component({
  selector: 'app-datos-generales-facturas',
  templateUrl: './datos-generales-facturas.component.html',
  styleUrls: ['./datos-generales-facturas.component.scss']
})
export class DatosGeneralesFacturasComponent implements OnInit {

  msgs: Message[] = [];
  progressSpinner: boolean = false;

  @Input() openTarjetaDatosGenerales;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Output() guardadoSend = new EventEmitter<FacturasItem>();

  @Input() bodyInicial: FacturasItem;

  resaltadoDatos: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  // Abrir y cerrar la ficha

  esFichaActiva(): boolean {
    return this.openTarjetaDatosGenerales;
  }

  abreCierraFicha(key): void {
    this.openTarjetaDatosGenerales = !this.openTarjetaDatosGenerales;
    this.opened.emit(this.openTarjetaDatosGenerales);
    this.idOpened.emit(key);
  }

  // Mensajes en pantalla

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  clear() {
    this.msgs = [];
  }

}
