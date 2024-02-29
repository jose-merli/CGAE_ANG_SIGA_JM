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
import { ContrarioDesignaItem } from '../../../../../models/sjcs/ContrarioDesignaItem';
import { ContrarioEjgItem } from '../../../../../models/sjcs/ContrarioEjgItem';
import { ProcuradorItem } from '../../../../../models/sjcs/ProcuradorItem';


@Component({
	selector: 'app-datos-procurador-contrario',
	templateUrl: './datos-procurador-contrario.component.html',
	styleUrls: ['./datos-procurador-contrario.component.scss']
})
export class DatosProcuradorContrarioComponent implements OnInit, OnChanges {
	generalBody: ProcuradorItem = new ProcuradorItem();

	tipoIdentificacion;
	progressSpinner: boolean = false;
	msgs = [];
	nifRepresentante;

	nombreCabecera: string;
	nColegiadoCabecera: string;

	@Input() modoEdicion;
	@Input() body: JusticiableItem;
	@Input() checkedViewRepresentante;
	@Input() navigateToJusticiable: boolean = false;
	@Input() fromContrario;
	@Input() fromContrarioEJG;
	@Input() tarjetaDatosProcurador;

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

	@ViewChild('cdCreateProcurador') cdCreateProcurador: Dialog;
	@ViewChild('cdProcuradorAssociate') cdProcuradorAssociate: Dialog;
	@ViewChild('cdProcuradorDisassociate') cdProcuradorDisassociate: Dialog;

	@Output() contrario = new EventEmitter<boolean>();
	@Output() contrarioEJG = new EventEmitter<boolean>();
	@Output() opened = new EventEmitter<Boolean>();
	@Output() idOpened = new EventEmitter<String>();
	@Output() bodyChange = new EventEmitter<JusticiableItem>();

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

		if (this.fromContrario || this.fromContrarioEJG) {
			this.permisoEscritura = true;
		}

