import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import * as moment from 'moment';
import { Message } from 'primeng/api';
import { TranslateService } from '../../../../../../commons/translate';
import { ActuacionAsistenciaItem } from '../../../../../../models/guardia/ActuacionAsistenciaItem';
import { DatosGeneralesActuacionAsistenciaItem } from '../../../../../../models/guardia/DatosGeneralesActuacionAsistenciaItem';
import { TarjetaAsistenciaItem } from '../../../../../../models/guardia/TarjetaAsistenciaItem';
import { ParametroRequestDto } from '../../../../../../models/ParametroRequestDto';
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
  datosIniciales: DatosGeneralesActuacionAsistenciaItem = new DatosGeneralesActuacionAsistenciaItem();
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
  institucionActual: any;
  datosBuscar: any;
  valorFormatoProc: any;
  parametroNIG: any;
  parametroNProc: any;
  juzgadoComisaria: string = "0";
  // hitoNueve:boolean = false;

  constructor(private datepipe : DatePipe,
    private sigaServices : SigaServices,
    private commonServices : CommonsService,
    private translateService : TranslateService) { }

  ngOnInit() {
    this.recuperaHitoNueve();
    this.getNigValidador();
    this.getNprocValidador();
    this.getComboComisaria();
    this.getComboJuzgado();
    this.getComboPrision();
    this.getComboTipoActuacion();
    this.compruebaActuacionValidada();
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

      this.setComisariaJuzgado();

      if (this.juzgadoComisaria != "0") {
        this.searchTipoActuacionPorDefecto();
      }
      this.datosIniciales = Object.assign({}, this.datosGeneralesActuacion);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {

    if(changes.actuacion 
        && changes.actuacion.currentValue){
        
        this.getDatosGenerales();

      }
    
  }

  searchTipoActuacionPorDefecto() {
    this.sigaServices
      .getParam("gestionTiposActuacion_busquedaTipoActuacionPorDefecto", "?descripcionTipoAsistencia=" + this.asistencia.descripcionTipoAsistenciaColegio + "&juzgadocomisaria=" + this.juzgadoComisaria)
      .subscribe(
        res => {
          if (res.valor != null) {
            this.datosGeneralesActuacion.tipoActuacion = res.valor;
            this.getComboCoste();
          }
        },
        err => {

        }
      );

  }
  
  recalculaDiaDespues() {
    let parts, partsAnio, fechaActuacion, fechaGuardia;
    if (this.datosGeneralesActuacion.fechaActuacion) {
      parts = this.datosGeneralesActuacion.fechaActuacion.split('/');
      fechaActuacion = new Date (parts[2], parts[1] - 1, parts[0]);
      
  
      parts = this.asistencia.fechaAsistencia.split('/');
      partsAnio = parts[2].split(' ');
  
      fechaGuardia = new Date(partsAnio[0], parts[1] - 1, parts[0]); 
  
      if (fechaActuacion > fechaGuardia) {
        this.datosGeneralesActuacion.diaDespues = true;
      } else {
        this.datosGeneralesActuacion.diaDespues = false;
      }
    }
  }

  setComisariaJuzgado() {
    if (this.asistencia.juzgado != null) {
      this.juzgadoComisaria = "2";
    } else if (this.asistencia.comisaria != null) {
      this.juzgadoComisaria = "1";
    }
  }

  disableGuardar(){
    if((this.datosIniciales.fechaActuacion == this.datosGeneralesActuacion.fechaActuacion || 
      (this.datosIniciales.fechaActuacion == null && this.datosGeneralesActuacion.fechaActuacion == ""))
      && (this.datosIniciales.tipoActuacion == this.datosGeneralesActuacion.tipoActuacion ||
        (this.datosIniciales.tipoActuacion == null && this.datosGeneralesActuacion.tipoActuacion == ""))
      && (this.datosIniciales.idCoste == this.datosGeneralesActuacion.idCoste ||
        (this.datosIniciales.idCoste == null && this.datosGeneralesActuacion.idCoste == ""))
      && (this.datosIniciales.numAsunto == this.datosGeneralesActuacion.numAsunto ||
        (this.datosIniciales.numAsunto == null && this.datosGeneralesActuacion.numAsunto == ""))
      && (this.datosIniciales.nig == this.datosGeneralesActuacion.nig ||
        (this.datosIniciales.nig == null && this.datosGeneralesActuacion.nig == ""))
      && (this.datosIniciales.comisaria == this.datosGeneralesActuacion.comisaria ||
        (this.datosIniciales.comisaria == null && this.datosGeneralesActuacion.comisaria == ""))
      && (this.datosIniciales.juzgado == this.datosGeneralesActuacion.juzgado ||
        (this.datosIniciales.juzgado == null && this.datosGeneralesActuacion.juzgado == ""))
      && (this.datosIniciales.prision == this.datosGeneralesActuacion.prision ||
        (this.datosIniciales.prision == null && this.datosGeneralesActuacion.prision == ""))
      && (this.datosIniciales.descripcion == this.datosGeneralesActuacion.descripcion ||
        (this.datosIniciales.descripcion == null && this.datosGeneralesActuacion.descripcion == ""))
      && (this.datosIniciales.observaciones == this.datosGeneralesActuacion.observaciones ||
        (this.datosIniciales.observaciones == null && this.datosGeneralesActuacion.observaciones == ""))){
      return true;
    }else{
      return false;
    }
  }

   //Si la actuacion esta anulada o validada, no se podrá editar de ninguna forma
  compruebaActuacionValidada(){
    if (this.actuacion != null && (this.actuacion.anulada == '1' || this.actuacion.validada == 'SÍ')) {
      this.editable = false;
    } else {
      this.editable = true;
    }
  }

  compruebaCamposObligatorios() {

    let error = false;

    if ((this.datosGeneralesActuacion.nig != null && !error && !this.validarNig(this.datosGeneralesActuacion.nig))) {
      this.showMsg('error', this.translateService.instant("justiciaGratuita.oficio.designa.NIGInvalido"), '');
      error = true;
    }

    if(this.asistencia.numProcedimiento && !this.asistencia.numDiligencia){
      if ((this.datosGeneralesActuacion.numAsunto != null && !error && !this.validarNProcedimiento(this.datosGeneralesActuacion.numAsunto))) {
        this.showMsg('error', this.translateService.instant('general.message.incorrect'), this.translateService.instant("justiciaGratuita.oficio.designa.numProcedimientoNoValido"));
        error = true;
      }
    }
    return error;
  }

  getNprocValidador(){
    let parametro = {
      valor: "FORMATO_VALIDACION_NPROCEDIMIENTO_DESIGNA"
    };

    this.sigaServices
      .post("busquedaPerJuridica_parametroColegio", parametro)
      .subscribe(
        data => {
          this.parametroNProc = JSON.parse(data.body);
        //this.progressSpinner = false;
      });
  }

  validarNProcedimiento(nProcedimiento) {
    let ret = false;
    
    if (nProcedimiento != null && nProcedimiento != '' && this.parametroNProc != undefined) {
      if (this.parametroNProc != null && this.parametroNProc.parametro != "") {
          let valorParametroNProc: RegExp = new RegExp(this.parametroNProc.parametro);
          if (nProcedimiento != '') {
            if(valorParametroNProc.test(nProcedimiento)){
              ret = true;
            }else{
              let severity = "error";
                      let summary = this.translateService.instant("justiciaGratuita.oficio.designa.numProcedimientoNoValido");
                      let detail = "";
                      this.msgs.push({
                        severity,
                        summary,
                        detail
                      });

              ret = false
            }
          }
        }
    }

    return ret;
  }

  /*
  validarNProcedimiento(nProcedimiento:string) {
    //Esto es para la validacion de CADECA

    let response:boolean = false;

    if (this.institucionActual == "2008" || this.institucionActual == "2015" || this.institucionActual == "2029" || this.institucionActual == "2033" || this.institucionActual == "2036" ||
      this.institucionActual == "2043" || this.institucionActual == "2006" || this.institucionActual == "2021" || this.institucionActual == "2035" || this.institucionActual == "2046" || this.institucionActual == "2066") {
      if (nProcedimiento != '' && nProcedimiento != null) {
        let objRegExp = /^[0-9]{4}[\/]{1}[0-9]{5}[\.]{1}[0-9]{2}$/;
        let ret = objRegExp.test(nProcedimiento);
        response = ret;
      }
    } else {
      if (nProcedimiento != '' && nProcedimiento != null && nProcedimiento.length == 12) {
        let objRegExp = /^[0-9]{4}[\/]{1}[0-9]{7}$/;
        let ret = objRegExp.test(nProcedimiento);
        response = ret;
      } 
    }
    return response;

  }
  */

  validarNig(nig) {
    let ret = false;
    
    if (nig != null && nig != '' && this.parametroNIG != undefined) {
        if (this.parametroNIG != null && this.parametroNIG.parametro != "") {
            let valorParametroNIG: RegExp = new RegExp(this.parametroNIG.parametro);
          if (nig != '') {
            ret = valorParametroNIG.test(nig);
          }
        }
      //this.progressSpinner = false;
    }

    return ret;
  }

  getNigValidador(){
    let parametro = {
      valor: "NIG_VALIDADOR"
    };

    this.sigaServices
      .post("busquedaPerJuridica_parametroColegio", parametro)
      .subscribe(
        data => {
          this.parametroNIG = JSON.parse(data.body);
        //this.progressSpinner = false;
      });
  }

  getInstitucionActual() {
    this.sigaServices.get("institucionActual").subscribe(n => { this.institucionActual = n.value });
  }

  formatoProc(){
    this.sigaServices.get('actuaciones_designacion_numProcedimiento').subscribe(
      (data) => {
        // console.log("FORMATO PROC")
        // console.log(data)
       this.valorFormatoProc = data.valor;
        // console.log(this.valorFormatoProc)
      },
      (err) => {
        //console.log(err);
      }
    );
  }

  recuperaHitoNueve(){
    //this.progressSpinner = true;
    this.sigaServices.get("institucionActual").subscribe(a => {
      this.institucionActual = a.value;
      this.sigaServices.getParam("actuaciones_searchHitoNueveAsistencia","?anioNumero="+this.asistencia.anioNumero+"&idInstitucion="+this.institucionActual).subscribe(
        n => {
          if(n.error && n.error.code == 500){
            this.showMsg('error','Error', n.error.description);
          }else{
            // this.hitoNueve = n;
            this.datosGeneralesActuacion.controlCheckDiaDespues = n;
          }
          this.progressSpinner = false;
        },
        err => {
          //console.log(err);
          this.progressSpinner = false;
        }
      );
    });
  }

  getDatosGenerales(){
    //this.progressSpinner = true;
    this.sigaServices.getParam("actuaciones_searchTarjetaDatosGenerales","?anioNumero="+this.asistencia.anioNumero+"&idActuacion="+this.actuacion.idActuacion).subscribe(
      n => {
        
        if(n.error && n.error.code == 500){
          this.showMsg('error','Error', n.error.description);
        }else{
          this.datosGeneralesActuacion = n.datosGeneralesActuacionAsistenciaItems[0];
          this.datosGeneralesActuacionAux = Object.assign({},this.datosGeneralesActuacion);
          this.datosIniciales = Object.assign({}, this.datosGeneralesActuacion);
          if(this.datosGeneralesActuacion &&
            this.datosGeneralesActuacion.tipoActuacion){
            this.onChangeTipoActuacion();
          }
        }
        this.progressSpinner = false;
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      }, () => {
        this.commonServices.arregloTildesCombo(this.comboCoste);
      }
    );
  }

  save(){
    if(!this.compruebaCamposObligatorios()){
    
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
              this.datosIniciales = Object.assign({}, this.datosGeneralesActuacion);
              this.datosGeneralesActuacion.idActuacion = result.id;
              this.refreshTarjetas.emit(result.id);
              this.refreshHistorico.emit(true);
            }
            this.progressSpinner = false;
          },
          err => {
            //console.log(err);
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
      this.juzgadoComisaria = "2";
      this.searchTipoActuacionPorDefecto();
    }
  }

  onChangeComisaria(){
    if(this.datosGeneralesActuacion.comisaria){
      this.datosGeneralesActuacion.juzgado = '';
      this.juzgadoComisaria = "1";
      this.searchTipoActuacionPorDefecto();
    }
  }

  restablecer (){
    this.datosGeneralesActuacion = Object.assign({},this.datosGeneralesActuacionAux);
    this.datosIniciales = Object.assign({}, this.datosGeneralesActuacion);
  }

  fillFechaActuacion(event){
    if(event){
      this.datosGeneralesActuacion.fechaActuacion = this.datepipe.transform(new Date(event), 'dd/MM/yyyy');

      let fechaAsistenciaDate = moment([Number(this.asistencia.fechaAsistencia.split('/')[2].split(' ')[0]), Number(this.asistencia.fechaAsistencia.split('/')[1])-1,Number(this.asistencia.fechaAsistencia.split('/')[0])]).toDate();
      if(new Date(event) > fechaAsistenciaDate){
        if(this.datosGeneralesActuacion.controlCheckDiaDespues)this.datosGeneralesActuacion.diaDespues = true;
        this.fActuacionvalida = true;
      }else{
        if(this.datosGeneralesActuacion.controlCheckDiaDespues)this.datosGeneralesActuacion.diaDespues = false;
        if(new Date(event) < fechaAsistenciaDate){
          this.showMsg('error','Error',this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.actuacion.fecha.menor"));
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
        //console.log(err);

      }, () => {
        this.commonServices.arregloTildesCombo(this.comboComisaria);
        this.commonServices.arregloTildesContrariaCombo(this.comboComisaria);
      }
    );

  }

  getComboJuzgado(){

    this.sigaServices.get("combo_comboJuzgado").subscribe(
      n => {
        this.comboJuzgado = n.combooItems;
      },
      err => {
        //console.log(err);

      }, () => {
        this.commonServices.arregloTildesCombo(this.comboJuzgado);
        this.commonServices.arregloTildesContrariaCombo(this.comboJuzgado);
      }
    );

  }

  getComboPrision(){

    this.sigaServices.get("combo_prisiones").subscribe(
      n => {
        this.comboPrision = n.combooItems;
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      }, () => {
        this.commonServices.arregloTildesCombo(this.comboPrision);
        this.commonServices.arregloTildesContrariaCombo(this.comboPrision);
      }
    );

  }

  getComboCoste(){

    this.sigaServices.getParam("combo_comboCosteFijo","?anioNumero="+this.asistencia.anioNumero+"&idTipoActuacion="+this.datosGeneralesActuacion.tipoActuacion).subscribe(
      n => {
        this.comboCoste = n.combooItems;
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      }, () => {
        this.commonServices.arregloTildesCombo(this.comboCoste);
      }
    );

  }

  getComboTipoActuacion(){
    let idtipoActuacion = "-1";
    if(this.actuacion != null){
      idtipoActuacion= this.actuacion.tipoActuacion;
    }
    this.sigaServices.getParam("combo_comboTipoActuacion","?anioNumero="+this.asistencia.anioNumero+"&idTipoAsistencia="+idtipoActuacion).subscribe(
      n => {
        this.comboTipoActuacion = n.combooItems;
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      }, () => {
        this.commonServices.arregloTildesCombo(this.comboTipoActuacion);
        this.commonServices.arregloTildesContrariaCombo(this.comboTipoActuacion);
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
