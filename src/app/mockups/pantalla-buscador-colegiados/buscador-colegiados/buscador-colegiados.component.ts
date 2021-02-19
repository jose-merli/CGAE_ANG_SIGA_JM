import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-buscador-colegiados',
  templateUrl: './buscador-colegiados.component.html',
  styleUrls: ['./buscador-colegiados.component.scss']
})
export class BuscadorColegiadosComponent implements OnInit {

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
