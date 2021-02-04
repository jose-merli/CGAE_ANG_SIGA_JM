import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ficha-ejgs',
  templateUrl: './ficha-ejgs.component.html',
  styleUrls: ['./ficha-ejgs.component.scss']
})
export class FichaEjgsComponent implements OnInit {

  rutas: string[] = ['SJCS', 'EJGS'];
  tarjetaFija = {
    nombre: "Información Resumen",
    icon: 'fas fa-clipboard',
    iconFixed: 'fas fa-thumbtack',
    tipo: "detalle",
    fixed: true,
    campos: [
      {
        "key": "Año/Número EJG",
        "value": "E2018/00068"
      },
      {
        "key": "Solicitante",
        "value": "RFOFOSQ DDUVBJX, JUAN"
      },
      {
        "key": "Estado",
        "value": "Dictaminado"
      },
      {
        "key": "Designado",
        "value": "XXXXXX XXXX, YYYYY"
      },
      {
        "key": "Dictamen",
        "value": "sfdsfs gdfgfdg hththtrh"
      },
      {
        "key": "Resolución CAJG",
        "value": "ggdfgdg gfgfd gg gfgfdgdfgfdgfdgfdgdfgf"
      },
      {
        "key": "Impugnación",
        "value": "ggdfgdg gfgfd gg gfgfdgdfgfdgfdgfdgdfgf"
      }
    ],
  };

  listaTarjetas = [
    {
      nombre: "Datos Generales",
      imagen: "assets/images/img-colegiado.PNG",
      tipo: "detalle",
      fixed: false,
      campos: [
        {
          "key": "Fecha Apertura",
          "value": "J02/07/2007"
        },
        {
          "key": "Año/Número EJG",
          "value": "e2018/00068"
        },
        {
          "key": "Tipo EJG",
          "value": "Ordinario"
        },
        {
          "key": "Tipo EJG Colegio",
          "value": "Penal"
        },
        {
          "key": "Estado",
          "value": "Dictaminado"
        }
      ]
    },
    {
      nombre: "Servicios de tramitación",
      imagen: "",
      icon: "fa fa-gavel",
      tipo: "detalle",
      fixed: false,
      campos: [
        {
          "key": "Turno",
          "value": "MEDIACION VIC"
        },
        {
          "key": "Guardia",
          "value": "MEDIACION JUZGADOS"
        },
        {
          "key": "Tramitador",
          "value": "TORRES ALFARO, PEDRO"
        }
      ]
    },
    {
      nombre: "Unidad Familiar",
      imagen: "",
      icon: 'fa fa-users',
      tipo: "detalle",
      fixed: false,
      campos: [
        {
          "key": "Identificación",
          "value": "21490602T"
        },
        {
          "key": "Apellidos",
          "value": "RFOFOSQ DDUVBJX"
        },
        {
          "key": "Nombre",
          "value": "JUAN"
        },
        {
          "key": "Estado EJG",
          "value": "PENDIENTE"
        }
      ]
    },
    {
      nombre: "Expedientes Económicos",
      imagen: "",
      icon: 'fa fa-dollar',
      tipo: "detalle",
      fixed: false,
      campos: [
        {
          "key": "Número total",
          "value": "5"
        }
      ]
    },
    {
      nombre: "Relaciones",
      imagen: "",
      icon: 'fas fa-link',
      tipo: "detalle",
      fixed: false,
      campos: [
        {
          "key": "Número total de Relaciones",
          "value": "5"
        }
      ]
    },
    {
      nombre: "Estados",
      imagen: "",
      icon: 'fa fa-graduation-cap',
      tipo: "detalle",
      fixed: false,
      campos: [
        {
          "key": "Estado",
          "value": "Dictaminado"
        },
        {
          "key": "Fecha",
          "value": "02/07/2007"
        }
      ]
    },
    {
      nombre: "Documentación",
      imagen: "",
      icon: 'fa fa-briefcase',
      tipo: "detalle",
      fixed: false,
      campos: [
        {
          "key": "Número total de Documentos",
          "value": "7"
        }
      ]
    },
    {
      nombre: "Informe Calificación",
      imagen: "",
      icon: 'fa fa-certificate',
      tipo: "detalle",
      fixed: false,
      campos: [
        {
          "key": "Fecha",
          "value": "02/07/2007"
        },
        {
          "key": "Dictamen",
          "value": "grbjgbrejgberjgberjgbrejgebr greger"
        },
        {
          "key": "Fundamento",
          "value": "grbjgbrejgberjgberjgbrejgebr gregergrgregergreg ...."
        }
      ]
    },
    {
      nombre: "Resolución",
      imagen: "",
      icon: 'fa fa-gavel',
      tipo: "detalle",
      fixed: false,
      campos: [
        {
          "key": "Fecha",
          "value": "02/07/2007"
        },
        {
          "key": "Tipo resolución",
          "value": "XXXXXXXX"
        },
        {
          "key": "Fundamento",
          "value": "grbjgbrejgberjgberjgbrejgebr gregergrgregergreg ...."
        }
      ]
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
