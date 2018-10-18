import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-agenda",
  templateUrl: "./agenda.component.html",
  styleUrls: ["./agenda.component.scss"]
})
export class AgendaComponent implements OnInit {
  cols;
  datos;
  types;
  listLectura;
  listLecturaSelect;
  listAcceso;
  listAccesoSelect;
  lectura: boolean = true;
  acceso: boolean = true;

  constructor() {}

  ngOnInit() {
    this.getColsResults();
    this.listLecturaSelect = [];
    this.listAccesoSelect = [];
  }

  getColsResults() {
    this.cols = [
      {
        field: "perfil",
        header: "Perfil"
      }
    ];

    this.datos = [
      {
        perfil: "Abogado"
      },
      {
        perfil: "Camarero"
      },
      {
        perfil: "Torero"
      }
    ];

    this.listLectura = [
      {
        perfil: "Abogado"
      },
      {
        perfil: "Camarero"
      },
      {
        perfil: "Torero"
      },
      {
        perfil: "Panadero"
      },
      {
        perfil: "Barrendero"
      },
      {
        perfil: "Informatico"
      }
    ];

    this.types = [
      {
        label: "Solo Lectura"
      },
      {
        label: "Acceso Total"
      }
    ];
  }

  activateLectura() {
    this.lectura = false;
    this.acceso = true;
  }

  activateAcceso() {
    this.acceso = false;
    this.lectura = true;
  }
}
