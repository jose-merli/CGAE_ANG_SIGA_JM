import { Component, OnInit, Input, EventEmitter, Output, HostListener } from '@angular/core';
import { SigaWrapper } from "../../../../../wrapper/wrapper.class";
import { USER_VALIDATIONS } from "../../../../../properties/val-properties";
import { Calendar } from 'primeng/primeng';
import { SigaServices } from '../../../../../_services/siga.service';
import { esCalendar, catCalendar, euCalendar, glCalendar } from '../../../../../utils/calendar';
import { CommonsService } from '../../../../../_services/commons.service';
import { ComboItem } from '../../../../../models/ComboItem';
import { Router } from '@angular/router';
import { TranslateService } from '../../../../../commons/translate';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { KEY_CODE } from '../../../../../commons/login-develop/login-develop.component';
import { FacturacionItem } from '../../../../../models/sjcs/FacturacionItem';

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
	selectedValue: string = "facturacion";
	showFiltroBusquedaFacturacion: boolean = true;

	@Output() buscarFacturacion = new EventEmitter<boolean>();

	@Input() permisos;

	filtros: FacturacionItem = new FacturacionItem();
	filtrosAux: FacturacionItem = new FacturacionItem();
	progressSpinnerFiltro: boolean = false;

	constructor(private router: Router,
		private sigaService: SigaServices,
		private translateService: TranslateService,
		private persistenceService: PersistenceService,
		private commonsService: CommonsService) {
		super(USER_VALIDATIONS);
	}

	ngOnInit() {
		this.progressSpinnerFiltro = true;

		if (undefined != this.persistenceService.getPermisos()) {
			this.permisos = this.persistenceService.getPermisos();
		}

		this.getRangeYear();
		this.comboFactEstados();
		this.comboPartidasPresupuestarias();
		this.comboGrupoTurnos();
		this.comboFactConceptos();


		if (undefined != this.persistenceService.getFiltrosAux()) {
			this.persistenceService.setFiltros(this.persistenceService.getFiltrosAux());

		}

		if (undefined != this.persistenceService.getFiltros()) {
			this.filtros = this.persistenceService.getFiltros();

			if(this.filtros.fechaDesde != undefined){
				this.filtros.fechaDesde = this.commonsService.arreglarFecha(this.filtros.fechaDesde);
			}

			if(this.filtros.fechaHasta != undefined){
				this.filtros.fechaHasta = this.commonsService.arreglarFecha(this.filtros.fechaHasta);
			}

			this.isBuscar();
		} else {
			this.filtros = new FacturacionItem();
		}
	}

	nuevo() {
		this.persistenceService.setFiltros(this.filtros);
		this.persistenceService.clearDatos();
		this.router.navigate(["/fichaFacturacion"]);
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

	comboFactEstados() {
		this.progressSpinnerFiltro = true;
		this.sigaService.get("combo_comboFactEstados").subscribe(
			data => {
				this.estadoFacturas = data.combooItems;
				this.commonsService.arregloTildesCombo(this.estadoFacturas);
				this.progressSpinnerFiltro = false;
			},
			err => {
				console.log(err);
				this.progressSpinnerFiltro = false;
			}
		);
	}

	comboPartidasPresupuestarias() {
		this.progressSpinnerFiltro = true;

		this.sigaService.get("combo_partidasPresupuestarias").subscribe(
			data => {
				this.partidaPresupuestaria = data.combooItems;
				this.commonsService.arregloTildesCombo(this.partidaPresupuestaria);
				this.progressSpinnerFiltro = false;
			},
			err => {
				console.log(err);
				this.progressSpinnerFiltro = false;
			}
		);
	}

	comboGrupoTurnos() {
		this.progressSpinnerFiltro = true;

		this.sigaService.get("combo_grupoFacturacion").subscribe(
			data => {
				this.grupoTurnos = data.combooItems;
				this.commonsService.arregloTildesCombo(this.grupoTurnos);
				this.progressSpinnerFiltro = false;
			},
			err => {
				console.log(err);
				this.progressSpinnerFiltro = false;
			}
		);
	}

	comboFactConceptos() {
		this.progressSpinnerFiltro = true;

		this.sigaService.get("combo_comboFactConceptos").subscribe(
			data => {
				this.conceptos = data.combooItems;
				this.commonsService.arregloTildesCombo(this.conceptos);
				this.progressSpinnerFiltro = false;
			},
			err => {
				console.log(err);
				this.progressSpinnerFiltro = false;
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
		if (this.filtros.fechaHasta < this.filtros.fechaDesde) {
			this.filtros.fechaHasta = undefined;
		}
	}

	fillFechaHasta(event) {
		this.filtros.fechaHasta = event;
	}


	isBuscar() {
		if (this.checkFilters()) {
			this.persistenceService.setFiltros(this.filtros);
			this.persistenceService.setFiltrosAux(this.filtros);
			this.filtrosAux = this.persistenceService.getFiltrosAux()
			this.buscarFacturacion.emit(false)
		}
	}

	checkFilters() {
		if ((undefined != this.filtros.idEstado) || (undefined != this.filtros.fechaDesde) || (undefined != this.filtros.fechaHasta) ||
			(undefined != this.filtros.idConcepto) || (undefined != this.filtros.idFacturacion) || (undefined != this.filtros.idPartidaPresupuestaria) ||
			(undefined != this.filtros.nombre && this.filtros.nombre.trim() != "")) {

			if ((undefined != this.filtros.fechaDesde) && (undefined != this.filtros.fechaHasta)) {
				if (this.filtros.fechaDesde <= this.filtros.fechaHasta) {
					return true;
				} else {
					return false;
				}
			} else {
				return true;
			}
		} else {
			this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("cen.busqueda.error.busquedageneral"));
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

	restablecer() {
		this.filtros = new FacturacionItem();
		this.filtrosAux = new FacturacionItem();
	}

	clear() {
		this.msgs = [];
	}

	//búsqueda con enter
	@HostListener("document:keypress", ["$event"])
	onKeyPress(event: KeyboardEvent) {
		if (event.keyCode === KEY_CODE.ENTER) {
			this.isBuscar();
		}
	}
}