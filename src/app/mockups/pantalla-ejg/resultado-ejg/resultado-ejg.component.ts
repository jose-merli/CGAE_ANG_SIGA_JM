import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-resultado-ejg',
  templateUrl: './resultado-ejg.component.html',
  styleUrls: ['./resultado-ejg.component.scss']
})
export class ResultadoEJGComponent implements OnInit {
  @Input() showResponse = false;
  @Input() cabeceras = [];
  @Input() elementos = [];
  @Input() elementosAux = [];
  constructor() { }

  ngOnInit(): void {
  }

}
