import { Component, OnInit, ViewEncapsulation, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, DatePipe } from '@angular/common';
import { TurnosItems } from '../../../../../models/sjcs/TurnosItems';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { procesos_oficio } from '../../../../../permisos/procesos_oficio';
import { InscripcionesItems } from '../../../../../models/sjcs/InscripcionesItems';
import { InscripcionesObject } from '../../../../../models/sjcs/InscripcionesObject';
import { TranslateService } from '../../../../../commons/translate/translation.service';

@Component({
	selector: 'app-ficha-inscripciones',
	templateUrl: './ficha-inscripciones.component.html',
	styleUrls: ['./ficha-inscripciones.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class FichaInscripcionesComponent implements OnInit {
	idModelo: string;
	fichasPosibles: any[];
	filtrosConsulta;
	idPersona: string;
	turnosItem;
	progressSpinner: boolean = false;
	turnosItem2;
	modoEdicion: boolean;
	selectedDatos;
	msgs;
	fechaDeHoy;
	datosSelected;
	idProcedimiento;
	pesosSeleccionadosTarjeta: string;
	datos;
	datos2;
	body;
	datos3;
	permisos: boolean = false;
	isLetrado: boolean = false;
	disabledValidar: boolean = false;
	disabledDenegar: boolean = false;
	disabledSolicitarBaja: boolean = false;
	messageShow: string;
	permisosTarjetaResumen: boolean = true;
	permisosTarjetaCola: boolean = true;

	constructor(private translateService: TranslateService, private route: ActivatedRoute, private sigaServices: SigaServices, private datepipe: DatePipe, private location: Location, private persistenceService: PersistenceService, private commonsService: CommonsService) { }

	ngOnInit() {
		this.selectedDatos = [];
		this.datosSelected = new InscripcionesItems();
		this.datosSelected.fechaActual = new Date();
		this.datosSelected.observaciones = " ";
		if (
			sessionStorage.getItem("isLetrado") != null &&
			sessionStorage.getItem("isLetrado") != undefined
		) {
			this.isLetrado = JSON.parse(sessionStorage.getItem("isLetrado"));
		}

		if (this.persistenceService.getPermisos()) {
			this.permisos = true;
		} else {
			this.permisos = false;
		}

		this.commonsService.checkAcceso(procesos_oficio.tarjetaResumenInscripciones)
			.then(respuesta => {
				this.permisosTarjetaResumen = respuesta;
				if (this.permisosTarjetaResumen != true) {
					this.permisosTarjetaResumen = false;
				} else {
					this.permisosTarjetaResumen = true;
				}
			}).catch(error => console.error(error));

		this.commonsService.checkAcceso(procesos_oficio.tarjetaResumenCola)
			.then(respuesta => {
				this.permisosTarjetaCola = respuesta;
				if (this.permisosTarjetaCola != true) {
					this.permisosTarjetaCola = false;
				} else {
					this.permisosTarjetaCola = true;
				}
			}).catch(error => console.error(error));
		// this.route.queryParams
		// 	.subscribe(params => {
		// 		this.idPersona = params.idpersona
		// 		console.log(params);
		// 	});
		if (this.persistenceService.getDatos() != undefined) {
			this.datos = this.persistenceService.getDatos();
			this.modoEdicion = true;
		} else {
			this.datos = new InscripcionesItems();
			this.modoEdicion = false;
		}

		this.fichasPosibles = [
			{
				key: 'generales',
				activa: true
			},
			{
				key: 'inscripcion',
				activa: true
			},
			{
				key: 'gestioninscripcion',
				activa: true
			},
		];
		if (this.datos.estadonombre == "Alta") {
			this.disabledSolicitarBaja = false;
		} else {
			this.disabledSolicitarBaja = true;
		}
		if (this.datos.estadonombre == "Pendiente de Baja" || this.datos.estadonombre == "Pendiente de Alta") {
			this.disabledValidar = false;
			this.disabledDenegar = false;
		} else {
			this.disabledValidar = true;
			this.disabledDenegar = true;
		}
	}

	modoEdicionSend(event) {
		this.modoEdicion = event.modoEdicion;
		this.idPersona = event.idPersona
	}

	datosSend(event) {
		this.datos2 = event;
	}

	datosSend2(event) {
		this.datos3 = event;
	}
	seleccionadosSend(event) {
		this.selectedDatos = event.prueba;
	}
	backTo() {
		this.location.back();
	}


	showMessage(severity, summary, msg) {
		this.msgs = [];
		this.msgs.push({
			severity: severity,
			summary: summary,
			detail: msg
		});
	}

	validar(selectedDatos) {
		this.progressSpinner = true;
		this.body = new InscripcionesObject();
		this.body.inscripcionesItem = selectedDatos
		this.body.inscripcionesItem.forEach(element => {
			element.idpersona = this.datos.idpersona;
			element.fechaActual = this.datosSelected.fechaActual;
			element.observaciones = this.datosSelected.observaciones;
			element.fechasolicitud = this.datos.fechasolicitud;
			element.fechadenegacion = this.datos.fechadenegacion;
			element.fechabaja = this.datos.fechabaja;
			element.fechasolicitudbaja = this.datos.fechasolicitudbaja;
			element.fechavalidacion = this.datos.fechavalidacion;
			element.estadonombre = this.datos.estadonombre;
			element.validarinscripciones = this.datos.validarinscripciones;
			element.tipoguardias = this.datos.tipoguardias;
		});
		this.sigaServices.post("inscripciones_updateValidar", this.body).subscribe(
			data => {
				this.selectedDatos = [];
				// this.searchPartidas.emit(false);
				this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
				this.progressSpinner = false;
			},
			err => {
				if (err != undefined && JSON.parse(err.error).error.description != "") {
					this.showMessage("success", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
				} else {
					this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
				}
				this.progressSpinner = false;
			},
			() => {
				this.progressSpinner = false;
			}
		);
	}

	denegar(selectedDatos) {
		this.progressSpinner = true;
		this.body = new InscripcionesObject();
		this.body.inscripcionesItem = selectedDatos
		this.body.inscripcionesItem.forEach(element => {
			element.idpersona = this.datos.idpersona;
			element.fechaActual = this.datosSelected.fechaActual;
			element.observaciones = this.datosSelected.observaciones;
			element.fechasolicitud = this.datos.fechasolicitud;
			element.fechadenegacion = this.datos.fechadenegacion;
			element.fechabaja = this.datos.fechabaja;
			element.fechasolicitudbaja = this.datos.fechasolicitudbaja;
			element.fechavalidacion = this.datos.fechavalidacion;
			element.estadonombre = this.datos.estadonombre;
			element.validarinscripciones = this.datos.validarinscripciones;
			element.tipoguardias = this.datos.tipoguardias;
		});
		this.sigaServices.post("inscripciones_updateDenegar", this.body).subscribe(
			data => {
				this.selectedDatos = [];
				// this.searchPartidas.emit(false);
				this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
				this.progressSpinner = false;
			},
			err => {
				if (err != undefined && JSON.parse(err.error).error.description != "") {
					this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
				} else {
					this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
				}
				this.progressSpinner = false;
			},
			() => {
				this.progressSpinner = false;
			}
		);
	}


	solicitarBaja(selectedDatos) {
		this.progressSpinner = true;
		this.fechaDeHoy = new Date();
		let fechaHoy = this.datepipe.transform(this.fechaDeHoy, 'dd/MM/yyyy');
		let fechaActual2 = this.datepipe.transform(this.datosSelected.fechaActual, 'dd/MM/yyyy')
		if (fechaActual2 != fechaHoy) {
			this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.oficio.inscripciones.mensajesolicitarbaja"));
		} else {
			this.body = new InscripcionesObject();
			this.body.inscripcionesItem = selectedDatos
			this.body.inscripcionesItem.forEach(element => {
				element.idpersona = this.datos.idpersona;
				element.fechaActual = this.datos.fechaActual;
				element.observaciones = this.datos.observaciones;
				element.fechasolicitud = this.datos.fechasolicitud;
				element.fechadenegacion = this.datos.fechadenegacion;
				element.fechabaja = this.datos.fechabaja;
				element.fechasolicitudbaja = this.datos.fechasolicitudbaja;
				element.fechavalidacion = this.datos.fechavalidacion;
				element.estadonombre = this.datos.estadonombre;
				element.validarinscripciones = this.datos.validarinscripciones;
				element.tipoguardias = this.datos.tipoguardias;
			});
			this.sigaServices.post("inscripciones_updateSolicitarBaja", this.body).subscribe(
				data => {
					this.selectedDatos = [];
					//   this.searchPartidas.emit(false);
					this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
					this.progressSpinner = false;
				},
				err => {
					if (err != undefined && JSON.parse(err.error).error.description != "") {
						this.showMessage("success", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
					} else {
						this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
					}
					this.progressSpinner = false;
				},
				() => {
					this.progressSpinner = false;
				}
			);
		}
	}

	cambiarFecha(selectedDatos) {
		this.progressSpinner = true;
		this.body = new InscripcionesObject();
		this.body.inscripcionesItem = selectedDatos
		this.body.inscripcionesItem.forEach(element => {
			element.idpersona = this.datos.idpersona;
			element.fechaActual = this.datos.fechaActual;
			element.observaciones = this.datos.observaciones;
			element.fechasolicitud = this.datos.fechasolicitud;
			element.fechadenegacion = this.datos.fechadenegacion;
			element.fechabaja = this.datos.fechabaja;
			element.fechasolicitudbaja = this.datos.fechasolicitudbaja;
			element.fechavalidacion = this.datos.fechavalidacion;
			element.estadonombre = this.datos.estadonombre;
			element.validarinscripciones = this.datos.validarinscripciones;
			element.tipoguardias = this.datos.tipoguardias;
		});
		this.sigaServices.post("inscripciones_updateCambiarFecha", this.body).subscribe(
			data => {
				this.selectedDatos = [];
				// this.searchPartidas.emit(false);
				this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
				this.progressSpinner = false;
			},
			err => {
				if (err != undefined && JSON.parse(err.error).error.description != "") {
					this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
				} else {
					this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
				}
				this.progressSpinner = false;
			},
			() => {
				this.progressSpinner = false;
			}
		);
	}


	fillFechaCalendar(event) {
		this.datos.fechaActual = this.transformaFecha(event);
	}


	transformaFecha(fecha) {
		if (fecha != null) {
			let jsonDate = JSON.stringify(fecha);
			let rawDate = jsonDate.slice(1, -1);
			if (rawDate.length < 14) {
				let splitDate = rawDate.split("/");
				let arrayDate = splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0];
				fecha = new Date((arrayDate += "T00:00:00.001Z"));
			} else {
				fecha = new Date(fecha);
			}
		} else {
			fecha = undefined;
		}


		return fecha;
	}
}
