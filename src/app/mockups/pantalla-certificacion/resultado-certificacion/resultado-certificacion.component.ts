import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-resultado-certificacion',
  templateUrl: './resultado-certificacion.component.html',
  styleUrls: ['./resultado-certificacion.component.scss']
})
export class ResultadoCertificacionComponent implements OnInit {
  @Input() allSelected = false;
  @Input() showResponse = false;
  @Input() cabeceras = [];
  @Input() elementos = [];
  @Input() elementosAux = [];
  @Output() anySelected = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }
  notifyAnySelected(event){
    this.anySelected.emit(event);
  }
}
