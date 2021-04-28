import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Message } from 'primeng/primeng';
import { Cell, Row, RowGroup, TablaResultadoDesplegableJEService } from '../../../../../commons/tabla-resultado-desplegable/tabla-resultado-desplegable-je.service';
import { JustificacionExpressItem } from '../../../../../models/sjcs/JustificacionExpressItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { SigaServices } from '../../../../../_services/siga.service';

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
  totalActuaciones = 0;
  modoBusqueda: string = 'b';
  numDesignasModificadas = 0;
  numActuacionesModificadas = 0;
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
  
  comboModulos: any [];
  comboJuzgados: any [];
  comboAcreditacionesPorModulo: any [];
  comboJuzgadosPorInstitucion: any [];
  idInstitucion: String;
  actuacionesToDelete = [];
  actuacionToAdd: Row;
  dataToUpdate: RowGroup[];
  actuacionesItem = {};

  @Output() actuacionesToDleteArrEmit = new EventEmitter<any[]>(); // para enviar a backend - ELIMINAR
  @Output() newActuacionItemEmit = new EventEmitter<{}>();// para enviar a backend -  NUEVO
  @Output() dataToUpdateArrEmit = new EventEmitter<any[]>(); // para enviar a backend -  GUARDAR

  actuacionesToDleteArr = []; // para enviar a backend - ELIMINAR
  newActuacionItem = {}; // para enviar a backend -  NUEVO
  dataToUpdateArr = []; // para enviar a backend -  GUARDAR

  constructor(private trdService: TablaResultadoDesplegableJEService, private datepipe: DatePipe,
    private commonsService: CommonsService, private sigaServices: SigaServices) 
  { }

  ngOnInit(): void {
    this.progressSpinner=true;

    this.datosJustificacionAux = this.datosJustificacion;

    this.cargaInicial();
    this.getJuzgados();
  }

  getJuzgados(){
    this.progressSpinner = true;

    this.sigaServices.get("combo_comboJuzgadoDesignaciones").subscribe(
      n => {
        this.comboJuzgados = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboJuzgados);
        this.progressSpinner = false;
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      }
    );
  }

  cargaAcreditacionesPorModulo($event){
    this.progressSpinner = true;

    this.sigaServices.post("combo_comboAcreditacionesPorModulo", $event).subscribe(
      n => {
        this.comboAcreditacionesPorModulo = JSON.parse(n.body).combooItems;
        this.commonsService.arregloTildesCombo(this.comboAcreditacionesPorModulo);
        this.progressSpinner = false;
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      }
    );
  }

  cargaModulosPorJuzgado($event){
    this.progressSpinner = true;
    this.sigaServices.post("combo_comboModulosConJuzgado", $event).subscribe(
      n => {
        this.comboModulos = JSON.parse(n.body).combooItems;
        this.commonsService.arregloTildesCombo(this.comboModulos);
        this.progressSpinner = false;
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      }
    );
  }

  cargaJuzgadosPorInstitucion($event){
    this.progressSpinner = true;
    this.sigaServices.post("combo_comboJuzgadoPorInstitucion", $event).subscribe(
      n => {
        this.comboJuzgadosPorInstitucion = JSON.parse(n.body).combooItems;
        this.commonsService.arregloTildesCombo(this.comboJuzgadosPorInstitucion);
        this.progressSpinner = false;
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      }
    );
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
    let validada;
    let finalizada;

    this.datosJustificacion.forEach((designacion, i) =>{
      
      let letra = (i + 10).toString(36).toUpperCase()
      let arr2 = [];
      let cod = designacion.codigoDesignacion;
      let estadoDesignacion = designacion.estado;
      
      arr1 = [];
      obj1 = {};
      
      if ( estadoDesignacion == 'V'){
        validada = true; // activa
        finalizada = false;
      }else if ( estadoDesignacion == 'F'){
        finalizada = true; // finalizada
        validada = false;
      } else {
        finalizada = false; 
        validada = false;
      }

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
      
      let id2 = expedientes;
      let estadoEx = estados;
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
      { type: 'checkboxPermisos', value: finalizada, size: 50, combo: null},
      { type: 'text', value: listaCliente, size: 153, combo: null },
      { type: 'input', value: designacion.nig, size: 153, combo: null},
      { type: 'input', value: designacion.numProcedimiento, size: 153 , combo: null},
      { type: 'select', value: designacion.procedimiento, size: 153 , combo: null }, //modulo
      { type: 'datePicker', value: this.formatDate(designacion.fechaActuacion), size: 153 , combo: null},
      { type: 'text', value: '' , size: 153, combo: null},
      { type: 'text', value: designacion.tipoAcreditacion , size: 50, combo: null},
      { type: 'checkbox', value: validada, size: 50 , combo: null},
      { type: 'invisible', value: designacion.anioDesignacion , size: 0, combo: null},
      { type: 'invisible', value: designacion.anioProcedimiento , size: 0, combo: null},
      { type: 'invisible', value: designacion.art27 , size: 0, combo: null},
      { type: 'invisible', value: this.formatDate(designacion.fechaDesignacion) , size: 0, combo: null},
      { type: 'invisible', value: designacion.idInstitucion , size: 0, combo: null},
      { type: 'invisible', value: designacion.idInstitucionJuzgado , size: 0, combo: null},
      { type: 'invisible', value: designacion.idJuzgado , size: 0, combo: null},
      { type: 'invisible', value: designacion.idPersona , size: 0, combo: null},
      { type: 'invisible', value: designacion.idTurno , size: 0, combo: null},
      { type: 'invisible', value: designacion.muestraPendiente , size: 0, combo: null},
      { type: 'invisible', value: designacion.numDesignacion , size: 0, combo: null},
      { type: 'invisible', value: designacion.resolucionDesignacion , size: 0, combo: null},
      { type: 'invisible', value: designacion.idProcedimiento , size: 0, combo: null},
      { type: 'invisible', value: designacion.fechaJustificacion , size: 0, combo: null},
      { type: 'invisible', value: designacion.ejgs , size: 0, combo: null},
      { type: 'invisible', value: designacion.designacionHasta , size: 0, combo: null},
      { type: 'invisible', value: designacion.designacionDesde , size: 0, combo: null},
      { type: 'invisible', value: designacion.resolucionPTECAJG , size: 0, combo: null},
      { type: 'invisible', value: designacion.ejgSinResolucion , size: 0, combo: null},
      { type: 'invisible', value: designacion.conEJGNoFavorables , size: 0, combo: null},
      { type: 'invisible', value: designacion.sinEJG , size: 0, combo: null},
      { type: 'invisible', value: designacion.actuacionesValidadas , size: 0, combo: null},
      { type: 'invisible', value: designacion.justificacionHasta , size: 0, combo: null},
      { type: 'invisible', value: designacion.justificacionDesde , size: 0, combo: null},
      { type: 'invisible', value: designacion.restriccionesVisualizacion , size: 0, combo: null},
      { type: 'invisible', value: designacion.numEJG , size: 0, combo: null},
      { type: 'invisible', value: designacion.anioEJG , size: 0, combo: null},
      { type: 'invisible', value: designacion.apellidos , size: 0, combo: null},
      { type: 'invisible', value: designacion.nombre , size: 0, combo: null},
      { type: 'invisible', value: designacion.nColegiado , size: 0, combo: null}
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

        if (actuacion.permitirAniadirLetrado == "1"){ 
          arr1 = 
          [
          { type: 'checkboxPermisos', value: finalizada, size: 50, combo: null },
          { type: 'text', value: actuacion.nombreJuzgado, size: 153 , combo: null},
          { type: 'input', value: actuacion.nig, size: 153, combo: null},
          { type: 'input', value: actuacion.numProcedimiento, size: 153 , combo: null},
          { type: 'select', value: actuacion.procedimiento, size: 153 , combo: null}, //modulo
          { type: 'datePicker', value:  this.formatDate(actuacion.fecha), size: 153 , combo: null},
          { type: 'datePicker', value:  actuacion.fechaJustificacion , size: 153, combo: null},
          { type: 'buttom', value: 'Nuevo' , size: 50, combo: null},
          { type: 'checkbox', value: validada, size: 50 , combo: null},
          { type: 'invisible', value:  actuacion.numDesignacion , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.idAcreditacion , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.tipoAcreditacion , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.idTipoAcreditacion , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.porcentaje , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.descripcion , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.categoriaProcedimiento , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.idJurisdiccion , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.complemento , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.permitirAniadirLetrado , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.numAsunto , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.idProcedimiento , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.idJuzgado , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.nombreJuzgado , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.fechaJustificacion , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.validada , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.idFacturacion , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.anioProcedimiento , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.descripcionFacturacion , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.docJustificacion , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.anulacion , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.nigNumProcedimiento , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.permitirLetrado , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.anio , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.idTurno , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.idInstitucion , size: 0, combo: null}

        ];
        }else{
          arr1 = 
          [
          { type: 'checkboxPermisos', value: finalizada, size: 50, combo: null },
          { type: 'text', value: actuacion.nombreJuzgado, size: 153 , combo: null},
          { type: 'input', value: actuacion.nig, size: 153, combo: null},
          { type: 'input', value: actuacion.numProcedimiento, size: 153 , combo: null},
          { type: 'select', value: actuacion.procedimiento, size: 153 , combo: null}, //modulo
          { type: 'datePicker', value:  this.formatDate(actuacion.fecha), size: 153 , combo: null},
          { type: 'datePicker', value:  actuacion.fechaJustificacion , size: 153, combo: null},
          { type: 'text', value: actuacion.descripcion , size: 50, combo: null},
          { type: 'checkbox', value: validada, size: 50 , combo: null },
          { type: 'invisible', value:  actuacion.numDesignacion , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.idAcreditacion , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.tipoAcreditacion , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.idTipoAcreditacion , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.porcentaje , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.tipoAcreditacion , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.categoriaProcedimiento , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.idJurisdiccion , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.complemento , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.permitirAniadirLetrado , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.numAsunto , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.idProcedimiento , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.idJuzgado , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.nombreJuzgado , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.fechaJustificacion , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.validada , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.idFacturacion , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.anioProcedimiento , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.descripcionFacturacion , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.docJustificacion , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.anulacion , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.nigNumProcedimiento , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.permitirLetrado , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.anio , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.idTurno , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.idInstitucion , size: 0, combo: null}
        ];
      }

          let num = index + 2;
          let key = letra + num;
          this.totalActuaciones = this.totalActuaciones + 1;
          obj1 =  { [key] : arr1, position: 'collapse'};
          arr1 = [];    
        arr2.push(Object.assign({},obj1));
        obj1 = null;
       
     })

      dataObj = { [cod]  : arr2, [id2] : "" , [id3] : "", [estadoDesignacion] : "", [estadoEx] : ""};
      data.push(Object.assign({},dataObj));
      expedientes = "";
    })

    resultModified = Object.assign({},{'data': data});

    this.rowGroups = this.trdService.getTableData(resultModified);
    this.rowGroupsAux = this.rowGroups;
    this.totalRegistros = this.rowGroups.length;
    this.totalDesignas = this.totalRegistros;
  }

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
    this.newActuacionItemEmit.emit(this.newActuacionItem);
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
  this.actuacionesToDleteArrEmit.emit(this.actuacionesToDleteArr);
}

