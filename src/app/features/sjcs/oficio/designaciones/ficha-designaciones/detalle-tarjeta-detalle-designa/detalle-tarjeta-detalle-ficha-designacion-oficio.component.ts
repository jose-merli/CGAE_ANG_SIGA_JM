import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { truncate, truncateSync } from 'fs';
import { ConfirmationService, Message } from 'primeng/components/common/api';
import { TranslateService } from '../../../../../../commons/translate/translation.service';
import { ControlAccesoDto } from '../../../../../../models/ControlAccesoDto';
import { SaltoCompItem } from '../../../../../../models/guardia/SaltoCompItem';
import { ParametroDto } from '../../../../../../models/ParametroDto';
import { ParametroRequestDto } from '../../../../../../models/ParametroRequestDto';
import { ActuacionDesignaItem } from '../../../../../../models/sjcs/ActuacionDesignaItem';
import { ActuacionDesignaObject } from '../../../../../../models/sjcs/ActuacionDesignaObject';
import { DesignaItem } from '../../../../../../models/sjcs/DesignaItem';
import { procesos_oficio } from '../../../../../../permisos/procesos_oficio';
import { CommonsService } from '../../../../../../_services/commons.service';
import { SigaServices } from '../../../../../../_services/siga.service';

@Component({
  selector: 'app-detalle-tarjeta-detalle-ficha-designacion-oficio',
  templateUrl: './detalle-tarjeta-detalle-ficha-designacion-oficio.component.html',
  styleUrls: ['./detalle-tarjeta-detalle-ficha-designacion-oficio.component.scss']
})
export class DetalleTarjetaDetalleFichaDesignacionOficioComponent implements OnInit {
  progressSpinner: boolean = false;
  msgs: Message[] = [];
  nuevaDesigna: any;
  valorParametro: any;
  valorParametroNProcedimiento: any;
  searchParametros: ParametroDto = new ParametroDto();
  searchParametrosFormatoNProcedimiento: ParametroDto = new ParametroDto();
  datosBuscar: any[];
  estado: any;
  tieneLetradoAsignado: boolean = false;
  actuacionesNoFacturada: ActuacionDesignaItem[] = [];
  actuacionDesigna: ActuacionDesignaItem[] = [];
  disableFinalizar: boolean = false;
  disableAnular: boolean = false;
  disableReactivar: boolean = false;
  disableRestablecer:boolean = false;
  disableGuardar:boolean = false;
  refresh: any;
  estadoAnterior: any;
  refreshProcedimiento: any;
  refreshModulo: any;
  initDelitos: any;
  delitosValue: any;
  delitosOpciones: any;
  @Input() campos;
  @Output() refreshData = new EventEmitter<DesignaItem>();
  @Output() refreshDataCombos = new EventEmitter<boolean>();
  datosInicial: any;
  esColegiado: boolean = false;
  anio: any;
  textFilter: string = "Seleccionar";
  textSelected: String = "{0} delitos seleccionados";
  inputs = [
    { nombre: 'NIG', value: "" },
    { nombre: 'Nº Procedimiento', value: "" }
  ];

  datePickers = [
    {
      nombre: 'Fecha estado',
      value: ""
    },
    {
      nombre: 'Fecha cierre',
      value: ""
    }
  ];

  selectores = [
    {
      nombre: 'Estado',
      opciones: [
        { label: 'Activo', value: 'V' },
        { label: 'Finalizado', value: 'F' },
        { label: 'Anulada', value: 'A' }
      ],
      value:[],
      disable:true
    },
    {
      nombre: 'Juzgado',
      opciones: [

      ],
      value:[],
      disable:false
    },
    {
      nombre: 'Procedimiento',
      opciones: [

      ],
      value:[],
      disable:false
    },
    {
      nombre: 'Módulo',
      opciones: [
      ],
      value:[],
      disable:false
    }
  ];

  constructor(private sigaServices: SigaServices, private datepipe: DatePipe, private commonsService: CommonsService, private confirmationService: ConfirmationService, private translateService: TranslateService) { }

