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
      id: "anioNum",
      name: "Año/Número"
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
    ['78B0A34', "2018/453", "06/02/2019", "-", "234234 ADFAF ASFSAFASF, VICTOR JAVIER", "234234 ADFAF ASFSAFASF, JAVIER", "INSTRUCCION1"],
    ['23R6T54', "2019/356", "08/02/2019", "-", "097645 ADFAF ASFSAFASF, MARIA TERESA", "234234 ADFAF ASFSAFASF, JUAN", "INSTRUCCION2"]
  ];
  elementosAux = [
    ['78B0A34', "2018/453", "06/02/2019", "-", "234234 ADFAF ASFSAFASF, VICTOR JAVIER", "234234 ADFAF ASFSAFASF, JAVIER", "INSTRUCCION1"],
    ['23R6T54', "2019/356", "08/02/2019", "-", "097645 ADFAF ASFSAFASF, MARIA TERESA", "234234 ADFAF ASFSAFASF, JUAN", "INSTRUCCION2"]
  ];
  constructor() { }

  ngOnInit(): void {
  }
  selectedAll(event) {
    this.allSelected = event;
  }
}
