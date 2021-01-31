import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ficha-actuacion',
  templateUrl: './ficha-actuacion.component.html',
  styleUrls: ['./ficha-actuacion.component.scss']
})
export class FichaActuacionComponent implements OnInit {

  rutas: string[] = ['SJCS', 'Designaciones', 'Actuaciones'];
  tarjetaFija = {
    nombre: "Informacón Resumen",
    icon: 'fas fa-clipboard',
    iconFixed: 'fas fa-thumbtack',
    tipo: "detalle",
    fixed: true,
    campos: [
      {
        "key": "Facturación",
        "value": "2º Bimestre 2018 (Marzo-Abril) - GUARDIAS / TURNO DE OFICIO"
      },{
        "key": "Nombre",
        "value": "01/03/2018-30/04/2018 - 2º Bimestre 2018 (Marzo-Abril) - GUARDIAS / TURNO DE OFICIO"
      },
      {
        "key": "Nombre abono banco",
        "value": "CIXB"
      }
    ],
    enlaces: []
  };

  listaTarjetas = [
    {
      nombre: "Datos Generales",
      imagen: "assets/images/img-colegiado.PNG",
      tipo: "detalle",
      fixed: false,
      campos: [
        {
          "key": "Juzgado",
          "value": "Juzgado de lo social N1 BADAJOZ"
        },
        {
          "key": "Módulo",
          "value": "SSDFXXXX XXXX XXXXXXX"
        },
        {
          "key": "Acreditación",
          "value": "DSHBSBFSHDFNSDH SDHFB SDUFSUY"
        }
      ]
    },
    {
      nombre: "Justificación",
      icon: "fa fa-gavel",
      tipo: "detalle",
      fixed: false,
      campos: [
        {
          "key": "Estado",
          "value": "XXXXX"
        },
        {
          "key": "Fecha Justificación",
          "value": "25/01/2021"
        },
        {
          "key": "Partida Presupuestaria",
          "value": "XXXXXXXXX"
        }
      ]
    },
    {
      nombre: "Histórico de la Actuación",
      imagen: "assets/images/img-colegiado.PNG",
      tipo: "detalle",
      fixed: false,
      campos: [
        {
          "key": "Fecha Justificación",
          "value": "25/01/2021"
        },
        {
          "key": "Acción",
          "value": "Validar"
        },
        {
          "key": "Usuario",
          "value": "SJDFAJHBFH ASDHFBAJHFB, LUIS"
        }
      ]
    },
    {
      nombre: "Documentación",
      imagen: "",
      icon: "fa fa-briefcase",
      tipo: "detalle",
      fixed: false,
      campos: [
        {
          "key": "Número total de Documentos",
          "value": "7"
        }
      ]
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
