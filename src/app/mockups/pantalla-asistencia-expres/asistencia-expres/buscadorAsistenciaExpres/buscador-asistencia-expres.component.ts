import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Message } from 'primeng/components/common/api';

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
  @Input() modoBusqueda: string;
  modoBusquedaB: boolean = true;
  @Input() titulo: string;
  msgs: Message[] = [];
  rutas: string[] = ['SJCS', 'Guardia', 'Asistencias'];


  constructor() {
    this.datos = {
      radios: [],
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

  showMsg() {
    this.msgs = [];
    this.msgs.push({
      severity: "info",
      summary: 'Información buscada',
      detail: 'Mostrando información buscada'
    });
  }

  clear() {
    this.msgs = [];
  }

}
