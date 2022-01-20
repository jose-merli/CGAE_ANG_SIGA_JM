import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { ActivatedRoute, Router } from '@angular/router';
import { BuscadorAsistenciaExpresComponent } from './buscador-asistencia-expres/buscador-asistencia-expres.component';
import { SigaServices } from '../../../../../_services/siga.service';
import { ResultadoAsistenciaExpresComponent } from '../resultado-asistencia-expres/resultado-asistencia-expres.component';
import { Cell, Row, RowGroup, TablaResultadoDesplegableAEService } from '../../../../../commons/tabla-resultado-desplegable/tabla-resultado-desplegable-ae.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { TarjetaAsistenciaItem } from '../../../../../models/guardia/TarjetaAsistenciaItem';
import { ActuacionAsistenciaItem } from '../../../../../models/guardia/ActuacionAsistenciaItem';
import { DatePipe } from '@angular/common';

import { PersistenceService } from '../../../../../_services/persistence.service';
import { TranslateService } from '../../../../../commons/translate';
import * as moment from 'moment';
import { procesos_guardia } from '../../../../../permisos/procesos_guarida';
import { SigaStorageService } from '../../../../../siga-storage.service';
import { FiltroAsistenciaItem } from '../../../../../models/guardia/FiltroAsistenciaItem';
import { KEY_CODE } from '../../../../administracion/parametros/parametros-generales/parametros-generales.component';
import { BuscadorAsistenciasComponent } from './buscador-asistencias/buscador-asistencias.component';
import { ResultadoAsistenciasComponent } from '../resultado-asistencias/resultado-asistencias.component';

@Component({
  selector: 'app-asistencia-expres',
  templateUrl: './asistencia-expres.component.html',
  styleUrls: ['./asistencia-expres.component.scss']
})
export class AsistenciaExpresComponent implements OnInit,AfterViewInit {
  msgs: Message[] = [];
  show = false;
  cFormValidity = true;
  modoBusqueda = 'b';
  rowGroups : RowGroup[];
  rowGroupsAux: RowGroup[];
  initialRowGroups : RowGroup[];
  rutas: string[] = [];
  radios = [];
  asistencias : TarjetaAsistenciaItem[] = [];
  progressSpinner : boolean;
  showSustitutoDialog : boolean;
  mensajeSustitutoDialog : string;
  comboSexo = [
    {label: "HOMBRE", value:"H"},
    {label: "MUJER", value: "M"},
    {label: "NO CONSTA", value: "N"}
  ];
  comboJuzgados = [];
  comboComisarias = [];
  comboDelitos = [];
  isLetrado : boolean = false;
  resaltadoDatos: boolean = false;
  permisoEscrituraAE : boolean = false;
  resultModified;
  letradoFillAutomaticamente = false;
  @ViewChild(BuscadorAsistenciaExpresComponent) filtrosAE: BuscadorAsistenciaExpresComponent;
  @ViewChild(ResultadoAsistenciaExpresComponent) resultadoAE: ResultadoAsistenciaExpresComponent;
  @ViewChild(BuscadorAsistenciasComponent) filtro : BuscadorAsistenciasComponent;
  @ViewChild(ResultadoAsistenciasComponent) resultado : ResultadoAsistenciasComponent;
  constructor(private activatedRoute: ActivatedRoute,
    private sigaServices: SigaServices,
    private trdService: TablaResultadoDesplegableAEService,
    private sigaStorageService: SigaStorageService,
    private datepipe: DatePipe,
    private commonServices: CommonsService,
    private persistenceService : PersistenceService,
    private translateService : TranslateService,
    private router: Router) { }

