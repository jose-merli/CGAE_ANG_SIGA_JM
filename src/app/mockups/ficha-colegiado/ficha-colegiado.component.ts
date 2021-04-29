import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ficha-colegiado',
  templateUrl: './ficha-colegiado.component.html',
  styleUrls: ['./ficha-colegiado.component.scss']
})
export class FichaColegiadoComponent implements OnInit {

  rutas: string[] = ['Censo', 'Colegiados', 'Ficha colegial'];
  tarjetaFija = {
    nombre: "Información Resumen",
    icono: 'fas fa-clipboard',
    detalle: false,
    fixed: true,
    campos: [
      {
        "key": "Apellidos y Nombre",
        "value": "ABDTW YSVYHDZT, JUAN CARLOS"
      },
      {
        "key": "Identificación",
        "value": "21421197D"
      },
      {
        "key": "Número de Colegiado",
        "value": "4792"
      },
      {
        "key": "Situación Ejercicio Actual",
        "value": "Activo"
      }
    ],
    enlaces: []
  };

  listaTarjetas = [
    {
      id: 'mockFichColeSerInte',
      nombre: "Servicios de interés",
      icono: 'fas fa-link',
      detalle: false,
      fixed: false,
      enlaces: [
        {
          "texto": "SJCS > Inscripciones Turno",
          "href": "",
          "params": ""
        },
        {
          "texto": "SJCS > Inscripciones Guardia",
          "href": "",
          "params": ""
        },
        {
          "texto": "SJCS > Calendario Guardias",
          "href": "/pantallaCalendariosComponent",
          "params": ""
        },
        {
          "texto": "SJCS > Desginaciones",
          "href": "/fichaDesignacionesComponent",
          "params": ""
        },
        {
          "texto": "SJCS > Asistencias",
          "href": "/fichaAsistenciaComponent",
          "params": ""
        },
        {
          "texto": "SJCS > Preasistencias",
          "href": "",
          "params": ""
        },
        {
          "texto": "SJCS > Facturación > Cartas facturación y pago",
          "href": "",
          "params": ""
        },
        {
          "texto": "SJCS > Facturación > Retenciones",
          "href": "",
          "params": ""
        },
        {
          "texto": "SJCS > Facturación > Movimientos varios",
          "href": "",
          "params": ""
        },
        {
          "texto": "Facturación > ...",
          "href": "",
          "params": ""
        }
      ]
    },
    {
      id: 'mockFichColeDatGen',
      nombre: "Datos Generales",
      imagen: "",
      icono: 'fa fa-user',
      detalle: true,
      fixed: false,
      opened: false,
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
      id: 'mockFichColeDatCol',
      nombre: "Datos Colegiales",
      imagen: "",
      icono: 'far fa-address-book',
      detalle: true,
      fixed: false,
      opened: false,
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
      id: 'mockFichColeOtrCole',
      nombre: "Otras Colegiaciones",
      imagen: "",
      icono: 'fa fa-graduation-cap',
      detalle: true,
      fixed: false,
      opened: false,
      campos: [
        {
          "key": "Número total de Colegiaciones",
          "value": "0"
        }
      ]
    },
    {
      id: 'mockFichColeCert',
      nombre: "Certificados",
      imagen: "",
      icono: 'fa fa-certificate',
      detalle: true,
      fixed: false,
      opened: false,
      campos: [
        {
          "key": "Número total de Certificados",
          "value": "1"
        }
      ]
    },
    {
      id: 'mockFichColeSan',
      nombre: "Sanciones",
      imagen: "",
      icono: 'fa fa-gavel',
      detalle: true,
      fixed: false,
      opened: false,
      campos: [
        {
          "key": "Número total de Sanciones",
          "value": "0"
        }
      ]
    },
    {
      id: 'mockFichColeSoci',
      nombre: "Sociedades",
      imagen: "",
      icono: 'fa fa-briefcase',
      detalle: true,
      fixed: false,
      opened: false,
      campos: [
        {
          "key": "Número total de Sociedades",
          "value": "0"
        }
      ]
    },
    {
      id: 'mockFichColeDatCurr',
      nombre: "Datos Curriculares",
      imagen: "",
      icono: 'fa fa-paperclip',
      detalle: true,
      fixed: false,
      opened: false,
      campos: [
        {
          "key": "Número total de Datos Curriculares",
          "value": "6"
        }
      ]
    },
    {
      id: 'mockFichColeDirecc',
      nombre: "Direcciones",
      imagen: "",
      icono: 'fa fa-map-marker',
      detalle: true,
      fixed: false,
      opened: false,
      campos: [
        {
          "key": "Número total de Direcciones",
          "value": "2"
        }
      ]
    },
    {
      id: 'mockFichColeDatBanc',
      nombre: "Datos Bancarios",
      imagen: "",
      icono: 'fa fa-bank',
      detalle: true,
      fixed: false,
      opened: false,
      campos: [
        {
          "key": "Número total de Cuentas",
          "value": "1"
        }
      ]
    },
    {
      id: 'mockFichColeRegt',
      nombre: "Regtel",
      imagen: "",
      icono: 'fa fa-file-alt',
      detalle: true,
      fixed: false,
      opened: false,
      campos: [
        {
          "key": "Número total de Directorios",
          "value": "No se han encontrado Registros"
        }
      ]
    },
    {
      id: 'mockFichColeAltMut',
      nombre: "Alter Mutua",
      imagen: "",
      icono: 'fa fa-user',
      detalle: false,
      fixed: false,
      opened: false,
      enlaces: [
        {
          "texto": "Alternativa al RETA",
          "href": "0"
        },
        {
          "texto": "Ofertas",
          "href": "0"
        }
      ]
    },
    {
      id: 'mockFichColeMutuAboga',
      nombre: "Mutualidad de la abogacía",
      imagen: "",
      icono: 'fas fa-link',
      detalle: false,
      fixed: false,
      opened: false,
      enlaces: [
        {
          "texto": "Plan Universal",
          "href": "0"
        },
        {
          "texto": "Seguro Accidentes",
          "href": "0"
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