		/* Procede de search*() */
		if (sessionStorage.getItem("datosProcurador")) {
			let data = this.generalBody = JSON.parse(sessionStorage.getItem("datosProcurador"))[0];
			sessionStorage.removeItem("datosProcurador");

			//Para que se muestre la tarjeta una vez vuelve de buscar un procurador
			//El timer es para que de tiempo a que se cargue la tarjeta
			setTimeout(() => {
				this.onHideTarjeta();
				let top = document.getElementById("procuradorJusticiable");
				if (top) {
					top.scrollIntoView();
					top = null;
				}
			}, 10);
			this.generalBody.idProcurador = data.idProcurador;
			this.generalBody.nColegiado = data.nColegiado;
			this.generalBody.nombre = data.nombreApe;
			this.generalBody.idInstitucion = data.idInstitucion;

			if (sessionStorage.getItem("EJGItem")) this.contrarioEJG.emit(true);
			else this.contrario.emit(true);
			this.permisoEscritura = true;
			this.Associate();
		}
		/* Procede de ficha pre-designacion */
		// else if (sessionStorage.getItem("procuradorFicha")) {
		// 	let data = sessionStorage.getItem("procuradorFicha");
		//sessionStorage.removeItem("procuradorFicha");
		else if (sessionStorage.getItem("contrarioEJG")) {
			let data = JSON.parse(sessionStorage.getItem("contrarioEJG"));
			if (data.idprocurador != null) {
				this.generalBody.nColegiado = data.procurador.split(",")[0];
				this.generalBody.nombre = data.procurador.split(",")[1].concat(",", data.procurador.split(",")[2]);
				this.generalBody.idProcurador = data.idprocurador;
				this.generalBody.idInstitucion = data.idInstitucionProc;
			}

			this.contrarioEJG.emit(true);

			this.permisoEscritura = true;

			this.nColegiadoCabecera = this.generalBody.nColegiado;
			this.nombreCabecera = this.generalBody.nombre;


			// this.generalBody.idInstitucion = data.idInstitucionProc.toString();
			// this.generalBody.idProcurador = data.idProcurador;
			// this.sigaServices.post("gestionejg_busquedaProcuradorEJG", this.ejg).subscribe(
			// 	n => {
			// 		let data = JSON.parse(n.body).procuradorItems[0];
			// 		this.generalBody.nColegiado = data.nColegiado;
			// 		this.generalBody.nombre = data.apellido1 + " " + data.apellido2 + ", " + data.nombre;
			// 		this.nombreCabecera = this.generalBody.nombre;
			// 		this.progressSpinner = false;
			// 	},
			// 	err => {
			// 		this.progressSpinner = false;
			// 	});
			//Procede de gicha designacion
		} else if (sessionStorage.getItem("contrarioDesigna")) {
			let data = JSON.parse(sessionStorage.getItem("contrarioDesigna"));
			// sessionStorage.removeItem("contrarioDesigna");
			// this.generalBody.nColegiado = data.split(",")[0];
			// this.generalBody.nombre = data.split(",")[1].concat(",", data.split(",")[2]);
			// this.generalBody.idProcurador = data.idprocurador;
			// this.generalBody.idInstitucion = data.idInstitucionProc;
			if (data.idprocurador != null) {
				this.generalBody.nColegiado = data.procurador.split(",")[0];
				this.generalBody.nombre = data.procurador.split(",")[1].concat(",", data.procurador.split(",")[2]);
				this.generalBody.idProcurador = data.idprocurador;
				this.generalBody.idInstitucion = data.idInstitucionProc;
			}

			this.contrario.emit(true);
			this.permisoEscritura = true;

			this.nColegiadoCabecera = this.generalBody.nColegiado;
			this.nombreCabecera = this.generalBody.nombre;


			// this.generalBody.idInstitucion = data.idInstitucionProc.toString();
			// this.generalBody.idProcurador = data.idProcurador;
			// this.sigaServices.post("gestionejg_busquedaProcuradorEJG", this.ejg).subscribe(
			// 	n => {
			// 		let data = JSON.parse(n.body).procuradorItems[0];
			// 		this.generalBody.nColegiado = data.nColegiado;
			// 		this.generalBody.nombre = data.apellido1 + " " + data.apellido2 + ", " + data.nombre;
			// 		this.nombreCabecera = this.generalBody.nombre;
			// 		this.progressSpinner = false;
			// 	},
			// 	err => {
			// 		this.progressSpinner = false;
			// 	});

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
			sessionStorage.setItem("nuevoProcurador", "true");
			if (this.fromContrario) sessionStorage.setItem("origin", "Contrario");
			else if (this.fromContrarioEJG) sessionStorage.setItem("origin", "ContrarioEJG");
			this.router.navigate(['/busquedaGeneral']);
		}
	}




	Disassociate() {
		if (!sessionStorage.getItem("EJGItem")) {
			let designa = JSON.parse(sessionStorage.getItem("designaItemLink"));
			// let contrarioPeticion: ContrarioDesignaItem = new ContrarioDesignaItem();
			// contrarioPeticion.idinstitucion = designa.idInstitucion;
			// contrarioPeticion.idpersona = Number(sessionStorage.getItem("personaDesigna"));
			// contrarioPeticion.anio = designa.ano;
			// contrarioPeticion.idturno = designa.idTurno;
			// contrarioPeticion.numero = designa.numero;
			// contrarioPeticion.idprocurador = null;
			// contrarioPeticion.idinstitucionProcu = null;
			let request: string[] = [designa.idInstitucion, sessionStorage.getItem("personaDesigna"), designa.ano, designa.numero, designa.idTurno, null, null]
			this.sigaServices.post('designaciones_updateProcuradorContrario', request).subscribe(
				(n) => {
					this.progressSpinner = false;
					this.showMessage(
						'success',
						this.translateService.instant('general.message.correct'),
						this.translateService.instant('general.message.accion.realizada')
					);
					this.generalBody = new ProcuradorItem();
					this.nColegiadoCabecera = this.generalBody.nColegiado;
					this.nombreCabecera = this.generalBody.nombre;
					sessionStorage.removeItem("procuradorFicha");
					//this.persistenceService.setBody(this.generalBody);
				},
				(err) => {
					this.progressSpinner = false;
					this.showMessage(
						'error',
						this.translateService.instant('general.message.error'),
						this.translateService.instant('general.message.error.realiza.accion'));
				}
			);

		}
		else {
			let ejg: EJGItem = JSON.parse(sessionStorage.getItem("EJGItem"));
			// let contrarioPeticion: ContrarioEjgItem = new ContrarioEjgItem();
			// contrarioPeticion.idinstitucion = Number(ejg.idInstitucion);
			// contrarioPeticion.idpersona = Number(sessionStorage.getItem("personaDesigna"));
			// contrarioPeticion.anio = Number(ejg.annio);
			// contrarioPeticion.idtipoejg = Number(ejg.tipoEJG);
			// contrarioPeticion.numero = Number(ejg.numero);
			// contrarioPeticion.idprocurador = null;
			// contrarioPeticion.idinstitucionProcu = null;
			let request: string[] = [ejg.idInstitucion, sessionStorage.getItem("personaDesigna"), ejg.annio, ejg.numero, ejg.tipoEJG, null, null];
			this.sigaServices.post('gestionejg_updateProcuradorContrarioEJG', request).subscribe(
				(n) => {
					this.progressSpinner = false;
					this.showMessage(
						'success',
						this.translateService.instant('general.message.correct'),
						this.translateService.instant('general.message.accion.realizada')
					);
					this.generalBody = new ProcuradorItem();
					this.nColegiadoCabecera = this.generalBody.nColegiado;
					this.nombreCabecera = this.generalBody.nombre;
					sessionStorage.removeItem("procuradorFicha");
					//this.persistenceService.setBody(this.generalBody);
				},
				(err) => {
					this.progressSpinner = false;
					this.showMessage(
						'error',
						this.translateService.instant('general.message.error'),
						this.translateService.instant('general.message.error.realiza.accion'));
				}
			);

		}
	}

	Associate() {
		if (!sessionStorage.getItem("EJGItem")) {
			let designa = JSON.parse(sessionStorage.getItem("designaItemLink"));
			// let contrarioPeticion: ContrarioDesignaItem = new ContrarioDesignaItem();
			// contrarioPeticion.idinstitucion = designa.idInstitucion;
			// contrarioPeticion.idpersona = Number(sessionStorage.getItem("personaDesigna"));
			// contrarioPeticion.anio = designa.ano;
			// contrarioPeticion.idturno = designa.idTurno;
			// contrarioPeticion.numero = designa.numero;
			// contrarioPeticion.idprocurador = Number(this.generalBody.idProcurador);
			// contrarioPeticion.idinstitucionProcu = Number(this.generalBody.idInstitucion);
			let request: string[] = [designa.idInstitucion, sessionStorage.getItem("personaDesigna"), designa.ano, designa.numero, designa.idTurno, this.generalBody.idProcurador, this.generalBody.idInstitucion]
			this.sigaServices.post('designaciones_updateProcuradorContrario', request).subscribe(
				(n) => {
					this.progressSpinner = false;
					this.showMessage(
						'success',
						this.translateService.instant('general.message.correct'),
						this.translateService.instant('general.message.accion.realizada')
					);
					let procurador: string = this.generalBody.nColegiado + "," + this.generalBody.nombreApe;
					sessionStorage.setItem("procuradorFicha", procurador);
					this.nColegiadoCabecera = this.generalBody.nColegiado;
					this.nombreCabecera = this.generalBody.nombre;
					//this.persistenceService.setBody(this.generalBody);
				},
				(err) => {
					this.progressSpinner = false;
					this.showMessage(
						'error',
						this.translateService.instant('general.message.error'),
						this.translateService.instant('general.message.error.realiza.accion'));
				}
			);
		}
		else {
			let ejg: EJGItem = JSON.parse(sessionStorage.getItem("EJGItem"));
			// let contrarioPeticion: ContrarioEjgItem = new ContrarioEjgItem();
			// contrarioPeticion.idinstitucion = Number(ejg.idInstitucion);
			// contrarioPeticion.idpersona = Number(sessionStorage.getItem("personaDesigna"));
			// contrarioPeticion.anio = Number(ejg.annio);
			// contrarioPeticion.idtipoejg = Number(ejg.tipoEJG);
			// contrarioPeticion.numero = Number(ejg.numero);
			// contrarioPeticion.idprocurador = Number(this.generalBody.idProcurador);
			// contrarioPeticion.idinstitucionProcu = Number(this.generalBody.idInstitucion);
			let request: string[] = [ejg.idInstitucion, sessionStorage.getItem("personaDesigna"), ejg.annio, ejg.numero, ejg.tipoEJG, this.generalBody.idProcurador, this.generalBody.idInstitucion];
			this.sigaServices.post('gestionejg_updateProcuradorContrarioEJG', request).subscribe(
				(n) => {
					this.progressSpinner = false;
					this.showMessage(
						'success',
						this.translateService.instant('general.message.correct'),
						this.translateService.instant('general.message.accion.realizada')
					);
					let procurador: string = this.generalBody.nColegiado + "," + this.generalBody.nombreApe;
					sessionStorage.setItem("procuradorFicha", procurador);
					this.nColegiadoCabecera = this.generalBody.nColegiado;
					this.nombreCabecera = this.generalBody.nombre;
					//this.persistenceService.setBody(this.generalBody);
				},
				(err) => {
					this.progressSpinner = false;
					this.showMessage(
						'error',
						this.translateService.instant('general.message.error'),
						this.translateService.instant('general.message.error.realiza.accion'));
				}
			);

		}
	}

	onHideTarjeta() {
		this.showTarjeta = !this.showTarjeta;
		this.opened.emit(this.showTarjeta);   // Emit donde pasamos el valor de la Tarjeta Procuradores.
    	this.idOpened.emit('Procuradores'); // Constante para abrir la Tarjeta de Procuradores.
	}

	disabledSave() {
		if (this.generalBody.idProcurador != undefined && this.generalBody.idProcurador != null) {
			return false;
		} else {
			return true;
		}
	}

	disabledDisassociate() {
		if (this.nColegiadoCabecera != undefined && this.nColegiadoCabecera != null) {
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
		this.cdCreateProcurador.hide();
	}

	rejectAssociate() {

	}

	rejectDisassociate() {

	}

	ngOnChanges(changes: SimpleChanges) {
		if (this.tarjetaDatosProcurador == true) this.showTarjeta = this.tarjetaDatosProcurador;
	  }
}
