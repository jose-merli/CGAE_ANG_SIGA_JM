import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-datos-colegiales',
  templateUrl: './datos-colegiales.component.html',
  styleUrls: ['./datos-colegiales.component.scss']
})
export class DatosColegialesComponent implements OnInit {


  @Input()
  fichasPosibles: any = [
    {
      key: "generales",
      activa: false
    },
  ]

  constructor() { }

  ngOnInit() {
    console.log(this.fichasPosibles)
  }

  esFichaActiva(key) {

    let fichaPosible = this.getFichaPosibleByKey(key);
    return fichaPosible.activa;
  }


  getFichaPosibleByKey(key): any {
    let fichaPosible = this.fichasPosibles.filter((elto) => {
      return elto.key === key;
    })
    if (fichaPosible && fichaPosible.length) {
      return fichaPosible[0];
    }
    return {}
  }

  abrirFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    fichaPosible.activa = true;
  }

  cerrarFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    fichaPosible.activa = false;
  }


}
