import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-comunicaciones-ejg',
  templateUrl: './comunicaciones-ejg.component.html',
  styleUrls: ['./comunicaciones-ejg.component.scss']
})
export class ComunicacionesEJGComponent implements OnInit {
  @Input() modoEdicion;
  @Input() permisoEscritura;
  @Input() tarjetaComunicaciones: string;

  constructor() { }

  ngOnInit() {
  }

}
