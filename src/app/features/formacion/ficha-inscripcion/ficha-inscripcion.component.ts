import { Component, OnInit } from "@angular/core";
import { SigaServices } from "../../../_services/siga.service";

@Component({
  selector: "app-ficha-inscripcion",
  templateUrl: "./ficha-inscripcion.component.html",
  styleUrls: ["./ficha-inscripcion.component.scss"]
})
export class FichaInscripcionComponent implements OnInit {
  historico: boolean = false;
  openFicha: boolean = false;
  progressSpinner: boolean = false;
  closeFicha: boolean = true;
  fichasPosibles;
  msgs;

  rowsPerPage;
  cols;

  comboEstados: any[];
  comboPrecio: any[];
  comboModoPago: any[];

  constructor(private sigaServices: SigaServices) {}

  ngOnInit() {
    this.getFichasPosibles();
    this.getComboEstados();
    this.getComboPrecio();
    this.getComboModoPago();
  }

  getComboEstados() {
    // obtener estados
    this.sigaServices.get("busquedaCursos_estadosCursos").subscribe(
      n => {
        this.comboEstados = n.combooItems;
        this.arregloTildesCombo(this.comboEstados);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboPrecio() {
    this.comboPrecio = [
      { label: "Pago Total", value: 0 },
      { label: "Pago Plazos", value: 1 }
    ];

    this.arregloTildesCombo(this.comboPrecio);
  }

  getComboModoPago() {
    this.comboModoPago = [
      { label: "Domiciliación", value: 0 },
      { label: "Contado", value: 1 },
      { label: "Transferencia", value: 2 }
    ];

    this.arregloTildesCombo(this.comboPrecio);
  }

  //FUNCIONES GENERALES
  getFichasPosibles() {
    this.fichasPosibles = [
      {
        key: "curso",
        activa: true
      },
      {
        key: "inscripcion",
        activa: false
      },
      {
        key: "personales",
        activa: false
      },
      {
        key: "pago",
        activa: false
      },
      {
        key: "certificados",
        activa: false
      }
    ];
  }

  //Funciones controlan las fichas
  esFichaActiva(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    return fichaPosible.activa;
  }

  abreCierraFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    fichaPosible.activa = !fichaPosible.activa;
    this.openFicha = !this.openFicha;
  }

  getFichaPosibleByKey(key): any {
    let fichaPosible = this.fichasPosibles.filter(elto => {
      return elto.key === key;
    });
    if (fichaPosible && fichaPosible.length) {
      return fichaPosible[0];
    }
    return {};
  }

  clear() {
    this.msgs = [];
  }

  arregloTildesCombo(combo) {
    combo.map(e => {
      let accents =
        "ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž";
      let accentsOut =
        "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
      let i;
      let x;
      for (i = 0; i < e.label.length; i++) {
        if ((x = accents.indexOf(e.label[i])) != -1) {
          e.labelSinTilde = e.label.replace(e.label[i], accentsOut[x]);
          return e.labelSinTilde;
        }
      }
    });
  }
}
