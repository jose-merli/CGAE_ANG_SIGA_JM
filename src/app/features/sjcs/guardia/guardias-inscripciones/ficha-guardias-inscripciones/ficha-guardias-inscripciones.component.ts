import { Component, OnInit, ViewEncapsulation, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, DatePipe } from '@angular/common';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { procesos_guardia } from '../../../../../permisos/procesos_guarida';
import { InscripcionesObject } from '../../../../../models/sjcs/InscripcionesObject';
import { TranslateService } from '../../../../../commons/translate/translation.service';
import { ConfirmationService } from '../../../../../../../node_modules/primeng/primeng';
import { ColegiadoItem } from '../../../../../models/ColegiadoItem';
import { ParametroRequestDto } from '../../../../../models/ParametroRequestDto';
import { ParametroDto } from '../../../../../models/ParametroDto';
import { SigaStorageService } from '../../../../../siga-storage.service';
import { GuardiaObject } from '../../../../../models/guardia/GuardiaObject';
import { procesos_oficio } from '../../../../../permisos/procesos_oficio';
import { ResultadoInscripciones } from '../ResultadoInscripciones.model';
import { ResultadoInscripcionesBotones } from '../ResultadoInscripcionesBotones.model';


@Component({
	selector: 'app-ficha-guardias-inscripciones',
	templateUrl: './ficha-guardias-inscripciones.component.html',
	styleUrls: ['./ficha-guardias-inscripciones.component.scss']
})



export class FichaGuardiasInscripcionesComponent implements OnInit {
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
	bodyInicial;
	nuevo: boolean = false;
	infoParaElPadre: { fechasolicitudbajaSeleccionada: any; fechaActual: any; observaciones: any; id_persona: any; idturno: any, idinstitucion: any, idguardia: any, fechasolicitud: any, fechavalidacion: any, fechabaja: any, observacionessolicitud: any, observacionesbaja: any, observacionesvalidacion: any, observacionesdenegacion: any, fechadenegacion: any, observacionesvalbaja: any, observacionesvalidacionNUEVA: any, fechavalidacionNUEVA: any, observacionesvalbajaNUEVA: any, fechasolicitudbajaNUEVA: any, observacionesdenegacionNUEVA: any, fechadenegacionNUEVA: any, observacionessolicitudNUEVA: any, fechasolicitudNUEVA: any, validarinscripciones: any, estado: any }[] = [];
	objetoValidacion: ResultadoInscripcionesBotones[] = [];
	existeTrabajosSJCS: any;
	existeSaltosCompensaciones: any;


	constructor(public datepipe: DatePipe, private translateService: TranslateService, private route: ActivatedRoute,
		private sigaServices: SigaServices, private location: Location, private persistenceService: PersistenceService,
		private router: Router, private commonsService: CommonsService, private confirmationService: ConfirmationService,
		private localStorageService: SigaStorageService) { }

	ngAfterViewInit(): void {
		//this.enviarEnlacesTarjeta();
		this.goTop();
	}

