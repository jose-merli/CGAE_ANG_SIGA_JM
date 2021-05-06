import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tarjeta-rel-ficha-act',
  templateUrl: './tarjeta-rel-ficha-act.component.html',
  styleUrls: ['./tarjeta-rel-ficha-act.component.scss']
})
export class TarjetaRelFichaActComponent implements OnInit, OnChanges {

  @Input() relaciones: any;
  @Output() changeDataEvent = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes.relaciones.currentValue) {
      let campos;
      if (this.relaciones == undefined && this.relaciones == null || this.relaciones.length == 0) {
        campos = [{
          "key": "Nº total",
          "value": "No existen relaciones asociadas a la actuación"
        }];

      } else {
        campos = [{
          "key": "Nº total",
          "value": this.relaciones.length
        }];
      }

      let event = {
        tarjeta: 'sjcsDesigActuaOfiRela',
        campos: campos
      }
      this.changeDataEvent.emit(event);

    }

  }

}