  ngOnInit() {
    this.datosInicial = this.campos;
    this.initDelitos = this.delitosValue;
    this.nuevaDesigna = JSON.parse(sessionStorage.getItem("nuevaDesigna"));
    let parametro = new ParametroRequestDto();
    parametro.idInstitucion = this.campos.idInstitucion;
    parametro.modulo = "SCS";
    parametro.parametrosGenerales = "CONFIGURAR_COMBO_DESIGNA";
    this.sigaServices
      .postPaginado("parametros_search", "?numPagina=1", parametro)
      .subscribe(
        data => {
          this.searchParametros = JSON.parse(data["body"]);
          this.datosBuscar = this.searchParametros.parametrosItems;
          this.datosBuscar.forEach(element => {
            if (element.parametro == "CONFIGURAR_COMBO_DESIGNA" && (element.idInstitucion == 0 || element.idInstitucion == element.idinstitucionActual)) {
              this.valorParametro = element.valor;
            }
          });
        },
        err => {
          console.log(err);
        },
        () => {
        }
      );
    parametro = new ParametroRequestDto();
    parametro.idInstitucion = this.campos.idInstitucion;
    parametro.modulo = "SCS";
    parametro.parametrosGenerales = "FORMATO_VALIDACION_NPROCEDIMIENTO_DESIGNA";
    this.sigaServices
      .postPaginado("parametros_search", "?numPagina=1", parametro)
      .subscribe(
        data => {
          this.searchParametrosFormatoNProcedimiento = JSON.parse(data["body"]);
          this.datosBuscar = this.searchParametros.parametrosItems;
          this.datosBuscar.forEach(element => {
            if (element.parametro == "FORMATO_VALIDACION_NPROCEDIMIENTO_DESIGNA" && (element.idInstitucion == 0 || element.idInstitucion == element.idinstitucionActual)) {
              this.valorParametroNProcedimiento = element.valor;
              console.log("NUEVO PARAMETRO");
              console.log(this.valorParametroNProcedimiento);
            }
          });
        },
        err => {
          console.log(err);
        },
        () => {
        }
      );
    if (!this.nuevaDesigna) {
      this.inputs[0].value = this.campos.nig;
      this.inputs[1].value = this.campos.numProcedimiento;
      // this.estado = this.campos.art27;
      this.selectores[0].opciones = [{ label: this.campos.estado, value: this.campos.sufijo }];
      this.selectores[1].opciones = [{ label: this.campos.nombreJuzgado, value: this.campos.idJuzgado }];
      this.selectores[2].opciones = [{ label: this.campos.nombreProcedimiento, value: this.campos.idProcedimiento}];
      this.selectores[3].opciones = [{ label: this.campos.modulo, value: this.campos.idModulo }];
      // this.getComboModulos();
      this.datePickers[0].value = this.campos.fechaEstado;
      this.datePickers[1].value = this.campos.fechaFin;
      this.checkAcceso();
      if(this.campos.estado == 'Activo'){
        if(this.esColegiado){
          this.disableAnular = true;
          this.disableFinalizar = true;
        }else{
          this.disableFinalizar = false;
          if(this.ningunaActuacionesFacturada(this.campos)){
            this.disableAnular = false;
          }else{
            this.disableAnular = true;
          }
        }
        this.disableReactivar = true;
      }else if(this.campos.estado == 'Finalizado'){
        if(this.esColegiado){
          this.disableReactivar = true;
        }else{
          this.disableReactivar = false;
        }
        this.disableFinalizar = true;
        this.disableAnular = true;
      }else if(this.campos.estado == 'Anulada'){
        this.disableAnular = true;
        this.disableFinalizar = true;
        if(this.esColegiado){
          this.disableReactivar = true;
        }else{
          this.disableReactivar = false;
        }
      }
      this.disableRestablecer = false;
    } else {
      this.datePickers[0].value = this.formatDate(new Date());
      this.selectores[0].opciones = [
        { label: 'Activo', value: 'V' }
       ];
      this.getComboJuzgados();
      this.disableAnular = true;
      this.disableFinalizar = true;
      this.disableReactivar = true;
      this.disableRestablecer = false;
    }
    

    this.getComboDelitos();

  }

