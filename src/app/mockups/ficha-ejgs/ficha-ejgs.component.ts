import { ViewChild } from '@angular/core';
import { HostListener } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { ElementRef } from '@angular/core';
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
          "value": "5"
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

  stickyElementoffset = 0;
  scrollOffset = 0;
  enableSticky = false;
  navbarHeight = 0;
  scrollWidth = 0;

  @ViewChild('parent') private parent: ElementRef;
  @ViewChild('navbar') private navbarElement: ElementRef;
  @ViewChild('content') private content: ElementRef;
  @ViewChild('main') private main: ElementRef;

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.stickyElementoffset = this.navbarElement.nativeElement.getBoundingClientRect().top;
    this.navbarHeight = this.navbarElement.nativeElement.clientHeight;
    this.scrollWidth = this.main.nativeElement.clientHeight - this.parent.nativeElement.clientHeight;
  }

  @HostListener("scroll", ['$event'])
  manageScroll($event: Event) {
    this.scrollOffset = $event.srcElement['scrollTop'];
    this.setSticky();
  }

  setSticky() {
    if (this.scrollOffset >= this.stickyElementoffset) {
      this.enableSticky = true;
      this.renderer.setStyle(this.content.nativeElement, "padding-top", this.navbarHeight + "px");
      this.renderer.setStyle(this.navbarElement.nativeElement, "right", this.scrollWidth + "px");
    } else {
      this.enableSticky = false;
      this.renderer.setStyle(this.content.nativeElement, "padding-top", "0px");
      this.renderer.setStyle(this.navbarElement.nativeElement, "right", this.scrollWidth + "px");
    }
  }

}
