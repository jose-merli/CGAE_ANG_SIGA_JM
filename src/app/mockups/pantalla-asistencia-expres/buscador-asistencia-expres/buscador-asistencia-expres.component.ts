import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-buscador-asistencia-expres',
  templateUrl: './buscador-asistencia-expres.component.html',
  styleUrls: ['./buscador-asistencia-expres.component.scss']
})
export class BuscadorAsistenciaExpresComponent implements OnInit {
  datos;
  aeForm = new FormGroup({
    numColegiado: new FormControl(''),
      nombreAp: new FormControl(''),
    });
    @Input() selectores1;

  constructor(){
}  

  ngOnInit(): void {
  }
  opcionSeleccionado: string  = '0';
  verSeleccion: string        = '';

  capturar() {
      // Pasamos el valor seleccionado a la variable verSeleccion
      this.verSeleccion = this.opcionSeleccionado;
      
  }

}