	ngOnInit() {
		sessionStorage.setItem("FichaInscripciones","1");
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

		let isLetrado = this.localStorageService.isLetrado;

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
			if (this.persistenceService.getDatos() != undefined && this.persistenceService.getDatos() != null){
				this.datos = this.persistenceService.getDatos();
			}
		

		//Comprueba la procedencia
		if (sessionStorage.getItem("sesion") == "nuevaInscripcion") {
			this.getDatosTarjetaResumen(this.datos);
			this.datos.fechasolicitud = this.datepipe.transform(new Date(), 'dd/MM/yyyy'); //formatear la fecha
			this.modoEdicion = false;
		} else {
			this.modoEdicion = true;
		}

		this.getDatosTarjetaResumen(this.datos); //PUNTO DE INTERRUPCION PARA VER QUE TIENE DATOS
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
		this.enviarEnlacesTarjeta();
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

	validar() {

		this.controlarfechas();
		let body2 = new ResultadoInscripcionesBotones("");
		body2 = this.datos;

		if (body2.estado = "0") {
			body2.fechavalidacionNUEVA = this.datos.fechaActual;
			body2.observacionesvalidacionNUEVA = this.datos.observaciones;
			body2.fechasolicitudbajaNUEVA = null;
			body2.fechasolicitudbaja = null;
			if (this.datos.fechavalidacion == undefined) {
				body2.fechavalidacion = null;
			} else if (this.datos.fechasolicitud == undefined) {
				body2.fechasolicitud = null;
			} else if (this.datos.fechadenegacion == undefined) {
				body2.fechadenegacion = null;
			}
			if (this.datos.fechabaja == undefined) {
				body2.fechabaja = null;
			}
		} else if (body2.estado = "2") {
			body2.fechasolicitudbajaNUEVA = this.datos.fechaActual;
			body2.observacionesvalbajaNUEVA = this.datos.observaciones;
		}
		/* if (this.datos.fechasolicitudbaja == null) {
			body2.fechavalidacionNUEVA = this.datos.fechaActual;
			body2.observacionesvalidacionNUEVA = this.datos.observaciones;
			body2.fechasolicitudbajaNUEVA = null;
			body2.fechasolicitudbaja=null;
  
			if(this.datos.fechavalidacion == undefined){
			  body2.fechavalidacion = null;
			}else if(this.datos.fechasolicitud == undefined){
			  body2.fechasolicitud = null;
			}else if(this.datos.fechadenegacion == undefined){
			  body2.fechadenegacion = null;
			}
			if(this.datos.fechabaja == undefined){
			  body2.fechabaja = null;
			}
			
		  } else {
			body2.fechasolicitudbajaNUEVA = this.datos.fechaActual;
			body2.observacionesvalbajaNUEVA = this.datos.observaciones;
		  } */

		let objVal: ResultadoInscripcionesBotones = this.rellenarObjetoBackBOTONES(body2);

		this.objetoValidacion.push(objVal);

		this.llamadaBackValidar(this.objetoValidacion, body2.estado);
	}

	llamadaBackValidar(objetoValidacion, estado) {

		this.progressSpinner = true;
		if (estado == "0") {//validacion de estado Pendiente de Alta

			this.sigaServices.post(
				"guardiasInscripciones_validarInscripciones", objetoValidacion).subscribe(
					data => {
						//console.log("entra en el data");
						this.progressSpinner = false;
						//console.log(data);
						//mensaje de okey
						//console.log("Se ha realizado correctamente");
						this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));

					},
					err => {
						this.progressSpinner = false;
						//console.log(err);
						//mensaje de error
						//console.log("No se ha podido realizar el servicio de back");
						this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));

					},
					() => {
						this.commonsService.scrollTablaFoco('tablaFoco');
					});

		} else if (estado == "2") {//validacion de estado Pendiente de Baja

			//comprobacion de si la inscripcion tiene trabajos en SJCS
			this.sigaServices.post(
				"guardiasInscripciones_buscarTrabajosSJCS", objetoValidacion).subscribe(
					data => {
						//console.log("entra en el data");
						this.progressSpinner = false;
						this.existeTrabajosSJCS = data.body;

						if (this.existeTrabajosSJCS == "true") {

							this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("Existen trabajos pendientes en SJCS asociados."));

						} else {

							//comprobacion de si existen saltos y compensaciones para esta inscripcion y eliminar en caso de que asi se requiera

							this.sigaServices.post(
								"guardiasInscripciones_buscarsaltoscompensaciones", objetoValidacion).subscribe(
									data => {

										this.existeSaltosCompensaciones = JSON.parse(data.body);

										if (this.existeSaltosCompensaciones == true) {
											let mess = this.translateService.instant(
												"justiciaGratuita.oficio.inscripciones.mensajeSaltos"
											);
											let icon = "fa fa-edit";
											this.confirmationService.confirm({
												key: 'valBaja',
												message: mess,
												icon: icon,
												accept: () => {
													this.sigaServices.post("guardiasInscripciones_eliminarsaltoscompensaciones", objetoValidacion).subscribe();
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

											this.sigaServices.post(
												"guardiasInscripciones_validarInscripciones", objetoValidacion).subscribe(
													data => {
														this.progressSpinner = false;
														this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));

													},
													err => {
														this.progressSpinner = false;
														this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));

													});
										} else {
											this.sigaServices.post(
												"guardiasInscripciones_validarInscripciones", objetoValidacion).subscribe(
													data => {
														this.progressSpinner = false;
														this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));

													},
													err => {
														this.progressSpinner = false;
														this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));

													});
										}
									},
									err => {
										this.progressSpinner = false;

										this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));

									});

						}

					},
					err => {
						this.progressSpinner = false;

						this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));

					});


		}

	}

	confirmDelete() {
		let mess = this.translateService.instant(
			"justiciaGratuita.oficio.inscripciones.mensajeSaltos"
		);
		let icon = "fa fa-edit";
		this.confirmationService.confirm({
			message: mess,
			icon: icon,
			accept: () => {
				this.delete(); //llamada al back para borrar
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

	delete() {

		this.sigaServices.post("guardiasInscripciones_eliminarsaltoscompensaciones", this.objetoValidacion).subscribe(

			data => {

				this.datos = data.body;
			

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

	llamadaBackSaltosCompensaciones() {
		this.progressSpinner = true;
		this.sigaServices.post(
			"guardiasInscripciones_buscarsaltoscompensaciones", this.objetoValidacion).subscribe(
				data => {
					
					this.progressSpinner = false;
					let existeSaltosCompensaciones = data.body;
					

					if (existeSaltosCompensaciones == true) {
						//mensaje de diálogo de que hay saltos y compensaciones que si está seguro de eliminarlos
						this.confirmDelete();
					} 

					this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));

				},
				err => {
					this.progressSpinner = false;
					//console.log(err);
					
					this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));

				},
				() => {
					this.commonsService.scrollTablaFoco('tablaFoco');
				});

	}

	controlarfechas() {
		if (this.datos.fechasolicitud != undefined || this.datos.fechasolicitud != null || this.datos.fechasolicitud != "") {
			this.datos.fechasolicitud = this.datos.fechasolicitud; // ya viene con formato dd/MM/yyyy hh:mm:ss
			//this.datos.fechasolicitud = this.transformaFecha(this.datos.fechasolicitud);
		} else {
			this.datos.fechasolicitud = null;
		}

		if (this.datos.fechasolicitudbaja != undefined || this.datos.fechasolicitudbaja != null || this.datos.fechasolicitudbaja != "") {
			this.datos.fechasolicitudbaja = this.transformaFecha(this.datos.fechasolicitudbaja);
		} else {
			this.datos.fechasolicitudbaja = null;
		}

		if (this.datos.fechavalidacion != undefined || this.datos.fechavalidacion != null || this.datos.fechavalidacion != "") {
			this.datos.fechavalidacion = this.transformaFecha(this.datos.fechavalidacion);
		} else {
			this.datos.fechavalidacion = null;
		}

		if (this.datos.fechadenegacion != undefined || this.datos.fechavalidacion != null || this.datos.fechavalidacion != "") {
			this.datos.fechadenegacion = this.transformaFecha(this.datos.fechadenegacion);
		} else {
			this.datos.fechadenegacion = null;
		}

		if (this.datos.fechabaja != undefined || this.datos.fechabaja != null || this.datos.fechabaja != "") {
			this.datos.fechabaja = this.transformaFecha(this.datos.fechabaja);
		} else {
			this.datos.fechabaja = null;
		}
	}

	denegar() {
		this.progressSpinner = true;

		this.controlarfechas();

		let body2 = new ResultadoInscripcionesBotones("");
		body2 = this.datos;
		body2.fechadenegacionNUEVA = this.datos.fechaActual;
		body2.observacionesdenegacionNUEVA = this.datos.observaciones;

		let objVal: ResultadoInscripcionesBotones = this.rellenarObjetoBackBOTONES(body2);

		this.objetoValidacion.push(objVal);

		this.sigaServices.post(
			"guardiasInscripciones_denegarInscripciones", this.objetoValidacion).subscribe(
				data => {
				
					this.progressSpinner = false;
				
					this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));

				},
				err => {
					this.progressSpinner = false;
					//console.log(err);
			
					this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));

				},
				() => {
					this.commonsService.scrollTablaFoco('tablaFoco');
				});
	}

	/* llamadaBackDenegar() {

		this.progressSpinner = true;
		this.sigaServices.post(
		  "guardiasInscripciones_denegarInscripciones", this.objetoValidacion).subscribe(
			data => {
			  //console.log("entra en el data");
			  this.progressSpinner = false;
			  //console.log(data);
			  //mensaje de okey
			  //console.log("Se ha realizado correctamente");
			  this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
	
			},
			err => {
			  this.progressSpinner = false;
			  //console.log(err);
			  //mensaje de error
			  //console.log("No se ha podido realizar el servicio de back");
			  this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
	
			},
			() => {
			  this.commonsService.scrollTablaFoco('tablaFoco');
			});
	  } */

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
		if(this.datos.idguardia!= null && this.datos.idguardia!= undefined){
			this.sigaServices.post("guardiasInscripciones_TarjetaColaGuardia", this.datos.idguardia).subscribe(
				n => {
					// this.datos = n.turnosItem;
					this.datosColaOficio = JSON.parse(n.body).combooItems;
					this.datosColaOficio.forEach(element => {
						element.orden = +element.orden;
					});
					
					this.progressSpinner = false;

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

					//console.log("this.datos3: ", this.datos3);
				}
			);
		}
		this.progressSpinner = false;
	}

	solicitarBaja() {

		this.controlarfechas();

		let fechaHoy = this.transformaFecha(new Date());

		let body2 = new ResultadoInscripcionesBotones("");
		body2 = this.datos;
		body2.fechasolicitudbajaNUEVA = this.datos.fechaActual;
		body2.observacionessolicitudNUEVA = this.datos.observaciones;

		if (this.formatDate(this.datos.fechaActual) != this.formatDate(fechaHoy)) {
			this.showMessage("error", this.translateService.instant("general.message.incorrect"), "La fecha elegida no puede ser distinta a la fecha actual.");
		} else {


			//De misma forma se realizará con las guardias del turno al que esté inscrito el colegiado.

			let objVal: ResultadoInscripcionesBotones = this.rellenarObjetoBackBOTONES(body2);

			this.objetoValidacion.push(objVal);

			//mirar si el turno tiene guardias y el colegiado está inscrito se le dará automaticamente de baja a todas las guardias
			this.sigaServices.post(
				"guardiasInscripciones_buscarGuardiasAsocTurnos", this.objetoValidacion).subscribe();

			//•	Al realizar la solicitud el sistema iniciara las consultas necesarias para determinar si el letrado tiene trabajos SJCS pendientes asociados a dicho turno. En el caso de que existan, se mostrará un mensaje de confirmación para realizar la baja de que hay trabajos SJCS pendientes y permitirá realizar la baja.
			let accion = "SolicitarBaja";

			this.llamadaBackTrabajosSJCS(accion);

		}

	}


	llamadaBackSolicitarBaja() {

		this.progressSpinner = true;
		this.sigaServices.post(
			"guardiasInscripciones_solicitarBajaInscripciones", this.objetoValidacion).subscribe(
				data => {
					this.progressSpinner = false;

					this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
					this.objetoValidacion = []
				},
				err => {
					this.progressSpinner = false;

					this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
					this.objetoValidacion = []
				},
				() => {
					this.commonsService.scrollTablaFoco('tablaFoco');
				});
	}

	confirmBaja() {
		let mess = this.translateService.instant(
			"justiciaGratuita.oficio.inscripciones.mensajeSaltos"
		);
		let icon = "fa fa-edit";
		this.confirmationService.confirm({
			message: mess,
			icon: icon,
			accept: () => {
				//permitirá hacer la baja
				this.llamadaBackSolicitarBaja();

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

	llamadaBackTrabajosSJCS(accion) {
		this.progressSpinner = true;
		this.sigaServices.post(
			"guardiasInscripciones_buscarTrabajosSJCS", this.objetoValidacion).subscribe(
				data => {
					this.progressSpinner = false;
					let existeTrabajosSJCS = data.body;

					if (existeTrabajosSJCS == "true") {
						//mensaje de error
						if (accion == "SolicitarBaja") {
							this.confirmBaja();
						}
					} else {
						this.llamadaBackSolicitarBaja();
					}

				},
				err => {
					this.progressSpinner = false;
					//console.log(err);
					this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));

				},
				() => {
					this.commonsService.scrollTablaFoco('tablaFoco');
				});

	}



	formatDate(date) {
		const pattern = 'dd/MM/yyyy';
		return this.datepipe.transform(date, pattern);

	}

	botonesInfo(event) {
		this.infoParaElPadre = event;
		
	}

	cambiarFecha() {
		this.progressSpinner = true;

		this.controlarfechas();

		let body2 = new ResultadoInscripcionesBotones("");
		body2 = this.datos;
		body2.fechasolicitudNUEVA = this.datos.fechaActual;
		body2.observacionessolicitudNUEVA = this.datos.observaciones;


		if (this.datos.estado == "2" || this.datos.estado == "1") {
			//cambiar fecha efectiva de alta
			if (this.datos.fechaActual <= this.datos.fechavalidacion) {
				body2.fechavalidacion = this.datos.fechaActual;
			}

		} else if (this.datos.estado == "3") {
			//cambiar fecha efectiva de baja
			if (this.datos.fechaActual >= this.datos.fechabaja) {
				body2.fechabaja = this.datos.fechaActual;
			}
		}

		let objVal: ResultadoInscripcionesBotones = this.rellenarObjetoBackBOTONES(body2);

		this.objetoValidacion.push(objVal);

		this.llamadaBackCambiarFecha();

		/*body.inscripcionesItem[0] = this.datos;
			body.inscripcionesItem[0].fechaActual = this.datos.fechaActual;
		body.inscripcionesItem[0].observaciones = this.datos.observaciones;
		body.inscripcionesItem[0].historico = undefined;
		body.inscripcionesItem[0].fechasolicitud = this.transformaFecha(this.datos.fechasolicitud);
		body.inscripcionesItem[0].fechavalidacion = this.transformaFecha(this.datos.fechavalidacion);

		this.sigaServices.post("inscripciones_updateCambiarFecha", body).subscribe(
			data => {
				this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
				//mensaje de error de que la fecha de validación es menor o igual a la fecha cumplimentada , por tanto error.
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
		);*/
		//Tengo que ver donde están los datos seleccionados en la tabla de inscripciones y pasarle por input esa variable del hijo al padre, para aquí recorrerla.		
		/*this.infoParaElPadre.forEach(el => {
	    
			el.fechasolicitudNUEVA = el.fechaActual;
			el.observacionessolicitudNUEVA = el.observaciones;
			
			if(el.estado=="2" || el.estado=="1"){
			  //cambiar fecha efectiva de alta
			  if(el.fechaActual <= el.fechavalidacion){
				el.fechavalidacion=el.fechaActual;
			  }
	
			}else if(el.estado=="3"){
			  //cambiar fecha efectiva de baja
			  if(el.fechaActual >= el.fechabaja){
				el.fechabaja=el.fechaActual;
			  }
			}
	
			let objVal: ResultadoInscripcionesBotones = this.rellenarObjetoBackBOTONES(el);
	
			this.objetoValidacion.push(objVal);
	
			this.llamadaBackCambiarFecha();
	
		  });*/

		this.progressSpinner = false;

	}

	llamadaBackCambiarFecha() {

		this.progressSpinner = true;
		this.sigaServices.post(
			"guardiasInscripciones_cambiarFechaInscripciones", this.objetoValidacion).subscribe(
				data => {
					this.progressSpinner = false;
					
					this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
					this.ngOnInit();
				},
				err => {
					this.progressSpinner = false;
					
					this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));

				},
				() => {
					this.commonsService.scrollTablaFoco('tablaFoco');
				});
	}

	rellenarObjetoBackBOTONES(obj) {
		let objeto =
		{
			'idturno': obj['idturno'],
			'estado': obj['estado'],
			'abreviatura': null,
			'validarinscripciones': null,
			'nombreGuardia': null,
			'idguardia': obj['idguardia'],
			'apellidosnombre': null,
			'ncolegiado': null,
			'nombre': null,
			'apellidos': null,
			'apellidos2': null,
			'idinstitucion': obj['idinstitucion'],
			'idpersona': obj.idpersona,
			'fechasolicitud': (obj['fechasolicitud'] != null && obj['fechasolicitud'] != undefined) ? obj['fechasolicitud'] : null,
			'observacionessolicitud': (obj['observacionessolicitud'] != null && obj['observacionessolicitud'] != undefined) ? obj['observacionessolicitud'] : null,
			'fechavalidacion': (obj['fechavalidacion'] != null && obj['fechavalidacion'] != undefined) ? obj['fechavalidacion'] : null,
			'observacionesvalidacion': (obj['observacionesvalidacion'] != null && obj['observacionesvalidacion'] != undefined) ? obj['observacionesvalidacion'] : null,
			'fechasolicitudbaja': (obj['fechasolicitudbaja'] != null && obj['fechasolicitudbaja'] != undefined) ? obj['fechasolicitudbaja'] : null,
			'observacionesbaja': (obj['observacionesbaja'] != null && obj['observacionesbaja'] != undefined) ? obj['observacionesbaja'] : null,
			'fechabaja': (obj['fechabaja'] != null && obj['fechabaja'] != undefined) ? obj['fechabaja'] : null,
			'observacionesvalbaja': (obj['observacionesvalbaja'] != null && obj['observacionesvalbaja'] != undefined) ? obj['observacionesvalbaja'] : null,
			'fechadenegacion': (obj['fechadenegacion'] != null && obj['fechadenegacion'] != undefined) ? obj['fechadenegacion'] : null,
			'observacionesdenegacion': (obj['observacionesdenegacion'] != null && obj['observacionesdenegacion'] != undefined) ? obj['observacionesdenegacion'] : null,
			'fechavaloralta': (obj['fechavaloralta'] != null && obj['fechavaloralta'] != undefined) ? obj['fechavaloralta'] : null,
			'fechavalorbaja': (obj['fechavalorbaja'] != null && obj['fechavalorbaja'] != undefined) ? obj['fechavalorbaja'] : null,
			'code': null,
			'message': null,
			'description': null,
			'infoURL': null,
			'errorDetail': null,
			'observacionesvalidacionNUEVA': (obj['observacionesvalidacionNUEVA'] != null && obj['observacionesvalidacionNUEVA'] != undefined) ? obj['observacionesvalidacionNUEVA'] : null,
			'fechavalidacionNUEVA': (obj['fechavalidacionNUEVA'] != null && obj['fechavalidacionNUEVA'] != undefined) ? obj['fechavalidacionNUEVA'] : null,
			'observacionesvalbajaNUEVA': (obj['observacionesvalbajaNUEVA'] != null && obj['observacionesvalbajaNUEVA'] != undefined) ? obj['observacionesvalbajaNUEVA'] : null,
			'fechasolicitudbajaNUEVA': (obj['fechasolicitudbajaNUEVA'] != null && obj['fechasolicitudbajaNUEVA'] != undefined) ? obj['fechasolicitudbajaNUEVA'] : null,
			'observacionesdenegacionNUEVA': (obj['observacionesdenegacionNUEVA'] != null && obj['observacionesdenegacionNUEVA'] != undefined) ? obj['observacionesdenegacionNUEVA'] : null,
			'fechadenegacionNUEVA': (obj['fechadenegacionNUEVA'] != null && obj['fechadenegacionNUEVA'] != undefined) ? obj['fechadenegacionNUEVA'] : null,
			'observacionessolicitudNUEVA': (obj['observacionessolicitudNUEVA'] != null && obj['observacionessolicitudNUEVA'] != undefined) ? obj['observacionessolicitudNUEVA'] : null,
			'fechasolicitudNUEVA': (obj['fechasolicitudNUEVA'] != null && obj['fechasolicitudNUEVA'] != undefined) ? obj['fechasolicitudNUEVA'] : null,
		};

		return new ResultadoInscripcionesBotones(objeto);
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
		if (this.inscripcionesSelected.inscripcionesSelected != undefined) {
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
				//element.idguardia = this.datos.idGuardia;
				element.observacionessolicitud = this.datos.observaciones;
			});

			this.sigaServices.post("guardiasInscripciones_insertSolicitarAlta", body).subscribe(
				data => {
					this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
					this.progressSpinner = false;
					//Como se puede solicitar el alta para varias guardias no se puede refrescar la pantalla
					this.location.back;
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
		} else {
			this.showMessage("error", this.translateService.instant("general.message.incorrect"), "Debe seleccionar una inscripcion");
		}

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

	getDatosTarjetaResumen(guardia: any) {
		let datosResumen = [];
		datosResumen[0] = { label: "Turno", value: guardia.nombre_turno };
		datosResumen[1] = { label: "Guardia", value: guardia.nombre_guardia };
		datosResumen[2] = { label: "Fecha Sol Alta", value: this.formatDateSol2(guardia.fechasolicitud) };
		datosResumen[3] = { label: "Fecha Efec. Alta", value: guardia.fechavalidacion };
		datosResumen[4] = { label: "Estado", value: guardia.estadonombre };
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
			sessionStorage.setItem("volver", "true");
			this.router.navigate(['/inscripcionesGuardia']);
		

	}

	/*generate(){

		this.progressSpinner = true;
		let url = "";
		if (!this.modoEdicion) {
		  this.nuevo = true;
		  this.persistenceService.setDatos(null);
		  url = "guardiasInscripciones_nuevaInscripcion";
		  this.callSaveService(url);
		  this.progressSpinner=false; //añadido
		} else {
		  url = "guardiasInscripciones_updateInscripcion";
		  this.callSaveService(url);
		  this.progressSpinner=false; //añadido
		}
	}*/

	changeDateFormat(date1) {
		// date1 dd/MM/yyyy
		let date1C = date1.split("/").reverse().join("-")
		return date1C;
	}

	//CAMBIAR ESTA FUNCIÓN, EL OBJETO ES EL MOD CON LAS FECHAS NUEVAS... PARA REUTILIZAR EL CÓDIGO DEL BACK
	rellenarObjetoBack(obj) {
		let objeto =
		{
			'idturno': (obj.idturno != null && obj.idturno != undefined) ? obj.idturno : null,
			'estado': (obj.estado != null && obj.estado != undefined) ? obj.estado : null,
			'abreviatura': obj.abreviatura,
			'validarinscripciones': (obj.validarinscripciones != null && obj.validarinscripciones != undefined) ? obj.validarinscripciones : null,
			'validarjustificaciones': null,
			'nombreGuardia': null,
			'descripcionGuardia': null,
			'idguardia': (obj.idguardia != null && obj.idguardia != undefined) ? obj.idguardia : null,
			'apellidosnombre': obj.apellidosnombre,
			'ncolegiado': (obj.ncolegiado != null && obj.ncolegiado != undefined) ? obj.ncolegiado : null,
			'nombre': null,
			'apellidos': (obj.apellidos != null && obj.apellidos != undefined) ? obj.apellidos : null,
			'apellidos2': (obj.apellidos2 != null && obj.apellidos2 != undefined) ? obj.apellidos2 : null,
			'idinstitucion': (obj.idinstitucion != null && obj.idinstitucion != undefined) ? obj.idinstitucion : null,
			'idpersona': obj.idpersona,
			'fechasolicitud': (obj['fechasolicitud'] != null && obj['fechasolicitud'] != undefined) ? new Date(this.formatDateSol(obj['fechasolicitud'])) : null,
			'observacionessolicitud': (obj.observacionessolicitud != null && obj.observacionessolicitud != undefined) ? obj.observacionessolicitud : null,
			'fechavalidacion': (obj['fechavalidacion'] != null && obj['fechavalidacion'] != undefined) ? new Date(this.changeDateFormat(obj['fechavalidacion'])) : null,
			'observacionesvalidacion': (obj.observacionesvalidacion != null && obj.observacionesvalidacion != undefined) ? obj.observacionesvalidacion : null,
			'fechasolicitudbaja': (obj['fechasolicitudbaja'] != null) ? new Date(this.changeDateFormat(obj['fechasolicitudbaja'])) : null,
			'observacionesbaja': (obj.observacionesbaja != null && obj.observacionesbaja != undefined) ? obj.observacionesbaja : null,
			'fechabaja': (obj['fechabaja'] != null && obj['fechabaja'] != undefined) ? new Date(this.changeDateFormat(obj['fechabaja'])) : null,
			'observacionesvalbaja': (obj.observacionesvalbaja != null && obj.observacionesvalbaja != undefined) ? obj.observacionesvalbaja : null,
			'fechadenegacion': (obj['fechadenegacion'] != null && obj['fechadenegacion'] != undefined) ? new Date(this.changeDateFormat(obj['fechadenegacion'])) : null,
			'observacionesdenegacion': (obj.observacionesdenegacion != null && obj.observacionesdenegacion != undefined) ? obj.observacionesdenegacion : null,
			'fechavaloralta': (obj['fechavaloralta'] != null && obj['fechavaloralta'] != undefined) ? new Date(this.changeDateFormat(obj['fechavaloralta'])) : null,
			'fechavalorbaja': (obj['fechavalorbaja'] != null && obj['fechavalorbaja'] != undefined) ? new Date(this.changeDateFormat(obj['fechavalorbaja'])) : null,
			'code': null,
			'message': null,
			'description': null,
			'infoURL': null,
			'errorDetail': null
		};

		return new ResultadoInscripciones(objeto);
	}
	formatDateSol(date) {
		const pattern = 'dd/MM/yyyy hh:mm:ss';
		return this.datepipe.transform(date, pattern);
	
	  }

	formatDateSol2(date) {
		const pattern = 'dd/MM/yyyy';
		if (date != undefined && !date.includes('/'))
		return this.datepipe.transform(date, pattern);
	
	  }
	callSaveService(url) {

		let objVal: ResultadoInscripciones = this.rellenarObjetoBack(this.datos);
		this.sigaServices.post(url, objVal).subscribe(
			data => {

				this.actualizarFichaResumen();
				if (this.nuevo && data.body == "OK") { //mirar esto bien
					this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("justiciaGratuita.oficio.turnos.mensajeguardarDatos"));
					this.progressSpinner = false;
				} else {
					this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
					this.progressSpinner = false;
				}
			},
			err => {

				if (JSON.parse(err.error).error.description != "") {
					this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
				} else {
					this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
				}
				this.progressSpinner = false;
			},
			() => {
				this.progressSpinner = false;
				this.bodyInicial = JSON.parse(JSON.stringify(this.datos));
			}
		);

	}

	actualizarFichaResumen() {
		if (this.modoEdicion) {

			let datosResumen = [];
			datosResumen[0] = { label: "Turno", value: this.letradoItem.nombre_turno };
			datosResumen[1] = { label: "Guardia", value: this.letradoItem.nombre_guardia };
			datosResumen[2] = { label: "Fecha Sol Alta", value: this.formatDateSol2(this.letradoItem.fechasolicitud) };
			datosResumen[3] = { label: "Fecha Efec. Alta", value: this.letradoItem.fechavalidacion };
			datosResumen[4] = { label: "Estado", value: this.letradoItem.estadonombre };
			this.datosTarjetaResumen = datosResumen;

		}
	}
}