import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ficha-actuacion-designa-oficio',
  templateUrl: './ficha-actuacion-designa-oficio.component.html',
  styleUrls: ['./ficha-actuacion-designa-oficio.component.scss']
})
export class FichaActuacionDesignaOficioComponent implements OnInit {

  rutas: string[] = ['SJCS', 'Designaciones', 'Actuaciones', 'Ficha Actuación'];

  tarjetaFija = {
    nombre: "Resumen Actuación",
    icono: 'fas fa-clipboard',
    imagen: '',
    detalle: false,
    fixed: true,
    campos: [
      {
        "key": "Año/Número designación",
        "value": "D2018/00078"
      },
      {
        "key": "Letrado",
        "value": "2131 SDFASFA SDFF, JUAN"
      },
      {
        "key": "Fecha Actuación",
        "value": "22/09/2018"
      },
      {
        "key": "Número Actuación",
        "value": "4"
      },
    ],
    enlaces: []
  };

  listaTarjetas = [
    {
      id: 'sjcsDesigActuaOfiDatosGen',
      nombre: "Datos Generales",
      imagen: "",
      icono: 'far fa-address-book',
      fixed: false,
      detalle: true,
      opened: false,
      campos: [
        {
          "key": "Juzgado",
          "value": "Juzgado de lo social N1 BADAJOZ"
        },
        {
          "key": "Módulo",
          "value": "SSDFXXXXXXXXX XXXX XXXXXXX"
        },
        {
          "key": "Acreditación",
          "value": "VJHBFVJEFR VENVJKRENV VINNIRVE"
        },
      ]
    },
    {
      id: 'sjcsDesigActuaOfiJustifi',
      nombre: "Justificación",
      imagen: "",
      icono: 'fa fa-gavel',
      fixed: false,
      detalle: true,
      opened: false,
      campos: [
        {
          "key": "Fecha Justificación",
          "value": "12/03/2008"
        },
        {
          "key": "Estado",
          "value": "XXXXXXX"
        },
      ]
    },
    {
      id: 'sjcsDesigActuaOfiDatFac',
      nombre: "Datos Facturación",
      imagen: "",
      icono: 'fa fa-usd',
      fixed: false,
      detalle: true,
      opened: false,
      campos: [
        {
          "key": "Partida Presupuestaria",
          "value": "frfr frfrgtg ththth"
        },
      ]
    },
    {
      id: 'sjcsDesigActuaOfiRela',
      nombre: "Relaciones",
      imagen: "",
      icono: 'fas fa-link',
      fixed: false,
      detalle: false,
      opened: false,
      campos: [
        {
          "key": "Número total de Relaciones",
          "value": "5"
        },
      ]
    },
    {
      id: 'sjcsDesigActuaOfiGes',
      nombre: "Gestión",
      imagen: "",
      icono: 'fas fa-table',
      fixed: false,
      detalle: true,
      opened: false,
      campos: [
        {
          "key": "Fecha Justificación",
          "value": "20/10/2009"
        },
        {
          "key": "Acción",
          "value": "Validar"
        },
        {
          "key": "Usuario",
          "value": "BJGBRGJBREJ GREGJRGJRE ANTONIO"
        },
      ]
    },
    {
      id: 'sjcsDesigActuaOfiDoc',
      nombre: "Documentación",
      imagen: "",
      icono: 'fa fa-briefcase',
      fixed: false,
      detalle: false,
      opened: false,
      campos: [
        {
          "key": "Número total de Documentos",
          "value": "7"
        },
      ]
    },
  ];

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {

    this.listaTarjetas.forEach(tarj => {
      let tarjTmp = {
        id: tarj.id,
        ref: document.getElementById(tarj.id),
        nombre: tarj.nombre
      };

      this.tarjetaFija.enlaces.push(tarjTmp);
    });

  }

  isOpenReceive(event) {
    let tarjTemp = this.listaTarjetas.find(tarj => tarj.id == event);

    if (tarjTemp.detalle) {
      tarjTemp.opened = true;
    }

  }


}
