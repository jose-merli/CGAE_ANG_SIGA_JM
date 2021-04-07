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
    // this.progressSpinner=true;

  //   let arr = [];

  //   this.datosJustificacion.forEach((res, i) => {
  //     let expedientes =


  //     let objCells = [ "'D"+res.codigoDesignacion+"'": [
  //       {
  //         expedientes       
          
          
  //         { type: 'text', value: res.nombreTurno },
  //         { type: 'text', value: res.nombreGuardia },
  //         { type: 'multiselect', combo: this.comboGuardiasIncompatibles, value: ArrComboValue },
  //         { type: 'input', value: res.motivos },
  //         { type: 'input', value: res.diasSeparacionGuardias },
  //         { type: 'invisible', value: res.idTurnoIncompatible },
  //         { type: 'invisible', value: res.idGuardiaIncompatible },
  //         { type: 'invisible', value: res.idGuardia },
  //         { type: 'invisible', value: res.idTurno },
  //         { type: 'invisible', value: res.nombreTurnoIncompatible },
  //         { type: 'invisible', value: ArrNombresGI }
  //     ]
  //   ];
   
  //     let obj = {id: i, cells: objCells};
  //     arr.push(obj);
  //   });

  //   let datosTabla = { data: [{}]};

  //   this.rowGroups = this.trdService.getTableData(this.datosJustificacion);
  //   this.rowGroupsAux = this.trdService.getTableData(this.datosJustificacion);
  }
  
  selectedAll(event) {
    this.seleccionarTodo = event;
    // this.isDisabled = !event;
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
