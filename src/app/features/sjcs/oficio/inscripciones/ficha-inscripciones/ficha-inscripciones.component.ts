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
import { ConfirmationService } from '../../../../../../../node_modules/primeng/primeng';
import { ColegiadoItem } from '../../../../../models/ColegiadoItem';
import { ParametroRequestDto } from '../../../../../models/ParametroRequestDto';
import { ParametroDto } from '../../../../../models/ParametroDto';
import { SigaStorageService } from '../../../../../siga-storage.service';
import { ResultadoInscripciones } from '../../../guardia/guardias-inscripciones/ResultadoInscripciones.model';
import { ResultadoInscripcionesBotones } from '../../../guardia/guardias-inscripciones/ResultadoInscripcionesBotones.model';

@Component({
	selector: 'app-ficha-inscripciones',
	templateUrl: './ficha-inscripciones.component.html',
	styleUrls: ['./ficha-inscripciones.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class FichaInscripcionesComponent implements OnInit {
	permisosTarjeta: boolean = true;
	idModelo: string;
	searchParametros: ParametroDto = new ParametroDto();
	institucionActual: any;
	fichasPosibles: any[];
	filtrosConsulta;
	idPersona: string;
	ncolegiado: string;
	turnosItem;
	progressSpinner: boolean = false;
	turnosItem2;
	modoEdicion: boolean;
	disabledSolicitarBaja: boolean = false;
	disabledSolicitarAlta: boolean = false;
	disabledValidar: boolean = false;
	disabledDenegar: boolean = false;
	disabledCambiarFecha: boolean = false;
	msgs;
	inscripcionesSelected;
	idProcedimiento;
	pesosSeleccionadosTarjeta: string;
	datos;
	datosTarjetaResumen;
	letradoItem;
	datos3;
	permisos: boolean = false;
	isLetrado: boolean = false;
	messageShow: string;
	permisosTarjetaResumen: boolean = undefined;
	iconoTarjetaResumen = "clipboard";
	enlacesTarjetaResumen: any[] = [];
	manuallyOpened: Boolean;
	permisosTarjetaCola: boolean = undefined;
	openLetrado: Boolean = false;
	turno: any;
	historico: boolean = false;
	datosColaOficio;
	valorParametroDirecciones: any;
	bodyInicial;
	nuevo: boolean = false;
	infoParaElPadre: { fechasolicitudbajaSeleccionada: any; fechaActual: any; observaciones: any; id_persona: any; idturno: any, idinstitucion: any, idguardia: any, fechasolicitud: any, fechavalidacion: any, fechabaja: any, observacionessolicitud: any, observacionesbaja: any, observacionesvalidacion: any, observacionesdenegacion: any, fechadenegacion: any, observacionesvalbaja: any, observacionesvalidacionNUEVA: any, fechavalidacionNUEVA: any, observacionesvalbajaNUEVA: any, fechasolicitudbajaNUEVA: any, observacionesdenegacionNUEVA: any, fechadenegacionNUEVA: any, observacionessolicitudNUEVA: any, fechasolicitudNUEVA: any, validarinscripciones: any, estado: any }[] = [];
	objetoValidacion: ResultadoInscripcionesBotones[] = [];
	existeTrabajosSJCS: any;
	existeSaltosCompensaciones: any;

	idClasesComunicacionArray: string[] = [];
	idClaseComunicacion: String;
	keys: any[] = [];

	constructor(public datepipe: DatePipe, private translateService: TranslateService, private route: ActivatedRoute,
		private sigaServices: SigaServices, private location: Location, private persistenceService: PersistenceService,
		private router: Router, private commonsService: CommonsService, private confirmationService: ConfirmationService,
		private localStorageService: SigaStorageService, private datePipe: DatePipe) { }

	ngAfterViewInit(): void {
		this.enviarEnlacesTarjeta();
		this.goTop();
	}

	ngOnInit() {
		//console.log('this datos ficha: ', this.datos)
		sessionStorage.setItem("FichaInscripciones", "1");
		this.sigaServices.get("institucionActual").subscribe(n => {
			this.institucionActual = n.value;
			let parametro = new ParametroRequestDto();
			parametro.idInstitucion = this.institucionActual;
			parametro.modulo = "CEN";
			parametro.parametrosGenerales = "SOLICITUDES_MODIF_CENSO";
			this.sigaServices
				.postPaginado("parametros_search", "?numPagina=1", parametro)
				.subscribe(
					data => {
						this.searchParametros = JSON.parse(data["body"]);
						let datosBuscar = this.searchParametros.parametrosItems;
						datosBuscar.forEach(element => {
							if (element.parametro == "SOLICITUDES_MODIF_CENSO") {
								this.valorParametroDirecciones = element.valor;
							}
						});

					},
					err => {
						//console.log(err);
					},
					() => {
					}
				);
		});



		this.datosTarjetaResumen = [];

		this.isLetrado = this.localStorageService.isLetrado;

		if (this.persistenceService.getPermisos()) {
			this.permisos = true;
		} else {
			this.permisos = false;
		}

		this.commonsService.checkAcceso(procesos_oficio.tarjetaResumen)
			.then(respuesta => {
				this.permisosTarjetaResumen = respuesta;
			}).catch(error => console.error(error));

		this.commonsService.checkAcceso(procesos_oficio.tarjetaResumenCola)
			.then(respuesta => {
				this.permisosTarjetaCola = respuesta;
			}).catch(error => console.error(error));
		//this.turno = JSON.parse(sessionStorage.getItem("turno"));
		//if (this.persistenceService.getDatos() != undefined) {
		//En el caso que proceda de ver uno de los turnos o las guardias de las inscripciones
		if (sessionStorage.getItem("Inscripciones")) {
			this.datos = JSON.parse(sessionStorage.getItem("Inscripciones"));
		}
		else this.datos = this.persistenceService.getDatos();
		//Comprueba la procedencia
		if (sessionStorage.getItem("origin") == "newInscrip") {
			this.datos.fechasolicitud = new Date();
			this.modoEdicion = false;
		} else {
			this.modoEdicion = true;
		}

		this.getDatosTarjetaResumen(this.datos);
		this.letradoItem = this.datos;
		this.idPersona = this.datos.idpersona;
		if (this.idPersona == undefined) this.idPersona = this.datos.idPersona;
		if (this.idPersona == null) {
			let colegiadoConectado = new ColegiadoItem();
			colegiadoConectado.nif = this.datos.nif;
			this.sigaServices
				.post("busquedaColegiados_searchColegiado", colegiadoConectado)
				.subscribe(
					data => {
						let colegiadoSeleccionado = JSON.parse(data.body).colegiadoItem[0];
						this.idPersona = colegiadoSeleccionado.idPersona;
					})
		}

		this.datos.fechaActual = new Date();
		this.datos.observaciones = "";

		this.fichasPosibles = [
			{
				key: 'cola',
				activa: true
			},
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


		if (sessionStorage.getItem("Inscripciones") != null) {
			this.datos = JSON.parse(sessionStorage.getItem("Inscripciones"));
			sessionStorage.removeItem("Inscripciones");
		}

		//this.actualizarBotones();
		this.getColaOficio();
		this.HabilitarBotones();
		setTimeout(() => {
			this.enviarEnlacesTarjeta();
			this.progressSpinner = false;
		}, 2000);

		// Controlar boton denegar por si esta validada la inscripcion
		//TODO CONTROLAR SI ES CORRECTO EL INDICE
		if (this.datosTarjetaResumen[2].value) {
			this.disabledDenegar = true;
		}

	}

	ngOnChanges(changes: SimpleChanges) {
		this.datos.fechaActual = new Date();
		this.actualizarBotones();
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

	comunicar() {
		sessionStorage.setItem("rutaComunicacion", "/inscripciones");
		//IDMODULO de SJCS es 10
		sessionStorage.setItem("idModulo", '10');
	
		this.getDatosComunicar();
	}

	showMessage(severity, summary, msg) {
		this.msgs = [];
		this.msgs.push({
			severity: severity,
			summary: summary,
			detail: msg
		});
	}

	checkTrabajosSJCS(selectedDatos, access) {
		this.sigaServices.post("inscripciones_checkTrabajosSJCS", selectedDatos).subscribe(
			n => {
				let keyConfirmation = "deletePlantillaDoc";
				
				if (n.body == true) {
					this.progressSpinner = false;
					this.confirmationService.confirm({
						key: keyConfirmation,
						message: this.translateService.instant("justiciaGratuita.oficio.inscripciones.mensajeSJCS"),
						icon: "fa fa-trash-alt",
						accept: () => {
							if (access == 0) this.validar(1);
							else if (access == 2) this.solicitarBaja(3);
						},
						reject: () => {
							this.msgs = [
								{
									severity: "info",
									summary: "Cancel",
									detail: this.translateService.instant(
										"general.message.accion.cancelada"
									)
								}
							];
						}
					});
				}else{
					if (access == 0) this.validar(1);
					else if (access == 2) this.solicitarBaja(3);
				}
			});
		this.progressSpinner = false;
	}

	validar(access = 0) {
		let vb = 0;
		this.progressSpinner = true;
		let body = new InscripcionesObject();

		body.inscripcionesItem[0] = this.datos;
		body.inscripcionesItem[0].fechaActual = this.datos.fechaActual;
		body.inscripcionesItem[0].observaciones = this.datos.observaciones;
		if (this.datos.estado == "2") vb++;
		if (vb > 0 && access == 0) this.checkTrabajosSJCS(body, access);
		else {
			if (vb > 0) {
				this.sigaServices.post("inscripciones_checkSaltos", body).subscribe(
					n => {
						let keyConfirmation = "deletePlantillaDoc";
						let ins = new InscripcionesObject();
						ins.inscripcionesItem = JSON.parse(n.body).inscripcionesItem;
						if (ins.inscripcionesItem.length > 0) {
							this.progressSpinner = false;
							this.confirmationService.confirm({
								key: keyConfirmation,
								message: this.translateService.instant("justiciaGratuita.oficio.inscripciones.mensajeSaltos"),
								icon: "fa fa-trash-alt",
								accept: () => {
									ins.inscripcionesItem.forEach(element => {
										element.fechaActual = this.datos.fechaActual;
									}
									)
									this.sigaServices.post("inscripciones_updateBorrarSaltos", ins).subscribe();
								}
							})
						}
					}
				)
			}
			this.sigaServices.post("inscripciones_updateValidar", body).subscribe(
				data => {
					this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
					this.progressSpinner = false;
					// Fecha de Validación para inscripcion.
					this.datos.fechavalidacion = new Date(this.datos.fechaActual).getTime();
					if(this.datos.estado == "0"){
						this.datos.estado = "1";
						this.datos.estadonombre = "Alta";
					}else{
						this.datos.estado = "3";
						this.datos.estadonombre = "Baja";
					}
					this.persistenceService.setDatos(this.datos);
					// Desactivar Botón de Validación.
					this.disabledValidar = true;
					//El redireccionamiento es una solucion temporal hasta que se
					//decida el método de actualización de la ficha.
					//this.router.navigate(["/inscripciones"]);
					this.ngOnInit();
					this.actualizarBotones();
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
	}

	denegar() {
		this.progressSpinner = true;
		let body = new InscripcionesObject();
		body.inscripcionesItem[0] = this.datos;
		body.inscripcionesItem[0].fechaActual = this.datos.fechaActual;
		body.inscripcionesItem[0].observaciones = this.datos.observaciones;
		this.sigaServices.post("inscripciones_updateDenegar", body).subscribe(
			data => {
				this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
				this.datos.estado = "4";
				this.datos.estadonombre = "Denegada";
				this.progressSpinner = false;
				this.persistenceService.setDatos(this.datos);
				//El redireccionamiento es una solucion temporal hasta que se
				//decida el método de actualización de la ficha.
				//this.router.navigate(["/inscripciones"]);
				this.ngOnInit();
				this.actualizarBotones();
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

	goTop() {
		let top = document.getElementById("top");
		if (top) {
			top.scrollIntoView();
			top = null;
		}

	}


	getColaOficio() {
		this.datos.historico = this.historico;
		this.progressSpinner = true;
		if (this.datos.idturno != undefined && this.datos.idturno != null) {
			this.sigaServices.post("inscripciones_TarjetaColaOficio", this.datos).subscribe(
				n => {
					// this.datos = n.turnosItem;
					this.datosColaOficio = JSON.parse(n.body).inscripcionesItem;
					this.datosColaOficio.forEach(element => {
						element.orden = +element.orden;
					});
					// if (this.turnosItem.fechabaja != undefined || this.persistenceService.getPermisos() != true) {
					//   this.turnosItem.historico = true;
					// }
				},
				err => {
					//console.log(err);
					this.progressSpinner = false;
				}, () => {
					this.progressSpinner = false;
					let prueba: String = this.datos.ncolegiado.toString();
					let findDato = this.datosColaOficio.find(item => item.numerocolegiado == prueba);
					if (findDato != undefined) {
						this.datos3 = [
							{
								label: "Posición actual en la cola",
								value: findDato.orden
							},
							{
								label: "Número total de letrados apuntados",
								value: this.datosColaOficio.length
							},
						]
					}
				}
			);
		}
	}

	solicitarBaja(access = 2) {
		this.progressSpinner = true;
		let fechaDeHoy = new Date();
		let fechaHoy = this.datepipe.transform(fechaDeHoy, 'dd/MM/yyyy');
		let fechaActual2 = this.datepipe.transform(this.datos.fechaActual, 'dd/MM/yyyy')
		if (fechaActual2 != fechaHoy) {
			this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.oficio.inscripciones.mensajesolicitarbaja"));
		} else {
			let vb = 0;
			let body = new InscripcionesObject();
			body.inscripcionesItem[0] = this.datos;
			body.inscripcionesItem[0].fechaActual = this.datos.fechaActual;
			body.inscripcionesItem[0].observaciones = this.datos.observaciones;
			if (this.datos.estado == "2") vb++;
			if (vb > 0 && access == 2) this.checkTrabajosSJCS(body, access);
			else {
				this.sigaServices.post("inscripciones_updateSolicitarBaja", body).subscribe(
					data => {
						this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
						this.datos.estado = "2";
						this.datos.estadonombre = "Pendiente de Baja";
						this.persistenceService.setDatos(this.datos);
						this.progressSpinner = false;
						//El redireccionamiento es una solucion temporal hasta que se
						//decida el método de actualización de la ficha.
						//this.router.navigate(["/inscripciones"]);
						this.ngOnInit();
						this.actualizarBotones;
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
	}

	changeDateFormat(date1) {
		let date1C = date1;
		// date1 dd/MM/yyyy
		if (!isNaN(Number(date1))) {
			date1C = date1.split("/").reverse().join("-");
		}

		return date1C;
	}

	cambiarFecha() {
		this.progressSpinner = true;
		let body = new InscripcionesObject();
		body.inscripcionesItem[0] = this.datos;
		body.inscripcionesItem[0].fechaActual = this.datos.fechaActual;
		body.inscripcionesItem[0].observaciones = this.datos.observaciones;

		this.sigaServices.post("inscripciones_updateCambiarFecha", body).subscribe(
			data => {
				this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
				this.progressSpinner = false;
				//El redireccionamiento es una solucion temporal hasta que se
				//decida el método de actualización de la ficha.
				//this.router.navigate(["/inscripciones"]);
				this.ngOnInit();
				this.actualizarBotones();
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

	HabilitarBotones() {


		if ((this.datos.estado == "0" || this.datos.estado == "2") && !this.isLetrado) {
			this.disabledValidar = false;
		} else {
			this.disabledValidar = true;
		}

		if ((this.datos.estado == "0" || this.datos.estado == "2") && !this.isLetrado) {
			this.disabledDenegar = false;
		} else {
			this.disabledDenegar = true;
		}


		if (this.datos.estado == "1") {
			this.disabledSolicitarBaja = false;
		} else {
			this.disabledSolicitarBaja = true;

		}

		if (!this.modoEdicion) {
			this.disabledSolicitarAlta = false;
			//HACER EN LA FUNCIÓN 
			// if(this.datos.validarinscripciones == "S"){
			// 	this.datos.estadoNombre == "Pendiente de Alta";
			// }else{
			// 	this.datos.estadoNombre == "Alta";
			// 	this.datos.fechavalidacion == this.datos.fechaActual;
			// }
		} else {
			this.disabledSolicitarAlta = true;

		}

		if ((this.datos.estado == "1" || this.datos.estado == "2" || this.datos.estado == "3") && !this.isLetrado) {
			this.disabledCambiarFecha = false;
		} else {
			this.disabledCambiarFecha = true;
		}

	}
	solicitarAlta() {
		this.progressSpinner = true;

		let body = new InscripcionesObject();
		body.inscripcionesItem = this.inscripcionesSelected.inscripcionesSelected;
		body.inscripcionesItem.forEach(element => {
			if (this.persistenceService.getPermisos() != true) {
				element.estadonombre = "NoPermisos";// Se crea solicitun sin validar
			} else {
				if (this.valorParametroDirecciones == "N") {
					element.estadonombre = "PendienteDeValidar";
				}
			}
			element.idpersona = this.idPersona;
			element.observacionessolicitud = this.datos.observaciones;
			// Fecha introducida por Usuario cuando no es abogado.
			if (!this.isLetrado) {
				element.fechasolicitud = this.datos.fechaActual;
			}
			else{
				element.fechasolicitud = this.datos.fechasolicitud;
			}

		});
		this.sigaServices.post("inscripciones_insertSolicitarAlta", body).subscribe(
			data => {
				//Filtros para busqueda de Inscripciones
				sessionStorage.setItem("filtroInsertInscripcion", JSON.stringify(this.datos));
				this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
				this.progressSpinner = false;
				//Como se puede solicitar el alta para varias guardias no se puede refrescar la pantalla
				//this.location.back();
				this.router.navigate(['/inscripciones']);
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

		let tarjetaInscripciones = {
			label: "menu.justiciaGratuita.oficio.inscripciones",
			value: document.getElementById("datosInscripcion"),
			nombre: "datosInscripcion",
		};

		this.enlacesTarjetaResumen.push(tarjetaInscripciones);

		let tarjetaColaFijaInscripcion = {
			label: "justiciaGratuita.oficio.inscripciones.posicionenlacola",
			value: document.getElementById("colaFijaInscripcion"),
			nombre: "colaFijaInscripcion",
		};

		this.enlacesTarjetaResumen.push(tarjetaColaFijaInscripcion);

		let tarjetaGestionInscripciones = {
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

	getDatosTarjetaResumen(turno: any) {
		let datosResumen = [];
		datosResumen[0] = { label: "Turno", value: turno.nombreturno };
		datosResumen[1] = { label: "Fecha Solicitud", value: this.datepipe.transform(turno.fechasolicitud, 'dd/MM/yyyy') };
		datosResumen[2] = { label: "Fecha Efec. Alta", value: this.datepipe.transform(turno.fechavalidacion, 'dd/MM/yyyy') };
		datosResumen[3] = { label: "Estado", value: turno.estadonombre };
		this.datosTarjetaResumen = datosResumen;
	}

	actualizarBotones() {

		if (this.datos.estado == undefined) {
			if (this.inscripcionesSelected == undefined) { this.disabledSolicitarAlta = true; }//this.disabledValidar = true; }
			else {
				if (this.inscripcionesSelected.inscripcionesSelected.length == 0) {
					this.disabledSolicitarAlta = true;
					//this.disabledValidar = true;
				} else {
					this.disabledSolicitarAlta = false;
					//this.disabledValidar = false;
				}
			}
		}
		else {
			this.disabledSolicitarAlta = true;
		}

		if (this.datos.estado == "1") {
			this.disabledSolicitarBaja = false;
		}
		else {
			this.disabledSolicitarBaja = true;
		}

		if (this.datos.estado == "1" || this.datos.estado == "2" || this.datos.estado == "3") {
			this.disabledCambiarFecha = false;
		}
		else {
			this.disabledCambiarFecha = true;
		}

		// Letrado desactivar funcionalidad de Validar.
		if (this.isLetrado) {
			this.disabledValidar = true;
		}

		// Verificar si ya esta validado la inscripción.
		if (this.datosTarjetaResumen) {

		}

		this.datosTarjetaResumen.forEach(element => {
			if (element.label == "Fecha Efec. Alta") {
				if (element.value != null || element.value != undefined) {
					this.disabledValidar = true;
				}
			}
		});

	}

	seleccionadosSend(datosSelected) {
		this.inscripcionesSelected = datosSelected;
		this.actualizarBotones();
	}

	backTo() {
		if (sessionStorage.getItem("filtroInsertInscripcion")) {
			this.router.navigate(['/inscripciones']);
		} else {
			this.location.back();
		}
	}

		getDatosComunicar() {
		let datosSeleccionados = [];
		let rutaClaseComunicacion = "/inscripciones";

		this.sigaServices
		.post("dialogo_claseComunicacion", rutaClaseComunicacion)
		.subscribe(
			data => {
			this.idClaseComunicacion = JSON.parse(
				data["body"]
			).clasesComunicaciones[0].idClaseComunicacion;
			this.sigaServices
				.post("dialogo_keys", this.idClaseComunicacion)
				.subscribe(
				data => {
					this.keys = JSON.parse(data["body"]).keysItem;
					//    this.actuacionesSeleccionadas.forEach(element => {
					let keysValues = [];
					this.keys.forEach(key => {
					if (this.datos[key.nombre.toLowerCase()] != undefined) {
						keysValues.push(this.datos[key.nombre.toLowerCase()]);
					} 
					});
					datosSeleccionados.push(keysValues);
					sessionStorage.setItem(
						"datosComunicar",
						JSON.stringify(datosSeleccionados)
						);
					//datosSeleccionados.push(keysValues);
					
					this.router.navigate(["/dialogoComunicaciones"]);
				},
				err => {
				//console.log(err);
				}
			);
		},
		err => {
			//console.log(err);
		}
		);
		}
	

}
