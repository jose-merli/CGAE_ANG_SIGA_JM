import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-filtro-buscador-procurador',
  templateUrl: './filtro-buscador-procurador.component.html',
  styleUrls: ['./filtro-buscador-procurador.component.scss']
})
export class FiltroBuscadorProcuradorComponent implements OnInit {

  expanded = true;
  @Input() datos;
  selectores = [];
  inputs = [];

  constructor() { }

  ngOnInit() {
    this.selectores = this.datos.selectores;
    this.inputs = this.datos.inputs;
  }

}
