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
	permisosTarjetaResumen: boolean = true;
	iconoTarjetaResumen = "clipboard";
	enlacesTarjetaResumen: any[] = [];
	manuallyOpened: Boolean;
	permisosTarjetaCola: boolean = true;
	openLetrado: Boolean = false;
	turno: any;
	historico: boolean = false;
	datosColaOficio;
	valorParametroDirecciones: any;
	constructor(public datepipe: DatePipe, private translateService: TranslateService, private route: ActivatedRoute,
		private sigaServices: SigaServices, private location: Location, private persistenceService: PersistenceService,
		private router: Router, private commonsService: CommonsService, private confirmationService: ConfirmationService,
		private localStorageService: SigaStorageService) { }

	ngAfterViewInit(): void {
		this.enviarEnlacesTarjeta();
		this.goTop();
	}

	ngOnInit() {
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
		this.actualizarBotones();

		if (sessionStorage.getItem("Inscripciones") != null) {
			this.datos = JSON.parse(sessionStorage.getItem("Inscripciones"));
			sessionStorage.removeItem("Inscripciones");
		}

		this.getColaOficio();

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

	comunicar(selectedDatos) {

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
				//temporal
				n.body = true;
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
				}
				if (access == 0) this.validar(1);
				else if (access == 2) this.solicitarBaja(3);
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
					//El redireccionamiento es una solucion temporal hasta que se
					//decida el método de actualización de la ficha.
					//this.router.navigate(["/inscripciones"]);
					this.ngOnInit();
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

	denegar() {
		this.progressSpinner = true;
		let body = new InscripcionesObject();
		body.inscripcionesItem[0] = this.datos;
		body.inscripcionesItem[0].fechaActual = this.datos.fechaActual;
		body.inscripcionesItem[0].observaciones = this.datos.observaciones;
		this.sigaServices.post("inscripciones_updateDenegar", body).subscribe(
			data => {
				this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
				this.progressSpinner = false;
				//El redireccionamiento es una solucion temporal hasta que se
				//decida el método de actualización de la ficha.
				//this.router.navigate(["/inscripciones"]);
				this.ngOnInit();
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
						this.progressSpinner = false;
						//El redireccionamiento es una solucion temporal hasta que se
						//decida el método de actualización de la ficha.
						//this.router.navigate(["/inscripciones"]);
						this.ngOnInit();
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
			
		});
		this.sigaServices.post("inscripciones_insertSolicitarAlta", body).subscribe(
			data => {
				//Filtros para busqueda de Inscripciones
				sessionStorage.setItem("filtroInsertInscripcion", JSON.stringify(this.datos));
				this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
				this.progressSpinner = false;
				//Como se puede solicitar el alta para varias guardias no se puede refrescar la pantalla
				//this.location.back();
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
			if (this.inscripcionesSelected == undefined) this.disabledSolicitarAlta = true;
			else {
				if (this.inscripcionesSelected.inscripcionesSelected.length == 0) this.disabledSolicitarAlta = true;
				else this.disabledSolicitarAlta = false;
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

		if (this.datos.estado == "2" || this.datos.estado == "0") {
			this.disabledValidar = false;
			this.disabledDenegar = false;
		}
		else {
			this.disabledValidar = true;
			this.disabledDenegar = true;
		}

		if (this.datos.estado == "1" || this.datos.estado == "2" || this.datos.estado == "3") {
			this.disabledCambiarFecha = false;
		}
		else {
			this.disabledCambiarFecha = true;
		}
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
}
