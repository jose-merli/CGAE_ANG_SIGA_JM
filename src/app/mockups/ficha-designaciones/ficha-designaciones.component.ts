import { ElementRef } from '@angular/core';
import { HostListener } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { ViewChild } from '@angular/core';
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
        },{
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
      icono: 'fa fa-user',
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
      icono: "fa fa-briefcase",
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
    },{
      id: 'sjcsDesigContra',
      nombre: "Contrarios",
      imagen: "",
      icono: "fa fa-briefcase",
      detalle: true,
      fixed: false,
      opened: false,
      campos: [
        {
          "key": "Número de Contrarios",
          "value": "8"
        }
      ]
    },   {
      id: 'sjcsDesigProc',
      nombre: "Procurador",
      imagen: "",
      icono: "fa fa-briefcase",
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
    },   {
      id: 'sjcsDesigCamb',
      nombre: "Cambio Letrado",
      imagen: "",
      icono: "fa fa-briefcase",
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
      enlaces: [    
        {
        "texto": "Ficha colegial",
        "href": "/fichaColegial"
      }]
    }, {
      id: 'sjcsDesigRel',
      nombre: "Relaciones",
      imagen: "",
      icono: "fa fa-briefcase",
      detalle: false,
      fixed: false,
      opened: false,
      campos: []
    },  {
      id: 'sjcsDesigCom',
      nombre: "Comunicaciones",
      imagen: "",
      icono: "fa fa-briefcase",
      detalle: true,
      fixed: false,
      opened: false,
      campos: [
        {
          "key": "Nº total de Comunicaciones",
          "value": "54"
        }
      ]
    },  {
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
    },  {
      id: 'sjcsDesigAct',
      nombre: "Actuaciones",
      imagen: "",
      icono: "fa fa-briefcase",
      detalle: true,
      fixed: false,
      opened: false,
      campos: [
        {
          "key": "Nº total",
          "value": "5"
        }
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

    this.listaTarjetas.forEach(tarj => {
      let tarjTmp = {
        id: tarj.id,
        ref: document.getElementById(tarj.id),
        nombre: tarj.nombre
      };

      this.tarjetaFija.enlaces.push(tarjTmp);
    });

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

  isOpenReceive(event) {
    let tarjTemp = this.listaTarjetas.find(tarj => tarj.id == event);

    if (tarjTemp.detalle) {
      tarjTemp.opened = true;
    }

  }


}
