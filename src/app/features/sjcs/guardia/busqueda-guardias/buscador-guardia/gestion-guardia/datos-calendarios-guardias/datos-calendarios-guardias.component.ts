import { Component, OnInit } from '@angular/core';
import { SigaServices } from '../../../../../../../_services/siga.service';
import { datos_combos } from '../../../../../../../utils/datos_combos';

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

  infoDiasLab = "";
  infoDiasFes = "";

  laborables;
  festividades;
  comboUnidad = datos_combos.comboUnidadesTiempo;

  constructor(private sigaServices: SigaServices) { }

  ngOnInit() {
    if (this.modoEdicion)
      this.openFicha = true;
    this.search();



    this.festividades = this.creaSemana();
    this.laborables = this.creaSemana();

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
              });
            });
          if (n != null && n.diasLab != null && n.diasLab.length > 0)
            Array.from(n.diasLab).forEach(element => {
              this.laborables.forEach(it => {
                if (it.label == element)
                  it.value = true;
              })
            });
          this.changeFestividades();
          this.changeLaborables();
        },
        err => {
          console.log(err);
        })
  }


  onChangeSeleccLaborables() {
    if (!this.selectLaborables)
      this.laborables.map(it => {
        it.value = false
        this.infoDiasLab = ""

        return it;
      });
    else
      this.laborables.map(it => {
        it.value = true
        return it;
      });

    this.changeLaborables();
  }
  onChangeSeleccFestividades() {
    if (!this.selectFestividades)
      this.festividades.map(it => {
        it.value = false;
        this.infoDiasFes = ""
        return it;
      });
    else
      this.festividades.map(it => {
        it.value = true;
        return it;
      });

    this.changeFestividades();
  }

  changeLaborables() {
    if (this.selectLaborables) {
      this.laborables.forEach(it => {
        if (!it.value)
          this.selectLaborables = false;

      })
    } else {
      this.selectLaborables = true
      this.laborables.forEach(it => {
        if (!it.value)
          this.selectLaborables = false;
      })
    }
    this.infoDiasLab = "";
    this.laborables.forEach(it => {
      if (it.value)
        this.infoDiasLab += it.label;
    });
    if (this.infoDiasLab.length == 5 && this.infoDiasLab.indexOf('S') == -1 && this.infoDiasLab.indexOf('D') == -1)
      this.infoDiasLab = "L-V";
    else if (this.infoDiasLab.length == 6 && this.infoDiasLab.indexOf('D') == -1)
      this.infoDiasLab = "L-S";
    else if (this.infoDiasLab.length == 7)
      this.infoDiasLab = "L-D";

    if (this.infoDiasLab != "")
      this.infoDiasLab = "Lab. " + this.infoDiasLab + ", "

  }
  changeFestividades() {
    if (this.selectFestividades) {
      this.festividades.forEach(it => {
        if (!it.value)
          this.selectFestividades = false;
      })
    } else {
      this.selectFestividades = true
      this.festividades.forEach(it => {
        if (!it.value)
          this.selectFestividades = false;
      })
    }

    this.infoDiasFes = "";
    this.festividades.forEach(it => {
      if (it.value)
        this.infoDiasFes += it.label;
    });
    if (this.infoDiasFes.length == 5 && this.infoDiasFes.indexOf('S') == -1 && this.infoDiasFes.indexOf('D') == -1)
      this.infoDiasFes = "L-V";
    else if (this.infoDiasFes.length == 6 && this.infoDiasFes.indexOf('D') == -1)
      this.infoDiasFes = "L-S";
    else if (this.infoDiasFes.length == 7)
      this.infoDiasFes = "L-D";

    if (this.infoDiasFes != "")
      this.infoDiasFes = "Fes. " + this.infoDiasFes;
  }



  abreCierraFicha() {
    this.openFicha = !this.openFicha;
  }

  creaSemana() {
    let semana = [];
    Array.from("LMXJVSD").forEach(it => {
      semana.push({
        label: it,
        value: false
      });
    });
    return semana;
  }

}
