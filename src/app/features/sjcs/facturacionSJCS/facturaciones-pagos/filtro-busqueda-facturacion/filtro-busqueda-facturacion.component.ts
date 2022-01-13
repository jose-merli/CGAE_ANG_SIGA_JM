import { Component, OnInit, Input, EventEmitter, Output, HostListener } from '@angular/core';
import { SigaWrapper } from "../../../../../wrapper/wrapper.class";
import { USER_VALIDATIONS } from "../../../../../properties/val-properties";
import { Calendar } from 'primeng/primeng';
import { SigaServices } from '../../../../../_services/siga.service';
import { esCalendar, catCalendar, euCalendar, glCalendar } from '../../../../../utils/calendar';
import { CommonsService } from '../../../../../_services/commons.service';
import { ComboItem } from '../../../../../models/ComboItem';
import { FacturacionItem } from "../../../../../models/sjcs/FacturacionItem";
import { Router } from '@angular/router';
import { TranslateService } from '../../../../../commons/translate';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { KEY_CODE } from '../../../../../commons/login-develop/login-develop.component';
import { PagosjgItem } from '../../../../../models/sjcs/PagosjgItem';
import { MultiSelect } from 'primeng/multiselect';

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
	estadoPagos: ComboItem;
	conceptos: ComboItem;
	grupoTurnos: ComboItem;
	partidaPresupuestaria: ComboItem;
	msgs: any[];
	buscar: boolean = false;
	selectedValue: string = "facturacion";
	showFicha: boolean = true;

	@Output() busqueda = new EventEmitter<String>();
	@Output() cambiaBuscar = new EventEmitter<boolean>();

	@Input() permisoEscrituraFac;
	@Input() permisoEscrituraPag;

	filtrosFacturacion: FacturacionItem = new FacturacionItem();
	filtrosPagos: PagosjgItem = new PagosjgItem();

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

		this.getRangeYear();
		this.comboFactEstados();
		this.comboEstadosPagos();
		this.comboPartidasPresupuestarias();
		this.comboGrupoTurnos();
		this.comboFactConceptos();

		if (undefined != this.persistenceService.getFiltrosAux()) {
			this.persistenceService.setFiltros(this.persistenceService.getFiltrosAux());
		}

		if (undefined != this.persistenceService.getFiltros()) {
			let datos = this.persistenceService.getFiltros();

			if (undefined != datos.selectedValue) {
				this.selectedValue = datos.selectedValue;
			}

			if (this.selectedValue == "facturacion") {
				this.filtrosFacturacion = datos;

				if (this.filtrosFacturacion.fechaDesde != undefined) {
					this.filtrosFacturacion.fechaDesde = this.commonsService.arreglarFecha(this.filtrosFacturacion.fechaDesde);
				}

				if (this.filtrosFacturacion.fechaHasta != undefined) {
					this.filtrosFacturacion.fechaHasta = this.commonsService.arreglarFecha(this.filtrosFacturacion.fechaHasta);
				}

				if ((undefined != this.filtrosFacturacion.idEstado) || (undefined != this.filtrosFacturacion.fechaDesde) || (undefined != this.filtrosFacturacion.fechaHasta) ||
					(undefined != this.filtrosFacturacion.idConcepto) || (undefined != this.filtrosFacturacion.idFacturacion) || (undefined != this.filtrosFacturacion.idPartidaPresupuestaria) ||
					(undefined != this.filtrosFacturacion.nombre && this.filtrosFacturacion.nombre.trim() != "")) {
					this.isBuscar();
				}
			} else if (this.selectedValue == "pagos") {
				this.filtrosPagos = datos;

				if (this.filtrosPagos.fechaDesde != undefined) {
					this.filtrosPagos.fechaDesde = this.commonsService.arreglarFecha(this.filtrosPagos.fechaDesde);
				}

				if (this.filtrosPagos.fechaHasta != undefined) {
					this.filtrosPagos.fechaHasta = this.commonsService.arreglarFecha(this.filtrosPagos.fechaHasta);
				}

				if ((undefined != this.filtrosPagos.idEstado) || (undefined != this.filtrosPagos.fechaDesde) || (undefined != this.filtrosPagos.fechaHasta) ||
					(undefined != this.filtrosPagos.idConcepto) || (undefined != this.filtrosPagos.idFacturacion) || (undefined != this.filtrosPagos.idPartidaPresupuestaria) ||
					(undefined != this.filtrosPagos.nombre && this.filtrosPagos.nombre.trim() != "")) {
					this.isBuscar();
				}
			}
		} else {
			this.selectedValue = "facturacion";
			this.filtrosFacturacion = new FacturacionItem();
			this.filtrosPagos = new PagosjgItem();
		}
	}

	nuevo() {
		let datos;

		if (this.selectedValue == "facturacion") {
			datos = this.filtrosFacturacion;
			datos.selectedValue = this.selectedValue;

			this.persistenceService.clearDatos();
			this.persistenceService.setFiltros(datos);

			this.router.navigate(["/fichaFacturacion"]);

		} else if (this.selectedValue == "pagos") {
			datos = this.filtrosPagos;
			datos.selectedValue = this.selectedValue;

			this.persistenceService.clearDatos();
			this.persistenceService.setFiltros(datos);

			this.router.navigate(["/fichaPagos"]);
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
		this.showFicha = !this.showFicha;
	}

	borrarFecha() {
		this.value = null;
		this.valueChangeInput.emit(this.value);
		this.fechaSelectedFromCalendar = true;
		this.calendar.onClearButtonClick("");
	}

	cambiaFiltro() {
		this.filtrosFacturacion = new FacturacionItem();
		this.filtrosPagos = new PagosjgItem();
		this.cambiaBuscar.emit(false);

		this.persistenceService.clearFiltros();
		this.persistenceService.clearFiltrosAux();
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

	comboEstadosPagos() {
		this.progressSpinnerFiltro = true;

		this.sigaService.get("combo_comboPagoEstados").subscribe(
			data => {
				this.estadoPagos = data.combooItems;
				this.commonsService.arregloTildesCombo(this.estadoPagos);
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
		if (this.selectedValue == "facturacion") {
			this.filtrosFacturacion.fechaDesde = event;
			if (this.filtrosFacturacion.fechaHasta < this.filtrosFacturacion.fechaDesde) {
				this.filtrosFacturacion.fechaHasta = undefined;
			}
		} else if (this.selectedValue == "pagos") {
			this.filtrosPagos.fechaDesde = event;
			if (this.filtrosPagos.fechaHasta < this.filtrosPagos.fechaDesde) {
				this.filtrosPagos.fechaHasta = undefined;
			}
		}
	}

	fillFechaHasta(event) {
		if (this.selectedValue == "facturacion") {
			this.filtrosFacturacion.fechaHasta = event;
		} else if (this.selectedValue == "pagos") {
			this.filtrosPagos.fechaHasta = event;
		}
	}

	isBuscar() {
		if (this.checkFilters()) {
			let filtros;

			if (this.selectedValue == "facturacion") {
				filtros = this.filtrosFacturacion;
			} else if (this.selectedValue == "pagos") {
				filtros = this.filtrosPagos;
			}
			filtros.selectedValue = this.selectedValue;

			this.persistenceService.setFiltrosAux(filtros);
			this.persistenceService.setFiltros(filtros);

			this.busqueda.emit(this.selectedValue);
		}
	}

	checkFilters() {
		if (this.selectedValue == "facturacion") {
			if ((undefined != this.filtrosFacturacion.idEstado) || (undefined != this.filtrosFacturacion.fechaDesde) || (undefined != this.filtrosFacturacion.fechaHasta) ||
				(undefined != this.filtrosFacturacion.idConcepto) || (undefined != this.filtrosFacturacion.idFacturacion) || (undefined != this.filtrosFacturacion.idPartidaPresupuestaria) ||
				(undefined != this.filtrosFacturacion.nombre && this.filtrosFacturacion.nombre.trim() != "")) {

				if ((undefined != this.filtrosFacturacion.fechaDesde) && (undefined != this.filtrosFacturacion.fechaHasta)) {
					if (this.filtrosFacturacion.fechaDesde <= this.filtrosFacturacion.fechaHasta) {
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
		} else if (this.selectedValue == "pagos") {
			if ((undefined != this.filtrosPagos.idEstado) || (undefined != this.filtrosPagos.fechaDesde) || (undefined != this.filtrosPagos.fechaHasta) ||
				(undefined != this.filtrosPagos.idConcepto) || (undefined != this.filtrosPagos.idFacturacion) || (undefined != this.filtrosPagos.idPartidaPresupuestaria) ||
				(undefined != this.filtrosPagos.nombre && this.filtrosPagos.nombre.trim() != "")) {

				if ((undefined != this.filtrosPagos.fechaDesde) && (undefined != this.filtrosPagos.fechaHasta)) {
					if (this.filtrosPagos.fechaDesde <= this.filtrosPagos.fechaHasta) {
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
		this.filtrosFacturacion = new FacturacionItem();
		this.filtrosPagos = new PagosjgItem();
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

	focusInputField(someMultiselect: MultiSelect) {
		setTimeout(() => {
			someMultiselect.filterInputChild.nativeElement.focus();
		}, 300);
	}

	onChangeMultiSelectFact(event, filtro) {
		if (undefined != event.value && event.value.length == 0) {
			this.filtrosFacturacion[filtro] = undefined;
		}
	}

	onChangeMultiSelectPagos(event, filtro) {
		if (undefined != event.value && event.value.length == 0) {
			this.filtrosPagos[filtro] = undefined;
		}
	}

	disabledNuevo(): boolean {

		return ((this.selectedValue == 'facturacion' && !this.permisoEscrituraFac) || (this.selectedValue == 'pagos' && !this.permisoEscrituraPag));
	}
}