import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Message } from 'primeng/primeng';
import { Cell, Row, RowGroup, TablaResultadoDesplegableJEService } from '../../../../../commons/tabla-resultado-desplegable/tabla-resultado-desplegable-je.service';
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
  actuacionesToDelete = [];
  actuacionToAdd: Row;
  dataToUpdate: RowGroup[];
  actuacionesItem = {};
  actuacionesToDleteArr = []; // para enviar a backend - ELIMINAR
  newActuacionItem = {}; // para enviar a backend -  NUEVO
  dataToUpdateArr = []; // para enviar a backend -  GUARDAR
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
    let estados = "";
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
      /*designacion.expedientes.forEach(exp =>{
       // expedientes += '\n' + exp;
       expedientes +=  exp + '\n';
       })*/
       
      expedientes = Object.keys(designacion.expedientes)[0];
      estados = Object.values(designacion.expedientes)[0].toString();
      }else{
        expedientes = "";
      }


      if (designacion.nombreJuzgado != null && designacion.nombreJuzgado != []){
        /*designacion.nombreJuzgado.forEach(cliente =>{
         listaCliente +=  cliente + '\n';
         })*/
         listaCliente = designacion.nombreJuzgado;
        }else{
          listaCliente = "";
        }
      console.log('expedientes: ', expedientes + estados)
      let id2 = expedientes;
      let id3 = designacion.cliente;
      let moduleSelector =
      {
        nombre: designacion.procedimiento,
        opciones: [
          { label: designacion.procedimiento, value: designacion.procedimiento }
        ]
      };
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
      { type: 'checkbox', value: true, size: 50 },
      { type: 'invisible', value: designacion.anioDesignacion , size: 153},
      { type: 'invisible', value: designacion.anioProcedimiento , size: 153},
      { type: 'invisible', value: designacion.art27 , size: 153},
      { type: 'invisible', value: this.formatDate(designacion.fechaDesignacion) , size: 153},
      { type: 'invisible', value: designacion.idInstitucion , size: 153},
      { type: 'invisible', value: designacion.idInstitucionJuzgado , size: 153},
      { type: 'invisible', value: designacion.idJuzgado , size: 153},
      { type: 'invisible', value: designacion.idPersona , size: 153},
      { type: 'invisible', value: designacion.idTurno , size: 153},
      { type: 'invisible', value: designacion.muestraPendiente , size: 153},
      { type: 'invisible', value: designacion.numDesignacion , size: 153},
      { type: 'invisible', value: designacion.resolucionDesignacion , size: 153}
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
        /*actuacion.nombreJuzgado.forEach(cliente =>{
         listaClienteAct +=  cliente + '\n';
         })*/
         listaClienteAct = actuacion.nombreJuzgado ;
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
          { type: 'invisible', value:  actuacion.idAcreditacion , size: 0},
          { type: 'invisible', value:  actuacion.descripcion , size: 0},
          { type: 'invisible', value:  actuacion.idTipoAcreditacion , size: 0},
          { type: 'invisible', value:  actuacion.porcentaje , size: 0},
          { type: 'invisible', value:  actuacion.tipoAcreditacion , size: 0},
          { type: 'invisible', value:  actuacion.categoriaProcedimiento , size: 0},
          { type: 'invisible', value:  actuacion.idJurisdiccion , size: 0},
          { type: 'invisible', value:  actuacion.complemento , size: 0},
          { type: 'invisible', value:  actuacion.permitirAniadirLetrado , size: 0},
          { type: 'invisible', value:  actuacion.numAsunto , size: 0},
          { type: 'invisible', value:  actuacion.idProcedimiento , size: 0},
          { type: 'invisible', value:  actuacion.idJuzgado , size: 0},
          { type: 'invisible', value:  actuacion.nombreJuzgado , size: 0},
          { type: 'invisible', value:  actuacion.fechaJustificacion , size: 0},
          { type: 'invisible', value:  actuacion.validada , size: 0},
          { type: 'invisible', value:  actuacion.idFacturacion , size: 0},
          { type: 'invisible', value:  actuacion.anioProcedimiento , size: 0},
          { type: 'invisible', value:  actuacion.descripcionFacturacion , size: 0},
          { type: 'invisible', value:  actuacion.docJustificacion , size: 0},
          { type: 'invisible', value:  actuacion.anulacion , size: 0},
          { type: 'invisible', value:  actuacion.nigNumProcedimiento , size: 0},
          { type: 'invisible', value:  actuacion.permitirLetrado , size: 0}

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
          { type: 'invisible', value:  actuacion.idAcreditacion , size: 0},
          { type: 'invisible', value:  actuacion.descripcion , size: 0},
          { type: 'invisible', value:  actuacion.idTipoAcreditacion , size: 0},
          { type: 'invisible', value:  actuacion.porcentaje , size: 0},
          { type: 'invisible', value:  actuacion.tipoAcreditacion , size: 0},
          { type: 'invisible', value:  actuacion.categoriaProcedimiento , size: 0},
          { type: 'invisible', value:  actuacion.idJurisdiccion , size: 0},
          { type: 'invisible', value:  actuacion.complemento , size: 0},
          { type: 'invisible', value:  actuacion.permitirAniadirLetrado , size: 0},
          { type: 'invisible', value:  actuacion.numAsunto , size: 0},
          { type: 'invisible', value:  actuacion.idProcedimiento , size: 0},
          { type: 'invisible', value:  actuacion.idJuzgado , size: 0},
          { type: 'invisible', value:  actuacion.nombreJuzgado , size: 0},
          { type: 'invisible', value:  actuacion.fechaJustificacion , size: 0},
          { type: 'invisible', value:  actuacion.validada , size: 0},
          { type: 'invisible', value:  actuacion.idFacturacion , size: 0},
          { type: 'invisible', value:  actuacion.anioProcedimiento , size: 0},
          { type: 'invisible', value:  actuacion.descripcionFacturacion , size: 0},
          { type: 'invisible', value:  actuacion.docJustificacion , size: 0},
          { type: 'invisible', value:  actuacion.anulacion , size: 0},
          { type: 'invisible', value:  actuacion.nigNumProcedimiento , size: 0},
          { type: 'invisible', value:  actuacion.permitirLetrado , size: 0}
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
  getActuacionToAdd(event){
    this.actuacionToAdd = event;
    this.tableDataToJson2(this.actuacionToAdd);
  }
  tableDataToJson2(actuacionToAdd){
    let actuacionesCells : Cell[];
    actuacionesCells = actuacionToAdd.cells;
    this.newActuacionItem = this.actCellToJson(actuacionesCells);
}
  getActuacionesToDelete(event){
    this.actuacionesToDelete = event;
    this.tableDataToJson();
  }
  tableDataToJson(){
    this.actuacionesToDelete.forEach(actObj => {
    let actuacionesCells : Cell[];
    actuacionesCells = actObj;
    this.actuacionesItem = this.actCellToJson(actuacionesCells);
    this.actuacionesToDleteArr.push(this.actuacionesItem);
  });
}


