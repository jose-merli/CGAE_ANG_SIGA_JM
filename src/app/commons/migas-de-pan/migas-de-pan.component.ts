import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-migas-de-pan',
  templateUrl: './migas-de-pan.component.html',
  styleUrls: ['./migas-de-pan.component.scss']
})
export class MigasDePanComponent implements OnInit {

  @Input() rutas: string[];
  @Input() tooltip: string;

  constructor() { }

  ngOnInit() {
  }
}
