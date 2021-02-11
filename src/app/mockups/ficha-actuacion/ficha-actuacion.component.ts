import { ElementRef } from '@angular/core';
import { HostListener } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ficha-actuacion',
  templateUrl: './ficha-actuacion.component.html',
  styleUrls: ['./ficha-actuacion.component.scss']
})
export class FichaActuacionComponent implements OnInit {

  rutas: string[] = ['SJCS', 'Designaciones', 'Actuaciones'];

  tarjetaFija = {
    nombre: "Resumen Actuación",
    icono: 'fas fa-clipboard',
    detalle: false,
    fixed: true,
    campos: [
      {
        "key": "Año/Número designación",
        "value": "D2018/00078"
      },
      {
        "key": "Turno",
        "value": "XXXXXX"
      },
      {
        "key": "Gurdia",
        "value": "XXXXXX"
      },
      {
        "key": "Número Actuación",
        "value": "4"
      },
      {
        "key": "Fecha Actuación",
        "value": "23/09/2018"
      },
      {
        "key": "Letrado",
        "value": "2131 SDFASFA SDFF, JUAN"
      },
      {
        "key": "Asistido",
        "value": "SDFASFA SDFF, JUAN"
      },
    ],
    enlaces: []
  };

  listaTarjetas = [
    {
      id: 'sjcsDesigActuaDatosGen',
      nombre: "Datos Generales",
      imagen: "",
      icono: 'far fa-address-book',
      fixed: false,
      detalle: true,
      opened: false,
      campos: [
        {
          "key": "Juzgado",
          "value": "Juzgado de lo social N1 BADAJOZ"
        },
        {
          "key": "Módulo",
          "value": "SSDFXXXX XXXX XXXXXXX"
        },
        {
          "key": "Acreditación",
          "value": "DSHBSBFSHDFNSDH SDHFB SDUFSUY"
        }
      ]
    },
    {
      id: 'sjcsDesigActuaJusti',
      nombre: "Justificación",
      icono: "fa fa-gavel",
      detalle: true,
      fixed: false,
      opened: false,
      campos: [
        {
          "key": "Estado",
          "value": "XXXXX"
        },
        {
          "key": "Fecha Justificación",
          "value": "25/01/2021"
        },
        {
          "key": "Partida Presupuestaria",
          "value": "XXXXXXXXX"
        }
      ]
    },
    {
      id: 'sjcsDesigActuaHidtoAct',
      nombre: "Histórico de la Actuación",
      imagen: "",
      icono: 'fa fa-user',
      detalle: true,
      fixed: false,
      opened: false,
      campos: [
        {
          "key": "Fecha Justificación",
          "value": "25/01/2021"
        },
        {
          "key": "Acción",
          "value": "Validar"
        },
        {
          "key": "Usuario",
          "value": "SJDFAJHBFH ASDHFBAJHFB, LUIS"
        }
      ]
    },
    {
      id: 'sjcsDesigActuaDoc',
      nombre: "Documentación",
      imagen: "",
      icono: "fa fa-briefcase",
      detalle: true,
      fixed: false,
      opened: false,
      campos: [
        {
          "key": "Número total de Documentos",
          "value": "7"
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
    this.goTop();
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

  goTop() {
    let top = document.getElementById("top");
    if (top) {
      top.scrollIntoView();
      top = null;
    }
  }


}
