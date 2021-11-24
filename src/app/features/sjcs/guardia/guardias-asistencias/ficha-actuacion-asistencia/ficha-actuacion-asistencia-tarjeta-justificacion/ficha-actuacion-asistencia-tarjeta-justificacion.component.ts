import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Message } from 'primeng/api';
import { TranslateService } from '../../../../../../commons/translate';
import { ActuacionAsistenciaItem } from '../../../../../../models/guardia/ActuacionAsistenciaItem';
import { TarjetaJustificacionActuacionAsistenciaItem } from '../../../../../../models/guardia/TarjetaJustificacionActuacionAsistenciaItem';
import { SigaStorageService } from '../../../../../../siga-storage.service';
import { SigaServices } from '../../../../../../_services/siga.service';

@Component({
  selector: 'app-ficha-actuacion-asistencia-tarjeta-justificacion',
  templateUrl: './ficha-actuacion-asistencia-tarjeta-justificacion.component.html',
  styleUrls: ['./ficha-actuacion-asistencia-tarjeta-justificacion.component.scss']
})
export class FichaActuacionAsistenciaTarjetaJustificacionComponent implements OnInit, OnChanges{

  msgs: Message[] = [];
  @Input() idAsistencia : string;
  @Input() actuacion : ActuacionAsistenciaItem;
  @Input() editable : boolean;
  @Output() refreshTarjetas = new EventEmitter<string>();
  @Output() refreshHistorico = new EventEmitter<boolean>();
  datosJustificacion : TarjetaJustificacionActuacionAsistenciaItem = new TarjetaJustificacionActuacionAsistenciaItem();
  datosJustificacionAux : TarjetaJustificacionActuacionAsistenciaItem = new TarjetaJustificacionActuacionAsistenciaItem();
  isLetrado : boolean;
  progressSpinner : boolean = false;
  reactivable : boolean = false;
  validada : boolean = false;

  constructor(private datepipe : DatePipe,
    private sigaServices : SigaServices,
    private sigaStorageService : SigaStorageService,
    private translateService : TranslateService
    ) { }

  ngOnInit() {
    this.isLetrado = this.sigaStorageService.isLetrado;
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if(changes.idAsistencia
      && changes.actuacion
      && changes.idAsistencia.currentValue
      && changes.actuacion.currentValue){
        this.getTarjetaJustificacionData();
        if(this.actuacion.validada == 'SÍ'){
          this.validada = true;
        }
        if(this.actuacion.anulada == '1'){
          this.reactivable = true;
        }
      }
  }

  getTarjetaJustificacionData(){

    this.progressSpinner = true;
    this.sigaServices.getParam("actuaciones_searchTarjetaJustificacion","?anioNumero="+this.idAsistencia+"&idActuacion="+this.actuacion.idActuacion).subscribe(
      n => {
        
        if(n.error && n.error.code == 500){
          this.showMsg('error','Error', n.error.description);
        }else{
          this.datosJustificacion = n.tarjetaJustificacionItems[0];
          this.datosJustificacionAux = Object.assign({},this.datosJustificacion);
          if(this.isLetrado && !this.datosJustificacion.fechaJustificacion){ //Si es letrado, deshabilitamos el campo de fecha y lo seteamos a la fecha actual
            this.datosJustificacion.fechaJustificacion = this.datepipe.transform(new Date(), 'dd/MM/yyyy');
          }
        }
        this.progressSpinner = false;
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      }, () => {
        this.progressSpinner = false;
      }
    );

  }

  save(){

    this.progressSpinner = true;
      this.sigaServices
      .postPaginado("actuaciones_saveTarjetaJustificacion","?anioNumero="+this.idAsistencia+"&idActuacion="+this.actuacion.idActuacion, this.datosJustificacion)
      .subscribe(
        n => {
          let result = JSON.parse(n["body"]);
          if(result.error){
            this.showMsg('error', this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.errorguardar"), result.error.description);
          }else{
            this.showMsg('success', this.translateService.instant("general.message.accion.realizada"), '');
            this.datosJustificacionAux = Object.assign({}, this.datosJustificacion);
            this.refreshTarjetas.emit(result.id);
            this.refreshHistorico.emit(true);
          }
          this.progressSpinner = false;
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        }
      );

  }

  validar(){
    this.datosJustificacion.validada = '1';
    this.updateEstadoActuacion();
  }

  desvalidar(){
    this.datosJustificacion.validada = '0';
    this.updateEstadoActuacion();
  }

  anular(){
    this.datosJustificacion.anulada = '1';
    this.updateEstadoActuacion();
  }

  reactivar(){
    this.datosJustificacion.anulada = '0';
    this.updateEstadoActuacion();
  }

  updateEstadoActuacion(){
    this.progressSpinner = true;
    this.sigaServices
    .postPaginado("actuaciones_updateEstadoActuacion","?anioNumero="+this.idAsistencia+"&idActuacion="+this.actuacion.idActuacion, this.datosJustificacion)
    .subscribe(
      n => {
        let result = JSON.parse(n["body"]);
        if(result.error){
          this.showMsg('error', this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.errorguardar"), result.error.description);
        }else{
          this.showMsg('success', this.translateService.instant("general.message.accion.realizada"), '');
          if(this.datosJustificacion.validada == '0'){
            this.datosJustificacion.estado = '';
          }else{
            this.datosJustificacion.estado = 'VALIDADA';
          }
          this.checkEstados();
          this.datosJustificacion.validada = '';
          this.datosJustificacion.anulada = '';
          this.refreshTarjetas.emit(result.id);
          this.refreshHistorico.emit(true);
        }
        this.progressSpinner = false;
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }

  checkEstados(){
    if(this.datosJustificacion.validada == '1'){
      this.validada = true;
      this.editable = false;
    }else{
      this.validada = false;
      this.editable = true;
    }

    if(this.datosJustificacion.anulada == '1'){
      this.reactivable = true;
      this.editable = false;
    }else{
      this.reactivable = false;
      this.editable = true;
    }
  }

  fillFechaJustificacion(event){
    this.datosJustificacion.fechaJustificacion = this.datepipe.transform(new Date(event), 'dd/MM/yyyy');
  }

  restablecer(){
    this.datosJustificacion = Object.assign({},this.datosJustificacionAux);
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
}
