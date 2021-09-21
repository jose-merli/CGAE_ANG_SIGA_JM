import {
	Component,
	OnInit,
	Input,
	Output,
	EventEmitter,
	SimpleChanges,
	OnChanges,
	ChangeDetectorRef,
	ViewChild
} from '@angular/core';
import { SigaServices } from '../../../../../_services/siga.service';
import { TranslateService } from '../../../../../commons/translate';
import { JusticiableItem } from '../../../../../models/sjcs/JusticiableItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { procesos_justiciables } from '../../../../../permisos/procesos_justiciables';
import { ConfirmationService } from '../../../../../../../node_modules/primeng/api';
import { Dialog } from '../../../../../../../node_modules/primeng/dialog';

@Component({
	selector: 'app-datos-solicitud',
	templateUrl: './datos-solicitud.component.html',
	styleUrls: ['./datos-solicitud.component.scss']
})
export class DatosSolicitudComponent implements OnInit, OnChanges {
	bodyInicial;
	progressSpinner: boolean = false;
	modoEdicion: boolean = false;
	msgs;
	generalBody: any;
	comboAutorizaEjg;
	comboAutorizaAvisotel;
	comboSolicitajg;

	selectedAutorizaavisotel;
	selectedAsistidosolicitajg;
	selectedAsistidoautorizaeejg;
	permisoEscritura: boolean = true;

	@ViewChild('cdSolicitud') cdSolicitud: Dialog;

	@Output() modoEdicionSend = new EventEmitter<any>();
	@Output() createJusticiableByUpdateSolicitud = new EventEmitter<any>();
	@Input() showTarjeta;
	@Input() body: JusticiableItem;

	constructor(
		private sigaServices: SigaServices,
		private translateService: TranslateService,
		private commonsService: CommonsService,
		private confirmationService: ConfirmationService,
		private changeDetectorRef: ChangeDetectorRef
	) { }

	ngOnInit() {
		if (this.body != undefined && this.body.idpersona != undefined) {
			this.bodyInicial = JSON.parse(JSON.stringify(this.body));

			this.tratamientoDescripcionesTarjeta();
		} else {
			this.body = new JusticiableItem();
		}

		if (this.body.idpersona == undefined) {
			this.modoEdicion = false;
			this.selectedAutorizaavisotel = undefined;
			this.selectedAsistidosolicitajg = undefined;
			this.selectedAsistidoautorizaeejg = undefined;
			this.showTarjeta = false;
		} else {
			this.modoEdicion = true;
			this.tratamientoDescripcionesTarjeta();
		}

		this.getCombos();

		this.sigaServices.guardarDatosGeneralesJusticiable$.subscribe((data) => {
			let asistidoautorizaeejg = this.body.asistidoautorizaeejg;
			let asistidosolicitajg = this.body.asistidosolicitajg;
			let autorizaavisotelematico = this.body.autorizaavisotelematico;
			this.body = data;
			this.body.asistidoautorizaeejg = asistidoautorizaeejg;
			this.body.asistidosolicitajg = asistidosolicitajg;
			this.body.autorizaavisotelematico = autorizaavisotelematico;
			this.modoEdicion = true;
			this.bodyInicial = JSON.parse(JSON.stringify(this.body));
		});

		this.sigaServices.guardarDatosGeneralesRepresentante$.subscribe((data) => {
			let asistidoautorizaeejg = this.body.asistidoautorizaeejg;
			let asistidosolicitajg = this.body.asistidosolicitajg;
			let autorizaavisotelematico = this.body.autorizaavisotelematico;
			this.body = data;
			this.body.asistidoautorizaeejg = asistidoautorizaeejg;
			this.body.asistidosolicitajg = asistidosolicitajg;
			this.body.autorizaavisotelematico = autorizaavisotelematico;
			this.modoEdicion = true;
			this.bodyInicial = JSON.parse(JSON.stringify(this.body));
		});
	}

	ngOnChanges(changes: SimpleChanges) {
		if (this.body != undefined && this.body.idpersona != undefined) {
			this.bodyInicial = JSON.parse(JSON.stringify(this.body));

			this.tratamientoDescripcionesTarjeta();
		} else {
			this.body = new JusticiableItem();
		}

		if (this.body.idpersona == undefined) {
			this.modoEdicion = false;
			this.selectedAutorizaavisotel = undefined;
			this.selectedAsistidosolicitajg = undefined;
			this.selectedAsistidoautorizaeejg = undefined;
			this.showTarjeta = false;
		} else {
			this.modoEdicion = true;
		}
	}

	tratamientoDescripcionesTarjeta() {
		if (this.body.autorizaavisotelematico != undefined && this.body.autorizaavisotelematico != null) {
			if (this.body.autorizaavisotelematico == '0') {
				this.selectedAutorizaavisotel = 'NO';
			} else if (this.body.autorizaavisotelematico == '1') {
				this.selectedAutorizaavisotel = 'SI';
			}
		} else {
			this.selectedAutorizaavisotel = undefined;
		}

		if (this.body.asistidosolicitajg != undefined && this.body.asistidosolicitajg != null) {
			if (this.body.asistidosolicitajg == '0') {
				this.selectedAsistidosolicitajg = 'NO';
			} else if (this.body.asistidosolicitajg == '1') {
				this.selectedAsistidosolicitajg = 'SI';
			}
		} else {
			this.selectedAsistidosolicitajg = undefined;
		}

		if (this.body.asistidoautorizaeejg != undefined && this.body.asistidoautorizaeejg != null) {
			if (this.body.asistidoautorizaeejg == '0') {
				this.selectedAsistidoautorizaeejg = 'NO';
			} else if (this.body.asistidoautorizaeejg == '1') {
				this.selectedAsistidoautorizaeejg = 'SI';
			}
		} else {
			this.selectedAsistidoautorizaeejg = undefined;
		}
	}

