import { OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, Message } from 'primeng/api';
import { DataTable } from 'primeng/primeng';
import { Row, TablaResultadoOrderCGService } from '../../../../../../commons/tabla-resultado-order/tabla-resultado-order-cg.service';
import { TranslateService } from '../../../../../../commons/translate';
import { GuardiaItem } from '../../../../../../models/guardia/GuardiaItem';
import { ListaGuardiasItem } from '../../../../../../models/guardia/ListaGuardiasItem';
import { SigaServices } from '../../../../../../_services/siga.service';

@Component({
  selector: 'app-ficha-lista-guardias-tarjeta-guardias',
  templateUrl: './ficha-lista-guardias-tarjeta-guardias.component.html',
  styleUrls: ['./ficha-lista-guardias-tarjeta-guardias.component.scss']
})
export class FichaListaGuardiasTarjetaGuardiasComponent implements OnInit, OnChanges {

  @Input()lista : ListaGuardiasItem;
  msgs : Message [] = [];
  rowGroups: Row[];
  rowGroupsAux: Row[];
  datosIniciales;
  cabeceras = [
    {
      id: "orden",
      name: "administracion.informes.literal.orden"
    },
    {
      id: "turno",
      name: "dato.jgr.guardia.guardias.turno"
    },
    {
      id: "guardia",
      name: "dato.jgr.guardia.inscripciones.guardia"
    },
    {
      id: "tipoDia",
      name: "dato.jgr.guardia.guardias.tipoDia"
    }
  ];

  seleccionarTodo = false;
  progressSpinner : boolean = false;
  numSeleccionado : number = 0;
  selectedDatos : GuardiaItem [] = [];
  guardias : GuardiaItem [] = [];
  disableDelete : boolean = true;
  comboTurnos = [];
  comboGuardias = [];
  totalRegistros  = 0;
  isLetrado : boolean;
  idPersonaUsuario : string;
  show : boolean = false;
  @Input()permisosEscritura : boolean = false;

