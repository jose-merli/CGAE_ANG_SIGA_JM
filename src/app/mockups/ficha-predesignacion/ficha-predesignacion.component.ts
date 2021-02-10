import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Message } from 'primeng/components/common/api';

@Component({
  selector: 'app-ficha-predesignacion',
  templateUrl: './ficha-predesignacion.component.html',
  styleUrls: ['./ficha-predesignacion.component.scss']
})
export class FichaPredesignacionComponent implements OnInit {

  allSelected = false;
  msgs: Message[] = [];
  rutas = ['SJCS', 'EJGS', 'Relaciones', 'PRE-Designación'];

  listaTarjetasFijas = [
    {
      nombre: "Información Resumen",
      imagen: "",
      icono: 'fas fa-clipboard',
      fixed: true,
      detalle: false,
      campos: [
        {
          "key": "Año/Número EJG",
          "value": "E2018/00068"
        },
        {
          "key": "Solicitante",
          "value": "SDFSSDF SFDSFSF, JUAN"
        },
        {
          "key": "Estado",
          "value": "Dictaminado"
        },
        {
          "key": "Designado",
          "value": "XXXXX XXXXX, YYYY"
        },
        {
          "key": "Dictamen",
          "value": "sasfsf drgftdgf ergege"
        },
        {
          "key": "Resolución CAJG",
          "value": "dsfsf drgftdgf ergegeDFGDGHDFBHDF"
        },
        {
          "key": "Impuganción",
          "value": "fsfsf dfgdfgdfgdgd"
        }
      ],
      enlaces: []
    },
  ];

  listaTarjetas = [
    {
      id: 'sjcsEjgsRelaPreDesigDefJuri',
      nombre: "Defensa Jurídica",
      imagen: "",
      icono: 'fas fa-user',
      fixed: false,
      detalle: true,
      opened: false,
      campos: [
        {
          "key": "Número Procedimiento",
          "value": "2008/2837333"
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
          "key": "En calidad de",
          "value": ""
        }
      ]
    },
    {
      id: 'sjcsEjgsRelaPreDesigProcu',
      nombre: "Procurador",
      imagen: "",
      icono: 'fas fa-user',
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
          "value": "MIGUEL DSFDFGDG DSGASG"
        }
      ]
    },
    {
      id: 'sjcsEjgsRelaPreDesigContra',
      nombre: "Contrarios",
      imagen: "",
      icono: 'fas fa-users',
      detalle: true,
      fixed: false,
      opened: false,
      campos: [
        {
          "key": "Número de Contrarios",
          "value": "8"
        }
      ]
    }
  ];

  cabeceras = [
    {
      id: "nif",
      name: "NIF"
    },
    {
      id: "nombre",
      name: "Nombre"
    },
    {
      id: "apellidos",
      name: "Apellidos"
    },
    {
      id: "fechaAlta",
      name: "Fecha Alta"
    },
    {
      id: "cargos",
      name: "Cargos"
    },
    {
      id: "estado",
      name: "Estado"
    },
    {
      id: "participación",
      name: "Participación"
    }
  ];
  elementos = [
    ['78900234T', "VICTOR JAVIER", "SFSFSAF DSGSDGSG", "06/02/2019", "Administrador", "Ejerciente", ""],
    ['23768954R', "MARIA TERESA", "ASWDFASG RETGAEWRT", "08/02/2019", "Administrador", "Ejerciente", ""]
  ];
  elementosAux = [
    ['78900234T', "VICTOR JAVIER", "SFSFSAF DSGSDGSG", "06/02/2019", "Administrador", "Ejerciente", ""],
    ['23768954R', "MARIA TERESA", "ASWDFASG RETGAEWRT", "08/02/2019", "Administrador", "Ejerciente", ""]
  ];
  isDisabled = true;
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

      this.listaTarjetasFijas[0].enlaces.push(tarjTmp);
    });
  }
  selectedAll(event){
    this.allSelected = event;
    this.isDisabled = !event;
  }
  notifyAnySelected(event){
    if (this.allSelected || event){
      this.isDisabled = false;
    } else {
      this.isDisabled = true;
    }
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

  showMsg(severity, summary, detail) {
    this.msgs = [];
    this.msgs.push({
      severity,
      summary,
      detail
    });
  }

  clear() {
    this.msgs = [];
  }

}
