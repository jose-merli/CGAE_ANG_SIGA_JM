import { Component, OnInit, ViewChild } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { TablaResultadoOrderCGService, Row } from '../shared/tabla-resultado-order/tabla-resultado-order-cg.service';
import { TablaResultadoOrderComponent } from '../shared/tabla-resultado-order/tabla-resultado-order.component';

@Component({
  selector: 'app-tarjeta-cola-guardia',
  templateUrl: './tarjeta-cola-guardia.component.html',
  styleUrls: ['./tarjeta-cola-guardia.component.scss']
})
export class TarjetaColaGuardiaComponent implements OnInit {

  @ViewChild(TablaResultadoOrderComponent) tablaResultadoOrderComponent: TablaResultadoOrderComponent;

  msgs: Message[] = [];
  allSelected = false;
  isDisabled = true;
  isDisabled2 = false;

  tarj = {
    opened: false,
    nombre: "Cola de Guardia",
    imagen: "",
    icono: 'fa fa-file-text',
    fixed: false,
    detalle: true,
    campos: [
      {
        "key": "Nº colegiado",
        "value": "104 Perez Salas Juan … 700 Sanchez Sanchez Pepe … 20 inscritos"
      }
    ],
    enlaces: []
  };

  selectores = [
    {
      nombre: "Seleccionar Guardia",
      opciones: [
        { value: "694", label: 'C. Provincial-Benalúa' },
        { value: "1494", label: 'C. Provincial-Benalúa(FS/Fest)' },
        { value: "695", label: 'C.Norte/Pascual Pérez' },
        { value: "1495", label: 'C.Norte/Pascual Pérez(FS/Fest)' },
        { value: "1316", label: 'G. dobles PENAL ant. a 2010' },
        { value: "699", label: 'G.C/Pol. Local Alic' },
        { value: "1496", label: 'G.C/Pol. Local Alic (FS/Fest)' },
        { value: "700", label: 'G.C/Pol. Local S.V' },
        { value: "1497", label: 'G.C/Pol. Local S.V (FS/Fest)' },
        { value: "1325", label: 'Guard. Refuerzo Penal Alicante' },
        { value: "697", label: 'Juz. Alicante (Inc)' },
        { value: "1498", label: 'Juz. Alicante (Inc) (FS/Fest)' },
        { value: "698", label: 'Juz.San Vicente(Inc)' },
        { value: "1499", label: 'Juz.San Vicente(Inc) (FS/Fest)' },
        { value: "767", label: 'L.Re2(Pref. Inv V.G)' },
        { value: "1501", label: 'L.Re2(Pref. Inv V.G) (FS/Fest)' },
        { value: "701", label: 'Letrado Reserva' },
        { value: "1500", label: 'Letrado Reserva (FS/Fest)' },
      ]
    }
  ]

  datepickers = ['Mostrar inscripciones a fecha de'];

  cabeceras = [
    {
      id: "grupo",
      name: "Grupo"
    },
    {
      id: "orden",
      name: "Orden"
    },
    {
      id: "ncolegiado",
      name: "Nº Colegiado"
    },
    {
      id: "apellidosnombre",
      name: "Apellidos, Nombre"
    },
    {
      id: "fechavalidez",
      name: "Fecha Validez"
    },
    {
      id: "fechabaja",
      name: "Fecha Baja"
    },
    {
      id: "compensaciones",
      name: "Compensaciones"
    },
    {
      id: "saltos",
      name: "Saltos"
    },
  ];
  showResponse = true;
  rowGroups: Row[];
  rowGroupsAux: Row[];
  showDatos: boolean = false;
  modoBusqueda: string = 'b';
  modoBusquedaB: boolean = true;
  selectAll = false;
  selectMultiple = false;

  seleccionarTodo = false;

  constructor(
    private trmService: TablaResultadoOrderCGService,
  ) { }

  ngOnInit(): void {
    this.rowGroups = this.trmService.getTableData();
    this.rowGroupsAux = this.trmService.getTableData();
  }

  selectedAll(event) {
    this.seleccionarTodo = event;
    this.isDisabled = !event;
  }
  notifyAnySelected(event) {
    if (this.seleccionarTodo || event) {
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

  clear() {
    this.msgs = [];
  }

  guardar() {
    this.tablaResultadoOrderComponent.guardar();
  }

}
