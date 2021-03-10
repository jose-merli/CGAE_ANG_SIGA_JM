import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { Location } from '@angular/common';

@Component({
  selector: 'app-pantalla-buscador-colegiados',
  templateUrl: './pantalla-buscador-colegiados.component.html',
  styleUrls: ['./pantalla-buscador-colegiados.component.scss']
})
export class PantallaBuscadorColegiadosComponent implements OnInit {

  rutas: string[] = ['SJCS', 'EJGs', 'Búsqueda Colegiado'];
  msgs: Message[] = [];
  show = false;

  datos = {

    selectores: [
      {
        nombre: "Colegio",
        opciones: [
          { label: 'XXXXXXXXXXX', value: 1 },
          { label: 'XXXXXXXXXXX', value: 2 },
          { label: 'XXXXXXXXXXX', value: 3 },
        ]
      },
      {
        nombre: "Turno",
        opciones: [
          { label: 'XXXXXXXXXXX', value: 1 },
          { label: 'XXXXXXXXXXX', value: 2 },
          { label: 'XXXXXXXXXXX', value: 3 },
        ]
      },
      {
        nombre: "Guardia",
        opciones: [
          { label: 'XXXXXXXXXXX', value: 1 },
          { label: 'XXXXXXXXXXX', value: 2 },
          { label: 'XXXXXXXXXXX', value: 3 },
        ]
      },
      {
        nombre: "Estado Colegial",
        opciones: [
          { label: 'XXXXXXXXXXX', value: 1 },
          { label: 'XXXXXXXXXXX', value: 2 },
          { label: 'XXXXXXXXXXX', value: 3 },
        ]
      },
    ],

    inputs: ['NIF', 'Apellidos', 'Nombre', 'Número de colegiado']

  };

  constructor(private location: Location) { }

  ngOnInit() {
    if (sessionStorage.getItem('usuarioBusquedaExpress')) {
      sessionStorage.removeItem('usuarioBusquedaExpress')
    }

    this.showMsg('info', 'Este buscador puede ser accedido desde varios lugares', '');
  }

  showMsg(severity, summary, detail) {
    this.msgs = [];
    this.msgs.push({
      severity,
      summary,
      detail
    });
  }

  clear() {
    this.msgs = [];
  }

  showResponse() {
    this.show = true;
  }

  hideResponse() {
    this.show = false;
  }

  goBack() {
    this.location.back();
  }

}
