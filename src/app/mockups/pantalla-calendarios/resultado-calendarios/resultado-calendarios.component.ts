import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../shared/services/data.service';

@Component({
  selector: 'app-resultado-calendarios',
  templateUrl: './resultado-calendarios.component.html',
  styleUrls: ['./resultado-calendarios.component.scss']
})
export class ResultadoCalendariosComponent implements OnInit {

  rowSelected;
  @Input() showResponse = false;
  @Input() cabeceras = [];
  @Input() elementos = [];
  @Input() elementosAux = [];
  @Input() allSelected = false;
  @Output() anySelected = new EventEmitter();

  constructor(private router: Router, private data: DataService) { }

  ngOnInit(): void {}
  
  notifyAnySelected(event) {
    this.anySelected.emit(event);

    let calendario = {
      listadoGuardia: this.elementos[this.rowSelected][5],
      fechaDesde: this.elementos[this.rowSelected][2],
      fechaHasta: this.elementos[this.rowSelected][3],
      fechaProgramada: this.elementos[this.rowSelected][4],
      observaciones: this.elementos[this.rowSelected][6],
    };

    this.data.changeMessage(calendario);

    this.router.navigate(['/fichaCalendarioProgramacionComponent']);
  }

  notifyRowSelected(event) {
    this.rowSelected = event;
  }

}