  ngOnInit(): void {
    this.show = false;
    this.getComboDelitosOnly();
  
    if ((this.activatedRoute.snapshot.queryParamMap.get('searchMode')
      && this.activatedRoute.snapshot.queryParamMap.get('searchMode') == 'a')
      || sessionStorage.getItem("modoBusqueda") == "a") {

      this.modoBusqueda = 'a';

    } else if((this.activatedRoute.snapshot.queryParamMap.get('searchMode')
    && this.activatedRoute.snapshot.queryParamMap.get('searchMode') == 'b')
    || sessionStorage.getItem("modoBusqueda") == "b"){
      this.modoBusqueda = 'b';
    }
    this.isLetrado = this.sigaStorageService.isLetrado;
    if(this.modoBusqueda == 'b'){
      this.commonServices.checkAcceso(procesos_guardia.asistencias_express)
      .then(respuesta => {

        this.permisoEscrituraAE = respuesta;

        this.persistenceService.setPermisos(this.permisoEscrituraAE);

        if (this.permisoEscrituraAE == undefined && this.modoBusqueda == 'b') {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
          this.router.navigate(["/errorAcceso"]);
        }

      }).catch(error => console.error(error));
    }else if(this.modoBusqueda == 'a'){
      this.commonServices.checkAcceso(procesos_guardia.asistencias)
      .then(respuesta => {

        this.permisoEscrituraAE = respuesta;

        this.persistenceService.setPermisos(this.permisoEscrituraAE);

        if (this.permisoEscrituraAE == undefined && this.modoBusqueda == 'a') {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
          this.router.navigate(["/errorAcceso"]);
        }

      }).catch(error => console.error(error));
    }

    this.radios = [
                    { label: this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.busquedaasistencias"), value: 'a' },
                    { label: this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.titulo"), value: 'b' }
                  ];
    this.rutas = ['SJCS', this.translateService.instant("menu.justiciaGratuita.GuardiaMenu"), this.translateService.instant("menu.justiciaGratuita.asistencia")];

  }

  ngAfterViewInit(): void {
    if(sessionStorage.getItem("filtroAsistencia") && sessionStorage.getItem("volver") && sessionStorage.getItem("modoBusqueda") == "b"){
      this.modoBusqueda = 'b';
      let oldFiltro : FiltroAsistenciaItem = JSON.parse(sessionStorage.getItem("filtroAsistencia"));
      this.filtrosAE.filtro.diaGuardia = oldFiltro.diaGuardia;
      this.filtrosAE.getTurnosByColegiadoFecha();
      this.filtrosAE.filtro.idTurno = oldFiltro.idTurno;
      this.filtrosAE.onChangeTurno();
      this.filtrosAE.filtro.idGuardia = oldFiltro.idGuardia;
      this.filtrosAE.onChangeGuardia();
      this.filtrosAE.filtro.idLetradoGuardia = oldFiltro.idLetradoGuardia;
      this.filtrosAE.filtro.idPersona = oldFiltro.idPersona;
      this.filtrosAE.filtro.idTipoAsistenciaColegiado = oldFiltro.idTipoAsistenciaColegiado;
      this.filtrosAE.filtro.isSustituto = oldFiltro.isSustituto;
      sessionStorage.removeItem("filtroAsistencia");
      sessionStorage.removeItem("volver");
      sessionStorage.removeItem("modoBusqueda");
      this.getComboComisarias(); // Posteriormente hace la busqueda de asistencias
    }else if(sessionStorage.getItem("filtroAsistencia") && sessionStorage.getItem("volver") && sessionStorage.getItem("modoBusqueda") == "a"){
      this.modoBusqueda = 'a';
      sessionStorage.removeItem("modoBusqueda");
      sessionStorage.removeItem("filtroAsistencia");
      sessionStorage.removeItem("volver");
    }

  }
  
  showResponse() {
    this.show = true;
  }
  hideResponse() {
    this.show = false;
  }
  saveForm($event) {
    this.cFormValidity = $event;
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

  isDisabled() {
    return this.modoBusqueda == 'a';
  }

  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      if(this.modoBusqueda == 'b'){
        this.checkSustitutoCheckBox();
      }else{
        this.searchAsistencias();
      }
      
    }
  }

  checkSustitutoCheckBox(){
    if(this.validateForm()){
      this.showSustitutoDialog = true;
      if(this.filtrosAE.filtro.isSustituto == 'S'){
          this.mensajeSustitutoDialog =  this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.refuerzoguardia");
      }else{
          this.mensajeSustitutoDialog = this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.refuerzoguardia2");
      }
    }
  }

  cancelar(){
    this.showSustitutoDialog = false;
  }
  confirmarSustituto(){
    this.showSustitutoDialog = false;
    this.progressSpinner = true;
    this.getComboComisarias(); 
  }

  clearForm(){

    this.filtrosAE.comboGuardias = [];
    this.filtrosAE.comboLetradosGuardia = [];
    this.filtrosAE.comboTiposAsistencia = [];
    this.filtrosAE.comboTurnos = [];
    this.filtrosAE.filtro.diaGuardia = '';
    this.filtrosAE.filtro.idGuardia = '';
    this.filtrosAE.filtro.idLetradoGuardia = '';
    this.filtrosAE.filtro.idTurno = '';
    this.filtrosAE.filtro.isSustituto = 'N';
    this.filtrosAE.filtro.idTipoAsistenciaColegiado = '';
    this.filtrosAE.resaltadoDatos = true;
    
  }

  validateForm(){
    let ok : boolean = true;
    if(!this.filtrosAE.filtro.diaGuardia
      || !this.filtrosAE.filtro.idGuardia
      || !this.filtrosAE.filtro.idLetradoGuardia
      || !this.filtrosAE.filtro.idTurno){
        this.showMsg('error', 'Error', this.translateService.instant("general.message.camposObligatorios"));
        ok = false;
      }
    return ok;
  }

  search(){
    this.filtrosAE.filtroAux = this.filtrosAE.filtro;
    this.hideResponse();
    this.sigaServices
      .post("busquedaGuardias_buscarAsistenciasExpress", this.filtrosAE.filtro)
      .subscribe(
        n => {
          let asistenciasDTO = JSON.parse(n["body"]);
          if(asistenciasDTO.error){
            this.showMsg('error', this.translateService.instant("informesycomunicaciones.modelosdecomunicacion.errorResultados"), asistenciasDTO.error.description);
          }else if(asistenciasDTO.tarjetaAsistenciaItems2 != undefined){
            if(asistenciasDTO.tarjetaAsistenciaItems2.length === 0){
            this.showMsg('info','Info',this.translateService.instant("informesYcomunicaciones.consultas.mensaje.sinResultados"));
            }else{
              this.fromJsonToRowGroups(asistenciasDTO.tarjetaAsistenciaItems2);
            }  
          } else{
            this.showMsg('info','Info',this.translateService.instant("informesYcomunicaciones.consultas.mensaje.sinResultados"));
          } 
          this.progressSpinner = false;
        },
        err => {
          //console.log(err);
        },
        () =>{
          this.progressSpinner = false;
          setTimeout(() => {
            this.commonServices.scrollTablaFoco('tablaFoco1');
          }, 5);
        }
      );
  }

  fromJsonToRowGroups(asistencias : TarjetaAsistenciaItem[]){
 
    let nombreApellidosType, fechaActuacionType, lugarType, nDiligenciaType;
    let nombreApellidosValue, delitosObservacionesValue, ejgValue, fechaActuacionValue, lugarValue, nDiligenciaValue;
    let objetoActuacion = {};
    let objetoAsistencia = {};
    let arrayAsistencias = [];
    asistencias.forEach((asistencia, indice) => {
      
      let arrayActuaciones = [];
      
      asistencia.actuaciones.forEach((actuacion, indiceAct) => {

        let letra = (indiceAct + 10).toString(36).toUpperCase();

        nombreApellidosType = '5InputSelector';
        nombreApellidosValue = [asistencia.nif, asistencia.apellido1, asistencia.apellido2, asistencia.nombre, asistencia.sexo];
        

        if(asistencia.idDelito
            || asistencia.observaciones){
              let comboDelitosValue = [];
              if(asistencia.idDelito){
                asistencia.idDelito.forEach(idDelito => {
                  comboDelitosValue.push(idDelito)
                })
              }
          delitosObservacionesValue = [comboDelitosValue, asistencia.observaciones];
        }else{
          delitosObservacionesValue = ['',''];
        }

        if(asistencia.ejgAnioNumero){
          ejgValue = asistencia.ejgAnioNumero;
        }else{
          ejgValue = '';
        }


        fechaActuacionType = 'datePicker';
        if(actuacion.fechaActuacion!=null){
          fechaActuacionValue = new Date(Date.parse(actuacion.fechaActuacion));
        }else{
          fechaActuacionValue = null;
        }

        let comisariaJuzgado = 'C';
        let idJuzgadoComisaria = '';
        if(actuacion.comisariaJuzgado){
          comisariaJuzgado = actuacion.comisariaJuzgado;
          idJuzgadoComisaria = actuacion.lugar;
        }
        lugarType = 'buttomSelect';
        lugarValue = ['C / J', this.comboComisarias, this.comboJuzgados
                        , comisariaJuzgado //C o J dependiendo si el lugar es una comisaria o juzgado
                        , idJuzgadoComisaria
                      ];
        

        if(actuacion.numeroAsunto){
          nDiligenciaType = 'input';
          nDiligenciaValue = actuacion.numeroAsunto;
        }else{
          nDiligenciaType = 'input';
          nDiligenciaValue = '';
        }
        let arrayDatosActuacion = [];
        if(indiceAct != 0){
          arrayDatosActuacion =
          [
            {type: 'invisible', value: '', combo: this.comboSexo, size: 445.5},
            {type: 'invisible', value: '', combo: this.comboDelitos, size: 225.75},
            {type: 'invisible', value: '', size: 100},
            {type: fechaActuacionType, value: fechaActuacionValue, showTime: true, size: 200},
            {type: lugarType, value: lugarValue, size: 400},
            {type: nDiligenciaType, value: nDiligenciaValue, size: 100}
          ]
        }else{
          arrayDatosActuacion =
          [
            {type: nombreApellidosType, value: nombreApellidosValue, combo: this.comboSexo, size: 445.5},
            {type: '2SelectorInput', value: delitosObservacionesValue, combo: this.comboDelitos, size: 225.75},
            {type: 'link', value: ejgValue, size: 100},
            {type: fechaActuacionType, value: fechaActuacionValue, showTime: true, size: 200},
            {type: lugarType, value: lugarValue, size: 400},
            {type: nDiligenciaType, value: nDiligenciaValue, size: 100},
            {type: 'invisible', value: asistencia.idTipoEjg}
          ]
        }

        let key = letra + 1;
        objetoActuacion = {[key] : arrayDatosActuacion};
        arrayActuaciones.push(Object.assign({},objetoActuacion));
      });

      objetoAsistencia = {[asistencia.anioNumero] : arrayActuaciones};
      arrayAsistencias.push(Object.assign({}, objetoAsistencia));
    });

    this.resultModified = Object.assign({},{'data':arrayAsistencias});

    this.rowGroups = this.trdService.getTableData(this.resultModified);
    this.rowGroupsAux = this.trdService.getTableData(this.resultModified);
    this.initialRowGroups = this.trdService.getTableData(this.resultModified);
    this.progressSpinner = false;
    this.showResponse();
  }

  getComboJuzgados(){

    this.sigaServices.getParam("busquedaGuardias_getJuzgados","?idTurno="+this.filtrosAE.filtro.idTurno).subscribe(
      n => {
        this.clear();
        if(n.error !== null
          && n.error.code === 500){
          this.showMsg("error", "Error", n.error.description.toString());
        }else{

          this.comboJuzgados = n.combooItems;
          this.commonServices.arregloTildesCombo(this.comboJuzgados);
          //this.search()
        }
      },
      err => {
        //console.log(err);
      }
    );

  }
  getComboComisarias(){

    this.sigaServices.getParam("busquedaGuardias_getComisarias","?idTurno="+this.filtrosAE.filtro.idTurno).subscribe(
      n => {
        this.clear();
        if(n.error !== null
          && n.error.code === 500){
          this.showMsg("error", "Error", n.error.description.toString());
        }else{

          this.comboComisarias = n.combooItems;
          this.commonServices.arregloTildesCombo(this.comboComisarias);
          this.getComboDelitos();
        }
      },
      err => {
        //console.log(err);
        this.progressSpinner = false
      }
    );

  }
  getComboComisariasOnly(){

    this.sigaServices.getParam("busquedaGuardias_getComisarias","?idTurno="+this.filtrosAE.filtro.idTurno).subscribe(
      n => {
        this.clear();
        if(n.error !== null
          && n.error.code === 500){
          this.showMsg("error", "Error", n.error.description.toString());
        }else{

          this.comboComisarias = n.combooItems;
          this.commonServices.arregloTildesCombo(this.comboComisarias);
        }
      },
      err => {
        //console.log(err);
        this.progressSpinner = false
      }
    );

  }
  getComboDelitos() {
    
    let designaItem = {};
    
    this.sigaServices.post("combo_comboDelitos", designaItem).subscribe(
      n => {
        let combos= JSON.parse(n["body"]);
        this.comboDelitos = combos.combooItems;
        this.commonServices.arregloTildesCombo(this.comboDelitos);
        this.getComboJuzgados();
      },
      err => {
        //console.log(err);
        this.showMsg('error',this.translateService.instant("informesycomunicaciones.modelosdecomunicacion.errorResultados"), err);
        this.progressSpinner = false
      }
    );
  }
  getComboDelitosOnly() {
    
    let designaItem = {};
    
    this.sigaServices.post("combo_comboDelitos", designaItem).subscribe(
      n => {
        let combos= JSON.parse(n["body"]);
        this.comboDelitos = combos.combooItems;
        this.commonServices.arregloTildesCombo(this.comboDelitos);
 
      },
      err => {
        //console.log(err);
        this.showMsg('error',this.translateService.instant("informesycomunicaciones.modelosdecomunicacion.errorResultados"), err);
        this.progressSpinner = false
      }
    );
  }
  saveTableData(event){
    this.progressSpinner = true;
    let rowGroupsToUpdate : RowGroup[] = event;
    let tarjetasAsistenciaItem : TarjetaAsistenciaItem[] = [];

    if(rowGroupsToUpdate && rowGroupsToUpdate.length != 0){

      rowGroupsToUpdate.forEach(rowGroup => {

        let tarjetaAsistenciaItem : TarjetaAsistenciaItem = new TarjetaAsistenciaItem();
        tarjetaAsistenciaItem.actuaciones = [];
        tarjetaAsistenciaItem.filtro = this.filtrosAE.filtroAux;
        if(rowGroup.id.length != 0){
          tarjetaAsistenciaItem.anioNumero = rowGroup.id;
          tarjetaAsistenciaItem.anio = rowGroup.id.split('/')[0].substring(1);
          tarjetaAsistenciaItem.numero =  rowGroup.id.split('/')[1];
        }

        rowGroup.rows.forEach((row, index) => {
          let actuacionAsistenciaItem : ActuacionAsistenciaItem = new ActuacionAsistenciaItem();
          if(index == 0){
            if(rowGroup.id.length != 0){
              tarjetaAsistenciaItem.ejgAnioNumero = row.cells[2].value;
              tarjetaAsistenciaItem.ejgAnio = row.cells[2].value.split('/')[0].substring(1);
              tarjetaAsistenciaItem.ejgNumero = row.cells[2].value.split('/')[1];
            }
            tarjetaAsistenciaItem.nif = row.cells[0].value[0];
            tarjetaAsistenciaItem.nombre = row.cells[0].value[3];
            tarjetaAsistenciaItem.apellido1 = row.cells[0].value[1];
            tarjetaAsistenciaItem.apellido2 = row.cells[0].value[2];
            tarjetaAsistenciaItem.sexo = row.cells[0].value[4];
            if(row.cells[1].value[0]){
              tarjetaAsistenciaItem.idDelito = row.cells[1].value[0];
            }
            tarjetaAsistenciaItem.observaciones = row.cells[1].value[1];
          }

          if(row.cells[3].value){
            actuacionAsistenciaItem.fechaActuacion = this.datepipe.transform(row.cells[3].value, 'dd/MM/yyyy HH:mm');
          }
          actuacionAsistenciaItem.comisariaJuzgado = row.cells[4].value[3];
          actuacionAsistenciaItem.lugar = row.cells[4].value[4];
          actuacionAsistenciaItem.numeroAsunto = row.cells[5].value;
          actuacionAsistenciaItem.fechaJustificacion = this.resultadoAE.fechaJustificacion;
          tarjetaAsistenciaItem.actuaciones.push(actuacionAsistenciaItem);

        })

        if(!this.filtrosAE.filtro.isSustituto){
          tarjetaAsistenciaItem.filtro.isSustituto = 'N';
        }
        tarjetasAsistenciaItem.push(tarjetaAsistenciaItem);
        
      });

    }

    if(tarjetasAsistenciaItem.length != 0
      && this.validateTableData(tarjetasAsistenciaItem)){
      this.sigaServices
      .post("busquedaGuardias_guardarAsistencias", tarjetasAsistenciaItem)
      .subscribe(
        n => {
          let result = JSON.parse(n["body"]);
          if(result.error){
            this.showMsg('error', this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.errorguardar"), result.error.description);
          }else{
            this.showMsg('success', this.translateService.instant("general.message.accion.realizada"), '');
            this.getComboComisarias();
          }
          
        },
        err => {
          if(err.status = "409"){
            this.showMsg('error', 'El usuario es colegiado y no existe una guardia para la fecha seleccionada. No puede continuar', '');
          }else{
            this.showMsg('error', this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.errorguardar"), '');
          }
          //console.log(err);
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        }
      );
    }
  }

  validateTableData(arrayAsistencias : TarjetaAsistenciaItem[]) : boolean{

    let valid = true;

    arrayAsistencias.forEach(asistencia =>{

      //Si rellenamos algun dato obligatorio del justiciable y los demas obligatorios no estan rellenos avisamos
      if((asistencia.nif || asistencia.nombre || asistencia.apellido1) 
      && (!asistencia.nif || !asistencia.nombre || !asistencia.apellido1)){

        this.showMsg('error',this.translateService.instant("formacion.mensaje.general.mensaje.error"), this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.errorjusticiablereq"));
        this.progressSpinner = false;
        valid = false;

      }

      if(valid){

        asistencia.actuaciones.forEach(actuacion =>{
          //La fecha actuacion es obligatoria
          if(!actuacion.fechaActuacion && valid){
            this.showMsg('error',this.translateService.instant("formacion.mensaje.general.mensaje.error"),this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.fechaactuacionobl"));
            this.progressSpinner = false;
            valid = false;
          }else if(valid && actuacion.fechaJustificacion){
            let fechaActuacionDate : Date = moment([Number(actuacion.fechaActuacion.split('/')[2].split(' ')[0]), Number(actuacion.fechaActuacion.split('/')[1])-1,Number(actuacion.fechaActuacion.split('/')[0])]).toDate();
            let fechaJustificacionDate : Date = moment(actuacion.fechaJustificacion,'DD/MM/YYYY').toDate();
            //La fecha justificacion no puede ser anterior a la fecha actuacion
            if(fechaJustificacionDate < fechaActuacionDate){
              this.showMsg('error',this.translateService.instant("formacion.mensaje.general.mensaje.error"), this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.errorfechajustif"));
              this.progressSpinner = false;
              valid = false;
            }
          }
        });

      }

    });

    return valid;
  }

  refreshInitialRowGroup(event){

    if(event && this.resultModified){
      this.initialRowGroups = this.trdService.getTableData(this.resultModified);
    }
  }

  searchAsistencias(){
    if(this.checkFilters()){
      this.hideResponse();
      let filtroAsistenciaItem = Object.assign({},this.filtro.filtro);
      if(this.filtro.filtro.idTurno   && this.filtro.filtro.idTurno.length > 0){
        filtroAsistenciaItem.idTurno = this.filtro.filtro.idTurno.toString();
      }else{
        filtroAsistenciaItem.idTurno = ""
      }
      if(this.filtro.filtro.idGuardia   && this.filtro.filtro.idGuardia.length > 0){
        filtroAsistenciaItem.idGuardia = this.filtro.filtro.idGuardia.toString();
      }else{
        filtroAsistenciaItem.idGuardia = ""
      }
      if(this.filtro.filtro.idOrigenAsistencia  && this.filtro.filtro.idOrigenAsistencia.length > 0){
        filtroAsistenciaItem.idOrigenAsistencia = this.filtro.filtro.idOrigenAsistencia.toString(); 
      }else{
        filtroAsistenciaItem.idOrigenAsistencia = ""
      }
      if(this.filtro.filtro.idEstadoAsistencia   && this.filtro.filtro.idEstadoAsistencia.length > 0){
        filtroAsistenciaItem.idEstadoAsistencia = this.filtro.filtro.idEstadoAsistencia.toString();  
      }else{
        filtroAsistenciaItem.idEstadoAsistencia = ""
      }
      if(this.filtro.filtro.idEstadoAsistido   && this.filtro.filtro.idEstadoAsistido.length > 0){
        filtroAsistenciaItem.idEstadoAsistido = this.filtro.filtro.idEstadoAsistido.toString();
      }else{
        filtroAsistenciaItem.idEstadoAsistido = ""
      }
      if(this.filtro.filtro.idComisaria  && this.filtro.filtro.idComisaria.length > 0){
        filtroAsistenciaItem.idComisaria = this.filtro.filtro.idComisaria.toString();
      }else{
        filtroAsistenciaItem.idComisaria = ""
      }
      if(this.filtro.filtro.idJuzgado   && this.filtro.filtro.idJuzgado.length > 0){
        filtroAsistenciaItem.idJuzgado = this.filtro.filtro.idJuzgado.toString();
      }else{
        filtroAsistenciaItem.idJuzgado = ""
      }
      if(this.filtro.filtro.idProcedimiento   && this.filtro.filtro.idProcedimiento.length > 0){
        filtroAsistenciaItem.idProcedimiento = this.filtro.filtro.idProcedimiento.toString();
      }else{
        filtroAsistenciaItem.idProcedimiento = ""
      }
      if(this.filtro.filtro.idTipoActuacion  && this.filtro.filtro.idTipoActuacion.length > 0){
        filtroAsistenciaItem.idTipoActuacion = this.filtro.filtro.idTipoActuacion.toString();
      }else{
        filtroAsistenciaItem.idTipoActuacion = ""
      }
      if(this.filtro.filtro.idActuacionValidada  && this.filtro.filtro.idActuacionValidada.length > 0){
        filtroAsistenciaItem.idActuacionValidada = this.filtro.filtro.idActuacionValidada.toString();
      }else{
        filtroAsistenciaItem.idActuacionValidada = ""
      }
      
      setTimeout(()=>{
        if(this.modoBusqueda == 'a' && this.filtro && this.filtro.filtro){
          this.progressSpinner = true;
          this.sigaServices
          .post("busquedaGuardias_buscarAsistencias", filtroAsistenciaItem)
          .subscribe(
            n => {
              let asistenciasDTO = JSON.parse(n["body"]);
              if(asistenciasDTO.error && asistenciasDTO.error.code != 200){
                this.showMsg('error', this.translateService.instant("informesycomunicaciones.modelosdecomunicacion.errorResultados"), asistenciasDTO.error.description);
              }else if(asistenciasDTO.tarjetaAsistenciaItems.length === 0){
                this.showMsg('info','Info',this.translateService.instant("informesYcomunicaciones.consultas.mensaje.sinResultados"));
              }else{
                if(asistenciasDTO.error && asistenciasDTO.error.code == 200){ //Todo ha ido bien pero la consulta ha excedido los registros maximos
                  this.showMsg('info', 'Info', asistenciasDTO.error.description);
                }
                let asistenciaItems: TarjetaAsistenciaItem[] = asistenciasDTO.tarjetaAsistenciaItems;
                this.filtro.filtroAux = Object.assign({},this.filtro.filtro);
                this.asistencias = asistenciaItems;
                this.showResponse();
              }    
              this.progressSpinner = false;
            },
            err => {
              //console.log(err);
            },
            () =>{
              this.progressSpinner = false;
              setTimeout(() => {
                this.commonServices.scrollTablaFoco('tablaFoco2');
              }, 5);
            }
          );
        }
      },500) 
    }
    
  }

  resetFiltros(){
    if(!this.filtro.filtroAux.anio){
      this.filtro.filtro = new FiltroAsistenciaItem();
      this.filtro.usuarioBusquedaExpress.nombreAp = '';
      this.filtro.usuarioBusquedaExpress.numColegiado = '';
      this.filtro.filtro.anio = String(new Date().getFullYear());
    }else{
      this.filtro.filtro = Object.assign({},this.filtro.filtroAux);
    }
  }

  nuevaAsistencia(){
    sessionStorage.setItem("nuevaAsistencia","true");
    sessionStorage.setItem("filtroAsistencia",JSON.stringify(this.filtro.filtro));
    sessionStorage.setItem("modoBusqueda","a");
    this.router.navigate(["/fichaAsistencia"]);
  }

  searchAsistenciasEvent(event){
    if(event){
      this.searchAsistencias();
    }
  }

  checkFilters(){
    if ((this.filtro.filtro.idTurno == null || this.filtro.filtro.idTurno == undefined || this.filtro.filtro.idTurno.length == 0) &&
        (this.filtro.filtro.fechaAsistenciaDesde == null || this.filtro.filtro.fechaAsistenciaDesde == undefined || this.filtro.filtro.fechaAsistenciaDesde.trim() == "" )&&
        (this.filtro.filtro.fechaAsistenciaHasta == null || this.filtro.filtro.fechaAsistenciaHasta == undefined || this.filtro.filtro.fechaAsistenciaHasta.trim() == "" )&&    
        (this.filtro.filtro.idGuardia == null || this.filtro.filtro.idGuardia == undefined || this.filtro.filtro.idGuardia.length == 0) &&
        (this.filtro.filtro.idEstadoAsistencia == null || this.filtro.filtro.idEstadoAsistencia == undefined || this.filtro.filtro.idEstadoAsistencia.length == 0) &&
        (this.filtro.filtro.idActuacionValidada == null || this.filtro.filtro.idActuacionValidada == undefined || this.filtro.filtro.idActuacionValidada.length == 0) &&
        (this.filtro.filtro.idTipoAsistenciaColegiado == null || this.filtro.filtro.idTipoAsistenciaColegiado == undefined || this.filtro.filtro.idTipoAsistenciaColegiado.length == 0) &&
        (this.filtro.filtro.numero == null || this.filtro.filtro.numero == undefined || this.filtro.filtro.numero.trim() == "" || this.filtro.filtro.numero.trim().length < 3) &&
        (this.filtro.filtro.idOrigenAsistencia == null || this.filtro.filtro.idOrigenAsistencia == undefined || this.filtro.filtro.idOrigenAsistencia.length == 0) &&
        (this.filtro.filtro.nif == null || this.filtro.filtro.nif == undefined || this.filtro.filtro.nif.trim() == "" || this.filtro.filtro.nif.trim().length < 3) &&
        (this.filtro.filtro.apellidos == null || this.filtro.filtro.apellidos == undefined || this.filtro.filtro.apellidos.trim() == "" || this.filtro.filtro.apellidos.trim().length < 3) &&
        (this.filtro.filtro.nombre == null || this.filtro.filtro.nombre == undefined || this.filtro.filtro.nombre.trim() == "" || this.filtro.filtro.nombre.trim().length < 3) &&
        (this.filtro.filtro.idEstadoAsistido == null || this.filtro.filtro.idEstadoAsistido == undefined || this.filtro.filtro.idEstadoAsistido.length == 0) &&
        (this.filtro.filtro.numDiligencia == null || this.filtro.filtro.numDiligencia == undefined || this.filtro.filtro.numDiligencia.trim() == "" || this.filtro.filtro.numDiligencia.trim().length < 3) &&
        (this.filtro.filtro.numProcedimiento == null || this.filtro.filtro.numProcedimiento == undefined || this.filtro.filtro.numProcedimiento.trim() == "" || this.filtro.filtro.numProcedimiento.trim().length < 3) &&
        (this.filtro.filtro.idComisaria == null || this.filtro.filtro.idComisaria == undefined || this.filtro.filtro.idComisaria.length == 0) &&
        (this.filtro.filtro.idJuzgado == null || this.filtro.filtro.idJuzgado == undefined || this.filtro.filtro.idJuzgado.length == 0) &&
        (this.filtro.filtro.idTipoActuacion == null || this.filtro.filtro.idTipoActuacion == undefined || this.filtro.filtro.idTipoActuacion.length == 0) &&
        (this.filtro.filtro.idProcedimiento == null || this.filtro.filtro.idProcedimiento == undefined || this.filtro.filtro.idProcedimiento.length == 0) &&
        (this.filtro.filtro.nig == null || this.filtro.filtro.nig == undefined || this.filtro.filtro.nig.trim() == "" || this.filtro.filtro.nig.trim().length < 3) &&
        (this.filtro.filtro.anio == null || this.filtro.filtro.anio == undefined )) {
        
        this.showMsg("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("cen.busqueda.error.busquedageneral"));
        return false;
      } else {   
        // quita espacios vacios antes de buscar
        if (this.filtro.filtro.anio != undefined && this.filtro.filtro.anio != null) {
          this.filtro.filtro.anio = this.filtro.filtro.anio;
        }
        if (this.filtro.filtro.numero != undefined && this.filtro.filtro.numero != null) {
          this.filtro.filtro.numero = this.filtro.filtro.numero.trim();
        }
        if (this.filtro.filtro.nig != undefined && this.filtro.filtro.nig != null) {
          this.filtro.filtro.nig = this.filtro.filtro.nig.trim();
        }
        if (this.filtro.filtro.apellidos != undefined && this.filtro.filtro.apellidos != null) {
          this.filtro.filtro.apellidos = this.filtro.filtro.apellidos.trim();
        }
        if (this.filtro.filtro.nombre != undefined && this.filtro.filtro.nombre != null) {
          this.filtro.filtro.nombre = this.filtro.filtro.nombre.trim();
        }
        if (this.filtro.filtro.nif != undefined && this.filtro.filtro.nif != null) {
          this.filtro.filtro.nif = this.filtro.filtro.nif.trim();
        }
        return true;
      }
    }

    letradoFillAutomatic(event){
      this.letradoFillAutomaticamente = event;
    }

    buscarAE(){
      this.getComboComisariasOnly();
      this.getComboJuzgados();
      this.show = true;
      if (this.letradoFillAutomaticamente){
        this.search();
      }else{
        this.checkSustitutoCheckBox();
      }
    }
}
