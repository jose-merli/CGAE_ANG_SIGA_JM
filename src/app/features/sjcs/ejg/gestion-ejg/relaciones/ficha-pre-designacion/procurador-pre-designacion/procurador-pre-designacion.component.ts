import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ConfirmationService, Message } from 'primeng/components/common/api';
import { TranslateService } from '../../../../../../../commons/translate';
import { JusticiableBusquedaItem } from '../../../../../../../models/sjcs/JusticiableBusquedaItem';
import { JusticiableItem } from '../../../../../../../models/sjcs/JusticiableItem';
import { JusticiableTelefonoItem } from '../../../../../../../models/sjcs/JusticiableTelefonoItem';
import { CommonsService } from '../../../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../../_services/siga.service';
import { Subject } from 'rxjs';
import { AuthenticationService } from '../../../../../../../_services/authentication.service';
import { Router } from '@angular/router';
import { SigaConstants } from '../../../../../../../utils/SigaConstants';
import { procesos_maestros } from '../../../../../../../permisos/procesos_maestros';
import { procesos_justiciables } from '../../../../../../../permisos/procesos_justiciables';
import { Checkbox, ConfirmDialog } from '../../../../../../../../../node_modules/primeng/primeng';
import { Dialog } from 'primeng/primeng';
import { ColegiadoItem } from "../../../../../../../models/ColegiadoItem";
import { EJGItem } from '../../../../../../../models/sjcs/EJGItem';
import { ProcuradorItem } from '../../../../../../../models/sjcs/ProcuradorItem';

@Component({
	selector: 'app-procurador-pre-designacion',
	templateUrl: './procurador-pre-designacion.component.html',
	styleUrls: ['./procurador-pre-designacion.component.scss']
})
export class ProcuradorPreDesignacionComponent implements OnInit {
	generalBody: ProcuradorItem = new ProcuradorItem();

	tipoIdentificacion;
	progressSpinner: boolean = false;
	msgs: Message[] = [];
	nifRepresentante;

	ejg: EJGItem;

	@Input() modoEdicion = true;

	esMenorEdad: boolean = false;
	idPersona;
	permisoEscritura;
	openPro: boolean = false;
	representanteValido: boolean = false;
	confirmationAssociate: boolean = false;
	confirmationDisassociate: boolean = false;
	confirmationCreateRepresentante: boolean = false;

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

		this.ejg = this.persistenceService.getDatos();

		/* Procede de ficha ejg */
		if (this.ejg.idInstitucionProc != null) {

			this.generalBody.idInstitucion = this.ejg.idInstitucionProc.toString();
			this.progressSpinner = true;
			let procurador = new JusticiableBusquedaItem();
			procurador.idpersona = this.generalBody.idProcurador.toString();
			this.sigaServices.post("busquedaJusticiables_searchJusticiables", procurador).subscribe(
				n => {
					this.generalBody = JSON.parse(n.body).justiciableBusquedaItems;
					this.progressSpinner = false;
				},
				err => {
					this.progressSpinner = false;
				});
		}

		

		/* Procede de search*() */
		if (sessionStorage.getItem("procurador")) {
			let data = this.generalBody = JSON.parse(sessionStorage.getItem("procurador"))[0];
			sessionStorage.removeItem("procurador");
			this.generalBody.nColegiado = data.numeroColegiado;
			this.generalBody.nombre = data.nombre;
			this.permisoEscritura = true;
		}
		this.progressSpinner = false;

		this.permisoEscritura = true;
	}

	search() {
		if (!this.permisoEscritura) {
			this.showMessage(
				'error',
				this.translateService.instant('general.message.incorrect'),
				this.translateService.instant('general.message.noTienePermisosRealizarAccion')
			);
		} else {
			sessionStorage.setItem("origin", "procuradorEJG");
			this.router.navigate(['/busquedaGeneral']);
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


	Disassociate() {
		let ejg: EJGItem = this.persistenceService.getDatos();
		ejg.idProcurador = null;
		ejg.idInstitucionProc = null;
		this.sigaServices.post('gestionejg_guardarProcuradorEJG', ejg).subscribe(
			//Añadir gestion de estatus KO 
			(n) => {

				this.showMessage(
					'success',
					this.translateService.instant('general.message.correct'),
					this.translateService.instant('general.message.accion.realizada')
				);
				this.generalBody = new ProcuradorItem();
				this.progressSpinner = false;
			},
			(err) => {
				this.progressSpinner = false;
				this.translateService.instant('general.message.error.realiza.accion');
			}
		);
	}

	Associate() {
		this.ejg.idProcurador = this.generalBody.idProcurador.toString();
		this.ejg.idInstitucionProc = parseInt(this.generalBody.idInstitucion.toString());
		this.sigaServices.post('designaciones_guardarProcuradorEJG', this.ejg).subscribe(
			//Añadir gestion de KO
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

	abreCierra() {
		this.openPro = !this.openPro;
	}

	disabledSave() {
		if (this.generalBody.nColegiado != undefined && this.generalBody.nColegiado != '') {
			return false;
		} else {
			return true;
		}
	}

	disabledDisassociate() {
		if (this.generalBody.nColegiado != undefined && this.generalBody.nColegiado != '') {
			return false;
		} else {
			return true;
		}
	}

	fillFechaDesigna(event) {
		this.generalBody.fechaDesigna = event;
	}

	clear() {
		this.msgs = [];
	}

}

