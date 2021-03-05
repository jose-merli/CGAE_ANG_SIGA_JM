import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-resultado-buscador-procurador',
  templateUrl: './resultado-buscador-procurador.component.html',
  styleUrls: ['./resultado-buscador-procurador.component.scss']
})
export class ResultadoBuscadorProcuradorComponent implements OnInit {

  rowSelected;

  cabeceras = [
    {
      id: "nifcif",
      name: "NIF/CIF"
    },
    {
      id: "nombre",
      name: "Nombre"
    },
    {
      id: "apellidos",
      name: "Apellidos"
    },
    {
      id: "colegio",
      name: "Colegio"
    },
    {
      id: "numerocolegiado",
      name: "Número de Colegiado"
    },
    {
      id: "estadocolegial",
      name: "Estado Colegial"
    },
    {
      id: "residencia",
      name: "Residencia"
    },
  ];

  elementos = [
    ['06756789H', "TOMAS", "HFBRHFBREH FRBJFHRBHJFR", "ALCALÁ DE HENARES", "3467", 'Ejerciente', 'Si'],
    ['55645678L', "ESPERANZA", "GBREGBER RJGBRJGBE", "ALCALÁ DE HENARES", "7931", 'Baja colegial', 'No'],
    ['28032012/35', "ISABEL", "GREGBETJGH UTHTHTHYT", "ALCALÁ DE HENARES", "8654", 'Ejerciente', 'Si'],
  ];

  elementosAux = [
    ['06756789H', "TOMAS", "HFBRHFBREH FRBJFHRBHJFR", "ALCALÁ DE HENARES", "3467", 'Ejerciente', 'Si'],
    ['55645678L', "ESPERANZA", "GBREGBER RJGBRJGBE", "ALCALÁ DE HENARES", "7931", 'Baja colegial', 'No'],
    ['28032012/35', "ISABEL", "GREGBETJGH UTHTHTHYT", "ALCALÁ DE HENARES", "8654", 'Ejerciente', 'Si'],
  ];

  constructor(private router: Router, private location: Location) { }

  ngOnInit() {

  }

  notifyAnySelected(event) {

    let procurador = {
      identificacion: this.elementos[this.rowSelected][0],
      nombre: this.elementos[this.rowSelected][1],
      ap1: this.elementos[this.rowSelected][2].split(' ')[0],
      ap2: this.elementos[this.rowSelected][2].split(' ')[1]
    };

    sessionStorage.setItem("usuarioBusquedaProcurador", JSON.stringify(procurador));

    this.location.back();

  }

  notifyRowSelected(event) {
    this.rowSelected = event;
  }

}
