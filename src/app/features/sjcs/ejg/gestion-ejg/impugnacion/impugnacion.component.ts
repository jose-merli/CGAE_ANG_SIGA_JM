import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-impugnacion',
  templateUrl: './impugnacion.component.html',
  styleUrls: ['./impugnacion.component.scss']
})
export class ImpugnacionComponent implements OnInit {
  @Input() modoEdicion;
  constructor() { }

  ngOnInit() {
  }

}
