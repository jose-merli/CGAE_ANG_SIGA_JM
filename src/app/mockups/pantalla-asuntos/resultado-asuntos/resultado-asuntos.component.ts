import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-resultado-asuntos',
  templateUrl: './resultado-asuntos.component.html',
  styleUrls: ['./resultado-asuntos.component.scss']
})
export class ResultadoAsuntosComponent implements OnInit {
  @Input() showResponse = false;
  @Input() cabeceras = [];
  @Input() elementos = [];
  @Input() elementosAux = [];
  @Input() allSelected = false;
  @Output() anySelected = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }
  notifyAnySelected(event){
    this.anySelected.emit(event);
  }
}
