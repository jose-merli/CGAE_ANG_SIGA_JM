import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ConfirmationService, Message } from 'primeng/components/common/api';
import { TranslateService } from '../../../../../commons/translate';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { Router } from '@angular/router';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { ProcuradorItem } from '../../../../../models/sjcs/ProcuradorItem';
import { DatePipe } from '@angular/common';
import { procesos_ejg } from '../../../../../permisos/procesos_ejg';

@Component({
	selector: 'app-procurador-pre-designacion',
	templateUrl: './procurador-pre-designacion.component.html',
	styleUrls: ['./procurador-pre-designacion.component.scss']
})
export class ProcuradorPreDesignacionComponent implements OnInit {

	generalBody: ProcuradorItem = new ProcuradorItem();

	//generalBody: EJGItem = new EJGItem();

	tipoIdentificacion;
	progressSpinner: boolean = false;
	msgs: Message[] = [];
	nifRepresentante;

	resaltadoDatos = false;

	ejg: EJGItem;

	fechaCabecera: Date = null;
	nombreCabecera: string = "";

	@Input() permisoEscritura:boolean;
	permisoProcurador:boolean;

	idPersona;
	openPro: boolean = false;
	representanteValido: boolean = false;
	confirmationAssociate: boolean = false;
	confirmationDisassociate: boolean = false;
	confirmationCreateRepresentante: boolean = false;
	perEscritura: boolean = false;
	menorEdadJusticiable: boolean = false;

	constructor(private sigaServices: SigaServices,
		private translateService: TranslateService,
		private persistenceService: PersistenceService,
		private commonsService: CommonsService,
		private router: Router) { }

	ngOnInit() {

		this.checkAcceso(procesos_ejg.procurador);

		this.ejg = this.persistenceService.getDatos();

		/* Procede de search*() */
		if (sessionStorage.getItem("datosProcurador")) {
			let data = JSON.parse(sessionStorage.getItem("datosProcurador"))[0];
			sessionStorage.removeItem("datosProcurador");

			this.abreCierra();
			let top = document.getElementById("procuradorPreDesigna");
			if (top) {
				top.scrollIntoView();
				top = null;
			}

			this.generalBody.idProcurador = data.idProcurador;
			this.generalBody.nColegiado = data.nColegiado;
			this.generalBody.nombre = data.nombreApe;
			if (this.ejg.idInstitucionProc != null) this.generalBody.fechaDesigna = new Date(this.ejg.fechaDesProc);
			this.generalBody.numerodesignacion = this.ejg.numerodesignaproc;
			this.generalBody.idInstitucion = data.idInstitucion;
			this.generalBody.idProcurador = data.idProcurador;
		}
		/* Procede de ficha ejg */
		else if (this.ejg.idProcurador != null) {

			this.generalBody.fechaDesigna = new Date(this.ejg.fechaDesProc);
			this.generalBody.numerodesignacion = this.ejg.numerodesignaproc;
			this.generalBody.idInstitucion = this.ejg.idInstitucionProc.toString();
			this.generalBody.idProcurador = this.ejg.idProcurador;
			this.sigaServices.post("gestionejg_busquedaProcuradorEJG", this.ejg).subscribe(
				n => {
					let data = JSON.parse(n.body).procuradorItems[0];
					this.generalBody.nColegiado = data.nColegiado;
					this.generalBody.nombre = data.apellido1 + " " + data.apellido2 + ", " + data.nombre;
					this.nombreCabecera = this.generalBody.nombre;
					
				},
				err => {
					
				});
			this.fechaCabecera = this.generalBody.fechaDesigna;
		}
		
	}

	checkAcceso(procurador: String){
		this.commonsService.checkAcceso(procurador)
		.then(respuesta => {
			this.permisoProcurador = respuesta;
			if(this.permisoEscritura){
				this.perEscritura = true;
			  }else{
				this.perEscritura = false;
			  }
		}
		).catch(error => console.error(error));
	}

	ngOnChanges(changes: SimpleChanges): void {
		if(this.permisoEscritura){
			this.perEscritura = true;
		  }else{
			this.perEscritura = false;
		  }
	}

