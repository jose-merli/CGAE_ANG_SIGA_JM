import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { SigaWrapper } from "../../../../../wrapper/wrapper.class";
import { USER_VALIDATIONS } from "../../../../../properties/val-properties";
import { Calendar, ConfirmationService } from 'primeng/primeng';
import { SigaServices } from '../../../../../_services/siga.service';
import { esCalendar, catCalendar, euCalendar, glCalendar } from '../../../../../utils/calendar';
import { CommonsService } from '../../../../../_services/commons.service';
import { ComboItem } from '../../../../../models/ComboItem';
import { FacturacionItem } from "../../../../../models/sjcs/FacturacionItem";
import { FacturacionDTO } from '../../../../../models/sjcs/FacturacionDTO';
import { Router } from '@angular/router';
import { TranslateService } from '../../../../../commons/translate';
import { PersistenceService } from '../../../../../_services/persistence.service';
import * as moment from 'moment';

@Component({
	selector: 'app-filtro-busqueda-facturacion',
	templateUrl: './filtro-busqueda-facturacion.component.html',
  	styleUrls: ['./filtro-busqueda-facturacion.component.scss']
})
export class FiltroBusquedaFacturacionComponent extends SigaWrapper implements OnInit {
	//FECHAS
	value: Date;
	valueChangeSelected = new EventEmitter();
	valueChangeInput = new EventEmitter();
	valueFocus = new EventEmitter();
	es: any = esCalendar;
	fechaSelectedFromCalendar: boolean = false;
	currentLang;
	yearRange: string;
	minDate: Date;
	maxDate: Date;
	disabled: boolean;
	showTime: boolean;
	calendar: Calendar;
	first: boolean = true;

	//COMBOS
	estadoFacturas: ComboItem;
	conceptos: ComboItem;
	grupoTurnos: ComboItem;
	partidaPresupuestaria: ComboItem;
	msgs: any[];
	buscar: boolean = false;
	selectedValue: string="facturacion";
	showFiltroBusquedaFacturacion: boolean = true; 
	
	@Output() buscarFacturacion = new EventEmitter<boolean>();

	@Input() permisos;

	filtros: FacturacionItem = new FacturacionItem();
	filtrosAux: FacturacionItem = new FacturacionItem();

	constructor(private router: Router,
		private sigaService: SigaServices,
		private translateService: TranslateService,
		private persistenceService: PersistenceService,
		private confirmationService: ConfirmationService,
		private commonsService: CommonsService) { 
		super(USER_VALIDATIONS);
	}

	ngOnInit() {
		this.getRangeYear();
		this.comboFactEstados();
		this.comboPartidasPresupuestarias();
		this.comboGrupoTurnos();
		this.comboFactConceptos();

		if (this.persistenceService.getPermisos() != undefined) {
			this.permisos = this.persistenceService.getPermisos();
		}
	  
		if (this.persistenceService.getFiltros() != undefined) {
			this.filtros = this.persistenceService.getFiltros();
			if (this.persistenceService.getHistorico() != undefined) {
			  this.buscarFacturacion.emit(this.persistenceService.getHistorico());
			}else {
			  this.isBuscar();
			}
		  } else {
			this.filtros = new FacturacionItem();
		  }
	}

	ngAfterViewInit(): void {
		this.getLenguage();
	}

	getRangeYear() {
		let today = new Date();
		let year = today.getFullYear();
		this.yearRange = year - 80 + ':' + (year + 20);
	}

  	onHideDatosGenerales() {
    	this.showFiltroBusquedaFacturacion = !this.showFiltroBusquedaFacturacion;
  	}

  	borrarFecha() {
		this.value = null;
		this.valueChangeInput.emit(this.value);
		this.fechaSelectedFromCalendar = true;
		this.calendar.onClearButtonClick("");
	}

	comboFactEstados(){
		this.sigaService.get("combo_comboFactEstados").subscribe(
			data => {
			  this.estadoFacturas = data.combooItems;
			  this.commonsService.arregloTildesCombo(this.estadoFacturas);
			},	  
			err => {
			  console.log(err);
			}
		);
	}

	comboPartidasPresupuestarias(){
		this.sigaService.get("combo_partidasPresupuestarias").subscribe(
			data => {
			  this.partidaPresupuestaria = data.combooItems;
			  this.commonsService.arregloTildesCombo(this.partidaPresupuestaria);
			},	  
			err => {
			  console.log(err);
			}
		);
	}

