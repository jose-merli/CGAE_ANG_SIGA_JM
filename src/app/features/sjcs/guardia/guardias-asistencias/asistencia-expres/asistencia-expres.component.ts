import { Component, OnInit, ViewChild } from '@angular/core';
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
import moment = require('moment');
import { procesos_guardia } from '../../../../../permisos/procesos_guarida';
import { SigaStorageService } from '../../../../../siga-storage.service';

@Component({
  selector: 'app-asistencia-expres',
  templateUrl: './asistencia-expres.component.html',
  styleUrls: ['./asistencia-expres.component.scss']
})
export class AsistenciaExpresComponent implements OnInit {
  msgs: Message[] = [];
  show = false;
  cFormValidity = true;
  modoBusqueda = 'b';
  rowGroups : RowGroup[];
  rowGroupsAux: RowGroup[];
  initialRowGroups : RowGroup[];
  rutas: string[] = [];
  radios = [];
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
  @ViewChild(BuscadorAsistenciaExpresComponent) filtros: BuscadorAsistenciaExpresComponent;
  @ViewChild(ResultadoAsistenciaExpresComponent) resultado: ResultadoAsistenciaExpresComponent;
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
    if (this.activatedRoute.snapshot.queryParamMap.get('searchMode') != null &&
      this.activatedRoute.snapshot.queryParamMap.get('searchMode') != undefined
      && this.activatedRoute.snapshot.queryParamMap.get('searchMode') != ''
      && this.activatedRoute.snapshot.queryParamMap.get('searchMode') == 'a') {

      this.modoBusqueda = 'a';

    }
    this.isLetrado = this.sigaStorageService.isLetrado;

    this.commonServices.checkAcceso(procesos_guardia.asistencias_express)
    .then(respuesta => {

      this.permisoEscrituraAE = respuesta;

      this.persistenceService.setPermisos(this.permisoEscrituraAE);

       if (this.permisoEscrituraAE == undefined) {
         sessionStorage.setItem("codError", "403");
         sessionStorage.setItem(
           "descError",
           this.translateService.instant("generico.error.permiso.denegado")
         );
         this.router.navigate(["/errorAcceso"]);
       }

    }).catch(error => console.error(error));

    this.radios = [
                    { label: this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.busquedaasistencias"), value: 'a' },
                    { label: this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.titulo"), value: 'b' }
                  ];
    this.rutas = ['SJCS', this.translateService.instant("menu.justiciaGratuita.GuardiaMenu"), this.translateService.instant("menu.justiciaGratuita.asistencia")];

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

  checkSustitutoCheckBox(){
    if(this.validateForm()){
      this.showSustitutoDialog = true;
      if(this.filtros.filtro.isSustituto){
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

    this.filtros.comboGuardias = [];
    this.filtros.comboLetradosGuardia = [];
    this.filtros.comboTiposAsistencia = [];
    this.filtros.comboTurnos = [];
    this.filtros.filtro.diaGuardia = '';
    this.filtros.filtro.idGuardia = '';
    this.filtros.filtro.idLetradoGuardia = '';
    this.filtros.filtro.idTurno = '';
    this.filtros.filtro.isSustituto = false;
    this.filtros.filtro.idTipoAsistenciaColegiado = '';
    this.filtros.resaltadoDatos = true;
    
  }

  validateForm(){
    let ok : boolean = true;
    if(!this.filtros.filtro.diaGuardia
      || !this.filtros.filtro.idGuardia
      || !this.filtros.filtro.idLetradoGuardia
      || !this.filtros.filtro.idTurno){
        this.showMsg('error', 'Error', this.translateService.instant("general.message.camposObligatorios"));
        ok = false;
      }
    return ok;
  }

  search(){
    this.filtros.filtroAux = this.filtros.filtro;
    this.hideResponse();
    this.sigaServices
      .post("busquedaGuardias_buscarAsistencias", this.filtros.filtro)
      .subscribe(
        n => {
          let asistenciasDTO = JSON.parse(n["body"]);
          if(asistenciasDTO.error){
            this.showMsg('error', this.translateService.instant("informesycomunicaciones.modelosdecomunicacion.errorResultados"), asistenciasDTO.error.description);
          }else if(asistenciasDTO.tarjetaAsistenciaItems.length === 0){
            this.showMsg('info','Info',this.translateService.instant("informesYcomunicaciones.consultas.mensaje.sinResultados"));
          }else{
            this.fromJsonToRowGroups(asistenciasDTO.tarjetaAsistenciaItems);
          }    
          this.progressSpinner = false;
        },
        err => {
          console.log(err);
        },
        () =>{
          this.progressSpinner = false;
        }
      );
  }

  fromJsonToRowGroups(asistencias){

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
              let comboDelitosValue = '';
              if(asistencia.idDelito){
                comboDelitosValue = asistencia.idDelito;
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
        fechaActuacionValue = new Date(Date.parse(actuacion.fechaActuacion));

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
            {type: 'invisible', value: '', combo: this.comboSexo},
            {type: 'invisible', value: '', combo: this.comboDelitos},
            {type: 'invisible', value: ''},
            {type: fechaActuacionType, value: fechaActuacionValue, showTime: true},
            {type: lugarType, value: lugarValue},
            {type: nDiligenciaType, value: nDiligenciaValue}
          ]
        }else{
          arrayDatosActuacion =
          [
            {type: nombreApellidosType, value: nombreApellidosValue, combo: this.comboSexo, size: 445.5},
            {type: '2SelectorInput', value: delitosObservacionesValue, combo: this.comboDelitos, size: 225.75},
            {type: 'text', value: ejgValue, size: 225.75},
            {type: fechaActuacionType, value: fechaActuacionValue, showTime: true, size: 225.75},
            {type: lugarType, value: lugarValue, size: 225.75},
            {type: nDiligenciaType, value: nDiligenciaValue, size: 225.75}
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

    this.sigaServices.getParam("busquedaGuardias_getJuzgados","?idTurno="+this.filtros.filtro.idTurno).subscribe(
      n => {
        this.clear();
        if(n.error !== null
          && n.error.code === 500){
          this.showMsg("error", "Error", n.error.description.toString());
        }else{

          this.comboJuzgados = n.combooItems;
          this.commonServices.arregloTildesCombo(this.comboJuzgados);
          this.search()
        }
      },
      err => {
        console.log(err);
      }
    );

  }
  getComboComisarias(){

    this.sigaServices.getParam("busquedaGuardias_getComisarias","?idTurno="+this.filtros.filtro.idTurno).subscribe(
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
        console.log(err);
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
        console.log(err);
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
        tarjetaAsistenciaItem.filtro = this.filtros.filtroAux;
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
          actuacionAsistenciaItem.fechaJustificacion = this.resultado.fechaJustificacion;
          tarjetaAsistenciaItem.actuaciones.push(actuacionAsistenciaItem);

        })

        if(this.filtros.filtro.isSustituto == undefined){
          tarjetaAsistenciaItem.filtro.isSustituto = false;
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
          }
          
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
            let fechaActuacionDate : Date = moment(actuacion.fechaActuacion,'DD/MM/YYYY HH:mm').toDate();
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

}
