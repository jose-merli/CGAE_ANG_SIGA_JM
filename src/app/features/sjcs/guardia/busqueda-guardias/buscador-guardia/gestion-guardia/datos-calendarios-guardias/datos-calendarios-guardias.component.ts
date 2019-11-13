import { Component, OnInit } from '@angular/core';
import { SigaServices } from '../../../../../../../_services/siga.service';

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

  constructor(private sigaServices: SigaServices) { }

  ngOnInit() {
    if (this.modoEdicion)
      this.openFicha = true;
    this.search();

  }

  search() {
    this.sigaServices.getParam(
      "busquedaGuardias_getGuardia",
      "?idGuardia=" + '1003').subscribe(
        n => {
          if (n != null && n.diasFes != null && n.diasFes.length > 0)
            Array.from(n.diasFes).forEach(element => {
              this.festividades.forEach(it => {
                if (it.label == element)
                  it.value = true;
              })
            });
          if (n != null && n.diasLab != null && n.diasLab.length > 0)
            Array.from(n.diasLab).forEach(element => {
              this.laborables.forEach(it => {
                if (it.label == element)
                  it.value = true;
              })
            });
        },
        err => {
          console.log(err);
        })
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
