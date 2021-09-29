import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-input-dividido',
  templateUrl: './input-dividido.component.html',
  styleUrls: ['./input-dividido.component.scss']
})
export class InputDivididoComponent implements OnInit {
  @Input() titulo = "";
  @Input() anio;
  @Input() numero;
  constructor() { }

  ngOnInit(): void {
    console.log(this.anio);
  }

}
