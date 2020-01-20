import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, ViewChild } from '@angular/core';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { FundamentosCalificacionObject } from '../../../../../models/sjcs/FundamentosCalificacionObject';
import { SigaServices } from '../../../../../_services/siga.service';
import { TranslateService } from '../../../../../commons/translate';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { ConfirmationService, DataTable } from '../../../../../../../node_modules/primeng/primeng';
import { CommonsService } from '../../../../../_services/commons.service';


@Component({
	selector: 'app-tabla-fundamentos-calificacion',
	templateUrl: './tabla-fundamentos-calificacion.component.html',
	styleUrls: ['./tabla-fundamentos-calificacion.component.scss']
})
export class TablaFundamentosCalificacionComponent implements OnInit {
	@Input() datos;
	@ViewChild("table") table;
	rowsPerPage: any = [];
	cols;
	msgs;

	selectedItem: number = 10;
	selectAll;
	selectedDatos = [];
	numSelected = 0;
	selectMultiple: boolean = false;
	seleccion: boolean = false;
	historico: boolean;
	@Output() searchHistoricalSend = new EventEmitter<boolean>();
	permisoEscritura: boolean = false;
	buscadores = [];
	message;

	initDatos;
	nuevo: boolean = false;
	progressSpinner: boolean = false;
	@ViewChild("table") tabla;
	constructor(
		private persistenceService: PersistenceService,
		private sigaService: SigaServices,
		private translateService: TranslateService,
		private router: Router,
		private changeDetectorRef: ChangeDetectorRef,
		private confirmationService: ConfirmationService,
		private commonsService: CommonsService
	) { }

	ngOnInit() {
		if (this.persistenceService.getPermisos() == true) {
			this.permisoEscritura = this.persistenceService.getPermisos();
		}
		this.getCols();
		this.historico = this.persistenceService.getHistorico();
		this.initDatos = JSON.parse(JSON.stringify(this.datos));
	}

	checkPermisosDelete() {
		let msg = this.commonsService.checkPermisos(this.permisoEscritura, undefined);

		if (msg != undefined) {
			this.msgs = msg;
		} else {
			if (((!this.selectMultiple || !this.selectAll) && this.selectedDatos.length == 0) || !this.permisoEscritura) {
				this.msgs = this.commonsService.checkPermisoAccion();
			} else {
				this.confirmDelete();
			}
		}
	}

	confirmDelete() {
		let mess = this.translateService.instant('messages.deleteConfirmation');
		let icon = 'fa fa-edit';
		this.confirmationService.confirm({
			message: mess,
			icon: icon,
			accept: () => {
				this.delete();
			},
			reject: () => {
				this.msgs = [
					{
						severity: 'info',
						summary: 'Cancel',
						detail: this.translateService.instant('general.message.accion.cancelada')
					}
				];
			}
		});
	}

	setItalic(dato) {
		if (dato.fechabaja == null) return false;
		else return true;
	}

	getCols() {
		this.cols = [
			{ field: 'codigo', header: 'general.codeext', width: "20%" },
			{ field: 'descripcionFundamento', header: 'administracion.parametrosGenerales.literal.descripcion', width: "60%" },
			{
				field: 'descripcionDictamen',
				header: 'justiciaGratuita.maestros.fundamentosCalificacion.datosGenerales.dictamen', width: "20%"
			}
		];

		this.cols.forEach(it => this.buscadores.push(""))

		this.rowsPerPage = [
			{
				label: 10,
				value: 10
			},
			{
				label: 20,
				value: 20
			},
			{
				label: 30,
				value: 30
			},
			{
				label: 40,
				value: 40
			}
		];
	}

	isSelectMultiple() {
		this.selectAll = false;
		if (this.permisoEscritura) {
			this.selectMultiple = !this.selectMultiple;
			if (!this.selectMultiple) {
				this.selectedDatos = [];
				this.numSelected = 0;
			} else {
				this.selectAll = false;
				this.selectedDatos = [];
				this.numSelected = 0;
			}
		}
	}

