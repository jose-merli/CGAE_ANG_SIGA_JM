import { AfterViewInit, ChangeDetectorRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, Message } from 'primeng/api';
import { DataTable } from 'primeng/primeng';
import { TranslateService } from '../../../../../commons/translate';
import { FiltroAsistenciaItem } from '../../../../../models/guardia/FiltroAsistenciaItem';
import { TarjetaAsistenciaItem } from '../../../../../models/guardia/TarjetaAsistenciaItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-resultado-asistencias',
  templateUrl: './resultado-asistencias.component.html',
  styleUrls: ['./resultado-asistencias.component.scss']
})
export class ResultadoAsistenciasComponent implements OnInit, AfterViewInit {

  msgs : Message [] = [];
  @Input() asistencias : TarjetaAsistenciaItem[];
  @Output() searchAgain = new EventEmitter<boolean>();
  rows : number = 10;
  rowsPerPage = [
    {
      label: 10,
      value: 10
    },
    {
      label: 20,
      value: 20
    },
    {
      label: 30,
      value: 30
    },
    {
      label: 40,
      value: 40
    }
  ];
  columnas = [];
  seleccionMultiple : boolean = false;
  seleccionarTodo : boolean = false;
  progressSpinner : boolean = false;
  numSeleccionado : number = 0;
  selectedDatos : TarjetaAsistenciaItem [] = [];
  disableDelete : boolean = true;
  disableDuplicar : boolean = true;
  @Input() filtro : FiltroAsistenciaItem;
  @ViewChild("table") table: DataTable;