  constructor(private sigaServices : SigaServices,
    private translateService : TranslateService,
    private troService : TablaResultadoOrderCGService,
    private confirmationService : ConfirmationService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.lista && this.lista && this.lista.idLista && this.guardias.length == 0){
      this.getGuardiasFromLista();
    }
  }

  getGuardiasFromLista(){
    this.show = false;
    this.progressSpinner = true;
    this.sigaServices.getParam(
      "listasGuardias_searchGuardiasFromLista", "?idLista=" + this.lista.idLista).subscribe(
        data => {
          
          if(data.error && data.error.code != 200){
            this.showMsg('error', this.translateService.instant("informesycomunicaciones.modelosdecomunicacion.errorResultados"), data.error.description);
          }else{

            if(data.error && data.error.code == 200){
              this.showMsg('info', 'Info', data.error.description);
            }
            this.guardias = data.guardiaItems;
            this.fromGuardiaItemToRows();
          }
          
          this.progressSpinner = false;
        },
        err => {
          //console.log(err);
          this.progressSpinner = false;
        },
        () =>{
          this.progressSpinner = false;
        }
      );
  }

  fromGuardiaItemToRows(){

    if(this.guardias){
      let arr = [];
      this.guardias.forEach( guardia => {
        let objArr = {cells: []};
        objArr.cells = [
          { type: 'text', value: guardia.orden, hiddenValue:'' },
          { type: 'text', value: guardia.turno, hiddenValue: guardia.idTurno},
          { type: 'text', value: guardia.nombre, hiddenValue: guardia.idGuardia },
          { type: 'text', value: guardia.tipoDia, hiddenValue:'' }
        ];
        arr.push(objArr);
      });

      this.totalRegistros = this.guardias.length;
      this.rowGroups = this.troService.getTableData(arr);
      this.rowGroupsAux = this.troService.getTableData(arr);
      this.datosIniciales = arr;
      this.show = true;

    }

  }

  saveGuardias(event : Row[]){
    let guardias : GuardiaItem[] = [];

    event.forEach(row => {

      let guardia : GuardiaItem = new GuardiaItem();
      guardia.idGuardia = row.cells[2].hiddenValue;
      guardia.idTurno = row.cells[1].hiddenValue;
      guardia.idListaGuardia = this.lista.idLista;
      guardia.orden = row.cells[0].value
      guardias.push(guardia);

    });

    if(guardias.length > 0){
      //listasGuardias_guardarGuardiasEnLista
      this.progressSpinner = true;
      this.sigaServices
      .post("listasGuardias_guardarGuardiasEnLista", guardias)
      .subscribe(
        n => {
          let updateResponseDTO = JSON.parse(n["body"]);
          if(updateResponseDTO.error && updateResponseDTO.error.description){
            this.showMsg('error', this.translateService.instant("informesycomunicaciones.modelosdecomunicacion.errorResultados"), updateResponseDTO.error.description);
          }else{
            this.showMsg('success', this.translateService.instant("general.message.accion.realizada"), '');
            this.getGuardiasFromLista();
          }    
          this.progressSpinner = false;
        },
        err => {
          //console.log(err);
        },
        () =>{
          this.progressSpinner = false;
        }
      );


    }
  }

  eliminarGuardias(event){
    let indexesToDelete = event;
    if(indexesToDelete.length >0){
      this.confirmationService.confirm({
        key: "confirmEliminar",
        message: '¿Está seguro de que desea eliminar las guardias?',
        icon: "fa fa-question-circle",
        accept: () => {this.executeEliminar(indexesToDelete);},
        reject: () =>{this.showMsg('info',"Cancel",this.translateService.instant("general.message.accion.cancelada"));}
      });
    }
  }

  executeEliminar(indexesToDelete){
    let guardias : GuardiaItem[] = [];

    indexesToDelete.forEach(index => {

      let guardia : GuardiaItem = new GuardiaItem();
      guardia.idGuardia = this.rowGroups[index].cells[2].hiddenValue;
      guardia.idTurno = this.rowGroups[index].cells[1].hiddenValue;
      guardia.idListaGuardia = this.lista.idLista;
      guardia.orden = this.rowGroups[index].cells[0].value;
      guardias.push(guardia);

    });

    if(guardias.length > 0){
      //listasGuardias_guardarGuardiasEnLista
      this.progressSpinner = true;
      this.sigaServices
      .post("listasGuardias_eliminarGuardiasFromLista", guardias)
      .subscribe(
        n => {
          let deleteResponseDTO = JSON.parse(n["body"]);
          if(deleteResponseDTO.error && deleteResponseDTO.error.description){
            this.showMsg('error', this.translateService.instant("informesycomunicaciones.modelosdecomunicacion.errorResultados"), deleteResponseDTO.error.description);
          }else{
            this.showMsg('success', this.translateService.instant("general.message.accion.realizada"), '');
            this.getGuardiasFromLista();
          }    
          this.progressSpinner = false;
        },
        err => {
          //console.log(err);
        },
        () =>{
          this.progressSpinner = false;
        }
      );
    }
  }

  resetTabla(event){
    if(event){
      this.rowGroups = this.troService.getTableData(this.datosIniciales);
      this.rowGroupsAux = this.troService.getTableData(this.datosIniciales);
    }
  }

  notifyAnySelected(event) {
    if (this.seleccionarTodo || event) {
      this.disableDelete = false;
    } else {
      this.disableDelete = true;
    }
  }
  checkSelectedRow(selected){
    this.selectedDatos = selected;
  }

  clear() {
    this.msgs = [];
  }

  showMsg(severityParam : string, summaryParam : string, detailParam : string) {
    this.msgs = [];
    this.msgs.push({
      severity: severityParam,
      summary: summaryParam,
      detail: detailParam
    });
  }
}
