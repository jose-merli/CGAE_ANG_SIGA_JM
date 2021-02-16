import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-resultado-calendarios',
  templateUrl: './resultado-calendarios.component.html',
  styleUrls: ['./resultado-calendarios.component.scss']
})
export class ResultadoCalendariosComponent implements OnInit {
  @Input() showResponse = false;
  @Input() cabeceras = [];
  @Input() elementos = [];
  @Input() elementosAux = [];
  @Input() allSelected = false;
  @Output() anySelected = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
    console.log('this.allSelected 2: ', this.allSelected)
  }
  notifyAnySelected(event){
    this.anySelected.emit(event);
  }
}
