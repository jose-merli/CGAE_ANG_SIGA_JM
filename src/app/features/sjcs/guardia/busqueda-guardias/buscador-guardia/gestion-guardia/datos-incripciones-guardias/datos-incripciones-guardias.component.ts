import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-datos-incripciones-guardias',
  templateUrl: './datos-incripciones-guardias.component.html',
  styleUrls: ['./datos-incripciones-guardias.component.scss']
})
export class DatosIncripcionesGuardiasComponent implements OnInit {

  @Input() TarjetaInscripciones;
  
  constructor() { }

  ngOnInit() {
  }

}
