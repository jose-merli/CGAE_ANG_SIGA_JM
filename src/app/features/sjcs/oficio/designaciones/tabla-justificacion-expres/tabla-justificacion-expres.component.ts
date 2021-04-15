import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Message } from 'primeng/primeng';
import { RowGroup, TablaResultadoDesplegableJEService } from '../../../../../commons/tabla-resultado-desplegable/tabla-resultado-desplegable-je.service';
import { JustificacionExpressItem } from '../../../../../models/sjcs/JustificacionExpressItem';

@Component({
  selector: 'app-tabla-justificacion-expres',
  templateUrl: './tabla-justificacion-expres.component.html',
  styleUrls: ['./tabla-justificacion-expres.component.scss']
})

export class TablaJustificacionExpresComponent implements OnInit {

  progressSpinner: boolean = false;
  seleccionarTodo: boolean = false;

  @Input() datosJustificacion;
  totalRegistros = 0;

  datosJustificacionAux: JustificacionExpressItem = new JustificacionExpressItem();

  rutas = ['SJCS', 'Designaciones'];
  msgs: Message[] = [];
  rowGroups: RowGroup[];
  rowGroupsAux: RowGroup[];
  numDesignas = 0;
  totalDesignas = 0;
  numActuaciones = 0;
  totalActuaciones = 0;
  modoBusqueda: string = 'b';

  from = 0;
  to = 10;
  numperPage = 10;

  cabeceras = [
    {
      id: "anio",
      name: "Año/Número Designación"
    },
    {
      id: 'ejgs',
      name: "EJG's"
    },
    {
      id: 'clientes',
      name: 'Clientes'
    },
    {
      id: 'finalizado',
      name: 'Finalizado'
    },
    {
      id: 'juzgado',
      name: 'Juzgado'
    },
    {
      id: 'nig',
      name: 'NIG'
    },
    {
      id: 'nproced',
      name: 'Nº Proced'
    },
    {
      id: "modulo",
      name: "Módulo"
    },
    {
      id: "actuacion",
      name: "Fecha Actuación"
    },
    {
      id: "justificacion",
      name: "Justificación"
    },
    {
      id: "acreditacion",
      name: "Acreditación"
    },
    {
      id: "validar",
      name: "Validar"
    }
  ];
  
  selectores1 = [
    {
      nombre: "Estado",
      opciones: [{ label: 'XXXXXXXXXXX', value: 1 },
      { label: 'XXXXXXXXXXX', value: 2 },
      { label: 'XXXXXXXXXXX', value: 3 },]
    },
    {
      nombre: "Actuaciones Validadas",
      opciones: [{ label: 'XXXXXXXXXXX', value: 1 },
      { label: 'XXXXXXXXXXX', value: 2 },
      { label: 'XXXXXXXXXXX', value: 3 },]
    },
    {
      nombre: "Incluir sin EJG",
      opciones: [{ label: 'XXXXXXXXXXX', value: 1 },
      { label: 'XXXXXXXXXXX', value: 2 },
      { label: 'XXXXXXXXXXX', value: 3 },]
    },
    {
      nombre: "Con EJG no favorables",
      opciones: [{ label: 'XXXXXXXXXXX', value: 1 },
      { label: 'XXXXXXXXXXX', value: 2 },
      { label: 'XXXXXXXXXXX', value: 3 },]
    },
    {
      nombre: "EJG's sin resolución",
      opciones: [{ label: 'XXXXXXXXXXX', value: 1 },
      { label: 'XXXXXXXXXXX', value: 2 },
      { label: 'XXXXXXXXXXX', value: 3 },]
    },
    {
      nombre: "EJG's Resolución PTE CAJG",
      opciones: [{ label: 'XXXXXXXXXXX', value: 1 },
      { label: 'XXXXXXXXXXX', value: 2 },
      { label: 'XXXXXXXXXXX', value: 3 },]
    }
  ];
  
  datePickers1 = ["Fecha de Justificación Desde", "Fecha de Justificación Hasta"];
  datePickers2 = ["Fecha de Designación Desde", "Fecha de Designación Hasta"];
  datePickers = [this.datePickers1, this.datePickers2];
  
  inputs1 = [
    "Año Designación", "Número Designación", "Apellidos", "Nombre", "Año EJG", "Número EJG"
  ];

  constructor(private trdService: TablaResultadoDesplegableJEService) 
  { }

  ngOnInit(): void {

    this.progressSpinner=false;

    this.datosJustificacionAux = this.datosJustificacion;

    this.cargaInicial();
  }

  cargaInicial(){
    let resultModified = {};
    let data = [];
    let dataObj = {};
    
    let arr1 = [];
    let obj1 = {};
    
    this.datosJustificacion.forEach((obj, i) =>{
      let letra = (i + 10).toString(36).toUpperCase()
      let arr2 = [];
      let cod = obj.codigoDesignacion;
      arr1 = [];
      obj1 = {};
      obj.expedientes.forEach((expediente, index) =>{
        arr1 = 
        [{ type: 'text', value: expediente, size: 300 },
        { type: 'text', value: obj.cliente, size: 300 },
        // { type: 'checkbox', value: obj.fin },
        { type: 'checkbox', value: false, size: 50 },
        { type: 'text', value: obj.nombreJuzgado, size: 153 },
        { type: 'text', value: obj.nig, size: 153},
        { type: 'text', value: obj.numProcedimiento, size: 153 },
        // { type: 'select', value: obj.modulo },
        { type: 'select', value: '', size: 153 },
        { type: 'datePicker', value: obj.fechaActuacion, size: 153 },
        { type: 'text', value: obj.justificacionDesde , size: 153},
        { type: 'text', value: obj.acreditacion , size: 50},
        // { type: 'checkbox', value: obj.val }
        { type: 'checkbox', value: false, size: 50 },
      ];

        let key = letra + index;
        obj1 =  { [key] : arr1};
        arr1 = [];
        
        arr2.push(Object.assign({},obj1));
        obj1 = null;
      })

      dataObj = { [cod]  : arr2};
      data.push(Object.assign({},dataObj));
    })

    resultModified = Object.assign({},{'data': data});

    this.rowGroups = this.trdService.getTableData(resultModified);
    this.rowGroupsAux = this.rowGroups;
    this.totalRegistros = this.rowGroups.length;

    console.log(this.rowGroups);
  }
  
  

  // notifyAnySelected(event) {
  //   if (event) {
  //     this.isDisabled = false;
  //   } else {
  //     this.isDisabled = true;
  //   }
  // }

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
