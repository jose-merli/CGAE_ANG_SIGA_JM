import { Component, OnInit } from '@angular/core';
import { TranslateService } from '../../../../../commons/translate';
import { GuardiaColegiadoItem } from '../../../../../models/guardia/GuardiaColegiadoItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-filtros-guardia-colegiado',
  templateUrl: './filtros-guardia-colegiado.component.html',
  styleUrls: ['./filtros-guardia-colegiado.component.scss']
})
export class FiltrosGuardiaColegiadoComponent implements OnInit {
  msgs;
  progressSpinner: boolean = false;
  showDatosGenerales: boolean = false;
  body;
  filtros = new GuardiaColegiadoItem();
  comboTurno;
  comboGuardia;
  isDisabledGuardia;
  comboValidar;
  disabledBusquedaExpress: boolean=false;
  usuarioBusquedaExpress = {
    numColegiado: '',
    nombreAp: ''
  };
  constructor(private sigaServices: SigaServices,
    private translateService: TranslateService,
    private persistenceService: PersistenceService,
    private commonServices: CommonsService) { }

  ngOnInit() {
    this.showDatosGenerales = true;
    if(sessionStorage.getItem("buscadorColegiados")){
      let busquedaColegiado = JSON.parse(sessionStorage.getItem("buscadorColegiados"));
      sessionStorage.removeItem("buscadorColegiados");

      this.usuarioBusquedaExpress.nombreAp=busquedaColegiado.nombre+" "+busquedaColegiado.apellidos;
      this.usuarioBusquedaExpress.numColegiado=busquedaColegiado.nColegiado;
    }
  }

  search(event){
    if(this.usuarioBusquedaExpress.numColegiado!=undefined && this.usuarioBusquedaExpress.numColegiado!=null 
      && this.usuarioBusquedaExpress.numColegiado.trim()!=""){
        this.filtros.numeroColegiado=this.usuarioBusquedaExpress.numColegiado;
    }
    console.log(this.filtros);
  }

  onChangeTurnos(){

  }

  changeColegiado(event){
    this.usuarioBusquedaExpress.nombreAp = event.nombreAp;
    this.usuarioBusquedaExpress.numColegiado = event.nColegiado;
  }

  clear() {
    this.msgs = [];
  }

  rest(){
    this.usuarioBusquedaExpress.nombreAp = '';
    this.usuarioBusquedaExpress.numColegiado = '';
    this.filtros = new GuardiaColegiadoItem();
  }

  fillFechaDesde(event){
    this.filtros.fechaInicio = event;
  }

  fillFechaHasta(event){
    this.filtros.fechaFin = event;
  }

  showMessage(event) {
    this.msgs = [];
    this.msgs.push({
      severity: event.severity,
      summary: event.summary,
      detail: event.msg
    });
  }
  showMessageError(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

   // Control de fechas
   getFechaHastaCalendar(fechaInputDesde, fechainputHasta) {
    if (
      fechaInputDesde != undefined &&
      fechainputHasta != undefined
    ) {
      let one_day = 1000 * 60 * 60 * 24;

      // convertir fechas en milisegundos
      let fechaDesde = new Date(fechaInputDesde).getTime();
      let fechaHasta = new Date(fechainputHasta).getTime();
      let msRangoFechas = fechaHasta - fechaDesde;

      if (msRangoFechas < 0) fechainputHasta = undefined;
    }
    return fechainputHasta;
  }

  getFechaDesdeCalendar(fechaInputesde, fechaInputHasta) {
    if (
      fechaInputesde != undefined &&
      fechaInputHasta != undefined
    ) {
      let one_day = 1000 * 60 * 60 * 24;

      // convertir fechas en milisegundos
      let fechaDesde = new Date(fechaInputesde).getTime();
      let fechaHasta = new Date(fechaInputHasta).getTime();
      let msRangoFechas = fechaHasta - fechaDesde;

      if (msRangoFechas < 0) fechaInputesde = undefined;
    }
    return fechaInputesde;
  }

}
