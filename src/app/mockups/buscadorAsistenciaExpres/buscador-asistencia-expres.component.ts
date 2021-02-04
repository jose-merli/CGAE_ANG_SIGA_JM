import { Component, OnInit, Input } from '@angular/core';
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
  showDatos: boolean = false;
  modoBusqueda: string = 'b';
  modoBusquedaB: boolean = true;
  @Input() titulo: string;
  rutas:string[] = ['SJCS', 'Guardia', 'Asistencias'];

  constructor() {
    this.datos = {
      radios: [
        { label: 'Búsqueda de Asistencias', value: 'a' },
        { label: 'Asistencia Exprés', value: 'b' }
      ],
      dropdowns: [
        {
          label: 'Turno',
          options: [
            { label: '1', value: '1' },
            { label: '2', value: '2' },
            { label: '3', value: '3' },
            { label: '4', value: '4' },
            { label: '5', value: '5' },
            { label: '6', value: '6' },
            { label: '7', value: '7' },
            { label: '8', value: '8' },
            { label: '9', value: '9' },
            { label: '10', value: '10' }
          ]
        },

        {
          label: 'Guardia',
          options: [
            { label: '1', value: '1' },
            { label: '2', value: '2' },
            { label: '3', value: '3' },
            { label: '4', value: '4' },
            { label: '5', value: '5' },
            { label: '6', value: '6' },
            { label: '7', value: '7' },
            { label: '8', value: '8' },
            { label: '9', value: '9' },
            { label: '10', value: '10' }
          ]
        },

        {
          label: 'Tipo Asistencia Colegio',
          options: [
            { label: '1', value: '1' },
            { label: '2', value: '2' },
            { label: '3', value: '3' },
            { label: '4', value: '4' },
            { label: '5', value: '5' },
            { label: '6', value: '6' },
            { label: '7', value: '7' },
            { label: '8', value: '8' },
            { label: '9', value: '9' },
            { label: '10', value: '10' }
          ]
        }
      ]
    };
  }

  ngOnInit(): void {
    this.titulo = 'Datos Comunes';
  }
  opcionSeleccionado: string = '0';
  verSeleccion: string = '';

  capturar() {
    // Pasamos el valor seleccionado a la variable verSeleccion
    this.verSeleccion = this.opcionSeleccionado;

  }

  onHideDatos() {
    this.showDatos = !this.showDatos;
  }

  changeTab() {
    if (this.modoBusqueda === 'b') {
      this.modoBusquedaB = true;
    } else if (this.modoBusqueda === 'a') {
      this.modoBusquedaB = false;
    }
  }

}
