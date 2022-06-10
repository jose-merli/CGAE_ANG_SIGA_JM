import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, DataTable, Message } from 'primeng/primeng';
import { TranslateService } from '../../../../../../commons/translate';
import { ActuacionAsistenciaItem } from '../../../../../../models/guardia/ActuacionAsistenciaItem';
import { TarjetaAsistenciaItem } from '../../../../../../models/guardia/TarjetaAsistenciaItem';
import { SigaServices } from '../../../../../../_services/siga.service';

@Component({
  selector: 'app-ficha-asistencia-tarjeta-actuaciones',
  templateUrl: './ficha-asistencia-tarjeta-actuaciones.component.html',
  styleUrls: ['./ficha-asistencia-tarjeta-actuaciones.component.scss']
})
export class FichaAsistenciaTarjetaActuacionesComponent implements OnInit, OnChanges {


  msgs : Message [] = [];
  @Input() modoLectura: boolean;
  @Input() asistencia : TarjetaAsistenciaItem;
  @Input() editable : boolean;
  @Output() refreshTarjetas = new EventEmitter<string>();
  disableReactivar : boolean = false;
  mostrarHistorico : boolean = false;
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
  actuaciones : ActuacionAsistenciaItem [] = [];
  disableDelete : boolean = true;
  selectedDatos : ActuacionAsistenciaItem[] = [];
  @ViewChild("table") table: DataTable;
  constructor(private changeDetectorRef : ChangeDetectorRef,
    private sigaServices : SigaServices,
    private translateService : TranslateService,
    private confirmationService : ConfirmationService,
    private router : Router) { }


  ngOnInit() {
  }


  ngOnChanges(changes: SimpleChanges): void {
    if(changes.asistencia
      && changes.asistencia.currentValue){
        this.getActuaciones();
      }
  }
  changeHistorico(){
    this.mostrarHistorico = !this.mostrarHistorico;
    this.selectedDatos = [];
    this.numSeleccionado = 0;
    this.disableDelete = true;
    this.disableReactivar = true;
    this.getActuaciones();
  }

  updateEstadoActuacion(newEstado : string){
   this.selectedDatos.forEach(sD => {
    if (sD.facturada != null && sD.facturada != undefined){
      this.showMsg("error", "No se pueden anular actuaciones facturadas.", "No se pueden anular actuaciones facturadas.");
    }else{
      this.progressSpinner = true;
        let actuaciones : ActuacionAsistenciaItem [] = [];
        if(Array.isArray(this.selectedDatos)){ //Si hemos seleccionado varios registros o hemos seleccionado al menos uno
          actuaciones = this.selectedDatos;
        }else{
          actuaciones.push(this.selectedDatos);
        }

        actuaciones.forEach(act => {
          act.estado = newEstado;
          if (newEstado == '1'){
            act.anulada = '1';
          }else{
            act.anulada = '0';
          }
        })

        if(actuaciones.length > 0 ){
          this.sigaServices.postPaginado("busquedaGuardias_updateEstadoActuacion","?anioNumero="+this.asistencia.anioNumero, actuaciones).subscribe(
            n => {

              let id = JSON.parse(n.body).id;
              let error = JSON.parse(n.body).error;
              this.progressSpinner = false;

              if (error != null && error.description != null) {
                this.showMsg("info", this.translateService.instant("general.message.informacion"), error.description);
              } else {
                this.showMsg('success', this.translateService.instant("general.message.accion.realizada"), '');
                this.getActuaciones();
                this.refreshTarjetas.emit(id);
              }
            },
            err => {
              //console.log(err);
              this.progressSpinner = false;
            }, () => {
              this.progressSpinner = false;
            });

        }
    }
      })
  
  }

  getActuaciones(){

    let mostrarHistorico : string = '';
    if(this.asistencia){
      if(this.mostrarHistorico){
        mostrarHistorico = 'S'
      }else{
        mostrarHistorico = 'N'
      }

      this.progressSpinner = true;
      this.sigaServices.getParam("busquedaGuardias_searchActuaciones","?anioNumero="+this.asistencia.anioNumero+"&mostrarHistorico="+mostrarHistorico).subscribe(
        n => {
          this.actuaciones = n.actuacionAsistenciaItems;
        },
        err => {
          //console.log(err);
          this.progressSpinner = false;
        }, () => {
          this.progressSpinner = false;
        }
      );

    }

  }

