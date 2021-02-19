import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ficha-designaciones',
  templateUrl: './ficha-designaciones.component.html',
  styleUrls: ['./ficha-designaciones.component.scss']
})
export class FichaDesignacionesComponent implements OnInit {

  rutas: string[] = ['SJCS', 'EJGS'];

  tarjetaFija = {
    nombre: "Información Resumen",
    icono: 'fas fa-clipboard',
    detalle: false,
    fixed: true,
    campos: [
      {
        "key": "Año/Número",
        "value": "D2018/00078"
      },
      {
        "key": "Letrado",
        "value": "2131 SDFASFA SDFF, JUAN"
      },
      {
        "key": "Estado",
        "value": "Dictaminado"
      },
      {
        "key": "Interesado",
        "value": "HDFHDFHDF DFHDFHDFH, JUAN"
      },
      {
        "key": "Número Asistencias",
        "value": "2"
      },
      {
        "key": "Validado",
        "value": "No"
      }
    ],
    enlaces: []
  };

  listaTarjetas = [
    {
      id: 'sjcsDesigaDatosGen',
      nombre: "Datos Generales",
      imagen: "",
      icono: 'far fa-address-book',
      fixed: false,
      detalle: true,
      opened: false,
      campos: [
        {
          "key": "Turno",
          "value": "PENAL MADRID FESTIVOS"
        },
        {
          "key": "Fecha",
          "value": "16/08/2010"
        },
        {
          "key": "Designación Art. 27-28",
          "value": "NO"
        }, {
          "key": "Tipo",
          "value": "VERJSDHFBSDF"
        }
      ]
    },
    {
      id: 'sjcsDesigaDet',
      nombre: "Detalle Designación",
      icono: "fa fa-gavel",
      detalle: true,
      fixed: false,
      opened: false,
      campos: [
        {
          "key": "Número Procedimiento",
          "value": "2008/675432"
        },
        {
          "key": "Juzgado",
          "value": "Juzgado de lo social N1 BADAJOZ"
        },
        {
          "key": "Procedimiento",
          "value": "CONTENCIOSO ADMINISTRATIVO"
        },
        {
          "key": "Módulo",
          "value": "SSDF XXXXXXXXX"
        }
      ]
    },
    {
      id: 'sjcsDesigDatAdicionales',
      nombre: "Datos Adicionales",
      imagen: "",
      icono: 'fa fa-university',
      detalle: true,
      fixed: false,
      opened: false,
      campos: [
        {
          "key": "Fecha Oficio Juzgado",
          "value": "01/09/2019"
        },
        {
          "key": "Fecha Reecepción Colegio",
          "value": "03/09/2019"
        },
        {
          "key": "Fecha Juicio",
          "value": "10/09/2019"
        }
      ]
    },
    {
      id: 'sjcsDesigInt',
      nombre: "Interesados",
      imagen: "",
      icono: "fa fa-users",
      detalle: true,
      fixed: false,
      opened: false,
      campos: [
        {
          "key": "Identificación",
          "value": "76543287T"
        },
        {
          "key": "Nombre",
          "value": "sfsd dfgdg, Juan"
        }
      ]
    },
    {
      id: 'sjcsDesigContra',
      nombre: "Contrarios",
      imagen: "",
      icono: "fa fa-users",
      detalle: true,
      fixed: false,
      opened: false,
      campos: [
        {
          "key": "Número de Contrarios",
          "value": "8"
        }
      ]
    },
    {
      id: 'sjcsDesigProc',
      nombre: "Procurador",
      imagen: "",
      icono: "fa fa-user",
      detalle: true,
      fixed: false,
      opened: false,
      campos: [
        {
          "key": "Nº Colegiado",
          "value": "6492"
        },
        {
          "key": "Nombre",
          "value": "MIGUEL HFGSGS AJSKFI"
        },
        {
          "key": "Fecha designación",
          "value": "02/07/2007"
        }
      ]
    },
    {
      id: 'sjcsDesigCamb',
      nombre: "Cambio Letrado",
      imagen: "",
      icono: "fa fa-graduation-cap",
      detalle: true,
      fixed: false,
      opened: false,
      campos: [
        {
          "key": "Nº Colegiado",
          "value": "6492"
        },
        {
          "key": "Nombre",
          "value": "MIGUEL HFGSGS AJSKFI"
        },
        {
          "key": "Fecha designación",
          "value": "02/07/2007"
        }
      ],
      enlaces: [],
      enlaceCardClosed: { href: '/fichaColegial', title: 'Ficha colegial' }
    },
    {
      id: 'sjcsDesigRel',
      nombre: "Relaciones",
      imagen: "",
      icono: "fas fa-link",
      detalle: false,
      fixed: false,
      opened: false,
      campos: []
    },
    {
      id: 'sjcsDesigCom',
      nombre: "Comunicaciones",
      imagen: "",
      icono: "fa fa-inbox",
      detalle: true,
      fixed: false,
      opened: false,
      campos: [
        {
          "key": "Nº total de Comunicaciones",
          "value": "54"
        }
      ]
    },
    {
      id: 'sjcsDesigDoc',
      nombre: "Documentación",
      imagen: "",
      icono: "fa fa-briefcase",
      detalle: true,
      fixed: false,
      opened: false,
      campos: [
        {
          "key": "Nº total de Documentos",
          "value": "7"
        }
      ]
    },
    {
      id: 'sjcsDesigAct',
      nombre: "Actuaciones",
      imagen: "",
      icono: "fa fa-gavel",
      detalle: true,
      fixed: false,
      opened: false,
      campos: [
        {
          "key": "Nº total",
          "value": "5"
        }
      ]
    },
    {
      id: 'sjcsDesigDatFac',
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
