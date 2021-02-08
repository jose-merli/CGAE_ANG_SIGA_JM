import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tarjeta',
  templateUrl: './tarjeta.component.html',
  styleUrls: ['./tarjeta.component.scss']
})
export class TarjetaComponent implements OnInit {

  @Input() cardTitle: string;
  @Input() cardOpenState: boolean;
  @Input() icon: string;
  @Input() image: string;
  @Input() campos;
  @Input() enlaces;
  @Input() fixed: boolean;

  constructor() { }

  ngOnInit() {
  }

}
