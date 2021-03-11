import { Component, Input, OnInit } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { TranslateService } from '../../../../../commons/translate';
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

  constructor(private router: Router, private translateService: TranslateService) { }

  ngOnInit(): void {
    this.filtroJustificacion = new JustificacionExpressItem();

    this.progressSpinner=true;
    this.showDesignas = true;

    this.checkLastRoute();

    if (sessionStorage.getItem('esBuscadorColegiados') == "true" && sessionStorage.getItem('usuarioBusquedaExpress')) {
      this.usuarioBusquedaExpress = JSON.parse(sessionStorage.getItem('usuarioBusquedaExpress'));
    }
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
}
