import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ficha-designacion-oficio',
  templateUrl: './ficha-designacion-oficio.component.html',
  styleUrls: ['./ficha-designacion-oficio.component.scss']
})
export class FichaDesignacionOficioComponent implements OnInit {

  rutas: string[] = ['SJCS', 'Oficio', 'Designaciones'];

  tarjetaFija = null;

  listaTarjetas = [
    {
      id: 'sjcsOficDesigDatGen',
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
          "value": "02/07/2007"
        },
        {
          "key": "Designación Art. 27-28",
          "value": "NO"
        },
        {
          "key": "Tipo",
          "value": "VFNJRFJFNRJFJJ"
        },
      ]
    },
    {
      id: 'sjcsOficDesigDeta',
      nombre: "Detalle Designación",
      imagen: "",
      icono: 'fa fa-gavel',
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
          "key": "Módulo",
          "value": "VFNJRFJFXXX XXXX XXXXXXXX"
        },
      ]
    },
    {
      id: 'sjcsOficDesigDatAdic',
      nombre: "Datos Adicionales",
      imagen: "",
      icono: 'fa fa-university',
      fixed: false,
      detalle: true,
      opened: false,
      campos: [
        {
          "key": "Fecha Oficio Juzgado",
          "value": "02/09/2019"
        },
        {
          "key": "Fecha Recepción Colegio",
          "value": "03/09/2019"
        },
        {
          "key": "Fecha Juicio",
          "value": "10/09/2019 10:30"
        },
      ]
    },
    {
      id: 'sjcsOficDesigDatFac',
      nombre: "Datos Facturación",
      imagen: "",
      icono: 'fa fa-usd',
      fixed: false,
      detalle: true,
      opened: false,
      campos: [
        {
          "key": "Partida Presupuestaria",
          "value": "frfr frfrgtg ththth"
        },
      ]
    },
  ];

  constructor() { }

  ngOnInit() {
  }

}
