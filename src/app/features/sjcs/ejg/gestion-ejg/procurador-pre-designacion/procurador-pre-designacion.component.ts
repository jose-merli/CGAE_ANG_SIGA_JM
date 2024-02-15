import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/primeng';
import { TranslateService } from '../../../../../commons/translate';
import { CommonsService } from '../../../../../_services/commons.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { ProcuradorItem } from '../../../../../models/sjcs/ProcuradorItem';
import { PersistenceService } from '../../../../../_services/persistence.service';

@Component({
	selector: 'app-procurador-pre-designacion',
	templateUrl: './procurador-pre-designacion.component.html',
	styleUrls: ['./procurador-pre-designacion.component.scss']
})
export class ProcuradorPreDesignacionComponent implements OnInit {

	@Input() datos: EJGItem;
	@Input() modoEdicion: boolean;
	@Input() openTarjetaProcuradorPreDesigna;
	@Input() permisoEscritura: boolean = false;
	@Output() guardadoSend = new EventEmitter<any>();

	required: boolean = false;

	msgs: Message[] = [];
	procurador: ProcuradorItem = new ProcuradorItem();
	resumen: any = {
		nombre: "",
		fecha: "" 
	};

	constructor(private sigaServices: SigaServices, private translateService: TranslateService, private commonsService: CommonsService,
		private persistenceService: PersistenceService, private router: Router) { }

	ngOnInit() {
		this.getProcurador();
	}

	clear() {
		this.msgs = [];
	}

	abreCierraFicha() {
		this.openTarjetaProcuradorPreDesigna = !this.openTarjetaProcuradorPreDesigna;
	}

	fillFechaDesigna(event) {
		this.procurador.fechaDesigna = event;
	}

	styleObligatorio(evento) {
		return this.required && this.commonsService.styleObligatorio(evento);
	}

	numberOnly(event): boolean {
		const charCode = (event.which) ? event.which : event.keyCode;
		if (charCode >= 48 && charCode <= 57) {
			return true;
		} else {
			return false;
		}
	}

	disableButton() {
		if (this.procurador.idProcurador != undefined && this.procurador.idProcurador != '') {
			return false;
		} else {
			return true;
		}
	}

	disassociate(){
		if (!this.permisoEscritura) {
			this.showMessage('error', this.translateService.instant('general.message.incorrect'), this.translateService.instant('general.message.noTienePermisosRealizarAccion'));
		} else {
			if(this.datos.idProcurador != null){
				this.datos.idProcurador = null;
				this.datos.idInstitucionProc = null;
				this.datos.fechaDesProc = null;
				this.datos.numerodesignaproc = null;
				this.datos.nombreApProcurador = null;
				this.sigaServices.post('gestionejg_guardarProcuradorEJG', this.datos).subscribe(
					n => {
						if (n.statusText == "OK") {
							this.showMessage('success',this.translateService.instant('general.message.correct'),this.translateService.instant('general.message.accion.realizada'));
							this.procurador = new ProcuradorItem();
							this.updateResumen();
							this.guardadoSend.emit(this.datos);
						}else {
							this.showMessage('error',this.translateService.instant('general.message.incorrect'),this.translateService.instant('general.mensaje.error.bbdd'));
						}
					}, err => {
						this.showMessage('error', "Error", this.translateService.instant('general.message.error.realiza.accion'));
					}
				);
			} else {
				this.procurador = new ProcuradorItem();
			}
		}
	}

	search(){
		if (!this.permisoEscritura) {
			this.showMessage('error', this.translateService.instant('general.message.incorrect'), this.translateService.instant('general.message.noTienePermisosRealizarAccion'));
		} else {
			this.persistenceService.setDatosEJG(this.datos);
			sessionStorage.setItem("nuevoProcurador", "true");
			this.router.navigate(['/busquedaGeneral']);
		}
	}

	associate() {
		if (!this.permisoEscritura) {
			this.showMessage('error', this.translateService.instant('general.message.incorrect'), this.translateService.instant('general.message.noTienePermisosRealizarAccion'));
		} else  if (this.validate()) {
			this.showMessage("error", "Error", this.translateService.instant('general.message.camposObligatorios'));
			this.required = true;
		} else {
			this.datos.idProcurador = this.procurador.idProcurador;
			this.datos.idInstitucionProc = parseInt(this.procurador.idInstitucion);
			this.datos.fechaDesProc = this.procurador.fechaDesigna;
			this.datos.numerodesignaproc = this.procurador.numerodesignacion;
			this.datos.nombreApProcurador = this.procurador.nombre;
	
			this.sigaServices.post('gestionejg_guardarProcuradorEJG', this.datos).subscribe(
				n => {
					if (n.statusText == "OK") {
						this.showMessage('success', this.translateService.instant('general.message.correct'), this.translateService.instant('general.message.accion.realizada'));
						this.guardadoSend.emit(this.datos);
						this.updateResumen();
					} else {
						this.showMessage('error', this.translateService.instant('general.message.incorrect'), this.translateService.instant('general.mensaje.error.bbdd'));
					}
				}, err => {
					this.showMessage('error', "Error", this.translateService.instant('general.message.error.realiza.accion'));
				}
			);
		}
	}

	private getProcurador(){
		/* Procede de search*() */
		if (sessionStorage.getItem("datosProcurador")) {
			let data = JSON.parse(sessionStorage.getItem("datosProcurador"))[0];
			sessionStorage.removeItem("datosProcurador");
			this.abreCierraFicha();
			this.procurador.idProcurador = data.idProcurador;
			this.procurador.nColegiado = data.nColegiado;
			this.procurador.nombre = data.nombreApe;
			if (this.datos.idInstitucionProc != null) this.procurador.fechaDesigna = new Date(this.datos.fechaDesProc);
			this.procurador.numerodesignacion = this.datos.numerodesignaproc;
			this.procurador.idInstitucion = data.idInstitucion;
			this.procurador.idProcurador = data.idProcurador;
		} else if (this.datos.idProcurador != null) {
			this.procurador.fechaDesigna = new Date(this.datos.fechaDesProc);
			this.procurador.numerodesignacion = this.datos.numerodesignaproc;
			this.procurador.idInstitucion = this.datos.idInstitucionProc.toString();
			this.procurador.idProcurador = this.datos.idProcurador;
			this.sigaServices.post("gestionejg_busquedaProcuradorEJG", this.datos).subscribe(
				n => {
					let data = JSON.parse(n.body).procuradorItems[0];
					this.procurador.nColegiado = data.nColegiado;
					this.procurador.nombre = data.apellido1 + " " + data.apellido2 + ", " + data.nombre;
					this.updateResumen();
				}, err => {
					this.updateResumen();
				}
			);
		}
	}

	private updateResumen(){
		this.resumen.nombre = this.procurador.nombre;
		this.resumen.fecha = this.procurador.fechaDesigna;
	}

	private validate() {
		if (this.procurador.idProcurador != undefined && this.procurador.idProcurador != '' && this.procurador.fechaDesigna != null) {
			return false;
		} else {
			return true;
		}
	}

	private showMessage(severity, summary, msg) {
		this.msgs = [];
		this.msgs.push({
			severity: severity,
			summary: summary,
			detail: msg
		});
	}
}