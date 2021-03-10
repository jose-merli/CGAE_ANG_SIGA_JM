import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-resultado-ejg',
  templateUrl: './resultado-ejg.component.html',
  styleUrls: ['./resultado-ejg.component.scss']
})
export class ResultadoEJGComponent implements OnInit {
  @Input() showResponse = false;
  @Input() cabeceras = [];
  @Input() elementos = [];
  @Input() elementosAux = [];
  @Input() allSelected = [];
  @Input() columnsSize: string[] = [];
  @Output() anySelected = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }
  notifyAnySelected(event) {
    this.anySelected.emit(event);
  }
}
