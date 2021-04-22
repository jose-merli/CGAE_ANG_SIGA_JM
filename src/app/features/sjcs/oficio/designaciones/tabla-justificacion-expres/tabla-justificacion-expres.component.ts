import { DatePipe } from '@angular/common';
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
  @Input() colegiado;
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

  constructor(private trdService: TablaResultadoDesplegableJEService,
    private datepipe: DatePipe) 
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
    let expedientes = "";
    let listaCliente = "";
    let listaClienteAct = "";
    let arr1 = [];
    let obj1 = {};
    console.log('this.datosJustificacion: ', this.datosJustificacion)
    this.datosJustificacion.forEach((designacion, i) =>{
      let letra = (i + 10).toString(36).toUpperCase()
      let arr2 = [];
      let cod = designacion.codigoDesignacion;
      let estadoDesignacion = designacion.estado;
      arr1 = [];
      obj1 = {};
      if (designacion.expedientes != null && designacion.expedientes != []){
      designacion.expedientes.forEach(exp =>{
       // expedientes += '\n' + exp;
       expedientes +=  exp + '\n';
       })
      }else{
        expedientes = "";
      }

      if (designacion.nombreJuzgado != null && designacion.nombreJuzgado != []){
        designacion.nombreJuzgado.forEach(cliente =>{
         // expedientes += '\n' + exp;
         listaCliente +=  cliente + '\n';
         })
        }else{
          listaCliente = "";
        }
      console.log('expedientes: ', expedientes)
      let id2 = expedientes;
      let id3 = designacion.cliente;
      let moduleSelector =
      {
        nombre: designacion.procedimiento,
        opciones: [
          { label: designacion.procedimiento, value: designacion.procedimiento }
        ]
      };
     // console.log('designacion.fechaActuacion: ', designacion.fechaActuacion)
      //console.log('this.formatDate(designacion.fechaActuacion): ', this.formatDate(designacion.fechaActuacion))
      let arrDesignacion = 
      [
      // { type: 'checkbox', value: obj.fin },

      { type: 'checkbox', value: true, size: 50 },
      { type: 'text', value: listaCliente, size: 153 },
      { type: 'text', value: designacion.nig, size: 153},
      { type: 'input', value: designacion.numProcedimiento, size: 153 },
      { type: 'select', value: designacion.procedimiento, size: 153  }, //modulo
      { type: 'datePicker', value: this.formatDate(designacion.fechaActuacion), size: 153 },
      { type: 'text', value: '' , size: 153},
      { type: 'text', value: designacion.tipoAcreditacion , size: 50},
      // { type: 'checkbox', value: obj.val }
      { type: 'checkbox', value: true, size: 50 }
    ];
    let key = letra + 1;
    obj1 =  { [key] : arrDesignacion, position: 'noCollapse'};
    arr2.push(Object.assign({},obj1));
    arrDesignacion = [];
    designacion.actuaciones.forEach((actuacion, index) =>{
      let moduleSelector =
      {
        nombre: actuacion.procedimiento,
        opciones: [
          { label: actuacion.procedimiento, value: actuacion.procedimiento }
        ]
      };
      if (actuacion.nombreJuzgado != null && actuacion.nombreJuzgado != []){
        actuacion.nombreJuzgado.forEach(cliente =>{
         // expedientes += '\n' + exp;
         listaClienteAct +=  cliente + '\n';
         })
        }else{
          listaClienteAct = "";
        }
        if (actuacion.permitirAniadirLetrado == "1"){ 
          arr1 = 
          [
          // { type: 'checkbox', value: obj.fin },

          { type: 'checkbox', value: true, size: 50 },
          { type: 'text', value: listaClienteAct, size: 153 },
          { type: 'input', value: actuacion.nig, size: 153},
          { type: 'input', value: actuacion.numProcedimiento, size: 153 },
          { type: 'select', value: actuacion.procedimiento, size: 153 }, //modulo
          { type: 'datePicker', value:  this.formatDate(actuacion.fecha), size: 153 },
          { type: 'datePicker', value:  actuacion.fechaJustificacion , size: 153},
          { type: 'buttom', value: 'Nuevo' , size: 50},
          // { type: 'checkbox', value: obj.val }
          { type: 'checkbox', value: true, size: 50 },
          { type: 'invisible', value:  actuacion.numActuacion , size: 0},
          
        ];
        }else{
          arr1 = 
          [
          // { type: 'checkbox', value: obj.fin },

          { type: 'checkbox', value: true, size: 50 },
          { type: 'text', value: listaClienteAct, size: 153 },
          { type: 'input', value: actuacion.nig, size: 153},
          { type: 'input', value: actuacion.numProcedimiento, size: 153 },
          { type: 'select', value: actuacion.procedimiento, size: 153 }, //modulo
          { type: 'datePicker', value:  this.formatDate(actuacion.fecha), size: 153 },
          { type: 'datePicker', value:  actuacion.fechaJustificacion , size: 153},
          { type: 'text', value: actuacion.tipoAcreditacion , size: 50},
          // { type: 'checkbox', value: obj.val }
          { type: 'checkbox', value: true, size: 50 },
          { type: 'invisible', value:  actuacion.numActuacion , size: 0},
        ];
      }

          let num = index + 2;
          let key = letra + num;
          obj1 =  { [key] : arr1, position: 'collapse'};
          arr1 = [];    
        arr2.push(Object.assign({},obj1));
        obj1 = null;
       
     })

      dataObj = { [cod]  : arr2, [id2] : "" , [id3] : "", [estadoDesignacion] : ""};
      data.push(Object.assign({},dataObj));
      expedientes = "";
    })

    resultModified = Object.assign({},{'data': data});

    this.rowGroups = this.trdService.getTableData(resultModified);
    this.rowGroupsAux = this.rowGroups;
    this.totalRegistros = this.rowGroups.length;
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

  formatDate(date) {
    const pattern = 'dd/MM/yyyy';
    return this.datepipe.transform(date, pattern);
  }
  clear() {
    this.msgs = [];
  }
}
