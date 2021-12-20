import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { PersistenceService } from '../../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../../commons/translate';
import { CommonsService } from '../../../../../../../_services/commons.service';
import { ProcuradoresItem } from '../../../../../../../models/sjcs/ProcuradoresItem';

@Component({
	selector: 'app-datos-direcciones-procuradores',
	templateUrl: './datos-direcciones-procuradores.component.html',
	styleUrls: ['./datos-direcciones-procuradores.component.scss']
})
export class DatosDireccionesProcuradoresComponent implements OnInit {
	//Resultados de la busqueda
	@Input() modoEdicion;

	codigoPostalValido: boolean = true;

	openFicha: boolean = true;
	msgs = [];
	@Input() historico;
	isDisabledProvincia: boolean = true;

	movilCheck: boolean = false;

	@Input() body: ProcuradoresItem;
	@Input() bodyInicial: ProcuradoresItem;
	@Input() idProcurador;
	provinciaSelecionada: string;

	comboProvincias;
	comboPoblacion;
	isDisabledPoblacion: boolean = true;
	resultadosPoblaciones;

	@Input() permisoEscritura;

	esDecanoValue: boolean = false;
	isCodigoEjisValue: boolean = false;

	@Input() progressSpinner;
	validDir = true;

	avisoMail: boolean = false;
	emailValido: boolean = true;
	tlf1Valido: boolean = true;
	tlf2Valido: boolean = true;
	faxValido: boolean = true;
	edicionEmail: boolean = false;

	@ViewChild('mailto') mailto;

	constructor(
		private persistenceService: PersistenceService,
		private sigaServices: SigaServices,
		private translateService: TranslateService,
		private commonsService: CommonsService
	) { }

	ngOnInit() {
		this.getComboProvincias();

		this.validateHistorical();

		if (this.modoEdicion) {
			this.bodyInicial = JSON.parse(JSON.stringify(this.body));
			// if (this.bodyInicial.email != null && this.bodyInicial.email != undefined) this.emailValido = true;

			if (this.bodyInicial.idProvincia != null && this.bodyInicial.idProvincia != undefined)
				this.isDisabledPoblacion = false;

			if (this.body != undefined && this.body.nombrePoblacion != null) {
				this.getComboPoblacion(this.body.nombrePoblacion);
				this.isDisabledPoblacion = false;
			} else {
				this.progressSpinner = false;
			}

			this.validateEmail();

		} else {
			this.body = new ProcuradoresItem();
			this.bodyInicial = JSON.parse(JSON.stringify(this.body));

		}
	}

	ngAfterViewInit(): void { }
	validateHistorical() {
		if (this.persistenceService.getDatos() != undefined) {
			if (
				this.persistenceService.getDatos().fechabaja != null ||
				this.persistenceService.getDatos().institucionVal != undefined
			) {
				this.historico = true;
			} else {
				this.historico = false;
			}
		}
	}

	getComboProvincias() {
		this.progressSpinner = true;

		this.sigaServices.get('busquedaComisarias_provinces').subscribe(
			(n) => {
				this.comboProvincias = n.combooItems;
				this.commonsService.arregloTildesCombo(this.comboProvincias);
				this.progressSpinner = false;
			},
			(err) => {
				//console.log(err);
				this.progressSpinner = false;
			},
			() => { }
		);
	}

	onChangeProvincia() {
		this.body.idPoblacion = '';
		this.comboPoblacion = [];

		if (this.body.idProvincia != undefined && this.body.idProvincia != '') {
			this.isDisabledPoblacion = false;
		} else {
			this.isDisabledPoblacion = true;
		}
		this.disabledSave();
	}

	validateEmail() {
		if (this.commonsService.validateEmail(this.body.email) && this.body.email != null && this.body.email != '') {
			this.emailValido = true;
			this.avisoMail = false;
		} else {

			if (this.body.email != null && this.body.email != '' && this.body.email != undefined) {
				this.emailValido = false;
				this.avisoMail = true;
			} else {
				this.emailValido = true;
				this.avisoMail = false;
			}

			// this.avisoMail = false;
			// if (this.body.email != null && this.body.email != '') this.avisoMail = true;
		}
	}

	onChangePoblacion() {
		if (this.body.idPoblacion != undefined && this.body.idPoblacion != null) {
			let poblacionSelected = this.comboPoblacion.filter((pob) => pob.value == this.body.idPoblacion);
			this.body.nombrePoblacion = poblacionSelected[0].label;
		}
		this.disabledSave();
	}

