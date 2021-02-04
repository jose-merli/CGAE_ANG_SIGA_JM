import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-resultado-certificacion',
  templateUrl: './resultado-certificacion.component.html',
  styleUrls: ['./resultado-certificacion.component.scss']
})
export class ResultadoCertificacionComponent implements OnInit {

  @Input() showResponse = false;
  @Input() cabeceras = [];
  @Input() elementos = [];
  @Input() elementosAux = [];
  constructor() { }

  ngOnInit(): void {
  }

}
