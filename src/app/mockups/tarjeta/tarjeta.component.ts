import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tarjeta',
  templateUrl: './tarjeta.component.html',
  styleUrls: ['./tarjeta.component.scss']
})
export class TarjetaComponent implements OnInit {
  @Input() imagen;
  @Input() icon;
  @Input() tipo;
  @Input() nombre;
  @Input() campos;
  @Input() enlaces;
  @Input() fixed: boolean;
  @Input() iconFixed;

  constructor() { }

  ngOnInit(): void { }

}
