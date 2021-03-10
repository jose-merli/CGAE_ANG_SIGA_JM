import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';

@Component({
  selector: 'app-ficha-cambio-letrado',
  templateUrl: './ficha-cambio-letrado.component.html',
  styleUrls: ['./ficha-cambio-letrado.component.scss']
})
export class FichaCambioLetradoComponent implements OnInit, AfterViewInit {

  msgs: Message[] = [];

  rutas: string[] = ['SJCS', 'Oficio', 'Designaciones', 'Cambio Letrado'];

  tarjetaFija = {
    nombre: "Resumen Cambio Letrado",
    icono: 'fas fa-clipboard',
    imagen: '',
    detalle: false,
    fixed: true,
    campos: [
      {
        "key": "Año/Número",
        "value": "E2018/00068"
      },
      {
        "key": "Interesado",
        "value": "BFRJBFRJF FRFRFR, JUAN"
      }
    ],
    enlaces: []
  };

  listaTarjetas = [
    {
      id: 'sjcsOfiDesigCmbLetDatColRen',
      nombre: "Datos Colegiado Renunciante",
      imagen: "",
      icono: 'fa fa-users',
      fixed: false,
      detalle: true,
      opened: false,
      campos: []
    },
    {
      id: 'sjcsOfiDesigCmbLetDatColSus',
      nombre: "Datos Colegiado Sustituto",
      imagen: "",
      icono: 'fa fa-users',
      fixed: false,
      detalle: true,
      opened: false,
      campos: []
    },
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
