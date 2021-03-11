import { Component, Input, OnInit } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { TranslateService } from '../../../../../commons/translate';

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
  
  expanded = true;

  @Input() modoBusqueda;

  progressSpinner: boolean = false;
  showDesignas: boolean = false;
  showJustificacionExpress: boolean = false;

  radioTarjeta: string = 'designas';

  constructor(private router: Router, private translateService: TranslateService) { }

  ngOnInit(): void {
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
}
