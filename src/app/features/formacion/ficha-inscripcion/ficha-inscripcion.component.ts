import { Component, OnInit } from "@angular/core";
import { SigaServices } from "../../../_services/siga.service";
import { DatosInscripcionItem } from "../../../models/DatosInscripcionItem";
import { esCalendar } from "../../../utils/calendar";
import { Location } from "@angular/common";
import { PersonaItem } from "../../../models/PersonaItem";
import { SelectItem } from "primeng/api";
import { cardService } from "../../../_services/cardSearch.service";

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
  modoEdicion: boolean = false;
  es: any = esCalendar;
  isValidate: boolean;
  isEditable: boolean = false;

  body: PersonaItem = new PersonaItem();
  inscripcion: DatosInscripcionItem = new DatosInscripcionItem();

  rowsPerPage;
  cols;

  comboEstados: any[];
  comboPrecio: any[];
  comboModoPago: any[];

  comboTipoIdentificacion: SelectItem[];
  selectedTipoIdentificacion: any = {};

  constructor(
    private sigaServices: SigaServices,
    private location: Location,
    private cardService: cardService
  ) {}

  ngOnInit() {
    this.getFichasPosibles();
    this.getComboEstados();
    this.getComboPrecio();
    this.getComboModoPago();

    if (sessionStorage.getItem("modoEdicionInscripcion") == "true") {
      this.modoEdicion = true;
      this.inscripcion = JSON.parse(
        sessionStorage.getItem("inscripcionCurrent")
      );

      // Cargamos los datos de la persona asignada a dicha inscripcion
      this.sigaServices
        .post("accesoFichaPersona_searchPersona", this.inscripcion.idPersona)
        .subscribe(
          data => {
            if (data != undefined && data != null) {
              this.body = JSON.parse(data["body"]);
              this.obtenerTiposIdentificacion();
            }
          },
          error => {
            console.log(error);
          }
        );
    }
  }

  getComboEstados() {
    // obtener estados
    this.sigaServices
      .get("busquedaInscripciones_estadosInscripciones")
      .subscribe(
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

  backTo() {
    this.location.back();
  }

  obtenerTiposIdentificacion() {
    this.sigaServices.get("fichaPersona_tipoIdentificacionCombo").subscribe(
      n => {
        this.comboTipoIdentificacion = n.combooItems;

        // obtener la identificacion a seleccionar
        if (this.body.tipoIdentificacion != undefined) {
          let ident = this.comboTipoIdentificacion.find(
            item => item.value == this.body.tipoIdentificacion
          );

          this.selectedTipoIdentificacion = ident.value;
        } else {
          let ident: SelectItem;
          ident.value = "";
          this.selectedTipoIdentificacion = ident;
        }

        this.comprobarValidacion();
      },
      err => {
        console.log(err);
      }
    );
  }

  comprobarValidacion() {
    if (
      (this.body.tipoIdentificacion != undefined ||
        this.body.tipoIdentificacion != null) &&
      this.body.nif != undefined &&
      this.body.nombre != undefined &&
      this.body.nombre.trim() != "" &&
      this.body.apellido1 != undefined &&
      this.body.apellido2 != ""
    ) {
      this.isValidate = true;
    } else {
      this.isValidate = false;
    }

    this.cardService.newCardValidator$.subscribe(data => {
      data.map(result => {
        result.cardNotario = this.isValidate;
      });
      console.log(data);
    });
  }
}
