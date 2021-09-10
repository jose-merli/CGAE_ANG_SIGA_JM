import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import moment = require('moment');
import { Message } from 'primeng/api';
import { TranslateService } from '../../../../../../commons/translate';
import { ActuacionAsistenciaItem } from '../../../../../../models/guardia/ActuacionAsistenciaItem';
import { DatosGeneralesActuacionAsistenciaItem } from '../../../../../../models/guardia/DatosGeneralesActuacionAsistenciaItem';
import { TarjetaAsistenciaItem } from '../../../../../../models/guardia/TarjetaAsistenciaItem';
import { CommonsService } from '../../../../../../_services/commons.service';
import { SigaServices } from '../../../../../../_services/siga.service';

@Component({
  selector: 'app-ficha-actuacion-asistencia-tarjeta-datos-generales',
  templateUrl: './ficha-actuacion-asistencia-tarjeta-datos-generales.component.html',
  styleUrls: ['./ficha-actuacion-asistencia-tarjeta-datos-generales.component.scss']
})
export class FichaActuacionAsistenciaTarjetaDatosGeneralesComponent implements OnInit, OnChanges {

  msgs : Message [] = [];
  datosGeneralesActuacion : DatosGeneralesActuacionAsistenciaItem = new DatosGeneralesActuacionAsistenciaItem();
  datosGeneralesActuacionAux : DatosGeneralesActuacionAsistenciaItem = new DatosGeneralesActuacionAsistenciaItem();
  @Input() actuacion : ActuacionAsistenciaItem;
  @Input() asistencia : TarjetaAsistenciaItem;
  @Input() editable : boolean;
  @Output() refreshTarjetas = new EventEmitter<string>();
  @Output() refreshHistorico = new EventEmitter<boolean>();
  progressSpinner : boolean = false;
  comboComisaria = [];
  comboJuzgado = [];
  comboPrision = [];
  comboCoste = [];
  comboTipoActuacion = [];
  fActuacionvalida : boolean = true;

  constructor(private datepipe : DatePipe,
    private sigaServices : SigaServices,
    private commonServices : CommonsService,
    private translateService : TranslateService) { }

  ngOnInit() {
    this.getComboComisaria();
    this.getComboJuzgado();
    this.getComboPrision();
    this.getComboTipoActuacion();

    //Si se trata de una nueva actuacion, inicializamos determinados campos con el valor que tienen en la asistencia
    if(!this.actuacion && this.asistencia){
      this.datosGeneralesActuacion.nig = this.asistencia.nig;
      this.datosGeneralesActuacion.comisaria = this.asistencia.comisaria
      this.datosGeneralesActuacion.juzgado = this.asistencia.juzgado;
      if(this.asistencia.numProcedimiento){
        this.datosGeneralesActuacion.numAsunto = this.asistencia.numProcedimiento;
      }else{
        this.datosGeneralesActuacion.numAsunto = this.asistencia.numDiligencia;
      }
    }

  }

  ngOnChanges(changes: SimpleChanges): void {

    if(changes.actuacion 
        && changes.actuacion.currentValue
        && changes.asistencia
        && changes.asistencia.currentValue){
        
        this.getDatosGenerales();

      }
    
  }

  getDatosGenerales(){
    this.progressSpinner = true;
    this.sigaServices.getParam("actuaciones_searchTarjetaDatosGenerales","?anioNumero="+this.asistencia.anioNumero+"&idActuacion="+this.actuacion.idActuacion).subscribe(
      n => {
        
        if(n.error && n.error.code == 500){
          this.showMsg('error','Error', n.error.description);
        }else{
          this.datosGeneralesActuacion = n.datosGeneralesActuacionAsistenciaItems[0];
          this.datosGeneralesActuacionAux = Object.assign({},this.datosGeneralesActuacion);
          if(this.datosGeneralesActuacion &&
            this.datosGeneralesActuacion.tipoActuacion){
            this.onChangeTipoActuacion();
          }
        }
        this.progressSpinner = false;
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      }, () => {
        this.commonServices.arregloTildesCombo(this.comboCoste);
      }
    );
  }