	checkPermisosRest() {
		let msg = this.commonsService.checkPermisos(this.permisoEscritura, undefined);

		if (msg != undefined) {
			this.msgs = msg;
		} else {
			this.rest();
		}
	}

	rest() {
		if (!this.permisoEscritura) {
			this.showMessage(
				'error',
				this.translateService.instant('general.message.incorrect'),
				this.translateService.instant('general.message.noTienePermisosRealizarAccion')
			);
		} else {
			if (this.bodyInicial != undefined) this.body = JSON.parse(JSON.stringify(this.bodyInicial));
		}
	}

	getCombos() {
		this.getComboAutorizaAvisotel();
		this.getComboAutorizaEjg();
		this.getComboSolicitajg();
	}

	getComboAutorizaAvisotel() {
		this.comboAutorizaAvisotel = [{ label: 'No', value: '0' }, { label: 'Si', value: '1' }];

		this.commonsService.arregloTildesCombo(this.comboAutorizaAvisotel);
	}

	getComboAutorizaEjg() {
		this.comboAutorizaEjg = [{ label: 'No', value: '0' }, { label: 'Si', value: '1' }];

		this.commonsService.arregloTildesCombo(this.comboAutorizaEjg);
	}

	getComboSolicitajg() {
		this.comboSolicitajg = [{ label: 'No', value: '0' }, { label: 'Si', value: '1' }];

		this.commonsService.arregloTildesCombo(this.comboSolicitajg);
	}

	checkPermisosSave() {
		let msg = this.commonsService.checkPermisos(this.permisoEscritura, undefined);

		if (msg != undefined) {
			this.msgs = msg;
		} else {
			this.save();
		}
	}

	save() {
		if (!this.permisoEscritura) {
			this.showMessage(
				'error',
				this.translateService.instant('general.message.incorrect'),
				this.translateService.instant('general.message.noTienePermisosRealizarAccion')
			);
		} else {
			if (!(this.bodyInicial.correoelectronico != undefined && this.bodyInicial.correoelectronico != '')) {
				if (this.body.autorizaavisotelematico == '1') {
					this.changeDetectorRef.detectChanges();
					this.showMessage(
						'info',
						this.translateService.instant('general.message.informacion'),
						this.translateService.instant(
							'justiciaGratuita.justiciables.message.necesarioCorreoElectronico.recibirNotificaciones'
						)
					);
				} else {
					if (this.body.numeroAsuntos != undefined && this.body.numeroAsuntos != '0') {
						this.callConfirmationUpdate();
					} else {
						this.callServiceSave();
					}
				}
			} else {
				if (this.body.numeroAsuntos != undefined && this.body.numeroAsuntos != '0') {
					this.callConfirmationUpdate();
				} else {
					this.callServiceSave();
				}
			}
		}
	}

	callServiceSave() {
		this.progressSpinner = true;
		let url = 'gestionJusticiables_updateDatosSolicitudJusticiable';

		this.sigaServices.post(url, this.body).subscribe(
			(data) => {
				this.bodyInicial.autorizaavisotelematico = this.body.autorizaavisotelematico;
				this.bodyInicial.asistidoautorizaeejg = this.body.asistidoautorizaeejg;
				this.bodyInicial.asistidosolicitajg = this.body.asistidosolicitajg;
				this.tratamientoDescripcionesTarjeta();
				this.showMessage(
					'success',
					this.translateService.instant('general.message.correct'),
					this.translateService.instant('general.message.accion.realizada')
				);
				this.sigaServices.notifyGuardarDatosSolicitudJusticiable(this.body);
				this.progressSpinner = false;
			},
			(err) => {
				if (JSON.parse(err.error).error.description != '') {
					this.showMessage(
						'error',
						this.translateService.instant('general.message.incorrect'),
						this.translateService.instant(JSON.parse(err.error).error.description)
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

	callConfirmationUpdate() {
		this.progressSpinner = false;

		this.confirmationService.confirm({
			key: 'cdSolicitud',
			message: this.translateService.instant('gratuita.personaJG.mensaje.actualizarJusticiableParaTodosAsuntos'),
			icon: 'fa fa-search ',
			accept: () => {
				this.callServiceSave();
			},
			reject: () => { }
		});
	}

	reject() {
		this.cdSolicitud.hide();
		this.progressSpinner = false;
		//Ya estavalidada la repeticion y puede crear al justiciable
		this.body.validacionRepeticion = true;
		this.body.asociarRepresentante = true;
		let url = 'gestionJusticiables_createJusticiable';
		this.sigaServices.post(url, this.body).subscribe(
			(data) => {
				let idJusticiable = JSON.parse(data.body).id;
				this.body.idpersona = idJusticiable;
				this.showMessage(
					'success',
					this.translateService.instant('general.message.correct'),
					this.translateService.instant('general.message.accion.realizada')
				);

				this.createJusticiableByUpdateSolicitud.emit(this.body);
			},
			(err) => {
				if (JSON.parse(err.error).error.description != '') {
					this.showMessage(
						'error',
						this.translateService.instant('general.message.incorrect'),
						this.translateService.instant(JSON.parse(err.error).error.description)
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

	clear() {
		this.msgs = [];
	}

	showMessage(severity, summary, msg) {
		this.msgs = [];
		this.msgs.push({
			severity: severity,
			summary: summary,
			detail: msg
		});
	}

	onHideTarjeta() {
		if (this.modoEdicion) {
			this.showTarjeta = !this.showTarjeta;
		}
	}
}
