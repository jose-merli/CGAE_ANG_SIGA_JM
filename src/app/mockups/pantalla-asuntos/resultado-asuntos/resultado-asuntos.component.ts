import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-resultado-asuntos',
  templateUrl: './resultado-asuntos.component.html',
  styleUrls: ['./resultado-asuntos.component.scss']
})
export class ResultadoAsuntosComponent implements OnInit {
  @Input() showResponse = false;
  @Input() cabeceras = [];
  @Input() elementos = [];
  @Input() elementosAux = [];
  constructor() { }

  ngOnInit(): void {
  }

}
