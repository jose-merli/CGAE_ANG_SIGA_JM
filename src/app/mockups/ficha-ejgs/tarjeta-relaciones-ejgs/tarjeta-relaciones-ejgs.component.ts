import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tarjeta-relaciones-ejgs',
  templateUrl: './tarjeta-relaciones-ejgs.component.html',
  styleUrls: ['./tarjeta-relaciones-ejgs.component.scss']
})
export class TarjetaRelacionesEjgsComponent implements OnInit {

  allSelected = false;

  cabeceras = [
    {
      id: "sjcs",
      name: "SJCS"
    },
    {
      id: "identificacion",
      name: "Identificación"
    },
    {
      id: "fecha",
      name: "Fecha"
    },
    {
      id: "turnoGuardia",
      name: "Turno/Guardia"
    },
    {
      id: "letrado",
      name: "Letrado"
    },
    {
      id: "interesado",
      name: "Interesado"
    },
    {
      id: "datosInteres",
      name: "Datos de interés"
    }
  ];
  elementos = [
    ['Asistencia', "A2021/02365", "06/02/2019", "-", "234234 ADFAF ASFSAFASF, VICTOR JAVIER", "234234 ADFAF ASFSAFASF, JAVIER", "INSTRUCCION1"],
    ['Designación', "D2021/00568", "08/02/2019", "-", "097645 ADFAF ASFSAFASF, MARIA TERESA", "234234 ADFAF ASFSAFASF, JUAN", "INSTRUCCION2"]
  ];
  elementosAux = [
    ['Asistencia', "A2021/02365", "06/02/2019", "-", "234234 ADFAF ASFSAFASF, VICTOR JAVIER", "234234 ADFAF ASFSAFASF, JAVIER", "INSTRUCCION1"],
    ['Designación', "D2021/00568", "08/02/2019", "-", "097645 ADFAF ASFSAFASF, MARIA TERESA", "234234 ADFAF ASFSAFASF, JUAN", "INSTRUCCION2"]
  ];

  constructor() { }

  ngOnInit() {
  }

  selectedAll(event) {
    this.allSelected = event;
  }

}