  formatDate(date) {
    const pattern = 'dd/MM/yyyy';
    return this.datepipe.transform(date, pattern);
  }

  busquedaCombos(event) {
    let arrayJuzgado = JSON.parse(sessionStorage.getItem("juzgadoSeleccioadno"));
    if (JSON.parse(sessionStorage.getItem("juzgadoSeleccioadno"))) {
      if (this.valorParametro == 1) {
        this.getComboProcedimientosConJuzgado(arrayJuzgado[0]);
      }
      if (this.valorParametro == 2) {
        this.getComboModulosConJuzgado(arrayJuzgado[0]);
      }
      if (this.valorParametro == 3) {
        this.getComboModulosConJuzgado(arrayJuzgado[0]);
        this.getComboProcedimientos();
      }
      if (this.valorParametro == 4) {
        this.getComboProcedimientosConJuzgado(arrayJuzgado[0]);
        this.getComboModulos();
      }
      if (this.valorParametro == 5) {
        this.getComboProcedimientos();
        this.getComboModulos();
      }
      sessionStorage.removeItem("juzgadoSeleccioadno");
    }
  }

  busquedaCombosModulo(event) {
    let arrayModulo = JSON.parse(sessionStorage.getItem("moduloSeleccionado"));
    if (JSON.parse(sessionStorage.getItem("moduloSeleccionado"))) {
      if (this.valorParametro == 2) {
        this.getComboProcedimientosConModulo(arrayModulo[0]);
      }
      sessionStorage.removeItem("moduloSeleccionado");
    }
  }

  busquedaCombosProcedimiento(event) {
    let arrayProcedimiento = JSON.parse(sessionStorage.getItem("procedimientoSeleccionado"));
    if (JSON.parse(sessionStorage.getItem("procedimientoSeleccionado"))) {
      if (this.valorParametro == 1) {
        this.getcCmboModulosConProcedimientos(arrayProcedimiento[0]);
      }
      sessionStorage.removeItem("procedimientoSeleccionado");
    }
  }

