import { Component, Input, OnInit } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { Message } from "primeng/components/common/api";
import { TranslateService } from '../../../../../commons/translate';
import { DesignaItem } from '../../../../../models/sjcs/DesignaItem';
import { JustificacionExpressItem } from '../../../../../models/sjcs/JustificacionExpressItem';

@Component({
  selector: 'app-filtro-designaciones',
  templateUrl: './filtro-designaciones.component.html',
  styleUrls: ['./filtro-designaciones.component.scss']
})
export class FiltroDesignacionesComponent implements OnInit {
  
  usuarioBusquedaExpress = {
    numColegiado: '',
    nombreAp: ''
  };
  
  filtroJustificacion: JustificacionExpressItem = new JustificacionExpressItem();

  expanded: boolean = true;

  @Input() modoBusqueda;

  progressSpinner: boolean = false;
  showDesignas: boolean = false;
  showJustificacionExpress: boolean = false;

  radioTarjeta: string = 'designas';
  //Variables busqueda designas
  msgs: Message[] = [];
  body: DesignaItem = new DesignaItem();
  fechaAperturaHastaSelect: Date;
  fechaAperturaDesdeSelect: Date;
  comboEstados: any[];

  constructor(private router: Router, private translateService: TranslateService) { }

  ngOnInit(): void {
    this.filtroJustificacion = new JustificacionExpressItem();

    this.progressSpinner=true;
    this.showDesignas = true;

    this.checkLastRoute();

    if (sessionStorage.getItem('esBuscadorColegiados') == "true" && sessionStorage.getItem('usuarioBusquedaExpress')) {
      this.usuarioBusquedaExpress = JSON.parse(sessionStorage.getItem('usuarioBusquedaExpress'));
    }

    //Inicializamos buscador designas
    this.getBuscadorDesignas();
  }

  changeFilters() {
    this.showDesignas=!this.showDesignas;
    this.showJustificacionExpress=!this.showJustificacionExpress;
  }

  checkLastRoute() {
    this.progressSpinner=false;
  }

  fillFechasJustificacion(event, campo) {
    if(campo=='justificacionDesde'){
      this.filtroJustificacion.justificacionDesde=event;
    }

    if(campo=='justificacionHasta'){
      this.filtroJustificacion.justificacionHasta=event;
    }

    if(campo=='designacionHasta'){
      this.filtroJustificacion.designacionHasta=event;
    }

    if(campo=='designacionDesde'){
      this.filtroJustificacion.designacionDesde=event;
    }
  }


  getBuscadorDesignas(){
    var today = new Date();
    var year = today.getFullYear().valueOf();
    this.body.ano = year;
    this.getComboEstados();
  }

  fillFechaAperturaDesde(event) {
    this.fechaAperturaDesdeSelect = event;
    if((this.fechaAperturaHastaSelect != null && this.fechaAperturaHastaSelect != undefined) && (this.fechaAperturaDesdeSelect > this.fechaAperturaHastaSelect)){
      this.msgs = [{severity: "error", summary: "Error", detail: this.translateService.instant('justiciaGratuita.sjcs.designas.mensaje.Fechas')}];
    }
  }

  fillFechaAperturaHasta(event) {
    this.fechaAperturaHastaSelect = event;
    if(this.fechaAperturaDesdeSelect > this.fechaAperturaHastaSelect ){
      this.msgs = [{severity: "error", summary: "Error", detail: this.translateService.instant('justiciaGratuita.sjcs.designas.mensaje.Fechas')}];
    }
  }

  getComboEstados() {
    this.comboEstados = [
      {label:'activo', value:'Activo'},
      {label:'finalizada', value:'Finalizada'},
      {label:'anulada', value:'Anulada'}
    ]
  }
}
