import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { SigaServices } from './../../../_services/siga.service';
import { DialogoComunicacionesItem } from '../../../models/DialogoComunicacionItem';
import { ModelosComunicacionesItem } from '../../../models/ModelosComunicacionesItem';
import { TranslateService } from '../../../commons/translate/translation.service';
import { esCalendar } from './../../../utils/calendar';
import { ConsultaConsultasItem } from '../../../models/ConsultaConsultasItem';
import { CampoDinamicoItem } from '../../../models/CampoDinamicoItem';
import { saveAs } from 'file-saver/FileSaver';
import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { typeSourceSpan } from '@angular/compiler';
import { DataTable } from 'primeng/datatable';
import { Observable } from "rxjs/Observable";
import { truncate } from 'fs';
import { findIndex } from 'rxjs/operators';

@Component({
	selector: 'app-dialogo-comunicaciones',
	templateUrl: './dialogo-comunicaciones.component.html',
	styleUrls: ['./dialogo-comunicaciones.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class DialogoComunicacionesComponent implements OnInit {
	msgs: any;
	selectedItem: number = 10;
	//Diálogo de comunicación
	showComunicar: boolean = false;
	modelosComunicacion: ModelosComunicacionesItem[] = [];
	bodyComunicacion: DialogoComunicacionesItem = new DialogoComunicacionesItem();
	tiposEnvio: any[];
	plantillasEnvio: any[];
	datos: any[];
	datosModelos: any[];
	colsModelos: any = [];
	selectMultipleComunicar: boolean = false;
	first: number = 0;
	currentDate: Date;
	clasesComunicaciones: any = [];
	currentRoute: String;
	selectedModelos: any = [];
	consultasSearch: any ;
	idClaseComunicacion: String;
	idModulo: String;
	keys: String[] = [];
	es: any = esCalendar;
	showValores: boolean = false;
	valores: CampoDinamicoItem[];
	operadoresTexto: any[];
	operadoresNumero: any[];
	listaConsultas: ConsultaConsultasItem[];
	comunicar: boolean = false;
	idInstitucion: String;
	datosSeleccionados: any[];
	maxNumModelos: number = 20;
	progressSpinner: boolean = false;
	rutaComunicacion: String;
	fechaProgramada: Date;
	plantillas: any[] = [];
	idConsulta: string;
	dato: any;
	selectedModelosSend: any = [];
	selectAll: boolean = false;
	@ViewChild('table') tableModelos: DataTable;

	constructor(
		public sigaServices: SigaServices,
		private translateService: TranslateService,
		private location: Location
	) { }

	ngOnInit() {

		if (sessionStorage.getItem("consultasSearch") != undefined) {
			this.consultasSearch = JSON.parse(sessionStorage.getItem("consultasSearch"));
		}

		this.progressSpinner = true;
		this.datosSeleccionados = JSON.parse(sessionStorage.getItem('datosComunicar'));
		sessionStorage.removeItem('back');
		this.getInstitucion();
		
		this.getMaxNumeroModelos();
		this.getFechaProgramada();
		this.getPlantillas();
		this.currentDate = new Date();

		this.valores = [];

		this.operadoresTexto = [
			{
				label: '=',
				value: '='
			},
			{
				label: '!=',
				value: '!='
			},
			{
				label: 'IS NULL',
				value: 'IS NULL'
			},
			{
				label: 'LIKE',
				value: 'LIKE'
			}
		];

		this.operadoresNumero = [
			{
				label: '=',
				value: '='
			},
			{
				label: '!=',
				value: '!='
			},
			{
				label: '>',
				value: '>'
			},
			{
				label: '>=',
				value: '>='
			},
			{
				label: '<',
				value: '<'
			},
			{
				label: '<=',
				value: '<='
			},
			{
				label: 'IS NULL',
				value: 'IS NULL'
			}
		];

		this.colsModelos = [
			{
				field: 'nombre',
				header:
					'informesycomunicaciones.comunicaciones.fichaRegistroComunicacion.configuracion.modeloComunicaciones'
			},
			{ field: 'plantillas', header: 'enviosMasivos.literal.plantillasEnvio' },
			{ field: 'tipoEnvio', header: 'informesycomunicaciones.comunicaciones.busqueda.tipoEnvio' }
		];
	}

	getClaseComunicaciones() {
		this.rutaComunicacion = sessionStorage.getItem('rutaComunicacion');
		this.sigaServices.post('dialogo_claseComunicacion', this.rutaComunicacion).subscribe(
			(data) => {
				this.idClaseComunicacion = JSON.parse(data['body']).clasesComunicaciones[0].idClaseComunicacion;
				this.getModelosComunicacion();
			},
			(err) => {
				console.log(err);
			}
		);
	}

	onChangeClaseComunicacion() {
		this.getModelosComunicacion();
	}

	getModelosComunicacion() {
		this.idModulo = sessionStorage.getItem('idModulo');

		if (this.idClaseComunicacion == '5') {
			this.idConsulta = sessionStorage.getItem('idConsulta');
		}

		if (this.consultasSearch != undefined) {
			this.idInstitucion = this.consultasSearch.idInstitucion;
		}
 		if (sessionStorage.getItem('idInstitucion') != undefined) {
            this.idInstitucion = sessionStorage.getItem('idInstitucion');
        } 
		let modeloSearch = {
			idModulo: this.idModulo,
			idClaseComunicacion: this.idClaseComunicacion,
			idConsulta: this.idConsulta,
			idInstitucion: this.idInstitucion
		};

		this.sigaServices.post('dialogo_modelosComunicacion', modeloSearch).subscribe(
			(data) => {
				this.modelosComunicacion = JSON.parse(data['body']).modelosComunicacionItems;

				for (let index = 0; index < this.modelosComunicacion.length; index++) {
					const element = this.modelosComunicacion[index];

					if (element.preseleccionar == 'SI') {
						this.selectedModelos.push(element);
					}
				}
				this.progressSpinner = false;
			},
			(err) => {
				console.log(err);
				this.progressSpinner = false;
			}
		);
	}

	onChangeSelectAll() {
		if (this.selectAll) {
			this.selectedModelos = JSON.parse(JSON.stringify(this.modelosComunicacion));
		} else {
			this.selectedModelos = [];
		}
	}

	onChangePlantillaEnvio(dato) {
		this.getTipoEnvios(dato);
	}

	getTipoEnvios(dato) {
		this.sigaServices.post('dialogo_tipoEnvios', dato.idPlantillaEnvio).subscribe(
			(data) => {
				let tipoEnvio = JSON.parse(data['body']).tipoEnvio;
				dato.tipoEnvio = tipoEnvio.tipoEnvio;
				dato.idTipoEnvio = tipoEnvio.idTipoEnvio;
			},
			(err) => {
				console.log(err);
			}
		);
	}

	obtenerCamposDinamicos(accion) {
		this.bodyComunicacion.modelos = this.selectedModelos;
		this.bodyComunicacion.idClaseComunicacion = this.idClaseComunicacion;

		if (this.consultasSearch != undefined ) {
			this.bodyComunicacion.idInstitucion = this.consultasSearch.idInstitucion;
		} else {
			this.bodyComunicacion.idInstitucion = this.idInstitucion;
		}


		if (accion == 'comunicar') {
			this.comunicar = true;
		} else {
			this.comunicar = false;
		}

		this.bodyComunicacion.comunicar = this.comunicar;

		if (this.comunicar && !this.comprobarPlantillas()) {
			this.showFail('Se ha de seleccionar al menos una plantilla de envio por modelo');
		} else {
			this.progressSpinner = true;
			this.sigaServices.post('dialogo_obtenerCamposDinamicos', this.bodyComunicacion).subscribe(
				(data) => {
					console.log(data);
					this.valores = [];
					this.listaConsultas = JSON.parse(data['body']).consultaItem;
					this.listaConsultas.forEach((element) => {
						if (element.camposDinamicos != null) {
							element.camposDinamicos.forEach((campo) => {

								let find = this.valores.find(x => x.campo == campo.campo);
								if (find == undefined) {
									this.valores.push(campo);
								}
							});
						}
					});

					if (this.valores.length > 0) {
						this.showValores = true;
					} else {
						if (this.comunicar) {
							this.enviarComunicacion();
						} else {
							this.descargarComunicacion();
						}
					}
				},
				(err) => {
					console.log(err);
					this.progressSpinner = false;
					let message = JSON.parse(err.error).error.message;

					if (message == null || message == undefined) {
						message = '';
					}

					this.showFail(
						this.translateService.instant(
							'informesycomunicaciones.modelosdecomunicacion.consulta.errorParametros'
						) + ' ' + message
					);
				},
				() => {
					this.progressSpinner = false;
				}

			);
		}
	}

	comprobarPlantillas() {
		let envioCorrecto = true;
		this.bodyComunicacion.modelos.forEach((element) => {
			if (!element.idPlantillaEnvio || element.idPlantillaEnvio == null || element.idPlantillaEnvio == '') {
				envioCorrecto = false;
			}
		});
		return envioCorrecto;
	}

	enviarComunicacion() {
		this.progressSpinner = true;

		this.valores.forEach((element) => {
			if (element.valor != null && typeof element.valor == 'object') {
				element.valor = element.valor.ID;
			}
			if (element.valores != undefined && element.valores != null) {
				let empty = {
					ID: 0,
					DESCRIPCION: 'Seleccione una opción...'
				};
				element.valores.unshift(empty);
			}
			if (element.operacion == 'OPERADOR') {
				element.operacion = this.operadoresNumero[0].value;
			}
		});

		if (this.datosSeleccionados != null && this.datosSeleccionados != undefined) {

			if (this.consultasSearch != undefined) {
				this.idInstitucion = this.consultasSearch.idInstitucion;
			}

			let datos = {
				idClaseComunicacion: this.idClaseComunicacion,
				modelos: this.bodyComunicacion.modelos,
				selectedDatos: this.datosSeleccionados,
				idInstitucion: this.idInstitucion,
				consultas: this.listaConsultas,
				comunicar: this.comunicar,
				ruta: this.rutaComunicacion,
				fechaProgramada: this.bodyComunicacion.fechaProgramacion
			};

			this.sigaServices.post('dialogo_generarEnvios', datos).subscribe(
				(data) => {
					this.showSuccess(
						this.translateService.instant('informesycomunicaciones.comunicaciones.mensaje.envio.generado')
					);
					this.showValores = false;
					this.backTo();
				},
				(err) => {
					console.log(err);
					this.showFail(
						this.translateService.instant(
							'informesycomunicaciones.comunicaciones.mensaje.envio.error.generar'
						)
					);
					this.progressSpinner = false;
				},
				() => {
					this.progressSpinner = false;
				}
			);
		} else {
			this.showFail(
				this.translateService.instant('informesycomunicaciones.comunicaciones.mensaje.envio.error.datos')
			);
			this.progressSpinner = false;
		}
	}

	enviar() {
		console.log(this.listaConsultas);
	}

	onRowSelectModelos(event) {
		event.data = true;
		return event.data;
	}

	onUnRowSelectModelos(event) {
		event.data = false;
		return event.data;
	}

	getKeysClaseComunicacion() {
		this.sigaServices.post('dialogo_keys', this.idClaseComunicacion).subscribe(
			(data) => {
				this.keys = JSON.parse(data['body']);
			},
			(err) => {
				console.log(err);
			}
		);
	}

	validarCamposDinamicos() {
		let valido = true;
		this.valores.forEach((element) => {
			if (valido) {
				if (!element.valorNulo) {
					if (element.valor != undefined && element.valor != null && element.valor != '') {
						valido = true;
					} else {
						valido = false;
					}
				} else {
					valido = true;
				}
			}
		});
		return valido;
	}

	descargarComunicacion() {
		this.progressSpinner = true;

		this.valores.forEach((element) => {
			if (element.valor != null && typeof element.valor == 'object') {
				if (element.valor.ID != null && element.valor.ID != undefined) {
					element.valor = element.valor.ID;
				}
			}
			if (element.valores != undefined && element.valores != null) {
				let empty = {
					ID: 0,
					DESCRIPCION: 'Seleccione una opción...'
				};
				element.valores.unshift(empty);
			}
			if (element.operacion == 'OPERADOR') {
				element.operacion = this.operadoresNumero[0].value;
			}
		});

		if (this.listaConsultas != null) {
			for (let i = 0; this.listaConsultas.length > i; i++) {

				if (this.listaConsultas[i].camposDinamicos != null) {
					for (let j = 0; this.listaConsultas[i].camposDinamicos.length > j; j++) {

						let find = this.valores.find(x => x.campo == this.listaConsultas[i].camposDinamicos[j].campo);
						if (find != undefined) {
							this.listaConsultas[i].camposDinamicos[j].valor = find.valor;
							this.listaConsultas[i].camposDinamicos[j].operacion = find.operacion;
						}
					}
				}

			}
		}

		if (this.consultasSearch != undefined) {
			this.idInstitucion = this.consultasSearch.idInstitucion;
		}

		let datos = {
			idClaseComunicacion: this.idClaseComunicacion,
			modelos: this.bodyComunicacion.modelos,
			selectedDatos: this.datosSeleccionados,
			idInstitucion: this.idInstitucion,
			consultas: this.listaConsultas,
			comunicar: this.comunicar,
			ruta: this.rutaComunicacion
		};

		let filename;
		this.sigaServices
			.post("dialogo_nombredoc", datos)
			.subscribe(
				data => {
					if (data["body"] != "") {
						let fileInfo = JSON.parse(data["body"]);
						if (fileInfo.name != "ResultadoConsulta.xlsx") {
							filename = fileInfo.name;
						} else {
							if (sessionStorage.getItem('nombreConsulta') != undefined) {
								filename = sessionStorage.getItem('nombreConsulta');
								filename += ".xlsx"
							} else {
								filename = fileInfo.name;
							}
						}


						this.sigaServices.postDownloadFiles('dialogo_descargar', fileInfo).subscribe(
							(data) => {
								if (data.size != 0) {
									// let a = JSON.parse(data);
									const blob = new Blob([data], { type: 'text/csv' });

									if (blob != undefined) {
										// 	saveAs(blob, data.nombre);
										// } else {
										saveAs(blob, filename);
										this.progressSpinner = false;
									}
									this.showValores = false;
								} else {
									this.showValores = false;
									this.progressSpinner = false;
									this.showFail(
										this.translateService.instant('informes.error.descargaDocumento')
									);
								}
							},
							(error) => {
								console.log(error);

								this.progressSpinner = false;
								if (error.message != null && error.message != undefined) {
									this.showFail(error.message)
								} else {
									this.showFail(this.translateService.instant('informes.error.descargaDocumento'));
								}

							},
							() => {
								this.progressSpinner = false;
							}
						);
					}
				},
				err => {
					this.progressSpinner = false;
					this.showValores = false;
					console.log(err);
					let mensaje = this.translateService.instant('informes.error.descargaDocumento');
					if (err != null && err != undefined && err.error != null && err.error != undefined) {
						let errDTO = JSON.parse(err.error);
						if (errDTO.message != null && errDTO.message != undefined) {
							mensaje = errDTO.message;
						}
					}
					this.showFail(mensaje);

				}
			);


	}

	parseErrorBlob(err: HttpErrorResponse): Observable<any> {
		const reader: FileReader = new FileReader();

		const obs = Observable.create((observer: any) => {
			reader.onloadend = (e) => {
				observer.error(JSON.parse(reader.result as string));
				observer.complete();
				this.showFail(JSON.parse(reader.result as string));
			}
		});
		reader.readAsText(err.error);
		return obs;
	}

	getInstitucion() {
        this.sigaServices.get('institucionActual').subscribe((n) => {
            this.idInstitucion = n.value;
            this.getClaseComunicaciones();
        });
	}

	getMaxNumeroModelos() {
		this.sigaServices.get('dialogo_maxModelos').subscribe((n) => {
			this.maxNumModelos = n.value;
		});
	}

	getFechaProgramada() {
		this.sigaServices.get('dialogo_fechaProgramada').subscribe(
			(n) => {
				this.bodyComunicacion.fechaProgramacion = new Date(n.fecha);
			},
			(err) => {
				console.log(err);
			}
		);
	}

	// Mensajes
	showFail(mensaje: string) {
		this.msgs = [];
		this.msgs.push({ severity: 'error', summary: '', detail: mensaje });
	}

	showSuccess(mensaje: string) {
		this.msgs = [];
		this.msgs.push({ severity: 'success', summary: '', detail: mensaje });
	}

	showInfo(mensaje: string) {
		this.msgs = [];
		this.msgs.push({ severity: 'info', summary: '', detail: mensaje });
	}

	clear() {
		this.msgs = [];
	}

	backTo() {
		sessionStorage.setItem('back', 'true');
		this.location.back();
	}

	getPlantillas() {
		this.sigaServices.get('modelos_detalle_plantillasComunicacion').subscribe(
			(data) => {
				this.plantillas = data.combooItems;
				this.plantillas.unshift({ label: 'Seleccionar', value: '' });
			},
			(err) => {
				console.log(err);
			},
			() => { }
		);
	}

	fillFechaProgramacionCalendar(event) {
		this.bodyComunicacion.fechaProgramacion = event;
	}

	fillFecha(event, dato) {
		dato.valor = event;
	}
}
