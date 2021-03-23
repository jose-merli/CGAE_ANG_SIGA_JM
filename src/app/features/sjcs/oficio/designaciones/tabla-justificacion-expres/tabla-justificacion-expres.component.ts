import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabla-justificacion-expres',
  templateUrl: './tabla-justificacion-expres.component.html',
  styleUrls: ['./tabla-justificacion-expres.component.scss']
})
export class TablaJustificacionExpresComponent implements OnInit {

  progressSpinner: boolean = false;

  @Input() datosJustificacion;

  constructor() { }

  ngOnInit(): void {
    
  }
}