  showMsg(severity, summary, detail) {
    this.progressSpinner = true;
    this.msgs = [];
    let designaUpdate = new DesignaItem();
    let anio = this.campos.ano.split("/");
    designaUpdate.ano = Number(anio[0].substring(1,5));
    designaUpdate.numero = this.campos.numero;
    designaUpdate.idTurno = this.campos.idTurno;
    designaUpdate.nombreInteresado = this.campos.nombreInteresado;
    designaUpdate.numColegiado = this.campos.numColegiado;
    designaUpdate.validada = this.campos.validada;
    //Guardar
      if (detail == "Guardar") {
      designaUpdate.estado = "";
      let validaNIG = true;
      let validaProcedimiento = true;
      designaUpdate.nig = this.inputs[0].value;
      designaUpdate.numProcedimiento = this.inputs[1].value;
      designaUpdate.idJuzgado = Number(this.selectores[1].value[0]);
      designaUpdate.idPretension = Number(this.selectores[2].value[0]);
      designaUpdate.idProcedimiento = Number(this.selectores[3].value[0]);
      designaUpdate.delitos = this.delitosValue;
      if(this.datePickers[0].value == null){
        designaUpdate.fechaEstado = null;
      }else{
        designaUpdate.fechaEstado = new Date(this.datePickers[0].value);
      }
      if(this.datePickers[1].value == null){
        designaUpdate.fechaFin = null;
      }else{
        designaUpdate.fechaFin = new Date(this.datePickers[1].value);
      }
      
      if(this.selectores[0].value[0] =="Finalizada"){
        designaUpdate.estado = "F";
      }else if(this.selectores[0].value[0] =="Activo"){
        designaUpdate.estado = "V";
      }else if(this.selectores[0].value[0] =="Anulada"){
        designaUpdate.estado = "A";
      }
      if(designaUpdate.nig != "" && designaUpdate.nig!= undefined){
        validaNIG = this.validarNig(designaUpdate.nig);
      }
      if(designaUpdate.numProcedimiento != "" && designaUpdate.numProcedimiento!= undefined){
        validaProcedimiento = this.validarNProcedimiento(designaUpdate.numProcedimiento);
      }

      if(validaNIG == true && validaProcedimiento == true){
        designaUpdate.fechaAnulacion = new Date();
        this.checkDesignaJuzgadoProcedimiento(designaUpdate);
      }else{
        this.progressSpinner = false;
        let severity = "error";
          let summary = "No se ha podido guardar el detalle de la designación";
          let detail = "";
          this.msgs.push({
            severity,
            summary,
            detail
          });
      }
    } 
    //ANULAR
    if (detail == "Anular" ) {
      this.progressSpinner = false;
      designaUpdate.estado = "A";
      designaUpdate.fechaAnulacion = null;
      designaUpdate.fechaEstado = new Date();
      let mess = "Está seguro de querer Anular la designación. Las actuaciones asociadas también serán anuladas de forma automática.¿Desea continuar?";
      let icon = "fa fa-question-circle";
      let keyConfirmation = "confirmAnular";
      this.confirmationService.confirm({
        key: keyConfirmation,
        message: mess,
        icon: icon,
        accept: () => {
          this.progressSpinner = true;
          this.tieneLetrado(this.campos, designaUpdate);
        },
        reject: () => {
          this.progressSpinner = false;
          this.msgs = [
            {
              severity: "info",
              summary: "Cancel",
              detail: this.translateService.instant(
                "general.message.accion.cancelada"
              )
            }
          ];
        }
      });
    } 
    //FINALIZAR
    if (detail == "Finalizar" ) {
      designaUpdate.estado = "F";
      designaUpdate.fechaAnulacion = null;
      designaUpdate.fechaEstado = new Date();
      this.updateDetalle(designaUpdate);
    } 
    //REACTIVAR
    if (detail == "Reactivar") {
      this.estadoAnterior = this.selectores[0].value[0];
      designaUpdate.estado = "V";
      designaUpdate.fechaEstado = new Date();
      designaUpdate.fechaAnulacion = null;
      this.ningunaActuacionesFacturada(this.campos);
      this.updateDetalle(designaUpdate);
    }
     //RESTABLECER
     if (detail == "Restablecer" ) {
       if(!this.nuevaDesigna){
        this.inputs[0].value = this.datosInicial.nig;
        this.inputs[1].value = this.datosInicial.numProcedimiento;
        // this.selectores[0].opciones = [{ label: this.datosInicial.estado, value: this.datosInicial.sufijo }];
        // this.selectores[1].opciones = [{ label: this.datosInicial.nombreJuzgado, value: this.datosInicial.idJuzgado }];
        // this.selectores[2].opciones = [{ label: this.datosInicial.nombreProcedimiento, value: this.datosInicial.idProcedimiento}];
        // this.selectores[3].opciones = [{ label: this.datosInicial.modulo, value: this.datosInicial.idModulo }];
        this.refresh = [this.datosInicial.idJuzgado];
        this.refreshProcedimiento = [this.datosInicial.idPretension];
        this.refreshModulo = [this.datosInicial.idProcedimiento];
        this.datePickers[0].value = this.datosInicial.fechaEstado;
        this.delitosValue = this.initDelitos;
        this.getComboDelitos();
        if(this.datosInicial.fechaFin==0){
          this.datePickers[1].value = null;
        }else{
          this.datePickers[1].value = this.datosInicial.fechaFin;
        }
        this.getComboJuzgados();
       }else{
        this.inputs[0].value = "";
        this.inputs[1].value = "";
        // this.selectores[0].opciones = [{ label: this.datosInicial.estado, value: this.datosInicial.sufijo }];
        // this.selectores[1].opciones = [{ label: this.datosInicial.nombreJuzgado, value: this.datosInicial.idJuzgado }];
        // this.selectores[2].opciones = [{ label: this.datosInicial.nombreProcedimiento, value: this.datosInicial.idProcedimiento}];
        // this.selectores[3].opciones = [{ label: this.datosInicial.modulo, value: this.datosInicial.idModulo }];
        this.selectores[1].value = [-1];
        this.selectores[2].value =  [-1];
        this.selectores[3].value =  [-1];
        this.delitosValue = "";
        this.getComboDelitos();
        this.datePickers[0].value = "";
        this.datePickers[0].value = "";
        this.datePickers[1].value = null;
        this.getComboJuzgados();
       }
     
    } 
  }

