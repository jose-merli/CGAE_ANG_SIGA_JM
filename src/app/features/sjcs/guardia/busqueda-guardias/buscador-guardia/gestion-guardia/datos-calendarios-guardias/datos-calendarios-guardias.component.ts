import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-datos-calendarios-guardias',
  templateUrl: './datos-calendarios-guardias.component.html',
  styleUrls: ['./datos-calendarios-guardias.component.scss']
})
export class DatosCalendariosGuardiasComponent implements OnInit {

  openFicha = false;
  modoEdicion = false
  selectLaborables = false;
  selectFestividades = false;

  laborables = [
    {
      label: "L",
      value: false
    },
    {
      label: "M",
      value: false

    },
    {
      label: "X",
      value: false

    },
    {
      label: "J",
      value: false

    },
    {
      label: "V",
      value: false

    },
    {
      label: "S",
      value: false

    },
    {
      label: "D",
      value: false

    }
  ]
  festividades = [
    {
      label: "L",
      value: false
    },
    {
      label: "M",
      value: false

    },
    {
      label: "X",
      value: false

    },
    {
      label: "J",
      value: false

    },
    {
      label: "V",
      value: false

    },
    {
      label: "S",
      value: false

    },
    {
      label: "D",
      value: false

    }
  ]

  constructor() { }

  ngOnInit() {
    if (this.modoEdicion)
      this.openFicha = true;


  }

  onChangeSeleccLaborables() {
    if (!this.selectLaborables)
      this.laborables.map(it => {
        it.value = false
        return it;
      });
    else
      this.laborables.map(it => {
        it.value = true
        return it;
      });
  }
  onChangeSeleccFestividades() {
    if (!this.selectFestividades)
      this.festividades.map(it => {
        it.value = false
        return it;
      });
    else
      this.festividades.map(it => {
        it.value = true
        return it;
      });
  }

  isAllLaborables() {
    if (this.selectLaborables) {
      this.laborables.forEach(it => {
        if (!it.value)
          this.selectLaborables = false;
      })
    }
  }
  isAllFestividades() {
    if (this.selectFestividades) {
      this.festividades.forEach(it => {
        if (!it.value)
          this.selectFestividades = false;
      })
    }
  }


  abreCierraFicha() {
    this.openFicha = !this.openFicha;
  }

}
