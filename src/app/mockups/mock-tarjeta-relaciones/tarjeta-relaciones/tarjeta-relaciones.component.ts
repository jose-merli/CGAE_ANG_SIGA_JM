import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tarjeta-relaciones',
  templateUrl: './tarjeta-relaciones.component.html',
  styleUrls: ['./tarjeta-relaciones.component.scss']
})
export class TarjetaRelacionesComponent implements OnInit {
  allSelected = false;
  listaTarjetas = [
    {
      opened: false,
      nombre: "Relaciones",
      imagen: "",
      icono: 'fas fa-link',
      fixed: false,
      detalle: true,
      campos: [
        {
          "key": "SJCS",
          "value": "Asistencia"
        },
        {
          "key": "Año/Número",
          "value": "A2021/02365"
        },
        {
          "key": "Fecha",
          "value": "06/02/2019"
        },
        {
          "key": "Turno/Guardia",
          "value": "-"
        },
        {
          "key": "Letrado",
          "value": "234234 ADFAF ASFSAFASF, VICTOR JAVIER"
        },
        {
          "key": "Interesado",
          "value": "234234 ADFAF ASFSAFASF, JAVIER"
        },
        {
          "key": "Datos de interés",
          "value": "INSTRUCCION1"
        },
        {
          "key": "Número total de Relaciones",
          "value": "5"
        }
      ]
    }
  ];

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

  ngOnInit(): void {
  }
  selectedAll(event) {
    this.allSelected = event;
  }
}
