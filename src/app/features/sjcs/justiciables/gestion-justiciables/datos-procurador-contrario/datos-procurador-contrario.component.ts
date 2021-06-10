import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ConfirmationService } from 'primeng/components/common/api';
import { TranslateService } from '../../../../../commons/translate';
import { JusticiableBusquedaItem } from '../../../../../models/sjcs/JusticiableBusquedaItem';
import { JusticiableItem } from '../../../../../models/sjcs/JusticiableItem';
import { JusticiableTelefonoItem } from '../../../../../models/sjcs/JusticiableTelefonoItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { Subject } from 'rxjs';
import { AuthenticationService } from '../../../../../_services/authentication.service';
import { Router } from '@angular/router';
import { SigaConstants } from '../../../../../utils/SigaConstants';
import { procesos_maestros } from '../../../../../permisos/procesos_maestros';
import { procesos_justiciables } from '../../../../../permisos/procesos_justiciables';
import { Checkbox, ConfirmDialog } from '../../../../../../../node_modules/primeng/primeng';
import { Dialog } from 'primeng/primeng';
import { ColegiadoItem } from "../../../../../models/ColegiadoItem";
import { EJGItem } from '../../../../../models/sjcs/EJGItem';


@Component({
	selector: 'app-datos-procurador-contrario',
	templateUrl: './datos-procurador-contrario.component.html',
	styleUrls: ['./datos-procurador-contrario.component.scss']
})
export class DatosProcuradorContrarioComponent implements OnInit {
	generalBody: ColegiadoItem = new ColegiadoItem();

	tipoIdentificacion;
	progressSpinner: boolean = false;
	msgs = [];
	nifRepresentante;

	@Input() modoEdicion;
	@Input() showTarjetaPermiso;
	@Input() body: JusticiableItem;
	@Input() checkedViewRepresentante;
	@Input() navigateToJusticiable: boolean = false;
	@Input() fromContrario;
	@Input() fromContrarioEJG;

	searchRepresentanteGeneral: boolean = false;
	showEnlaceRepresentante: boolean = false;
	// navigateToJusticiable: boolean = false;
	esMenorEdad: boolean = false;
	idPersona;
	permisoEscritura;
	showTarjeta: boolean = false;
	representanteValido: boolean = false;
	confirmationAssociate: boolean = false;
	confirmationDisassociate: boolean = false;
	confirmationCreateRepresentante: boolean = false;

	@ViewChild('cdCreateRepresentante') cdCreateRepresentante: Dialog;
	@ViewChild('cdRepresentanteAssociate') cdRepresentanteAssociate: Dialog;
	@ViewChild('cdRepresentanteDisassociate') cdRepresentanteDisassociate: Dialog;

	@Output() contrario = new EventEmitter<boolean>();
	@Output() contrarioEJG = new EventEmitter<boolean>();

	confirmationSave: boolean = false;
	confirmationUpdate: boolean = false;

	menorEdadJusticiable: boolean = false;


	constructor(private sigaServices: SigaServices,
		private translateService: TranslateService,
		private persistenceService: PersistenceService,
		private commonsService: CommonsService,
		private confirmationService: ConfirmationService,
		private authenticationService: AuthenticationService,
		private router: Router,
		private changeDetectorRef: ChangeDetectorRef) { }

	ngOnInit() {

		this.progressSpinner = true;

		/* this.commonsService
			.checkAcceso(procesos_justiciables.tarjetaProcuradorContrario)
			.then((respuesta) => {
				this.permisoEscritura = respuesta;

				if (this.permisoEscritura == undefined) {
					this.showTarjetaPermiso = false;
					this.progressSpinner = false;
				} else {
					this.showTarjetaPermiso = true;
					this.persistenceService.clearFiltrosAux();
				}
			})
			.catch((error) => console.error(error)); */

		if (this.fromContrario || this.fromContrarioEJG) {
			this.showTarjetaPermiso = true;
			this.permisoEscritura = true;
		}
		/* Procede de search*() */
		if (sessionStorage.getItem("procurador")) {
			let data = this.generalBody = JSON.parse(sessionStorage.getItem("procurador"))[0];
			sessionStorage.removeItem("procurador");
			this.generalBody.numColegiado = data.numeroColegiado;
			this.generalBody.nombre = data.nombre;

			if (sessionStorage.getItem("EJGItem")) this.contrarioEJG.emit(true);
			else this.contrario.emit(true);
			this.permisoEscritura = true;
		}
		/* Procede de ficha designacion */
		if (sessionStorage.getItem("procuradorFicha")) {
			let data = this.generalBody = JSON.parse(sessionStorage.getItem("procuradorFicha"));
			sessionStorage.removeItem("procuradorFicha");
			this.generalBody.numColegiado = data.split(",")[0];
			this.generalBody.nombre = data.split(",")[1].concat(",", data.split(",")[2]);

			if (sessionStorage.getItem("EJGItem")) this.contrarioEJG.emit(true);
			this.contrario.emit(true);
			this.permisoEscritura = true;
		}

		this.progressSpinner = false;
	}

