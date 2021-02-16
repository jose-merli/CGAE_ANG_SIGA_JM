import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-tabla-busqueda-ejg',
  templateUrl: './tabla-busqueda-ejg.component.html',
  styleUrls: ['./tabla-busqueda-ejg.component.scss']
})
export class TablaBusquedaEJGComponent implements OnInit {
  @Input() showResponse = false;
  @Input() cabeceras = [];
  @Input() elementos = [];
  @Input() elementosAux = [];
  @Input() allSelected = [];
  @Output() anySelected = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }
  notifyAnySelected(event){
    this.anySelected.emit(event);
  }
}