  clear() {
    this.msgs = [];
  }

  fillFechaHastaCalendar(event, nombre){
    if(nombre == "Fecha estado"){
      this.datePickers[0].value = event;
    }else if(nombre = "Fecha cierre"){
      this.datePickers[1].value = event;
    }
  }

  getComboJuzgados() {
    this.progressSpinner = true;
    this.sigaServices.get("combo_comboJuzgadoDesignaciones").subscribe(
      n => {
        this.selectores[1].opciones = n.combooItems;
        this.progressSpinner=false;
      },
      err => {
        console.log(err);
        this.progressSpinner=false;
      }, () => {
        this.arregloTildesCombo(this.selectores[1].opciones);
        this.progressSpinner=false;
      }
    );
  }

  getComboProcedimientos() {
    this.progressSpinner=true;
    this.sigaServices.get("combo_comboProcedimientosDesignaciones").subscribe(
      n => {
        this.selectores[2].opciones = n.combooItems;
        this.progressSpinner=false;
      },
      err => {
        console.log(err);
        this.progressSpinner=false;
      }, () => {
        this.arregloTildesCombo(this.selectores[2].opciones);
        this.progressSpinner=false;
      }
    );
  }

  getComboModulos() {
    this.progressSpinner=true;
    this.sigaServices.get("combo_comboModulosDesignaciones").subscribe(
      n => {
        this.selectores[3].opciones = n.combooItems;
        this.progressSpinner=false;
      },
      err => {
        console.log(err);
        this.progressSpinner=false;
      }, () => {
        this.arregloTildesCombo(this.selectores[3].opciones);
        this.progressSpinner=false;
      }
    );
  }

  getComboDelitos() {
    this.progressSpinner=true;
    this.sigaServices.get("combo_comboDelitos").subscribe(
      n => {
        this.delitosOpciones = n.combooItems;
        this.progressSpinner=false;
      },
      err => {
        console.log(err);
        this.progressSpinner=false;
      }, () => {
        this.arregloTildesCombo(this.delitosOpciones);
        this.progressSpinner=false;
      }
    );
  }

  getComboProcedimientosConJuzgado(idJuzgado) {
    this.progressSpinner=true;
    this.sigaServices.post("combo_comboProcedimientosConJuzgado", idJuzgado).subscribe(
      n => {
        this.selectores[2].opciones = JSON.parse(n.body).combooItems;
        this.progressSpinner=false;
      },
      err => {
        console.log(err);
        this.progressSpinner=false;
      }, () => {
        this.arregloTildesCombo(this.selectores[2].opciones);
        this.progressSpinner=false;
      }
    );
  }

  getComboProcedimientosConModulo(idProcedimiento) {
    this.progressSpinner=true;
    this.sigaServices.post("combo_comboProcedimientosConModulo", idProcedimiento).subscribe(
      n => {
        this.selectores[2].opciones = JSON.parse(n.body).combooItems;
        this.progressSpinner=false;
      },
      err => {
        console.log(err);
        this.progressSpinner=false;
      }, () => {
        this.arregloTildesCombo(this.selectores[2].opciones);
        this.progressSpinner=false;
      }
    );
  }

  getComboModulosConJuzgado(idJuzgado) {
    this.progressSpinner=true;
    this.sigaServices.post("combo_comboModulosConJuzgado", idJuzgado).subscribe(
      n => {
        this.selectores[3].opciones = JSON.parse(n.body).combooItems;
        this.progressSpinner=false;
      },
      err => {
        console.log(err);
        this.progressSpinner=false;
      }, () => {
        this.arregloTildesCombo(this.selectores[3].opciones);
        this.progressSpinner=false;
      }
    );
  }