getDataToUpdate(event){
this.dataToUpdate = event;
console.log('GUARDAR this.dataToUpdate: ', this.dataToUpdate)
  this.dataToUpdate.forEach(rowGroup => {
    let designa = rowGroup.rows[0];
    let codigoDesignacion = rowGroup.id;
    let expedientesDesignacion = rowGroup.id2;
    let clientesDesignacion =  rowGroup.id3;
    let estadoDesignacion = rowGroup.estadoDesignacion;
    let actuaciones = rowGroup.rows.slice(1, rowGroup.rows.length - 1);
    let actuacionesJson = this.actCellToJson(actuaciones);
    console.log('actuacionesJson: ', actuacionesJson)
    let designaToUpdateJSON = this.desigCellToJson(designa, codigoDesignacion, expedientesDesignacion, clientesDesignacion, estadoDesignacion, actuacionesJson);
    console.log('designaToUpdateJSON: ', designaToUpdateJSON)
    this.dataToUpdateArr.push(designaToUpdateJSON);
  })

  console.log('GUARDAR this.dataToUpdateArr: ', this.dataToUpdateArr)
}

actCellToJson(actuacionesCells){
  let numActuacion = actuacionesCells[9].value;
  let idAcreditacion = actuacionesCells[10].value;
  let descripcion = actuacionesCells[11].value;
  let idTipoAcreditacion = actuacionesCells[12].value;
  let porcentaje = actuacionesCells[13].value;
  let tipoAcreditacion = actuacionesCells[7].value;
  let procedimiento = actuacionesCells[4].value;
  let categoriaProcedimiento = actuacionesCells[15].value;
  let idJurisdiccion = actuacionesCells[16].value;
  let complemento = actuacionesCells[17].value;
  let permitirAniadirLetrado = actuacionesCells[18].value;
  let numAsunto = actuacionesCells[19].value;
  let idProcedimiento = actuacionesCells[20].value;
  let idJuzgado = actuacionesCells[21].value;
  let nombreJuzgado = actuacionesCells[1].value;
  let fechaJustificacion = actuacionesCells[6].value;
  let validada = actuacionesCells[8].value;
  let idFacturacion = actuacionesCells[25].value;
  let numProcedimiento = actuacionesCells[3].value;
  let anioProcedimiento = actuacionesCells[26].value;
  let descripcionFacturacion = actuacionesCells[27].value;
  let docJustificacion = actuacionesCells[28].value;
  let anulacion = actuacionesCells[29].value;
  let nigNumProcedimiento = actuacionesCells[30].value;
  let nig = actuacionesCells[2].value;
  let fecha = actuacionesCells[5].value;
  let permitirLetrado = actuacionesCells[31].value;
 
  this.actuacionesItem = (
    { 'numActuacion': numActuacion,
      'idAcreditacion': idAcreditacion,
      'descripcion': descripcion,
      'idTipoAcreditacion': idTipoAcreditacion,
      'porcentaje': porcentaje,
      'tipoAcreditacion': tipoAcreditacion,
      'procedimiento': procedimiento,
      'categoriaProcedimiento': categoriaProcedimiento,
      'idJurisdiccion': idJurisdiccion,
      'complemento': complemento,
      'permitirAniadirLetrado': permitirAniadirLetrado,
      'numAsunto': numAsunto,
      'idProcedimiento': idProcedimiento,
      'idJuzgado': idJuzgado,
      'nombreJuzgado': nombreJuzgado,
      'fechaJustificacion': fechaJustificacion,
      'validada': validada,
      'idFacturacion': idFacturacion,
      'numProcedimiento': numProcedimiento,
      'anioProcedimiento': anioProcedimiento,
      'descripcionFacturacion': descripcionFacturacion,
      'docJustificacion': docJustificacion,
      'anulacion': anulacion,
      'nigNumProcedimiento': nigNumProcedimiento,
      'nig': nig,
      'fecha': fecha,
      'permitirLetrado': permitirLetrado,
    }  );

    return this.actuacionesItem;
}



