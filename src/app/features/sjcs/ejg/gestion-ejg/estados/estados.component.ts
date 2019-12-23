import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-estados',
  templateUrl: './estados.component.html',
  styleUrls: ['./estados.component.scss']
})
export class EstadosComponent implements OnInit {
  @Input() modoEdicion;
  constructor() { }

  ngOnInit() {
  }

}
