import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { PreviousRouteService } from '../shared/services/previous-route.service';

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
      id: "identificador",
      name: "Identificador"
    },
    {
      id: "apellidosnombre",
      name: "Apellidos, Nombre"
    },
    {
      id: "direccion",
      name: "Dirección"
    },
    {
      id: "rol",
      name: "Rol"
    }
  ];

  elementos = [
    ['78900234T', "SFSFSAF DSGSDGSG, VICTOR JAVIER", "C/ LA SERNA Nº 10 - 03001 - ALICANTE", "Contrario"],
    ['23768954R', "ASWDFASG RETGAEWRT, MARIA TERESA", "C/ CAMARADA CÉSAR ELGUEZABAL Nº 18 - 03001 - ALICANTE", "Contrario"]
  ];

  elementosAux = [
    ['78900234T', "SFSFSAF DSGSDGSG, VICTOR JAVIER", "C/ LA SERNA Nº 10 - 03001 - ALICANTE", "Contrario"],
    ['23768954R', "ASWDFASG RETGAEWRT, MARIA TERESA", "C/ CAMARADA CÉSAR ELGUEZABAL Nº 18 - 03001 - ALICANTE", "Contrario"]
  ];

  isDisabled = true;

  datosProcurador = {};

  constructor(private previousRouteService: PreviousRouteService) { }

  ngOnInit() {


    if (this.previousRouteService.previousUrl.getValue() == '/pantallaBuscadorProcurador') {

      this.listaTarjetas.find(tarj => tarj.id == 'sjcsEjgsRelaPreDesigProcu').opened = true;

      if (sessionStorage.getItem('usuarioBusquedaProcurador')) {
        this.datosProcurador = JSON.parse(sessionStorage.getItem('usuarioBusquedaProcurador'));
        sessionStorage.removeItem('usuarioBusquedaProcurador')
      }

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

      this.listaTarjetasFijas[0].enlaces.push(tarjTmp);
    });

  }

  selectedAll(event) {
    this.allSelected = event;
    this.isDisabled = !event;
  }

  notifyAnySelected(event) {
    if (this.allSelected || event) {
      this.isDisabled = false;
    } else {
      this.isDisabled = true;
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

  goTop() {
    let top = document.getElementById("top");
    if (top) {
      top.scrollIntoView();
      top = null;
    }
  }

}