  getcCmboModulosConProcedimientos(idPretension) {
    this.progressSpinner=true;
    this.sigaServices.post("combo_comboModulosConProcedimientos", idPretension).subscribe(
      n => {
        this.selectores[3].opciones = JSON.parse(n.body).combooItems;
        this.progressSpinner=false;
      },
      err => {
        console.log(err);
        this.progressSpinner=false;
      }, () => {
        this.arregloTildesCombo(this.selectores[3].opciones);
        this.progressSpinner=false;
      }
    );
  }
  arregloTildesCombo(combo) {
    if (combo != undefined)
      combo.map(e => {
        let accents =
          "ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž";
        let accentsOut =
          "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
        let i;
        let x;
        for (i = 0; i < e.label.length; i++) {
          if ((x = accents.indexOf(e.label[i])) != -1) {
            e.labelSinTilde = e.label.replace(e.label[i], accentsOut[x]);
            return e.labelSinTilde;
          }
        }
      });
  }

  validarNig(nig) {
    //Esto es para la validacion de CADECA
    let ret = false;
    let institucionActual
    this.sigaServices.get("institucionActual").subscribe(n => {
      institucionActual = n.value;
      if (institucionActual == "2008" || institucionActual == "2015" || institucionActual == "2029" || institucionActual == "2033" || institucionActual == "2036" ||
      institucionActual == "2043" || institucionActual == "2006" || institucionActual == "2021" || institucionActual == "2035" || institucionActual == "2046" || institucionActual == "2066") {
      if (nig != '') {
        var objRegExp = /^[0-9]{7}[S,C,P,O,I,V,M,6,8,1,2,3,4]{1}(19|20)\d{2}[0-9]{7}$/;
        ret = objRegExp.test(nig);
        
      }
      else
        ret = true;
    } else {
      if (nig.length == 19) {
        var objRegExp = /^([a-zA-Z0-9]{19})?$/;
        ret = objRegExp.test(nig);
      } else {
        ret = true;
      }
    }
    });

    return ret;
  }

  validarNProcedimiento(nProcedimiento) {
    //Esto es para la validacion de CADECA
    let institucionActual
    this.sigaServices.get("institucionActual").subscribe(n => {
      institucionActual = n.value;
    });

    if (institucionActual == "2008" || institucionActual == "2015" || institucionActual == "2029" || institucionActual == "2033" || institucionActual == "2036" ||
      institucionActual == "2043" || institucionActual == "2006" || institucionActual == "2021" || institucionActual == "2035" || institucionActual == "2046" || institucionActual == "2066") {
      if (nProcedimiento != '') {
        var objRegExp = /^[0-9]{4}[\/]{1}[0-9]{5}[\.]{1}[0-9]{2}$/;
        var ret = objRegExp.test(nProcedimiento);
        return ret;
      }
      else
        return true;
    } else {
      if (nProcedimiento.length == 19) {
        var objRegExp = /^[0-9]{4}[\/]{1}[0-9]{7}[/]$/;
        var ret = objRegExp.test(nProcedimiento);
        return ret;
      } else {
        return true;
      }
    }

  }