  constructor(private changeDetectorRef : ChangeDetectorRef,
    private router : Router,
    private confirmationService : ConfirmationService,
    private translateService : TranslateService,
    private sigaServices : SigaServices,
    private commonServices : CommonsService) { }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.commonServices.scrollTablaFoco('tablaFoco2');
    }, 5);
  }

  ngOnInit() {
  }

  eliminar(){

    let asistencias : TarjetaAsistenciaItem [] = [];
    if(Array.isArray(this.selectedDatos)){
      asistencias = this.selectedDatos;
    }else{
      asistencias.push(this.selectedDatos);
    }

    let validada = asistencias.find((asistencia)=> asistencia.validada == 'SI');
    let noValidada = asistencias.find((asistencia)=> asistencia.validada == 'NO');

    if(validada || noValidada){ //Si las actuaciones estan o no validadas, avisamos de que se van a borrar tambien las actuaciones
      this.confirmationService.confirm({
        key: "confirmEliminar",
        message: this.translateService.instant("justiciaGratuita.guardia.busquedaasistencias.preguntaeliminarasistencia"),
        icon: "fa fa-question-circle",
        accept: () => {this.executeEliminar(asistencias);},
        reject: () =>{this.showMsg('info',"Cancel",this.translateService.instant("general.message.accion.cancelada"));}
      });
    }else{
      this.executeEliminar(asistencias);
    }

  }

  executeEliminar(asistencias : TarjetaAsistenciaItem []){
    if(asistencias){
      this.progressSpinner = true;
        this.sigaServices
        .post("busquedaGuardias_eliminarAsistencias", asistencias)
        .subscribe(
          n => {
            let deleteDTO = JSON.parse(n["body"]);
            if(deleteDTO.error){
              this.showMsg('error', this.translateService.instant("informesycomunicaciones.modelosdecomunicacion.errorResultados"), deleteDTO.error.description);
            }else{
              this.showMsg('success', this.translateService.instant("general.message.accion.realizada"), '');
              if(asistencias.find(asistencia => asistencia.guardiaRequeridaValidacion == 'S')){
                this.isUnicaAsistenciaPorGuardia(asistencias);
              }else{
                this.searchAgain.emit(true);
              }
            }    
            this.progressSpinner = false;
          },
          err => {
            console.log(err);
            this.progressSpinner = false;
          },
          () =>{
            this.progressSpinner = false;
          }
        );
    }
  }

  isUnicaAsistenciaPorGuardia(asistencias : TarjetaAsistenciaItem []){

    this.sigaServices
        .post("busquedaGuardias_isUnicaAsistenciaPorGuardia", asistencias)
        .subscribe(
          n => {
            let stringDTO = JSON.parse(n["body"]);
            if(stringDTO.valor && stringDTO.valor == 'S'){

              this.confirmationService.confirm({
                key: "confirmDesvalidar",
                message: this.translateService.instant("justiciaGratuita.guardia.busquedaasistencias.preguntadesvalidarguardia"),
                icon: "fa fa-question-circle",
                accept: () => {this.desvalidarGuardias(asistencias);},
                reject: () =>{
                  this.showMsg('info',"Cancel",this.translateService.instant("general.message.accion.cancelada"));
                  this.searchAgain.emit(true);
                }
              });
              
            }else{
              this.searchAgain.emit(true);
            }
            this.progressSpinner = false;
          },
          err => {
            console.log(err);
            this.progressSpinner = false;
          },
          () =>{
            this.progressSpinner = false;
          }
        );

  }

  desvalidarGuardias(asistencias : TarjetaAsistenciaItem []){

    this.sigaServices
        .post("busquedaGuardias_desvalidarGuardiasAsistencias", asistencias)
        .subscribe(
          n => {
            let updateDTO = JSON.parse(n["body"]);
            if(updateDTO.error){
              this.showMsg('error','Error',this.translateService.instant("justiciaGratuita.guardia.busquedaasistencias.errordesvalidarguardia"));
            }
            this.searchAgain.emit(true);
            
            this.progressSpinner = false;
          },
          err => {
            console.log(err);
            this.progressSpinner = false;
          },
          () =>{
            this.progressSpinner = false;
          }
        );

  }

  duplicar(){
    let asistencia;
    if(Array.isArray(this.selectedDatos) && this.selectedDatos.length > 0){
      asistencia = this.selectedDatos[0];
    }else{
      asistencia = this.selectedDatos;
    }
    sessionStorage.setItem("asistenciaCopy", JSON.stringify(asistencia));
    sessionStorage.setItem("filtroAsistencia",JSON.stringify(this.filtro));
    sessionStorage.setItem("modoBusqueda","a");
    sessionStorage.setItem("nuevaAsistencia","true");
    this.router.navigate(["/fichaAsistencia"]);
  }

  onChangeRowsPerPages(event) {
    this.rows = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  onChangeSeleccionMultiple(){
    if(this.table.selectionMode == 'single'){
      this.table.selectionMode = 'multiple';
      this.seleccionMultiple = true;
    }else{
      this.table.selectionMode = 'single';
      this.seleccionMultiple = false;
    }
    this.selectedDatos = [];
    this.numSeleccionado = 0;
    this.disableDelete = true;
    this.disableDuplicar = true;
  }

  onChangeSeleccionarTodo(){
    if(this.seleccionarTodo){
      this.selectedDatos = this.asistencias;
      this.numSeleccionado = this.selectedDatos.length;
      this.disableDelete = false;
      if(this.numSeleccionado == 1){
        this.disableDuplicar = false;
      }else{
        this.disableDuplicar = true
      }
    }else{
      this.selectedDatos = [];
      this.numSeleccionado = 0;
      this.disableDelete = true;
      this.disableDuplicar = true;
    }
  }

  onSelectRow(asistencia : TarjetaAsistenciaItem){

    if(this.table.selectionMode == 'single'){
      this.numSeleccionado = 1;
    }else{
      this.numSeleccionado = this.selectedDatos.length;
      if(this.numSeleccionado == 1){
        this.disableDuplicar = false;
      }else{
        this.disableDuplicar = true;
      }
    }
    this.disableDelete = false;
  }

  onClickEnlace(asistencia : TarjetaAsistenciaItem){
      sessionStorage.setItem("filtroAsistencia",JSON.stringify(this.filtro));
      sessionStorage.setItem("modoBusqueda","a");
      sessionStorage.setItem("idAsistencia",asistencia.anio+"/"+asistencia.numero);
      this.router.navigate(["/fichaAsistencia"]);
  }

  actualizaSeleccionados(){
    if(this.table.selectionMode == 'single'){
      this.numSeleccionado = 0;
      this.disableDelete = true;
      this.disableDuplicar = true;
    }else{
      this.numSeleccionado = this.selectedDatos.length;
      if(this.numSeleccionado <= 0){
        this.disableDelete = true;
      }
      if(this.numSeleccionado == 1){
        this.disableDuplicar = false;
      }else{
        this.disableDuplicar = true;
      }
    }
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
