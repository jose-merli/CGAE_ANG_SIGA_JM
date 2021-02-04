import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ficha-colegiado',
  templateUrl: './ficha-colegiado.component.html',
  styleUrls: ['./ficha-colegiado.component.scss']
})
export class FichaColegiadoComponent implements OnInit {

  listaTarjetas = [
    {
      nombre: "Servicios de interés",
      icon: 'fas fa-link',
      tipo: "noDetalle",
      fixed: false,
      enlaces: [
        {
          "key": "Más información",
          "value": "0"
        }
      ]
    },
    {
      nombre: "Datos Generales",
      imagen: "assets/images/img-colegiado.PNG",
      tipo: "detalle",
      fixed: false,
      campos: [
        {
          "key": "Identificación",
          "value": "21496003L"
        },
        {
          "key": "Apellidos",
          "value": "LTSQVGMUM TUPKUCHL"
        },
        {
          "key": "Nombre",
          "value": "MARIA MERCEDES"
        },
        {
          "key": "Fecha Nacimiento",
          "value": "12/10/1970"
        }
      ]
    },
    {
      nombre: "Datos Colegiales",
      imagen: "",
      icon: 'far fa-address-book',
      tipo: "detalle",
      fixed: false,
      campos: [
        {
          "key": "Colegio",
          "value": "ALICANTE"
        },
        {
          "key": "Estado",
          "value": "Ejerciente"
        },
        {
          "key": "Nº Colegiado",
          "value": "4260"
        },
        {
          "key": "Residente",
          "value": "Si"
        },
        {
          "key": "Inscrito",
          "value": "No"
        }, {
          "key": "Fecha de Incorporación",
          "value": "04/04/1995"
        }
      ]
    },
    {
      nombre: "Otras Colegiaciones",
      imagen: "",
      icon: 'fa fa-graduation-cap',
      tipo: "detalle",
      fixed: false,
      campos: [
        {
          "key": "Número total de Colegiaciones",
          "value": "0"
        }
      ]
    },
    {
      nombre: "Certificados",
      imagen: "",
      icon: 'fa fa-certificate',
      tipo: "detalle",
      fixed: false,
      campos: [
        {
          "key": "Número total de Certificados",
          "value": "1"
        }
      ]
    },
    {
      nombre: "Sanciones",
      imagen: "",
      icon: 'fa fa-gavel',
      tipo: "detalle",
      fixed: false,
      campos: [
        {
          "key": "Número total de Sanciones",
          "value": "0"
        }
      ]
    },
    {
      nombre: "Sociedades",
      imagen: "",
      icon: 'fa fa-briefcase',
      tipo: "detalle",
      fixed: false,
      campos: [
        {
          "key": "Número total de Sociedades",
          "value": "0"
        }
      ]
    },
    {
      nombre: "Datos Curriculares",
      imagen: "",
      icon: 'fa fa-paperclip',
      tipo: "detalle",
      fixed: false,
      campos: [
        {
          "key": "Número total de Datos Curriculares",
          "value": "6"
        }
      ]
    },
    {
      nombre: "Direcciones",
      imagen: "",
      icon: 'fa fa-map-marker',
      tipo: "detalle",
      fixed: false,
      campos: [
        {
          "key": "Número total de Direcciones",
          "value": "2"
        }
      ]
    },
    {
      nombre: "Datos Bancarios",
      imagen: "",
      icon: 'fa fa-bank',
      tipo: "detalle",
      fixed: false,
      campos: [
        {
          "key": "Número total de Cuentas",
          "value": "1"
        }
      ]
    },
    {
      nombre: "Regtel",
      imagen: "",
      icon: 'fa fa-file-alt',
      tipo: "detalle",
      fixed: false,
      campos: [
        {
          "key": "Número total de Directorios",
          "value": "No se han encontrado Registros"
        }
      ]
    },
    {
      nombre: "Alter Mutua",
      imagen: "",
      icon: 'fa fa-user',
      tipo: "noDetalle",
      fixed: false,
      enlaces: [
        {
          "key": "Alternativa al RETA",
          "value": "0"
        }
      ]
    },
    {
      nombre: "Mutualidad de la abogacía",
      imagen: "",
      icon: 'fas fa-link',
      tipo: "noDetalle",
      fixed: false,
      enlaces: [
        {
          "key": "Plan Universal",
          "value": "0"
        }
      ]
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
