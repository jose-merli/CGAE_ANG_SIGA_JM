import { Component, OnInit, ViewChild } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { ActivatedRoute } from '@angular/router';
import { BuscadorAsistenciaExpresComponent } from './buscador-asistencia-expres/buscador-asistencia-expres.component';
import { SigaServices } from '../../../../../_services/siga.service';
import { FiltroAsistenciaItem } from '../../../../../models/guardia/FiltroAsistenciaItem';
import { ResultadoAsistenciaExpresComponent } from '../resultado-asistencia-expres/resultado-asistencia-expres.component';
import { Cell, Row, RowGroup, TablaResultadoDesplegableAEService } from '../../../../../commons/tabla-resultado-desplegable/tabla-resultado-desplegable-ae.service';
import { CommonsService } from '../../../../../_services/commons.service';

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
  rutas: string[] = ['SJCS', 'Guardia', 'Asistencias'];
  radios = [
    { label: 'Búsqueda de Asistencias', value: 'a' },
    { label: 'Asistencia Exprés', value: 'b' }
  ];
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

  @ViewChild(BuscadorAsistenciaExpresComponent) filtros: BuscadorAsistenciaExpresComponent;
  @ViewChild(ResultadoAsistenciaExpresComponent) resultado: ResultadoAsistenciaExpresComponent;
  constructor(private activatedRoute: ActivatedRoute,
    private sigaServices: SigaServices,
    private trdService: TablaResultadoDesplegableAEService,
    private commonServices: CommonsService) { }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.queryParamMap.get('searchMode') != null &&
      this.activatedRoute.snapshot.queryParamMap.get('searchMode') != undefined
      && this.activatedRoute.snapshot.queryParamMap.get('searchMode') != ''
      && this.activatedRoute.snapshot.queryParamMap.get('searchMode') == 'a') {

      this.modoBusqueda = 'a';

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

  checkSustitutoCheckBox(){

    this.showSustitutoDialog = true;
    if(this.filtros.filtro.isSustituto){
        this.mensajeSustitutoDialog = "Se va a sustituir al letrado de guardia. ¿Desea continuar?";
    }else{
        this.mensajeSustitutoDialog = "Se va a añadir el letrado como refuerzo en la guardia. ¿Desea continuar?";
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
    
  }

  validateForm(){
    if(!this.filtros.filtro.diaGuardia
      || !this.filtros.filtro.idGuardia
      || !this.filtros.filtro.idLetradoGuardia
      || !this.filtros.filtro.idTurno){
        this.showMsg('error', 'Error', 'Debe rellenar los campos obligatorios');
      }
  }

  search(){
    this.sigaServices
      .post("busquedaGuardias_buscarAsistencias", this.filtros.filtro)
      .subscribe(
        n => {
          let asistenciasDTO = JSON.parse(n["body"]);
          if(asistenciasDTO.tarjetaAsistenciaItems.length === 0){
            this.showMsg('info','Resultado búsqueda','No se han encontrado asistencias con los parámetros introducidos');
          }else{
            this.fromJsonToRowGroups(asistenciasDTO.tarjetaAsistenciaItems);
          }    
          this.progressSpinner = false;
        },
        err => {
          console.log(err);
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
        if(asistencia.asistido){
          nombreApellidosType = 'text';
          nombreApellidosValue = asistencia.asistido;
        }else{
          nombreApellidosType = '5InputSelector';
          nombreApellidosValue = [asistencia.nif, asistencia.apellido1, asistencia.apellido2, asistencia.nombre, asistencia.sexo];
        }

        if(asistencia.idDelito
            || asistencia.observaciones){
          delitosObservacionesValue = [asistencia.idDelito, asistencia.observaciones];
        }else{
          delitosObservacionesValue = ['',''];
        }

        if(asistencia.ejgAnioNumero){
          ejgValue = asistencia.ejgAnioNumero;
        }else{
          ejgValue = '';
        }

        if(actuacion.fechaActuacion){
          fechaActuacionType = 'text';
          fechaActuacionValue = actuacion.fechaActuacion;
        }else{
          fechaActuacionType = 'datePicker';
          fechaActuacionValue = '';
        }

        if(actuacion.lugar){
          lugarType = 'textTooltip'
          lugarValue = ['', actuacion.lugar];
        }else{
          lugarType = 'buttomSelect';
          lugarValue = ['C / J',
                          {
                            opciones: this.comboComisarias
                          },
                          {
                            opciones: this.comboJuzgados
                          }
                          , 'C'
                        ];
        }

        if(actuacion.numeroAsunto){
          nDiligenciaType = 'number';
          nDiligenciaValue = actuacion.numeroAsunto;
        }else{
          nDiligenciaType = 'input';
          nDiligenciaValue = '';
        }

        let arrayDatosActuacion =
        [
          {type: nombreApellidosType, value: nombreApellidosValue, combo: this.comboSexo},
          {type: '2SelectorInput', value: delitosObservacionesValue, combo: this.comboDelitos},
          {type: 'text', value: ejgValue},
          {type: fechaActuacionType, value: fechaActuacionValue},
          {type: lugarType, value: lugarValue},
          {type: nDiligenciaType, value: nDiligenciaValue}
        ]
        
        let key = letra + 1;
        objetoActuacion = {[key] : arrayDatosActuacion};
        arrayActuaciones.push(Object.assign({},objetoActuacion));
      });

      objetoAsistencia = {[asistencia.anioNumero] : arrayActuaciones};
      arrayAsistencias.push(Object.assign({}, objetoAsistencia));
    });

    let resultModified = Object.assign({},{'data':arrayAsistencias});

    this.rowGroups = this.trdService.getTableData(resultModified);
    this.rowGroupsAux = this.trdService.getTableData(resultModified);
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
      }
    );
  }

}