getDataToUpdate(event){

this.dataToUpdate = event;
  this.dataToUpdate.forEach(rowGroup => {
    let designa = rowGroup.rows[0].cells;
    let codigoDesignacion = rowGroup.id;
    let expedientesDesignacion = rowGroup.id2;
    let clientesDesignacion =  rowGroup.id3;
    let estadoDesignacion = rowGroup.estadoDesignacion;
    let actuaciones = rowGroup.rows.slice(1);

    let actJsonArr = [];
    actuaciones.forEach(act =>{
      let actuacionesJson = this.actCellToJson(act.cells);
      actJsonArr.push(actuacionesJson);
      
    })
  
    let designaToUpdateJSON = this.desigCellToJson(designa, codigoDesignacion, expedientesDesignacion, clientesDesignacion, estadoDesignacion, actJsonArr);
 
    this.dataToUpdateArr.push(designaToUpdateJSON);
  })

  this.dataToUpdateArrEmit.emit(this.dataToUpdateArr);
  this.dataToUpdateArr = [];
}

actCellToJson(actuacionesCells){
  let numDesignacion = actuacionesCells[9].value;
  let idAcreditacion = actuacionesCells[10].value;
  let descripcion = actuacionesCells[7].value;
  let idTipoAcreditacion = actuacionesCells[12].value;
  let porcentaje = actuacionesCells[13].value;
  let tipoAcreditacion = actuacionesCells[11].value;
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
  let anio = actuacionesCells[32].value;
  let idTurno = actuacionesCells[33].value;
  let idInstitucion = actuacionesCells[34].value;
 
  this.actuacionesItem = (
    { 'numDesignacion': numDesignacion,
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
      'anio': anio,
      'idTurno': idTurno,
      'idInstitucion': idInstitucion
    }  );

    return this.actuacionesItem;
}