	buscarPoblacion(e) {
		if (e.target.value && e.target.value !== null && e.target.value !== '') {
			if (e.target.value.length >= 3) {
				this.getComboPoblacion(e.target.value);
				this.resultadosPoblaciones = this.translateService.instant(
					'censo.busquedaClientesAvanzada.literal.sinResultados'
				);
			} else {
				this.comboPoblacion = [];
				this.resultadosPoblaciones = this.translateService.instant(
					'formacion.busquedaCursos.controlFiltros.minimoCaracteres'
				);
			}
		} else {
			this.comboPoblacion = [];
			this.resultadosPoblaciones = this.translateService.instant(
				'censo.busquedaClientesAvanzada.literal.sinResultados'
			);
		}
	}

	getComboPoblacion(dataFilter) {
		this.progressSpinner = true;

		this.sigaServices
			.getParam(
				'busquedaCommisarias_poblacion',
				'?idProvincia=' + this.body.idProvincia + '&dataFilter=' + dataFilter.replace("'", "''")
			)
			.subscribe(
				(n) => {
					this.isDisabledPoblacion = false;
					this.comboPoblacion = n.combooItems;
					this.commonsService.arregloTildesCombo(this.comboPoblacion);
					this.progressSpinner = false;
				},
				(error) => {
					this.progressSpinner = false;
				},
				() => { }
			);
	}

	onChangeCodigoPostal() {
		if (this.isValidCodigoPostal() && this.body.codigoPostal.length == 5) {
			let value = this.body.codigoPostal.substring(0, 2);
			this.provinciaSelecionada = value;
			this.isDisabledPoblacion = false;
			if (value != this.body.idProvincia) {
				this.body.idProvincia = this.provinciaSelecionada;
				this.body.idPoblacion = '';
				this.body.nombrePoblacion = '';
				this.comboPoblacion = [];
				if (this.historico == true) {
					this.isDisabledPoblacion = true;
				} else {
					this.isDisabledPoblacion = false;
				}
			}
			this.codigoPostalValido = true;
		} else {
			this.body.idProvincia = undefined;
			this.body.idPoblacion = undefined;
			this.codigoPostalValido = false;
			this.isDisabledPoblacion = true;
			this.provinciaSelecionada = '';
		}
		this.disabledSave();
	}

	isValidCodigoPostal(): boolean {
		return (
			this.body.codigoPostal &&
			typeof this.body.codigoPostal === 'string' &&
			/^(?:0[1-9]\d{3}|[1-4]\d{4}|5[0-2]\d{3})$/.test(this.body.codigoPostal)
		);
	}

	editEmail() {
		if (this.edicionEmail) this.edicionEmail = false;
		else this.edicionEmail = true;
	}

	openOutlook(dato) {
		let correo = dato.email;
		this.commonsService.openOutlook(correo);
	}

	abreCierraFicha() {
		this.openFicha = !this.openFicha;
	}


	changeEmail() {
		if (this.commonsService.validateEmail(this.body.email) && this.body.email != null && this.body.email != '') {
			this.emailValido = true;
			this.avisoMail = false;
		} else {

			if (this.body.email != null && this.body.email != '' && this.body.email != undefined) {
				this.emailValido = false;
				this.avisoMail = true;
			} else {
				this.emailValido = true;
				this.avisoMail = false;
			}

			// this.avisoMail = false;
			// if (this.body.email != null && this.body.email != '') this.avisoMail = true;
		}
		this.disabledSave();
	}

	changeTelefono1() {
		this.tlf1Valido = this.commonsService.validateTelefono(this.body.telefono1);
		this.disabledSave();
	}

	changeTelefono2() {
		this.tlf2Valido = this.commonsService.validateTelefono(this.body.telefono2);
		this.disabledSave();
	}

	changeFax() {
		this.faxValido = this.commonsService.validateFax(this.body.fax1);
		this.disabledSave();
	}

	disabledSave() {
		if (this.body.codigoPostal != undefined) this.body.codigoPostal = this.body.codigoPostal.trim();
		if (
			!this.avisoMail &&
			this.tlf1Valido &&
			this.tlf2Valido &&
			this.faxValido &&
			this.body.codigoPostal != undefined &&
			this.body.codigoPostal != '' &&
			this.body.codigoPostal.length == 5 &&
			this.body.idPoblacion != undefined &&
			this.body.idPoblacion != ''
		) {
			this.validDir = true;
		} else {
			this.validDir = false;
		}
	}

	clear() {
		this.msgs = [];
	}

	numberOnly(event): boolean {
		const charCode = (event.which) ? event.which : event.keyCode;
		if (charCode >= 48 && charCode <= 57 || (charCode == 44)) {
			if (charCode == 188) {
			}
			return true;
		}
		else {
			return false;

		}
	}

}