	searchHistorical() {
		this.historico = !this.historico;
		this.persistenceService.setHistorico(this.historico);
		this.searchHistoricalSend.emit(this.historico);
		this.selectAll = false;
		if (this.selectMultiple) {
			this.selectMultiple = false;
		}
	}
	onChangeSelectAll() {
		if (this.permisoEscritura) {
			if (!this.historico) {
				if (this.selectAll) {
					this.selectMultiple = true;
					this.selectedDatos = this.datos;
					this.numSelected = this.datos.length;
				} else {
					this.selectedDatos = [];
					this.numSelected = 0;
					this.selectMultiple = false;
				}
			} else {
				if (this.selectAll) {
					this.selectMultiple = true;
					this.selectedDatos = this.datos.filter(
						(dato) => dato.fechaBaja != undefined && dato.fechaBaja != null
					);
					this.numSelected = this.selectedDatos.length;
				} else {
					this.selectedDatos = [];
					this.numSelected = 0;
					this.selectMultiple = false;
				}
			}
		}
	}

	onChangeRowsPerPages(event) {
		this.selectedItem = event.value;
		this.changeDetectorRef.detectChanges();
		this.table.reset();
	}

	openTab(evento) {
		if (this.persistenceService.getPermisos() != undefined) {
			this.permisoEscritura = this.persistenceService.getPermisos();
		}
		if (!this.selectAll && !this.selectMultiple) {
			this.progressSpinner = true;
			this.persistenceService.setDatos(evento.data);
			this.router.navigate(['/gestionFundamentos']);
		} else {
			if (evento.data.fechabaja == undefined && this.historico) {
				this.selectedDatos.pop();
			}
		}
	}

	delete() {
		let fundamentoDelete = new FundamentosCalificacionObject();
		fundamentoDelete.fundamentosCalificacionesItems = this.selectedDatos;
		this.sigaService.post('fundamentosCalificacion_deleteFundamentoCalificacion', fundamentoDelete).subscribe(
			(data) => {
				this.selectedDatos = [];
				this.searchHistoricalSend.emit(false);
				this.showMessage(
					'success',
					this.translateService.instant('general.message.correct'),
					this.translateService.instant('general.message.accion.realizada')
				);
				this.progressSpinner = false;
			},
			(err) => {
				if (err != undefined && JSON.parse(err.error).error.description != '') {
					this.showMessage(
						'error',
						this.translateService.instant('general.message.incorrect'),
						JSON.parse(err.error).error.description
					);
				} else {
					this.showMessage(
						'error',
						this.translateService.instant('general.message.incorrect'),
						this.translateService.instant('general.message.error.realiza.accion')
					);
				}
				this.progressSpinner = false;
			},
			() => {
				this.progressSpinner = false;
			}
		);
	}

	checkPermisosActivate() {
		let msg = this.commonsService.checkPermisos(this.permisoEscritura, undefined);

		if (msg != undefined) {
			this.msgs = msg;
		} else {
			if (((!this.selectMultiple || !this.selectAll) && this.selectedDatos.length == 0) || !this.permisoEscritura) {
				this.msgs = this.commonsService.checkPermisoAccion();
			} else {
				this.activate();
			}
		}
	}

	activate() {
		let fundamentoCalificacionActivate = new FundamentosCalificacionObject();
		fundamentoCalificacionActivate.fundamentosCalificacionesItems = this.selectedDatos;
		this.sigaService
			.post('busquedaFundamentosCalificacion_activateFundamentos', fundamentoCalificacionActivate)
			.subscribe(
				(data) => {
					this.selectedDatos = [];
					this.searchHistoricalSend.emit(true);
					this.showMessage(
						'success',
						this.translateService.instant('general.message.correct'),
						this.translateService.instant('general.message.accion.realizada')
					);
					this.progressSpinner = false;
				},
				(err) => {
					if (err != undefined && JSON.parse(err.error).error.description != '') {
						this.showMessage(
							'error',
							this.translateService.instant('general.message.incorrect'),
							JSON.parse(err.error).error.description
						);
					} else {
						this.showMessage(
							'error',
							this.translateService.instant('general.message.incorrect'),
							this.translateService.instant('general.message.error.realiza.accion')
						);
					}
					this.progressSpinner = false;
				},
				() => {
					this.progressSpinner = false;
				}
			);
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
}