desigCellToJson(designacionesCells, codigoDesignacionParam, expedientesDesignacion, clientesDesignacion, estadoDesignacion, actuacionesJson){
  
  let procedimiento = designacionesCells[4].value;
  let actuaciones = actuacionesJson;
  let expedientes = expedientesDesignacion;
  let idProcedimiento = designacionesCells[21].value;
  let idPersona = designacionesCells[16].value;//
  let idTurno = designacionesCells[17].value;//
  let idInstitucion = designacionesCells[13].value;//
  let resolucionDesignacion = designacionesCells[20].value;//
  let fechaDesignacion = designacionesCells[12].value;//
  let fechaActuacion = designacionesCells[5].value;//
  let fechaJustificacion = designacionesCells[22].value;
  let numProcedimiento = designacionesCells[3].value;//
  let anioProcedimiento = designacionesCells[10].value;//
  let idInstitucionJuzgado = designacionesCells[14].value;//
  let idJuzgado = designacionesCells[15].value;//
  let nombreJuzgado = designacionesCells[1].value;//
  let nig = designacionesCells[2].value;//
  let art27 = designacionesCells[11].value;//
  let cliente = clientesDesignacion;
  let ejgs = designacionesCells[23].value;
  let codigoDesignacion = codigoDesignacionParam;
  let numDesignacion = designacionesCells[19].value;//
  let anioDesignacion = designacionesCells[9].value;//
  let designacionHasta = designacionesCells[24].value;
  let designacionDesde = designacionesCells[25].value;
  let resolucionPTECAJG = designacionesCells[26].value;
  let ejgSinResolucion = designacionesCells[27].value;
  let conEJGNoFavorables = designacionesCells[28].value;
  let sinEJG = designacionesCells[29].value;
  let actuacionesValidadas = designacionesCells[30].value;
  let estado = estadoDesignacion;
  let justificacionHasta = designacionesCells[31].value;
  let justificacionDesde = designacionesCells[32].value;
  let restriccionesVisualizacion = designacionesCells[33].value;
  let muestraPendiente = designacionesCells[18].value;//
  let numEJG = designacionesCells[34].value;
  let anioEJG = designacionesCells[35].value;
  let apellidos = designacionesCells[36].value;
  let nombre = designacionesCells[37].value;
  let nColegiado = designacionesCells[38].value;

  let fecha = fechaDesignacion;
  let fechaDes = new Date(fecha);

  fecha = fechaActuacion;
  let fechaAct = new Date(fecha);
  
  let designacionesItem = (
    { 'nColegiado': nColegiado,
      'nombre': nombre,
      'apellidos': apellidos,
      'anioEJG': anioEJG,
      'numEJG': numEJG,
      'muestraPendiente': muestraPendiente,
      'restriccionesVisualizacion': restriccionesVisualizacion,
      'justificacionDesde': justificacionDesde,
      'justificacionHasta': justificacionHasta,
      'estado': estado,
      'actuacionesValidadas': actuacionesValidadas,
      'sinEJG': sinEJG,
      'conEJGNoFavorables': conEJGNoFavorables,
      'ejgSinResolucion': ejgSinResolucion,
      'resolucionPTECAJG': resolucionPTECAJG,
      'designacionDesde': designacionDesde,
      'designacionHasta': designacionHasta,
      'anioDesignacion': anioDesignacion,
      'numDesignacion': numDesignacion,
      'codigoDesignacion': codigoDesignacion,
      'ejgs': ejgs,
      'cliente': cliente,
      'art27': art27,
      'nig': nig,
      'nombreJuzgado': nombreJuzgado,
      'idJuzgado': idJuzgado,
      'idInstitucionJuzgado': idInstitucionJuzgado,
      'actuaciones': actuaciones,
      //'expedientes': expedientes,
      'idProcedimiento': idProcedimiento,
      'idPersona': idPersona,
      'idTurno': idTurno,
      'idInstitucion': idInstitucion,
      'resolucionDesignacion': resolucionDesignacion,
      'fechaDesignacion': fechaDes,
      'fechaActuacion': fechaAct,
      'fechaJustificacion': fechaJustificacion,
      'numProcedimiento': numProcedimiento,
      'anioProcedimiento': anioProcedimiento,
      'procedimiento': procedimiento
    }  );

    return designacionesItem;
  }

  setnumActuacionesModificadas(event){
    this.numActuacionesModificadas = event;
  }

  setnumDesignasModificadas(event){
    this.numDesignasModificadas = event;
  }

  settotalActuaciones(event){
    this.totalActuaciones = this.totalActuaciones + event;
  }
}