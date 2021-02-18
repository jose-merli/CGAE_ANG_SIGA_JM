import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ficha-asistencia',
  templateUrl: './ficha-asistencia.component.html',
  styleUrls: ['./ficha-asistencia.component.scss']
})
export class FichaAsistenciaComponent implements OnInit {

  rutas: string[] = ['SJCS', 'Asistencia'];

  tarjetaFija = {
    nombre: "Resumen Asistencia",
    icono: 'fas fa-clipboard',
    detalle: false,
    fixed: true,
    opened: false,
    campos: [
      {
        "key": "Año/Número",
        "value": "D2018/00068"
      },
      {
        "key": "Fecha",
        "value": "28/05/2018"
      },
      {
        "key": "Letrado",
        "value": "2314 JDSHF SGSDG, ANTONIO"
      },
      {
        "key": "Asistido",
        "value": "XXXXXX XXXX, MARIA"
      },
      {
        "key": "Estado",
        "value": "ACTIVA"
      },
      {
        "key": "Validado",
        "value": "Si"
      },
      {
        "key": "Número de actuaciones",
        "value": "12"
      }
    ],
    enlaces: []
  };

  listaTarjetas = [
    {
      id: 'sjcsEjgsfichAsistDatGen',
      nombre: "Datos Generales",
      imagen: "",
      icono: 'far fa-address-book',
      detalle: true,
      fixed: false,
      opened: false,
      campos: [
        {
          "key": "Turno",
          "value": "T.O. VIOL GENERO ALICANTE"
        },
        {
          "key": "Guardia",
          "value": "V. Género Alicante"
        },
        {
          "key": "Tipo Asistencia Colegio",
          "value": "Detenidos"
        },
        {
          "key": "Fecha Asistencia",
          "value": "22/01/2018 10:35"
        }
      ]
    },
    {
      id: 'sjcsEjgsfichAsistOtros',
      nombre: "Otros Datos",
      imagen: "",
      icono: "fa fa-university",
      detalle: true,
      fixed: false,
      opened: false,
      campos: [
        {
          "key": "Estado",
          "value": "ACTIVA"
        },
        {
          "key": "Fecha estado",
          "value": "28/02/2016"
        },
        {
          "key": "Fecha Cierre",
          "value": "12/06/2018"
        }
      ]
    },
    {
      id: 'sjcsEjgsfichAsistDatAd',
      nombre: "Datos Adicionales",
      imagen: "",
      icono: "fa fa-university",
      detalle: true,
      fixed: false,
      opened: false,
      campos: []
    },
    {
      id: 'sjcsEjgsfichAsistRel',
      nombre: "Relaciones",
      imagen: "",
      icono: 'fas fa-link icon-ficha',
      detalle: true,
      fixed: false,
      opened: false,
      campos: [
        {
          "key": "",
          "value": "E2018/00987"
        },
        {
          "key": "Dictamen",
          "value": "Favorable"
        },
        {
          "key": "Fecha dictamen",
          "value": "28/09/2019"
        },
        {
          "key": "Resolución",
          "value": ""
        },
        {
          "key": "Fecha Resolución",
          "value": ""
        }
      ]
    },
    {
      id: 'sjcsEjgsfichAsistAs',
      nombre: "Asistido",
      imagen: "",
      icono: 'fa fa-user',
      detalle: true,
      fixed: false,
      opened: false,
      campos: [
        {
          "key": "Identificación",
          "value": "56784308R"
        }, {
          "key": "Apellidos",
          "value": "SAFSF SFSDFDSF"
        }, {
          "key": "Nombre",
          "value": "JUAN"
        }
      ],
      enlaceCardClosed: { href: '/fichaJusticiable', title: 'Ficha Justiciable' }
    },
    {
      id: 'sjcsEjgsfichAsistCont',
      nombre: "Contrarios",
      imagen: "",
      icono: 'fa fa-users',
      detalle: true,
      fixed: false,
      opened: false,
      campos: [{
        "key": "Número de Contrarios",
        "value": "8"
      }
      ]
    },
    {
      id: 'sjcsEjgsfichAsistDoc',
      nombre: "Documentación",
      imagen: "",
      icono: 'fa fa-briefcase',
      detalle: true,
      fixed: false,
      opened: false,
      campos: [
        {
          "key": "Número total de Documentos",
          "value": "7"
        }
      ]
    }, {
      id: 'sjcsEjgsfichAsistCol',
      nombre: "Colegiado",
      imagen: "",
      icono: 'fa fa-graduation-cap',
      detalle: true,
      fixed: false,
      opened: false,
      campos: []
    },
    {
      id: 'sjcsEjgsfichAsistCar',
      nombre: "Características",
      imagen: "",
      icono: 'fa fa-briefcase',
      detalle: true,
      fixed: false,
      opened: false,
      campos: []
    },
    {
      id: 'sjcsEjgsfichAsistAct',
      nombre: "Actuaciones",
      imagen: "",
      icono: 'fa fa-map-marker',
      detalle: true,
      fixed: false,
      opened: false,
      campos: [
        {
          "key": "Justificadas",
          "value": "3"
        },
        {
          "key": "Validadas",
          "value": "1"
        },
        {
          "key": "Facturadas",
          "value": "0"
        },
        {
          "key": "Número total",
          "value": "5"
        }
      ]
    }
  ];

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {

    this.goTop();

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

  goTop() {
    let top = document.getElementById("top");
    if (top) {
      top.scrollIntoView();
      top = null;
    }
  }

}