  save(){
    if(this.datosGeneralesActuacion.fechaActuacion && this.fActuacionvalida && this.datosGeneralesActuacion.tipoActuacion){

      this.progressSpinner = true;
      this.sigaServices
      .postPaginado("actuaciones_saveTarjetaDatosGenerales","?anioNumero="+this.asistencia.anioNumero, this.datosGeneralesActuacion)
      .subscribe(
        n => {
          let result = JSON.parse(n["body"]);
          if(result.error){
            this.showMsg('error', this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.errorguardar"), result.error.description);
          }else{
            this.showMsg('success', this.translateService.instant("general.message.accion.realizada"), '');
            this.datosGeneralesActuacionAux = Object.assign({}, this.datosGeneralesActuacion);
            this.datosGeneralesActuacion.idActuacion = result.id;
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

    }else{
      this.showMsg('error','Error', this.translateService.instant('general.message.camposObligatorios'));
    }
  }

  onChangeTipoActuacion(){

    if(this.datosGeneralesActuacion.tipoActuacion){

      this.comboCoste = []
      this.getComboCoste();

    }

  }

  onChangeJuzgado(){
    if(this.datosGeneralesActuacion.juzgado){
      this.datosGeneralesActuacion.comisaria = '';
    }
  }

  onChangeComisaria(){
    if(this.datosGeneralesActuacion.comisaria){
      this.datosGeneralesActuacion.juzgado = '';
    }
  }

  restablecer (){
    this.datosGeneralesActuacion = Object.assign({},this.datosGeneralesActuacionAux);
  }

  fillFechaActuacion(event){
    if(event){
      this.datosGeneralesActuacion.fechaActuacion = this.datepipe.transform(new Date(event), 'dd/MM/yyyy');

      let fechaAsistenciaDate = moment([Number(this.asistencia.fechaAsistencia.split('/')[2].split(' ')[0]), Number(this.asistencia.fechaAsistencia.split('/')[1])-1,Number(this.asistencia.fechaAsistencia.split('/')[0])]).toDate();
      if(new Date(event) > fechaAsistenciaDate){
        this.datosGeneralesActuacion.diaDespues = true;
        this.fActuacionvalida = true;
      }else{
        this.datosGeneralesActuacion.diaDespues = false;
        if(new Date(event) < fechaAsistenciaDate){
          this.showMsg('error','Error','La fecha de la Actuacion debe ser mayor a la fecha de la Asistencia');
          this.fActuacionvalida = false;
        }
      }
    }else {
      this.datosGeneralesActuacion.fechaActuacion = '';
    }
  }

  getComboComisaria(){

    this.sigaServices.get("combo_comboComisaria").subscribe(
      n => {
        this.comboComisaria = n.combooItems;
      },
      err => {
        console.log(err);

      }, () => {
        this.commonServices.arregloTildesCombo(this.comboComisaria);
      }
    );

  }

  getComboJuzgado(){

    this.sigaServices.get("combo_comboJuzgado").subscribe(
      n => {
        this.comboJuzgado = n.combooItems;
      },
      err => {
        console.log(err);

      }, () => {
        this.commonServices.arregloTildesCombo(this.comboJuzgado);
      }
    );

  }

  getComboPrision(){

    this.sigaServices.get("combo_prisiones").subscribe(
      n => {
        this.comboPrision = n.combooItems;
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      }, () => {
        this.commonServices.arregloTildesCombo(this.comboPrision);
      }
    );

  }

  getComboCoste(){

    this.sigaServices.getParam("combo_comboCosteFijo","?anioNumero="+this.asistencia.anioNumero+"&idTipoActuacion="+this.datosGeneralesActuacion.tipoActuacion).subscribe(
      n => {
        this.comboCoste = n.combooItems;
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      }, () => {
        this.commonServices.arregloTildesCombo(this.comboCoste);
      }
    );

  }

  getComboTipoActuacion(){
    this.sigaServices.getParam("combo_comboTipoActuacion","?anioNumero="+this.asistencia.anioNumero).subscribe(
      n => {
        this.comboTipoActuacion = n.combooItems;
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      }, () => {
        this.commonServices.arregloTildesCombo(this.comboTipoActuacion);
      }
    );
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

  styleObligatorio(evento){
    if((evento==undefined || evento==null || evento=="")){
      return this.commonServices.styleObligatorio(evento);
    }
  }

}
