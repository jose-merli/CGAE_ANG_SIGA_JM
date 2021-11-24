import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MultiSelect } from 'primeng/multiselect';
import { TranslateService } from '../../../../../commons/translate';
import { CertificacionFacItem } from '../../../../../models/sjcs/CertificacionFacItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-filtro-certificacion-fac',
  templateUrl: './filtro-certificacion-fac.component.html',
  styleUrls: ['./filtro-certificacion-fac.component.scss']
})
export class FiltroCertificacionFacComponent implements OnInit {

  filtros = new CertificacionFacItem;
  progressSpinnerFiltro: boolean = false;
  comboEstado=[];
  comboColegios = [];
  comboConceptoServicios = [];
  comboGrupoFacturacion=[];
  comboPartidaPresupuestaria=[];
  disableComboFact: boolean;

  showDatosJustificacion: boolean = true;


  @Output() busqueda = new EventEmitter<boolean>();
  @Output() nuevo = new EventEmitter<boolean>();
  @Input() permisoEscritura;
  @Input() disableColegio;
  msgs: any[];

  constructor(private translateService: TranslateService,
		private sigaServices: SigaServices,
		private commonsService: CommonsService,
		private persistenceService: PersistenceService,
		private router: Router) { }

  ngOnInit() {

    this.progressSpinnerFiltro = true;

    this.getComboEstado();
    this.getComboColegios();
    this.getComboConceptosServicios();
    this.getComboPartidaPresupuestaria();

    if(this.filtros.idColegio != null || this.filtros.idColegio != undefined){
      this.selectComboFacturacion(this.filtros.idColegio);
    }

    this.progressSpinnerFiltro = false;
    
  }


  getComboColegios(){

    this.progressSpinnerFiltro = true;

    this.sigaServices.get("combo_comboColegios").subscribe(
      data => {
        this.comboColegios = data.combooItems;
        this.commonsService.arregloTildesCombo(this.comboColegios);
      }
    );

    
  }

  getComboEstado(){

  }

  getComboConceptosServicios(){
    this.progressSpinnerFiltro = true;

    this.sigaServices.get("combo_comboFactConceptos").subscribe(
      data => {
        this.comboConceptoServicios = data.combooItems;
        this.commonsService.arregloTildesCombo(this.comboConceptoServicios);
        this.progressSpinnerFiltro = false;
      },
      err => {
        console.log(err);
        this.progressSpinnerFiltro = false;
      }
    );

  }

  selectComboFacturacion(idColegio){
    if(idColegio != null || idColegio != undefined){
      this.getComboGrupoFacturacion(idColegio);
      this.disableComboFact = false
    }else{
      this.disableComboFact = true
    }
  }

  getComboGrupoFacturacion(idColegio){

    this.progressSpinnerFiltro = true;

    this.sigaServices.getParam("combo_grupoFacturacionByColegio", "?idColegio=" + idColegio).subscribe(
      data => {
        this.comboGrupoFacturacion = data.combooItems;
        this.commonsService.arregloTildesCombo(this.comboGrupoFacturacion);
        this.progressSpinnerFiltro = false;
      },
      err => {
        console.log(err);
        this.progressSpinnerFiltro = false;
      }
    );
  }

  getComboPartidaPresupuestaria(){
    this.progressSpinnerFiltro = true;

    this.sigaServices.get("combo_partidasPresupuestarias").subscribe(
      data => {
        this.comboPartidaPresupuestaria = data.combooItems;
        this.commonsService.arregloTildesCombo(this.comboPartidaPresupuestaria);
        this.progressSpinnerFiltro = false;
      },
      err => {
        console.log(err);
        this.progressSpinnerFiltro = false;
      }
    );

  }

  newCer(){
    this.nuevo.emit(true);
  }

  buscarCert(){
    this.busqueda.emit(true);
  }

  fillFechaHasta(event){
    this.filtros.fechaHasta = event;
  }

  fillFechaDesde(event){
    this.filtros.fechaDesde = event;
			if (this.filtros.fechaHasta < this.filtros.fechaDesde) {
				this.filtros.fechaHasta = undefined;
			}
  }

  restablecer(){
    this.filtros = new CertificacionFacItem;
  }

  showMessage(severity, summary, msg) {
		this.msgs = [];
		this.msgs.push({
			severity: severity,
			summary: summary,
			detail: msg
		});
	}


	clear() {
		this.msgs = [];
	}

  onHideDatosJustificacion() {
		this.showDatosJustificacion = !this.showDatosJustificacion;
	}

  onChangeMultiSelect(event, filtro) {
		if (undefined != event.value && event.value.length == 0) {
			this.filtros[filtro] = undefined;
		}
	}

  onChangeColegio(event){
    this.filtros.idColegio = event.value;
    this.selectComboFacturacion(this.filtros.idColegio);
  }
}
