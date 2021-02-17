import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Message } from 'primeng/components/common/api';

@Component({
  selector: 'app-busqueda-ejg',
  templateUrl: './busqueda-ejg.component.html',
  styleUrls: ['./busqueda-ejg.component.scss']
})
export class BusquedaEjgComponent implements OnInit {
  isDisabled = true;
  rutas = ['SJCS', 'E.J.G'];
  msgs: Message[] = [];
  cFormValidity = true;
  show = false;
  allSelected = false;

  selectorEstados: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  selectores1 = [
    {
      nombre: "Tipo EJG",
      opciones: [
      ]
    },
    {
      nombre: "Tipo EJG Colegio",
      opciones: [
      ]
    },
    {
      nombre: "Creado desde",
      opciones: [
      ]
    },
    {
      nombre: "Estado EJG",
      opciones: [
      ]
    }
  ];
  datePickers1 = ["Fecha Apertura desde", "Fecha Apertura hasta", "Fecha Estado desde", "Fecha Estado hasta",
    "Fecha Límite desde", "Fecha Límite hasta"];


  selectores2 = [
    {
      nombre: "Dictamen",
      opciones: [
      ]
    },
    {
      nombre: "Fundamento Calificación",
      opciones: [
      ]
    },
    {
      nombre: "Resolución",
      opciones: [{ "label": "Archivo/s", "value": "5" }, { "label": "Confirmar y DENEGAR", "value": "3" }, { "label": "Confirmar y RECONOCER 100%", "value": "1" }, { "label": "Confirmar y RECONOCER 80%", "value": "2" }, { "label": "Devuelto al Colegio", "value": "6" }, { "label": "Modificar y DENEGAR", "value": "7" }, { "label": "Modificar y RECONOCER CON NOMBRAMIENTO 100%", "value": "8" }, { "label": "Modificar y RECONOCER CON NOMBRAMIENTO 80%", "value": "10" }, { "label": "Modificar y RECONOCER SIN NOMBRAMIENTO 100%", "value": "9" }, { "label": "Modificar y RECONOCER SIN NOMBRAMIENTO 80%", "value": "11" }, { "label": "Pendiente CAJG - Otros", "value": "4" }]
    },
    {
      nombre: "Fundamentos Jurídico",
      opciones: [
      ]
    },
    {
      nombre: "Impugnación",
    },
    {
      nombre: "Fundamento Impugnación",
      opciones: [
      ]
    }
  ];


  datePickers2 = ["Fecha Dictamen desde", "Fecha Dictamen hasta", "Fecha Resolución desde", "Fecha Resolución hasta",
    "Fecha Impugnación desde", "Fecha Impugnación hasta"];


  selectores3 = [
    {
      nombre: "Juzgado",
      opciones: [
      ]
    },
    {
      nombre: "Calidad",
      opciones: [
      ]
    },
    {
      nombre: "Preceptivo",
      opciones: [
      ]
    },
    {
      nombre: "Renuncia",
      opciones: [
      ]
    },
    {
      nombre: "Procedimiento",
      opciones: [
      ]
    },
  ];

  selectores4 = [
    {
      nombre: 'Ponente',
      opciones: []
    }
  ];

  datePickers3 = ['Fecha Ponente desde', 'Fecha Ponente hasta'];

  selectores5 = [
    {
      nombre: 'Rol',
      opciones: []
    }
  ];

  selectores6 = [
    {
      nombre: 'Turno',
      opciones: [
      ]
    },
    {
      nombre: 'Guardia',
      opciones: [
      ]
    },
    {
      nombre: 'Tipo Letrado',
      opciones: []
    }
  ];


  inputs1 = ['Asunto', 'Num/Año Procedimiento', 'NIG'];
  inputs2 = ['Año CAJG', 'Número CAJG', 'Año Acta', 'Número Acta', 'Número Registro Remesa'];
  inputs3 = ['NIF', 'Apellidos', 'Nombre'];

  inputs = [this.inputs1, this.inputs2, this.inputs3];
  selectores = [this.selectores1, this.selectores2, this.selectores3, this.selectores4, this.selectores5, this.selectores6];
  datePickers = [this.datePickers1, this.datePickers2, this.datePickers3];

  cabeceras = [
    {
      id: "turnoguardiaejg",
      name: "Turno/Guardia EJG"
    },
    {
      id: "turnodesignacion",
      name: "Turno Designación"
    },
    {
      id: "anionumeroejg",
      name: "Año/Número del EJG"
    },
    {
      id: "letradodesignacion",
      name: "Letrado de la designación"
    },
    {
      id: "fechaapertura",
      name: "Fecha Apertura"
    },
    {
      id: "estadoejg",
      name: "Estado del EJG"
    },
    {
      id: "apellidosnombre",
      name: "Apellidos, Nombre"
    },

  ];

  elementos = [
    ['T.O PENAL NOVELDA/G. Civil Novelda', 'T.O PEN NOVIEMBRE', 'E2018/00068', 'ASNDADBH AHDBHAJD, ANA', '27/05/2018', 'Archivado', 'ASNDADBH AHDBHAJD, JUAN'],
    ['T.O PENAL NOVELDA/G. Civil Novelda', 'T.O PEN NOVIEMBRE', 'E2018/00070', 'ASNDADBH AHDBHAJD, JUAN', '25/04/2018', 'Archivado', 'ASNDADBH AHDBHAJD, ANA'],
  ];
  elementosAux = [
    ['T.O PENAL NOVELDA/G. Civil Novelda', 'T.O PEN NOVIEMBRE', 'E2018/00068', 'ASNDADBH AHDBHAJD, ANA', '27/05/2018', 'Archivado', 'ASNDADBH AHDBHAJD, JUAN'],
    ['T.O PENAL NOVELDA/G. Civil Novelda', 'T.O PEN NOVIEMBRE', 'E2018/00070', 'ASNDADBH AHDBHAJD, JUAN', '25/04/2018', 'Archivado', 'ASNDADBH AHDBHAJD, ANA'],
  ];
  constructor( ) { }

  ngOnInit(): void {
    
  }

  saveForm($event) {
    this.cFormValidity = $event;
  }
  showResponse() {
    this.show = true;
  }
  hideResponse() {
    this.show = false;
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

  showMsg(severity, summary, detail) {
    this.msgs = [];
    this.msgs.push({
      severity,
      summary,
      detail
    });
  }

}