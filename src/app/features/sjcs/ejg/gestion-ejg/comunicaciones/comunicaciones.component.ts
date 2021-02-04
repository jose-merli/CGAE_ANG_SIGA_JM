import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-comunicaciones',
  templateUrl: './comunicaciones.component.html',
  styleUrls: ['./comunicaciones.component.scss']
})
export class ComunicacionesComponent implements OnInit {
  @Input() modoEdicion;
  @Input() permisoEscritura;
  @Input() tarjetaComunicaciones: string;

  constructor() { }

  ngOnInit() {
  }

}
