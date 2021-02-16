import { EventEmitter } from '@angular/core';
import { Output } from '@angular/core';
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
  @Output() isOpen = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  goToCard(enlace) {
    enlace.ref.scrollIntoView({ block: "center", behavior: 'smooth', inline: "start" });
    this.isOpen.emit(enlace.id);
  }

  goTop() {
    let top = document.getElementById("top");
    if (top) {
      top.scrollIntoView();
      top = null;
    }
  }

  goDown() {
    let down = document.getElementById("down");
    if (down) {
      down.scrollIntoView();
      down = null;
    }
  }

}