	comboGrupoTurnos(){
		this.sigaService.get("combo_grupoFacturacion").subscribe(
			data => {
			  this.grupoTurnos = data.combooItems;
			  this.commonsService.arregloTildesCombo(this.grupoTurnos);
			},	  
			err => {
			  console.log(err);
			}
		);
	}

	comboFactConceptos(){
		this.sigaService.get("combo_comboFactConceptos").subscribe(
			data => {
			  this.conceptos = data.combooItems;
			  this.commonsService.arregloTildesCombo(this.conceptos);
			},	  
			err => {
			  console.log(err);
			}
		);
	}

  	getLenguage() {
		this.sigaService.get('usuario').subscribe((response) => {
			this.currentLang = response.usuarioItem[0].idLenguaje;

			switch (this.currentLang) {
				case '1':
					this.es = esCalendar;
					break;
				case '2':
					this.es = catCalendar;
					break;
				case '3':
					this.es = euCalendar;
					break;
				case '4':
					this.es = glCalendar;
					break;
				default:
					this.es = esCalendar;
					break;
			}
		});
  	}
  
	fechaHoy() {
		this.value = new Date();
		this.valueChangeSelected.emit(this.value);
		this.calendar.overlayVisible = false;
		this.fechaSelectedFromCalendar = true;
	}
	
	change(newValue) {
		//evento que cambia el value de la fecha
		if (!this.showTime) {
			this.fechaSelectedFromCalendar = true;
			this.value = new Date(newValue);
			let year = this.value.getFullYear();
			if (year >= year - 80 && year <= year + 20) {
				if (this.minDate) {
					if (this.value >= this.minDate) {
						this.valueChangeSelected.emit(this.value);
					} else {
						this.borrarFecha();
					}
				} else {
					this.valueChangeSelected.emit(this.value);
				}
			} else {
				this.borrarFecha();
			}
		} else {
			this.valueChangeSelected.emit(this.value);
		}
	}
	fillFechaDesde(event) {
		this.filtros.fechaDesde = event;
		if(this.filtros.fechaHasta < this.filtros.fechaDesde){
			this.filtros.fechaHasta = undefined;
		}
	  }

	  fillFechaHasta(event) {
		this.filtros.fechaHasta = event;
	  }


	isBuscar(){
		if (this.checkFilters()) {
			this.persistenceService.setFiltros(this.filtros);
			this.persistenceService.setFiltrosAux(this.filtros);
			this.filtrosAux = this.persistenceService.getFiltrosAux()
			this.buscarFacturacion.emit(false)
		}
	}

	checkFilters() {
		if ((this.filtros.idEstado != undefined && this.filtros.idEstado != null) ||
		(this.filtros.fechaDesde != undefined && this.filtros.fechaDesde != null) ||
		(this.filtros.fechaHasta != undefined && this.filtros.fechaHasta != null) ||
		(this.filtros.idConcepto != undefined && this.filtros.idConcepto != null) ||
		(this.filtros.idFacturacion != undefined && this.filtros.idFacturacion != null) ||
		(this.filtros.idPartidaPresupuestaria != undefined && this.filtros.idPartidaPresupuestaria != null) ||
		(this.filtros.nombre != undefined && this.filtros.nombre != null)) {

			if((this.filtros.fechaDesde != undefined && this.filtros.fechaDesde != null) &&
			(this.filtros.fechaHasta != undefined && this.filtros.fechaHasta != null)){
				
				if(this.filtros.fechaDesde <= this.filtros.fechaHasta){
					return true;
				}else{
					return false;
				}
			}else{
				return true;
			}
		}else{
			this.showMessage("error",  this.translateService.instant("general.message.incorrect"),  this.translateService.instant("facturacionSJCS.facturacionesYPagos.buscarFacturacion.mensajeFiltroVacio"));
			return false;
		}
	}

	showMessage(severity, summary, msg) {
		this.msgs = [];
		this.msgs.push({
		  severity: severity,
		  summary: summary,
		  detail: msg
		});
	  }

	restablecer(){
		this.filtros = new FacturacionItem();
		this.filtrosAux = new FacturacionItem();
	}
}