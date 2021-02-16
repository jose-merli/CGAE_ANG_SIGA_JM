import { Component, Input, OnInit } from '@angular/core';
 
@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss']
})
export class SelectorComponent implements OnInit {
  @Input() selector;
  @Input() i;
  @Input() textoVisible = "Seleccionar";
  opcionSeleccionado: number = 0;
  verSeleccion: number;
  constructor() { }
 
  ngOnInit(): void {
  }
  capturar() {
    // Pasamos el valor seleccionado a la variable verSeleccion
    this.verSeleccion = this.opcionSeleccionado;
  }
}