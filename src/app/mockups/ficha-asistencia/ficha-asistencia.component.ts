import { ViewChild } from '@angular/core';
import { HostListener } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { ElementRef } from '@angular/core';
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
      imagen: "assets/images/img-colegiado.PNG",
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
      icono: "fa fa-gavel",
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
      icono: "fa fa-gavel",
      detalle: true,
      fixed: false,
      opened: false,
      campos: []
    },
    {
      id: 'sjcsEjgsfichAsistRel',
      nombre: "Relaciones",
      imagen: "",
      icono: 'fa fa-users',
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
      icono: 'fa fa-dollar',
      detalle: true,
      fixed: false,
      opened: false,
      campos: [
        {
          "key": "Identificación",
          "value": "56784308R"
        },{
          "key": "Apellidos",
          "value": "SAFSF SFSDFDSF"
        },{
          "key": "Nombre",
          "value": "JUAN"
        }
      ]
    },
    {
      id: 'sjcsEjgsfichAsistCont',
      nombre: "Contrarios",
      imagen: "",
      icono: 'fas fa-link',
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
      icono: 'fa fa-graduation-cap',
      detalle: true,
      fixed: false,
      opened: false,
      campos: []
    },{
      id: 'sjcsEjgsfichAsistCol',
      nombre: "Colegiado",
      imagen: "",
      icono: 'fa fa-graduation-cap',
      detalle: true,
      fixed: false,
      opened: false,
      campos: []
    }
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
      icono: 'fa fa-certificate',
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
