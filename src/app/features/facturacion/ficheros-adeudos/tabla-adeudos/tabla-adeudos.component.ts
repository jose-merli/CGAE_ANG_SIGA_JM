import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabla-adeudos',
  templateUrl: './tabla-adeudos.component.html',
  styleUrls: ['./tabla-adeudos.component.scss']
})
export class TablaAdeudosComponent implements OnInit {

  constructor() { }

  @Input() datos;
  
  ngOnInit() {
  }

}
