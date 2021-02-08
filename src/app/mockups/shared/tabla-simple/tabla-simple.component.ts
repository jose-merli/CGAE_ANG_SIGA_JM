import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabla-simple',
  templateUrl: './tabla-simple.component.html',
  styleUrls: ['./tabla-simple.component.scss']
})
export class TablaSimpleComponent implements OnInit {
  @Input() cabeceras;
  @Input() elementos;
  constructor() { }

  ngOnInit(): void {
  }

}
