import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-datos-calendarios-guardias',
  templateUrl: './datos-calendarios-guardias.component.html',
  styleUrls: ['./datos-calendarios-guardias.component.scss']
})
export class DatosCalendariosGuardiasComponent implements OnInit {

  openFicha = false;
  modoEdicion = false
  constructor() { }

  semana = [
    {
      label: "L",

    },
    {
      label: "M",

    },
    {
      label: "X",

    },
    {
      label: "J",

    },
    {
      label: "V",

    },
    {
      label: "S",

    },
    {
      label: "D",

    }
  ]

  ngOnInit() {
    if (this.modoEdicion)
      this.openFicha = true;
  }

  abreCierraFicha() {
    this.openFicha = !this.openFicha;
  }

}