  updateDetalle(updateDetalle){
    this.progressSpinner = true;
    if(updateDetalle.idPretension == 0){
      updateDetalle.idPretension = null;
    }
    this.sigaServices.post("designaciones_updateDetalleDesignacion", updateDetalle).subscribe(
        n => {
          let severity = "success";
          let summary = "Modificado correctamente";
          let detail = ""
          this.msgs.push({
            severity,
            summary,
            detail
          });
          updateDetalle.ano = this.campos.ano;
          this.selectores[0].value = [updateDetalle.estado];
          this.datePickers[0].value = this.formatDate(updateDetalle.fechaEstado);
          updateDetalle.nig = this.inputs[0].value;
          updateDetalle.numProcedimiento = this.inputs[1].value;
          let aux = this.selectores[1].value[0];
          if(aux != null && aux != undefined && aux != ""){
            this.selectores[1].opciones.forEach(el => {
              if(el.value ==aux ){
                updateDetalle.nombreJuzgado = el.label;
              }
          });
          }
          aux = this.selectores[2].value[0];
          if(aux != null && aux != undefined && aux != ""){
            this.selectores[2].opciones.forEach(el => {
              if(el.value ==aux ){
                updateDetalle.nombreProcedimiento = el.label;
              }
          });
          } 
          aux = this.selectores[3].value[0];
           if(aux != null && aux != undefined && aux != ""){
            this.selectores[3].opciones.forEach(el => {
              if(el.value ==aux ){
                updateDetalle.modulo = el.label;
              }
          });
          }  
          if(this.campos.estado == 'Activo'){
            if(this.esColegiado){
              this.disableAnular = true;
              this.disableFinalizar = true;
            }else{
              this.disableFinalizar = false;
              if(this.ningunaActuacionesFacturada(this.campos)){
                this.disableAnular = false;
              }else{
                this.disableAnular = true;
              }
            }
            this.disableReactivar = true;
          }else if(this.campos.estado == 'Finalizado'){
            if(this.esColegiado){
              this.disableReactivar = true;
            }else{
              this.disableReactivar = false;
            }
            this.disableFinalizar = true;
            this.disableAnular = true;
          }else if(this.campos.estado == 'Anulada'){
            this.disableAnular = true;
            this.disableFinalizar = true;
            if(this.esColegiado){
              this.disableReactivar = true;
            }else{
              this.disableReactivar = false;
            }
          }
          this.disableRestablecer = false;
          updateDetalle.rol = [this.estadoAnterior];
          this.refreshData.emit(updateDetalle);
        },
        err => {
          this.progressSpinner = false;
          console.log(err);
          let severity = "error";
          let summary = "No se ha podido modificar correctamente";
          let detail = ""
          this.msgs.push({
            severity,
            summary,
            detail
          });
        },() => {
          this.progressSpinner = false;
        });;
  }

 checkAcceso(){
  let controlAcceso = new ControlAccesoDto();
  controlAcceso.idProceso = procesos_oficio.designa;
  this.sigaServices.post("acces_control", controlAcceso).subscribe(
    data => {
      const permisos = JSON.parse(data.body);
      const permisosArray = permisos.permisoItems;
      const derechoAcceso = permisosArray[0].derechoacceso;

      this.esColegiado=true;
      if (derechoAcceso == 3) { //es colegio
        this.esColegiado = false;
      } else if (derechoAcceso == 2) {//es colegiado
        this.esColegiado = true;
      } else {
        sessionStorage.setItem("codError", "403");
        sessionStorage.setItem(
          "descError",
          this.translateService.instant("generico.error.permiso.denegado")
        );
      }
    },
    err => {
      this.progressSpinner = false;
      console.log(err);
    }
  );
 }

 checkDesignaJuzgadoProcedimiento(designaItem){
  this.sigaServices.post("designaciones_existeDesignaJuzgadoProcedimiento", designaItem).subscribe(
    n => {
      this.progressSpinner = false;
      if(JSON.parse(n.body).existeDesignaJuzgadoProcedimiento>0){
        let mess = "Atención: Ya existe una designación con el mismo número de prodecimiento y juzgado.¿Desea continuar?";
        let icon = "fa fa-question-circle";
        let keyConfirmation = "confirmGuardar";
        this.confirmationService.confirm({
          key: keyConfirmation,
          message: mess,
          icon: icon,
          accept: () => {
            this.progressSpinner = true;
            this.updateDetalle(designaItem);
          },
          reject: () => {
            this.progressSpinner = false;
            this.msgs = [
              {
                severity: "info",
                summary: "Cancel",
                detail: this.translateService.instant(
                  "general.message.accion.cancelada"
                )
              }
            ];
          }
        });
      }else{
        this.updateDetalle(designaItem);
      }
     
    },
    err => {
      this.progressSpinner = false;
      console.log(err);
    },() => {
      this.progressSpinner = false;
    });;
 }

 ningunaActuacionesFacturada(element): boolean{
   let resultado: boolean = false;
  const params = {
    anio: element.factConvenio,
    idTurno: element.idTurno,
    numero: element.numero,
    historico: false
  };
  this.progressSpinner = false;
  this.sigaServices.post("actuaciones_designacion", params).subscribe(
    data => {
      let object: ActuacionDesignaObject = JSON.parse(data.body);
      let resp = object.actuacionesDesignaItems;
        let facturadas = 0;
        resp.forEach(el => {
          this.actuacionDesigna.push(el);
          if (el.facturado) {
            facturadas += 1;
          }else if(!el.facturado){
            this.actuacionesNoFacturada.push(el);
          }
        });
        this.activarActuaciones(this.actuacionDesigna);
        if(facturadas == 0){
          resultado = true;
        }else{
          resultado = false;
        }
      },
      err => {
        resultado = false;
        this.progressSpinner = false;
        console.log(err);
      }
    );

    return resultado;
 }

