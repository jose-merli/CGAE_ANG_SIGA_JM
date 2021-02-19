import { ViewChild } from '@angular/core';
import { HostListener } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ficha-contrarios',
  templateUrl: './ficha-contrarios.component.html',
  styleUrls: ['./ficha-contrarios.component.scss']
})
export class FichaContrariosComponent implements OnInit {

  rutas: string[] = ['SJCS', 'EJGS', 'Contrarios'];
  tarjetaFija = {
    nombre: "Resumen Designación",
    icono: 'fas fa-clipboard',
    detalle: false,
    fixed: true,
    opened: false,
    campos: [
      {
        "key": "Año/NúmerO",
        "value": "D2018/00087"
      },
      {
        "key": "Letrado",
        "value": "RFOFOSQ DDUVBJX, PEPE"
      },
      {
        "key": "Estado",
        "value": "Activa"
      },
      {
        "key": "Validado",
        "value": "NO"
      },
      {
        "key": "Número Actuaciones",
        "value": "12"
      }
    ],
    enlaces: []
  };

  listaTarjetas = [
    {
      id: 'sjcsEjgsfichContDatGen',
      nombre: "Datos Generales",
      imagen: "assets/images/img-colegiado.PNG",
      icono: 'far fa-address-book',
      detalle: true,
      fixed: false,
      opened: false,
      campos: [
        {
          "key": "NIF",
          "value": "24567893T"
        },
        {
          "key": "Nombre",
          "value": "María Hgdsgfsd Gadh"
        },
        {
          "key": "Fecha nacimiento",
          "value": "18/09/2020"
        },
        {
          "key": "Fecha alta",
          "value": "22/09/2020"
        }
      ]
    },
    {
      id: 'sjcsEjgsfichContDatSol',
      nombre: "Datos solicitudes",
      imagen: "",
      icono: "fa fa-gavel",
      detalle: true,
      fixed: false,
      opened: false,
      campos: [
        {
          "key": "Justicia gratuita",
          "value": "SI"
        },
        {
          "key": "Datos Agencia Tributaria",
          "value": "NO"
        },
        {
          "key": "Notificación Electrónica",
          "value": "SI"
        }
      ]
    },
    {
      id: 'sjcsEjgsfichContDir',
      nombre: "Dirección y Contacto",
      imagen: "",
      icono: 'fa fa-users',
      detalle: true,
      fixed: false,
      opened: false,
      campos: [
        {
          "key": "País",
          "value": "ESPAÑA"
        },
        {
          "key": "Dirección",
          "value": "AVD. CATEDRATICO SOLER, 3-OFICINA 2"
        },
        {
          "key": "Población",
          "value": "Alicante/Alacant"
        }
      ]
    },
    {
      id: 'sjcsEjgsfichContRep',
      nombre: "Representante",
      imagen: "",
      icono: 'fa fa-dollar',
      detalle: true,
      fixed: false,
      opened: false,
      campos: [
        {
          "key": "NIF",
          "value": "21345678Y"
        }, {
          "key": "Nombre",
          "value": "María José Ghdhdhdh Hhfhfhf"
        }, {
          "key": "Correo electrónico",
          "value": "djfhfyufd@redabogacia.org"
        }, {
          "key": "Móvil",
          "value": "676767676"
        }
      ],
      enlaces: [],
      enlaceCardClosed: { href: '/fichaJusticiable', title: 'Ficha Justiciable' }
    },
    {
      id: 'sjcsEjgsfichContAsunt',
      nombre: "Asuntos",
      imagen: "",
      icono: 'fas fa-link',
      detalle: true,
      fixed: false,
      opened: false,
      campos: [
        {
          "key": "Apunte",
          "value": "Listados colegiales / 2012-Contado..."
        }, {
          "key": "Periodo",
          "value": "01/01/2012 - 31/12/2012"
        }, {
          "key": "Descripción",
          "value": "04/02/2018"
        }, {
          "key": "Verificado",
          "value": "No"
        }
      ]
    },
    {
      id: 'sjcsEjgsfichContAb',
      nombre: "Abogado",
      imagen: "",
      icono: 'fa fa-graduation-cap',
      detalle: true,
      fixed: false,
      opened: false,
      campos: [
        {
          "key": "Colegio",
          "value": "ALICANTE"
        },
        {
          "key": "Nº Colegiado",
          "value": "6492"
        },
        {
          "key": "Nombre",
          "value": "MIGUEL HGGDFUJD DHDVSY"
        },
        {
          "key": "NIF",
          "value": "67432187Y"
        },
        {
          "key": "Estado",
          "value": "Ejerciente"
        }
      ],
      enlaces: [],
      enlaceCardClosed: { href: '/fichaColegial', title: 'Ficha colegial' }
    },
    {
      id: 'sjcsEjgsfichContProc',
      nombre: "Procurador",
      imagen: "",
      icono: 'fa fa-briefcase',
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
          "value": "MIGUEL HGGDFUJD DHDVSY"
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