	search() {
		if (!this.permisoEscritura) {
			this.showMessage(
				'error',
				this.translateService.instant('general.message.incorrect'),
				this.translateService.instant('general.message.noTienePermisosRealizarAccion')
			);
		} else {
			sessionStorage.setItem("origin", "ProcuradorContrario");
			this.router.navigate(['/mantenimientoprocuradores']);
		}
	}




	Disassociate() {
		if (!sessionStorage.getItem("EJGItem")) {
			let designa = JSON.parse(sessionStorage.getItem("designaItemLink"));
			let request = [designa.idInstitucion, sessionStorage.getItem("personaDesigna"), designa.ano, designa.idTurno, designa.numero, ""]
			this.sigaServices.post('designaciones_updateProcuradorContrario', request).subscribe(
				(n) => {
					this.progressSpinner = false;
					this.showMessage(
						'success',
						this.translateService.instant('general.message.correct'),
						this.translateService.instant('general.message.accion.realizada')
					);
					this.persistenceService.setBody(this.generalBody);
				},
				(err) => {
					this.progressSpinner = false;
					this.translateService.instant('general.message.error.realiza.accion');
				}
			);
			this.generalBody = null;
		}
		else {
			let ejg: EJGItem = JSON.parse(sessionStorage.getItem("EJGItem"));
			let request = [sessionStorage.getItem("personaDesigna"), ejg.annio, ejg.numero, ejg.tipoEJG, ""];
			this.sigaServices.post('gestionejg_updateProcuradorContrarioEJG', request).subscribe(
				(n) => {
					this.progressSpinner = false;
					this.showMessage(
						'success',
						this.translateService.instant('general.message.correct'),
						this.translateService.instant('general.message.accion.realizada')
					);
					this.persistenceService.setBody(this.generalBody);
				},
				(err) => {
					this.progressSpinner = false;
					this.translateService.instant('general.message.error.realiza.accion');
				}
			);
			this.generalBody = null;
		}
	}

	Associate() {
		if (!sessionStorage.getItem("EJGItem")) {
			let designa = JSON.parse(sessionStorage.getItem("designaItemLink"));
			let request = [designa.idInstitucion, sessionStorage.getItem("personaDesigna"), designa.ano, designa.idTurno, designa.numero, this.generalBody.nombre]
			this.sigaServices.post('designaciones_updateProcuradorContrario', request).subscribe(
				(n) => {
					this.progressSpinner = false;
					this.showMessage(
						'success',
						this.translateService.instant('general.message.correct'),
						this.translateService.instant('general.message.accion.realizada')
					);
					this.persistenceService.setBody(this.generalBody);
				},
				(err) => {
					this.progressSpinner = false;
					this.translateService.instant('general.message.error.realiza.accion');
				}
			);
		}
		else {
			let ejg: EJGItem = JSON.parse(sessionStorage.getItem("EJGItem"));
			let request = [sessionStorage.getItem("personaDesigna"), ejg.annio, ejg.numero, ejg.tipoEJG, this.generalBody.nombre];
			this.sigaServices.post('gestionejg_updateProcuradorContrarioEJG', request).subscribe(
				(n) => {
					this.progressSpinner = false;
					this.showMessage(
						'success',
						this.translateService.instant('general.message.correct'),
						this.translateService.instant('general.message.accion.realizada')
					);
					this.persistenceService.setBody(this.generalBody);
				},
				(err) => {
					this.progressSpinner = false;
					this.translateService.instant('general.message.error.realiza.accion');
				}
			);
			this.generalBody = null;
		}
	}

	onHideTarjeta() {
		this.showTarjeta = !this.showTarjeta;
	}

	disabledSave() {
		if (this.generalBody.numColegiado != undefined && this.generalBody.numColegiado != '') {
			return false;
		} else {
			return true;
		}
	}

	disabledDisassociate() {
		if (this.generalBody.numColegiado != undefined && this.generalBody.numColegiado != '') {
			return false;
		} else {
			return true;
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

	clear() {
		this.msgs = [];
	}

	reject() {
		this.cdCreateRepresentante.hide();
	}

	rejectAssociate() {

	}

	rejectDisassociate() {

	}
}
