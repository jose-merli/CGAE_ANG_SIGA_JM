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
	ncolegiado: string;
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
	datosTarjetaResumen;
	body;
	datos3;
	permisos: boolean = false;
	isLetrado: boolean = false;
	disabledValidar: boolean = false;
	disabledDenegar: boolean = false;
	disabledSolicitarBaja: boolean = false;
	messageShow: string;
	permisosTarjetaResumen: boolean = true;
	iconoTarjetaResumen = "clipboard";
	enlacesTarjetaResumen: any[] = [];
	manuallyOpened:Boolean;
	permisosTarjetaCola: boolean = true;
	openLetrado : Boolean = false;
	constructor(public datepipe: DatePipe, private translateService: TranslateService, private route: ActivatedRoute, 
		 private sigaServices: SigaServices, private location: Location, private persistenceService: PersistenceService,private commonsService: CommonsService) { }

	ngOnInit() {
		this.datosTarjetaResumen = [];
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

		this.commonsService.checkAcceso(procesos_oficio.tarjetaResumen)
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
		let turno = JSON.parse(sessionStorage.getItem("turno"));
		let datosResumen = [];
		datosResumen[0] = {label: "Turno", value: turno.nombreturno};
		datosResumen[1] = {label: "Fecha Solicitud", value: this.datepipe.transform(turno.fechasolicitud, 'dd/MM/yyyy')};
		datosResumen[2] = {label: "Fecha Efec. Alta", value: this.datepipe.transform(turno.fechavalidacion, 'dd/MM/yyyy')};
		datosResumen[3] = {label: "Estado", value: turno.estadonombre};
		this.datosTarjetaResumen = datosResumen;
		// this.route.queryParams
		// 	.subscribe(params => {
		// 		// this.idPersona = params.idPersona;
		// 		// this.ncolegiado = params.ncolegiado
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
				key: 'letrado',
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
		this.enviarEnlacesTarjeta();

			// this.filtros.filtroAux = this.persistenceService.getFiltrosAux()
			// this.filtros.filtroAux.historico = event;
			// this.persistenceService.setHistorico(event);
			// this.progressSpinner = true;
			// this.sigaServices.post("inscripciones_busquedaInscripciones", this.filtros.filtroAux).subscribe(
			//   n => {
			// 	this.datos = JSON.parse(n.body).inscripcionesItem;
			// 	this.datos.forEach(element => {
			// 	  if(element.estado == "0"){
			// 		element.estadonombre = "Pendiente de Alta";
			// 	  }
			// 	  if(element.estado == "1"){
			// 		element.estadonombre = "Alta";
			// 	  }
			// 	  if(element.estado == "2"){
			// 		element.estadonombre = "Pendiente de Baja";
			// 	  }
			// 	  if(element.estado == "3"){
			// 		element.estadonombre = "Baja";
			// 	  }
			// 	  if(element.estado == "4"){
			// 		element.estadonombre = "Denegada";
			// 	  }
			// 	  element.ncolegiado = +element.ncolegiado;
			// 	});
			// 	this.buscar = true;
			// 	this.progressSpinner = false;
			// 	if (this.tablapartida != undefined) {
			// 	  this.tablapartida.tabla.sortOrder = 0;
			// 	  this.tablapartida.tabla.sortField = '';
			// 	  this.tablapartida.tabla.reset();
			// 	  this.tablapartida.buscadores = this.tablapartida.buscadores.map(it => it = "");
			// 	}
			//   },
			//   err => {
			// 	this.progressSpinner = false;
			// 	console.log(err);
			//   }, () => {
			//   }
			// );
	}

	modoEdicionSend(event) {
		this.modoEdicion = event.modoEdicion;
		this.idPersona = event.idPersona
	}

	datosTarjetaResumenEvent(event) {
		if (event != undefined) {
		  this.datosTarjetaResumen = event;
		}
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
	
		enviarEnlacesTarjeta() {

		this.enlacesTarjetaResumen = [];
	
		let tarjetaLetrado = {
			label: "busquedaSanciones.detalleSancion.letrado.literal",
			value: document.getElementById("datosLetrado"),
			nombre: "datosLetrado",
		  };
	
		 this.enlacesTarjetaResumen.push(tarjetaLetrado);

		 let tarjetaInscripciones= {
			label: "menu.justiciaGratuita.oficio.inscripciones",
			value: document.getElementById("datosInscripcion"),
			nombre: "datosInscripcion",
		  };
	
		 this.enlacesTarjetaResumen.push(tarjetaInscripciones);

		 let tarjetaColaFijaInscripcion= {
			label: "justiciaGratuita.oficio.inscripciones.posicionenlacola",
			value: document.getElementById("colaFijaInscripcion"),
			nombre: "colaFijaInscripcion",
		  };
	
		 this.enlacesTarjetaResumen.push(tarjetaColaFijaInscripcion);

		 let tarjetaGestionInscripciones= {
			label: "justiciaGratuita.oficio.inscripciones.seguimientoInscripcion",
			value: document.getElementById("gestioninscripcion"),
			nombre: "gestioninscripcion",
		  };
	
		 this.enlacesTarjetaResumen.push(tarjetaGestionInscripciones);
	  }
	
	  isCloseReceive(event) {
		if (event != undefined) {
		  	switch (event) {
				case "tarjetaLetrado":
				this.openLetrado = this.manuallyOpened;
				break;
				// case "configTurnos":
				// this.openConfigTurnos = this.manuallyOpened;
				// break;
				// case "configColaOficio":
				// this.openConfigColaOficio = this.manuallyOpened;
				// break;
				// case "colaOficio":
				// this.openColaOficio = this.manuallyOpened;
				// break;
				// case "guardias":
				// this.openGuardias = this.manuallyOpened;
				// break;
				// case "colaGuardias":
				// this.openColaGuardias = this.manuallyOpened;
				// break;
				// case "inscripciones":
				// this.openInscripciones = this.manuallyOpened;
				// break;
			}
		}
	  }
	
	  isOpenReceive(event) {
		
		if (event != undefined) {
		  switch (event) {
			case "tarjetaLetrado":
			  this.openLetrado = true;
			  break;
			// case "configTurnos":
			//   this.openConfigTurnos = true;
			//   break;
			// case "configColaOficio":
			//   this.openConfigColaOficio = true;
			//   break;
			// case "colaOficio":
			//   this.openColaOficio = true;
			//   break;
			// case "guardias":
			//   this.openGuardias = true;
			//   break;
			// case "colaGuardias":
			//   this.openColaGuardias = true;
			//   break;
			// case "inscripciones":
			//   this.openInscripciones = true;
			//   break;
		  }
		}
	   }
}