desigCellToJson(designacionesCells, codigoDesignacionParam, expedientesDesignacion, clientesDesignacion, estadoDesignacion, actuacionesJson){
  //pendiente procedimiento(modulo) = designacionesCells[4].value y tipoAcreditacion = designacionesCells[7].value

  let actuaciones = actuacionesJson;
  let expedientes = expedientesDesignacion;
  //let idProcedimiento = designacionesCells[x].value;
  let idPersona = designacionesCells[16].value;//
  let idTurno = designacionesCells[17].value;//
  let idInstitucion = designacionesCells[13].value;//
  let resolucionDesignacion = designacionesCells[20].value;//
  let fechaDesignacion = designacionesCells[12].value;//
  let fechaActuacion = designacionesCells[5].value;//
  //let fechaJustificacion = designacionesCells[x].value;
  let numProcedimiento = designacionesCells[3].value;//
  let anioProcedimiento = designacionesCells[10].value;//
  let idInstitucionJuzgado = designacionesCells[14].value;//
  let idJuzgado = designacionesCells[15].value;//
  let nombreJuzgado = designacionesCells[1].value;//
  let nig = designacionesCells[2].value;//
  let art27 = designacionesCells[11].value;//
  let cliente = clientesDesignacion;
  //let ejgs = designacionesCells[x].value;
  let codigoDesignacion = codigoDesignacionParam;
  let numDesignacion = designacionesCells[19].value;//
  let anioDesignacion = designacionesCells[9].value;//
  //let designacionHasta = designacionesCells[x].value;
   //let designacionDesde = designacionesCells[x].value;
   //let resolucionPTECAJG = designacionesCells[x].value;
   //let ejgSinResolucion = designacionesCells[x].value;
   //let conEJGNoFavorables = designacionesCells[x].value;
   //let sinEJG = designacionesCells[x].value;
   //let actuacionesValidadas = designacionesCells[x].value;
  let estado = estadoDesignacion;
   //let justificacionHasta = designacionesCells[x].value;
   //let justificacionDesde = designacionesCells[x].value;
   //let restriccionesVisualizacion = designacionesCells[x].value;
  let muestraPendiente = designacionesCells[18].value;//
   //let numEJG = designacionesCells[x].value;
   //let anioEJG = designacionesCells[x].value;
   //let apellidos = designacionesCells[x].value;
   //let nombre = designacionesCells[x].value;
   //let nColegiado = = designacionesCells[x].value;

  let designacionesItem = (
    { 'nColegiado': null,
      'nombre': null,
      'apellidos': null,
      'anioEJG': null,
      'numEJG': null,
      'muestraPendiente': muestraPendiente,
      'restriccionesVisualizacion': null,
      'justificacionDesde': null,
      'justificacionHasta': null,
      'estado': estado,
      'actuacionesValidadas': null,
      'sinEJG': null,
      'conEJGNoFavorables': null,
      'ejgSinResolucion': null,
      'resolucionPTECAJG': null,
      'designacionDesde': null,
      'designacionHasta': null,
      'anioDesignacion': anioDesignacion,
      'numDesignacion': numDesignacion,
      'codigoDesignacion': codigoDesignacion,
      'ejgs': null,
      'cliente': cliente,
      'art27': art27,
      'nig': nig,
      'nombreJuzgado': nombreJuzgado,
      'idJuzgado': idJuzgado,
      'idInstitucionJuzgado': idInstitucionJuzgado,
      'actuaciones': actuaciones,
      'expedientes': expedientes,
      'idProcedimiento': null,
      'idPersona': idPersona,
      'idTurno': idTurno,
      'idInstitucion': idInstitucion,
      'resolucionDesignacion': resolucionDesignacion,
      'fechaDesignacion': fechaDesignacion,
      'fechaActuacion': fechaActuacion,
      'fechaJustificacion': null,
      'numProcedimiento': numProcedimiento,
      'anioProcedimiento': anioProcedimiento,
    }  );

    return designacionesItem;
}

}
