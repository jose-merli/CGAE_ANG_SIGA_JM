import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { DataTable, Message } from 'primeng/primeng';

@Component({
  selector: 'app-tabla-ficheros-devoluciones',
  templateUrl: './tabla-ficheros-devoluciones.component.html',
  styleUrls: ['./tabla-ficheros-devoluciones.component.scss']
})
export class TablaFicherosDevolucionesComponent implements OnInit, OnChanges {
  
  constructor() { }

  ngOnInit() {
  }

  // Se actualiza cada vez que cambien los inputs
  ngOnChanges() {
  }

  

}
