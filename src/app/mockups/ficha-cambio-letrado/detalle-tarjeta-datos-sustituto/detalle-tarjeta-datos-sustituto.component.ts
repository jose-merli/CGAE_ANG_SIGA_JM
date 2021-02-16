import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detalle-tarjeta-datos-sustituto',
  templateUrl: './detalle-tarjeta-datos-sustituto.component.html',
  styleUrls: ['./detalle-tarjeta-datos-sustituto.component.scss']
})
export class DetalleTarjetaDatosSustitutoComponent implements OnInit {

  inputs = ['Número de colegiado', 'Apellidos', 'Nombre'];

  constructor() { }

  ngOnInit() {
  }

}
