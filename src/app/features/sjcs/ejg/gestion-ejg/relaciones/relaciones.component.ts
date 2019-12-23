import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-relaciones',
  templateUrl: './relaciones.component.html',
  styleUrls: ['./relaciones.component.scss']
})
export class RelacionesComponent implements OnInit {
  @Input() modoEdicion;
  constructor() { }

  ngOnInit() {
  }

}
