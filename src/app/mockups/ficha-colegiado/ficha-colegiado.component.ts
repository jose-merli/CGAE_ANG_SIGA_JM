import { ElementRef } from '@angular/core';
import { HostListener } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ficha-colegiado',
  templateUrl: './ficha-colegiado.component.html',
  styleUrls: ['./ficha-colegiado.component.scss']
})
export class FichaColegiadoComponent implements OnInit {

  tarjetaFija = null;

  listaTarjetas = [
    {
      nombre: "Servicios de interés",
      icono: 'fas fa-link',
      detalle: false,
      fixed: true,
      enlaces: [
        {
          "texto": "Facturación",
         // "href": "/mantenimientoFactura",
         "href": "",
          "params": []
        },
        {
          "texto": "Auditoría",
          "href": "/auditoriaUsuarios",
          "params": "21496003L"
        },
        {
          "texto": "Comunicaciones",
          "href": "/comunicacionesCenso",
          "params": "21496003L"
        }
      ]
    },
    {
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