	search() {
		if (!this.permisoEscritura) {
			this.showMessage(
				'error',
				this.translateService.instant('general.message.incorrect'),
				this.translateService.instant('general.message.existeDesignaAsociado')
			);
		}else if (!this.permisoProcurador) {
			this.showMessage(
				'error',
				this.translateService.instant('general.message.incorrect'),
				this.translateService.instant('general.message.noTienePermisosRealizarAccion')
			);
		}else {
			sessionStorage.setItem("nuevoProcurador", "true");
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

	numberOnly(event): boolean {
		const charCode = (event.which) ? event.which : event.keyCode;
		if (charCode >= 48 && charCode <= 57) {
			return true;
		}
		else {
			return false;

		}
	}

	Disassociate() {
		if (!this.permisoEscritura) {
			this.showMessage(
				'error',
				this.translateService.instant('general.message.incorrect'),
				this.translateService.instant('general.message.existeDesignaAsociado')
			);
		}else if (!this.permisoProcurador) {
			this.showMessage(
				'error',
				this.translateService.instant('general.message.incorrect'),
				this.translateService.instant('general.message.noTienePermisosRealizarAccion')
			);
		} else {
			this.progressSpinner = true;
			let ejgPeticion: EJGItem = this.persistenceService.getDatos();
			ejgPeticion.idProcurador = null;
			ejgPeticion.idInstitucionProc = null;
			ejgPeticion.fechaDesProc = null;
			ejgPeticion.numerodesignaproc = null;
			ejgPeticion.nombreApProcurador = null;
			this.sigaServices.post('gestionejg_guardarProcuradorEJG', ejgPeticion).subscribe(
				(n) => {
					if (n.statusText == "OK") {
						this.showMessage(
							'success',
							this.translateService.instant('general.message.correct'),
							this.translateService.instant('general.message.accion.realizada')
						);
						this.generalBody = new ProcuradorItem();
						this.fechaCabecera = null;
						this.nombreCabecera = "";
						this.persistenceService.setDatos(ejgPeticion);
						this.ejg = ejgPeticion;
					}
					else {
						this.showMessage(
							'error',
							this.translateService.instant('general.message.incorrect'),
							this.translateService.instant('general.mensaje.error.bbdd')
						);
					}
					this.progressSpinner = false;
				},
				(err) => {
					this.progressSpinner = false;
					this.translateService.instant('general.message.error.realiza.accion');
				}
			);
		}
	}

	styleObligatorio(evento) {
		if (this.resaltadoDatos && (evento == undefined || evento == null || evento == "")) {
		  return this.commonsService.styleObligatorio(evento);
		}
	}

	
	muestraCamposObligatorios() {
		this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios') }];
		this.resaltadoDatos = true;
	}

	checkPermisosAsso() {
		if (!this.permisoEscritura) {
			this.showMessage(
				'error',
				this.translateService.instant('general.message.incorrect'),
				this.translateService.instant('general.message.existeDesignaAsociado')
			);
		}else if (!this.permisoProcurador) {
			this.showMessage(
				'error',
				this.translateService.instant('general.message.incorrect'),
				this.translateService.instant('general.message.noTienePermisosRealizarAccion')
			);
		} else {
		  if (this.disabledAssociate()) {
			//this.msgs = this.commonsServices.checkPermisoAccion();
			this.muestraCamposObligatorios();
		  } else {
			this.Associate();
		  }
		}
	  }

	Associate() {

		this.progressSpinner = true;

		let ejgPeticion = this.persistenceService.getDatos();
		ejgPeticion.idProcurador = this.generalBody.idProcurador;
		ejgPeticion.idInstitucionProc = parseInt(this.generalBody.idInstitucion);
		ejgPeticion.fechaDesProc = this.generalBody.fechaDesigna;
		ejgPeticion.numerodesignaproc = this.generalBody.numerodesignacion;
		ejgPeticion.nombreApProcurador = this.generalBody.nombre;
		
		this.sigaServices.post('gestionejg_guardarProcuradorEJG', ejgPeticion).subscribe(
			(n) => {
				this.progressSpinner = false;
				if (n.statusText == "OK") {
					this.showMessage(
						'success',
						this.translateService.instant('general.message.correct'),
						this.translateService.instant('general.message.accion.realizada')
					);

					this.ejg = ejgPeticion;
					this.fechaCabecera = this.generalBody.fechaDesigna;
					this.nombreCabecera = this.generalBody.nombre;
					this.persistenceService.setDatos(this.ejg);
				}
				else {
					this.showMessage(
						'error',
						this.translateService.instant('general.message.incorrect'),
						this.translateService.instant('general.mensaje.error.bbdd')
					);
				}
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
		if (this.generalBody.idProcurador != undefined && this.generalBody.idProcurador != '') {
			return false;
		} else {
			return true;
		}
	}

	disabledAssociate() {
		if (this.generalBody.idProcurador != undefined && this.generalBody.idProcurador != ''
		&& this.generalBody.fechaDesigna != null ) { //&& this.generalBody.numerodesignacion
			return false;
		} else {
			return true;
		}
	}

	disabledDisassociate() {
		if (this.ejg.idProcurador != undefined && this.ejg.idProcurador != '') {
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

