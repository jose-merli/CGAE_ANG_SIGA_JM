import { Component, OnInit } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';

@Component({
  selector: 'app-ficha-ejgs',
  templateUrl: './ficha-ejgs.component.html',
  styleUrls: ['./ficha-ejgs.component.scss']
})
export class FichaEjgsComponent implements OnInit {

  rutas: string[] = ['SJCS', 'EJGS'];
  tarjetaFija = {
    nombre: "Información Resumen",
    icono: 'fas fa-clipboard',
    detalle: false,
    fixed: true,
    opened: false,
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
    enlaces: []
  };

  listaTarjetas = [
    {
      id: 'sjcsEjgsfichEjgsDatGen',
      nombre: "Datos Generales",
      imagen: "assets/images/img-colegiado.PNG",
      icono: 'far fa-address-book',
      detalle: true,
      fixed: false,
      opened: false,
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
      id: 'sjcsEjgsfichEjgsSerTra',
      nombre: "Servicios de tramitación",
      imagen: "",
      icono: "fa fa-gavel",
      detalle: true,
      fixed: false,
      opened: false,
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
      id: 'sjcsEjgsfichEjgsUniFam',
      nombre: "Unidad Familiar",
      imagen: "",
      icono: 'fa fa-users',
      detalle: true,
      fixed: false,
      opened: false,
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
      id: 'sjcsEjgsfichEjgsExpEco',
      nombre: "Expedientes Económicos",
      imagen: "",
      icono: 'fa fa-dollar',
      detalle: true,
      fixed: false,
      opened: false,
      campos: [
        {
          "key": "Número total",
          "value": "3"
        }
      ]
    },
    {
      id: 'sjcsEjgsfichEjgsRela',
      nombre: "Relaciones",
      imagen: "",
      icono: 'fas fa-link',
      detalle: true,
      fixed: false,
      opened: false,
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
    },
    {
      id: 'sjcsEjgsfichEjgsEstad',
      nombre: "Estados",
      imagen: "",
      icono: 'fa fa-graduation-cap',
      detalle: true,
      fixed: false,
      opened: false,
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
      id: 'sjcsEjgsfichEjgsDoc',
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
    },
    {
      id: 'sjcsEjgsfichEjgsInfoCal',
      nombre: "Informe Calificación",
      imagen: "",
      icono: 'fa fa-certificate',
      detalle: true,
      fixed: false,
      opened: false,
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
      id: 'sjcsEjgsfichEjgsResol',
      nombre: "Resolución",
      imagen: "",
      icono: 'fa fa-gavel',
      detalle: true,
      fixed: false,
      opened: false,
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
    },
    {
      id: 'sjcsEjgsfichEjgsInpug',
      nombre: "Impugnación",
      imagen: "",
      icono: 'fa fa-bank',
      detalle: true,
      fixed: false,
      opened: false,
      campos: [
        {
          "key": "Fecha",
          "value": "25/01/2021"
        },
        {
          "key": "Auto Resolutorio",
          "value": "Jasfsdgfs dsgagag"
        },
        {
          "key": "Sentido del Auto",
          "value": "swfeswgfsdfgdfsg"
        }
      ]
    },
    {
      id: 'sjcsEjgsfichEjgsReg',
      nombre: "Regtel",
      imagen: "",
      icono: 'fas fa-file-alt',
      detalle: true,
      fixed: false,
      opened: false,
      campos: [
        {
          "key": "Número total de Directorios",
          "value": "No se han encontrado Registros"
        },
      ]
    },
    {
      id: 'sjcsEjgsfichEjgsComu',
      nombre: "Comunicaciones",
      imagen: "",
      icono: 'fa fa-inbox',
      detalle: true,
      fixed: false,
      opened: false,
      campos: [
        {
          "key": "Número total de Comunicaciones",
          "value": "54"
        },
      ]
    }
  ];

  constructor(private router: Router) { }

  ngOnInit() {
    this.checkLastRoute();

    if (sessionStorage.getItem('esBuscadorColegiados') == "true" && sessionStorage.getItem("tarjeta")) {
      this.isOpenReceive(sessionStorage.getItem("tarjeta"));
    }
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

  checkLastRoute() {

    this.router.events
      .filter(e => e instanceof RoutesRecognized)
      .pairwise()
      .subscribe((event: any[]) => {
        if (event[0].urlAfterRedirects == "/pantallaBuscadorColegiados") {
          sessionStorage.setItem("esBuscadorColegiados", "true");
        } else {
          sessionStorage.setItem("esBuscadorColegiados", "false");
        }
      });
  }

}
