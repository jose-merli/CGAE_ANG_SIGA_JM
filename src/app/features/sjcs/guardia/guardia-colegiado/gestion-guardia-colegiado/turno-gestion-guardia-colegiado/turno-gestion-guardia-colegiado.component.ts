import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-turno-gestion-guardia-colegiado',
  templateUrl: './turno-gestion-guardia-colegiado.component.html',
  styleUrls: ['./turno-gestion-guardia-colegiado.component.scss']
})
export class TurnoGestionGuardiaColegiadoComponent implements OnInit {
  msgs;
  progressSpinner
  constructor() { }

  ngOnInit() {
  }

  clear(){}
}