  askEliminar(){

    this.confirmationService.confirm({
      key: "confirmEliminar",
      message: "¿Desea eliminar la/s actuacion/es?",
      icon: "fa fa-question-circle",
      accept: () => {this.eliminarActuaciones();},
      reject: () =>{this.showMsg('info',"Cancelado",this.translateService.instant("general.message.accion.cancelada"));}
    });

  }

  eliminarActuaciones(){

    this.progressSpinner = true;
    let actuaciones : ActuacionAsistenciaItem [] = [];
    if(Array.isArray(this.selectedDatos)){ //Si hemos seleccionado varios registros o hemos seleccionado al menos uno
      actuaciones = this.selectedDatos;
    }else{
      actuaciones.push(this.selectedDatos);
    }

    if(actuaciones){

      this.sigaServices.postPaginado("busquedaGuardias_eliminarActuaciones","?anioNumero="+this.asistencia.anioNumero, actuaciones).subscribe(
        n => {

          let error = JSON.parse(n.body).error;
          this.progressSpinner = false;

          if (error != null && error.description != null) {
            this.showMsg("info", this.translateService.instant("general.message.informacion"), error.description);
          } else {
            this.showMsg('success', this.translateService.instant("general.message.accion.realizada"), '');
            this.getActuaciones();
            this.refreshTarjetas.emit(this.asistencia.anioNumero);
          }
        },
        err => {
          //console.log(err);
          this.progressSpinner = false;
        }, () => {
          this.progressSpinner = false;
        });

    }

  }

  onClickEnlace(actuacion : ActuacionAsistenciaItem){
    let actuacionParaAbrir: ActuacionAsistenciaItem;
    this.actuaciones.forEach(act => {
      if(act.idActuacion == actuacion.idActuacion){
        actuacionParaAbrir = act;
      }
    });
    sessionStorage.setItem('asistenciaToFichaActuacion',JSON.stringify(this.asistencia));
    sessionStorage.setItem('actuacionAsistencia', JSON.stringify(actuacionParaAbrir));
    //console.log('Enlace a actuacion: ', actuacionParaAbrir);
    this.router.navigate(['/fichaActuacionAsistencia']);
  }

  nuevaActuacion(){
    sessionStorage.setItem('nuevaActuacionAsistencia','true');
    sessionStorage.setItem('asistenciaToFichaActuacion',JSON.stringify(this.asistencia));
    this.router.navigate(['/fichaActuacionAsistencia']);
  }

  isAnulado(actuacion : ActuacionAsistenciaItem){
    return actuacion.anulada == '1';
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
  }

  onChangeSeleccionarTodo(){
    if(this.seleccionarTodo){
      this.selectedDatos = this.actuaciones;
      this.numSeleccionado = this.selectedDatos.length;
      this.disableDelete = false;
      if(this.mostrarHistorico && this.actuaciones.every(actuacion => actuacion.anulada == '1')){
        this.disableReactivar = false;
      }
    
    }else{
      this.selectedDatos = [];
      this.numSeleccionado = 0;
      this.disableDelete = true;
      this.disableReactivar = true;
    }
      
  }

  onSelectRow(actuacion : ActuacionAsistenciaItem){

    if(this.table.selectionMode == 'single'){
      this.numSeleccionado = 1;
      if(actuacion.anulada == '1'){
        this.disableReactivar = false;;
      }
    }else{
      this.numSeleccionado = this.selectedDatos.length;
      if(this.mostrarHistorico && this.selectedDatos.every(actuacion => actuacion.anulada == '1')){
        this.disableReactivar = false;
      }
    }
    this.disableDelete = false;
  }

  actualizaSeleccionados(){
    if(this.table.selectionMode == 'single'){
      this.numSeleccionado = 0;
      this.disableDelete = true;
      this.disableReactivar = true;
    }else{
      this.numSeleccionado = this.selectedDatos.length;
      if(this.numSeleccionado <= 0){
        this.disableDelete = true;
        this.disableReactivar = true;
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
