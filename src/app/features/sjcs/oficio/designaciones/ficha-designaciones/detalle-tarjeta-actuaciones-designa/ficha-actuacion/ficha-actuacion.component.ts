import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { ActuacionDesignaItem } from '../../../../../../../models/sjcs/ActuacionDesignaItem';
import { SigaServices } from '../../../../../../../_services/siga.service';

@Component({
  selector: 'app-ficha-actuacion',
  templateUrl: './ficha-actuacion.component.html',
  styleUrls: ['./ficha-actuacion.component.scss']
})
export class FichaActuacionComponent implements OnInit {

  rutas: string[] = ['SJCS', 'Designaciones', 'Actuaciones', 'Ficha Actuación'];

  tarjetaFija = {
    nombre: "Resumen Actuación",
    icono: 'fas fa-clipboard',
    imagen: '',
    detalle: false,
    fixed: true,
    campos: [
      {
        "key": "Año/Número designación",
        "value": "D2018/00078"
      },
      {
        "key": "Letrado",
        "value": "2131 SDFASFA SDFF, JUAN"
      },
      {
        "key": "Fecha Actuación",
        "value": "22/09/2018"
      },
      {
        "key": "Número Actuación",
        "value": "4"
      },
    ],
    enlaces: []
  };

  listaTarjetas = [
    {
      id: 'sjcsDesigActuaOfiDatosGen',
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
          "value": "SSDFXXXXXXXXX XXXX XXXXXXX"
        },
        {
          "key": "Acreditación",
          "value": "VJHBFVJEFR VENVJKRENV VINNIRVE"
        },
      ]
    },
    {
      id: 'sjcsDesigActuaOfiJustifi',
      nombre: "Justificación",
      imagen: "",
      icono: 'fa fa-gavel',
      fixed: false,
      detalle: true,
      opened: false,
      campos: [
        {
          "key": "Fecha Justificación",
          "value": "12/03/2008"
        },
        {
          "key": "Estado",
          "value": "XXXXXXX"
        },
      ]
    },
    {
      id: 'sjcsDesigActuaOfiDatFac',
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
    {
      id: 'sjcsDesigActuaOfiRela',
      nombre: "Relaciones",
      imagen: "",
      icono: 'fas fa-link',
      fixed: false,
      detalle: false,
      opened: false,
      campos: [
        {
          "key": "Número total de Relaciones",
          "value": "5"
        },
      ]
    },
    {
      id: 'sjcsDesigActuaOfiHist',
      nombre: "Histórico",
      imagen: "",
      icono: 'fas fa-table',
      fixed: false,
      detalle: true,
      opened: false,
      campos: []
    },
    {
      id: 'sjcsDesigActuaOfiDoc',
      nombre: "Documentación",
      imagen: "",
      icono: 'fa fa-briefcase',
      fixed: false,
      detalle: false,
      opened: false,
      campos: [
        {
          "key": "Número total de Documentos",
          "value": "7"
        },
      ]
    },
  ];

  actuacionDesigna: any;
  isNewActDesig: boolean = false;
  progressSpinner: boolean = false;

  constructor(private location: Location, private sigaServices: SigaServices) { }

  ngOnInit() {

    if (sessionStorage.getItem("actuacionDesigna")) {
      let actuacion = JSON.parse(sessionStorage.getItem("actuacionDesigna"));
      this.actuacionDesigna = actuacion;
      console.log("🚀 ~ file: ficha-actuacion.component.ts ~ line 149 ~ FichaActuacionComponent ~ ngOnInit ~ this.actuacionDesigna", this.actuacionDesigna)

      if (actuacion.isNew) {
        this.getNewId(actuacion.designaItem);
        this.isNewActDesig = true;
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

  backTo() {
    this.location.back();
  }

  getNewId(designaItem: any) {

    this.progressSpinner = true;

    let actuacionRequest = {
      anio: designaItem.ano.toString().split('/')[0].replace('D', ''),
      idTurno: designaItem.idTurno,
      numero: designaItem.codigo,
    };

    this.sigaServices.post("actuaciones_designacion_newId", actuacionRequest).subscribe(
      data => {
        const idMax = JSON.parse(data.body).idMax;

        if (idMax != null) {
          this.actuacionDesigna.actuacion.numeroAsunto = idMax;
        }
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      },
      () => {
        if (this.isNewActDesig) {
          this.listaTarjetas.forEach(tarj => {
            if (tarj.id != 'sjcsDesigActuaOfiDatosGen') {
              tarj.detalle = false;
            } else {
              tarj.opened = true;
            }
          });
        }
      }
    );

  }


}
