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
  opcionSeleccionado: [number]  = [0];
  verSeleccion: [number];
  nuevaDesigna: any;
  disable: boolean;
  constructor() { }
 
  ngOnInit(): void {
    this.nuevaDesigna = JSON.parse(sessionStorage.getItem("nuevaDesigna"));
    if(this.selector.nombre == "Estado" && !this.nuevaDesigna){
      this.textoVisible = this.selector.opciones[0].label;
      this.disable = true;
    }
    if(this.selector.nombre == "Juzgado" && !this.nuevaDesigna){
      this.textoVisible = this.selector.opciones[0].label;
      this.disable = true;
    }
  }
  capturar() {
    // Pasamos el valor seleccionado a la variable verSeleccion
    this.verSeleccion = this.opcionSeleccionado;
  }

}