 tieneLetrado(element,designaUpdate) {
  designaUpdate.estado = "A";
  designaUpdate.fechaEstado = new Date();
  designaUpdate.fechaAnulacion = null;
  //Buscamos los letrados asociados a la designacion
  this.progressSpinner = true;
  let institucionActual;
  let  resquestLetrado = [element.factConvenio, element.idTurno, element.numero];
  this.sigaServices.post("designaciones_busquedaLetradosDesignacion", resquestLetrado).subscribe(
    data => {
      this.progressSpinner = false;
      let letrados = JSON.parse(data.body);
      if (letrados.length > 0) {
        this.tieneLetradoAsignado = true;
        let mess = "Si desea introducir una compensación al letrado designado pulse Aceptar, en caso contrario Cancelar";
        let icon = "fa fa-question-circle";
        let keyConfirmation = "confirmGuardarCompensacion";
        this.confirmationService.confirm({
          key: keyConfirmation,
          message: mess,
          icon: icon,
          accept: () => {
            let saltos = [];
              let salto = new SaltoCompItem();
              salto.fecha = this.formatDate(new Date());
              salto.idPersona = element.idPersona;
              salto.idTurno = element.idTurno;
              salto.motivo = "";
              salto.saltoCompensacion = "C";
              saltos.push(salto);
            this.sigaServices.post("saltosCompensacionesOficio_guardar", saltos).subscribe(
              result => {
  
                const resp = JSON.parse(result.body);
  
                if (resp.status == 'KO' || (resp.error != undefined && resp.error != null)) {
                  this.showMsg("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
                }
  
                if (resp.status == 'OK') {
                  if(this.actuacionesNoFacturada.length > 0){
                    this.eliminarActuacionesNoFacturadas(this.actuacionesNoFacturada, designaUpdate);
                  }else{
                  this.updateDetalle(designaUpdate);
                  } 
                }
              },
              error => {
                this.showMsg("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
              }
            );
          },
          reject: () => {
            if(this.actuacionesNoFacturada.length > 0){
              this.eliminarActuacionesNoFacturadas(this.actuacionesNoFacturada, designaUpdate);
          }else{
            this.updateDetalle(designaUpdate);
          }
          }
        });
      
      }else{
        if(this.actuacionesNoFacturada.length > 0){
            this.eliminarActuacionesNoFacturadas(this.actuacionesNoFacturada, designaUpdate);
        }else{
          this.updateDetalle(designaUpdate);
        }
      }
      
    },
    err => {
        this.showMsg("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
      this.progressSpinner = false;
    },
    () => {
      this.progressSpinner = false;
    }
  );
}

eliminarActuacionesNoFacturadas(actuacionesRequest, designaUpdate){
  this.sigaServices.post("actuaciones_designacion_eliminar", actuacionesRequest).subscribe(
    data => {
      this.progressSpinner = false;
      const resp = JSON.parse(data.body);

      if (resp.status == 'OK') {
        this.updateDetalle(designaUpdate);
      }

      if (resp.error != null && resp.error.descripcion != null) {

        if (resp.error.code == '500') this.showMsg('error',  'Error', this.translateService.instant(resp.error.descripcion) );

      }

    },
    err => {
      this.progressSpinner = false;
      console.log(err);
    }
  );
}
  activarActuaciones(actuacionesRequest) {
    this.sigaServices.post("actuaciones_designacion_reactivar", actuacionesRequest).subscribe(
      data => {
        this.progressSpinner = false;
        const resp = JSON.parse(data.body);

        if (resp.status == 'OK') {
        }

        if (resp.error != null && resp.error.descripcion != null) {
          this.showMsg('error', 'Error',  this.translateService.instant(resp.error.descripcion));
        }

      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      }
    );
  }

}
