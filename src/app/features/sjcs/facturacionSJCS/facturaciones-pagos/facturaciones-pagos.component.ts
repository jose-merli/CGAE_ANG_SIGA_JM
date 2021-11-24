import { Component, OnInit, ViewChild, EventEmitter, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SigaServices } from "../../../../_services/siga.service";
import { CommonsService } from '../../../../_services/commons.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { TranslateService } from '../../../../commons/translate';
import { procesos_facturacionSJCS } from '../../../../permisos/procesos_facturacionSJCS';
import { FiltroBusquedaFacturacionComponent } from "./filtro-busqueda-facturacion/filtro-busqueda-facturacion.component";
import { TablaBusquedaFacturacionComponent } from "./tabla-busqueda-facturacion/tabla-busqueda-facturacion.component";
import { FacturacionItem } from '../../../../models/sjcs/FacturacionItem';
import { ErrorItem } from '../../../../models/ErrorItem';
import { FacturacionDeleteDTO } from '../../../../models/sjcs/FacturacionDeleteDTO';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-facturaciones-pagos',
	templateUrl: './facturaciones-pagos.component.html',
	styleUrls: ['./facturaciones-pagos.component.scss']
})

export class FacturacionesYPagosComponent implements OnInit, OnDestroy {
	permisoEscrituraFac: boolean;
	permisoEscrituraPag: boolean;
	buscar: boolean = false;
	datos;
	datosFiltros: FacturacionItem;
	progressSpinner: boolean = false;
	msgs: any[] = [];
	filtroSeleccionado: String;
	rutaMenu: Subscription;

	@ViewChild(FiltroBusquedaFacturacionComponent) filtros: FiltroBusquedaFacturacionComponent;
	@ViewChild(TablaBusquedaFacturacionComponent) tabla: TablaBusquedaFacturacionComponent;

	constructor(private translateService: TranslateService,
		private sigaServices: SigaServices,
		private commonsService: CommonsService,
		private persistenceService: PersistenceService,
		private router: Router) {
		this.rutaMenu = this.sigaServices.rutaMenu$.subscribe(
			ruta => {
				if (ruta && ruta.length > 0 && ruta != 'fichaFacturacion' && ruta != 'fichaPagos') {
					this.persistenceService.clearFiltros();
					this.persistenceService.clearFiltrosAux();
				}
			}
		);
	}

	ngOnInit() {
		this.buscar = this.filtros.buscar;

		this.commonsService.checkAcceso(procesos_facturacionSJCS.busquedaFac).then(respuesta => {

			this.permisoEscrituraFac = respuesta;

			if (this.permisoEscrituraFac == undefined) {
				sessionStorage.setItem("codError", "403");
				sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
				this.router.navigate(["/errorAcceso"]);
			}
		}).catch(error => console.error(error));

		this.commonsService.checkAcceso(procesos_facturacionSJCS.busquedaPag).then(respuesta => {

			this.permisoEscrituraPag = respuesta;

			if (this.permisoEscrituraPag == undefined) {
				sessionStorage.setItem("codError", "403");
				sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
				this.router.navigate(["/errorAcceso"]);
			}
		}).catch(error => console.error(error));
	}

	busqueda(event) {
		this.datosFiltros = this.persistenceService.getFiltrosAux();
		this.progressSpinner = true;
		this.filtroSeleccionado = event;

		// Modificaciones para pasar de select a multiselect por usabilidad
		if (undefined != this.datosFiltros.idEstado) {
			if (this.datosFiltros.idEstado.length == 0) {
				this.datosFiltros.idEstado = undefined;
			} else {
				this.datosFiltros.idEstado = this.datosFiltros.idEstado.toString();
			}
		}

		if (undefined != this.datosFiltros.idPartidaPresupuestaria) {
			if (this.datosFiltros.idPartidaPresupuestaria.length == 0) {
				this.datosFiltros.idPartidaPresupuestaria = undefined;
			} else {
				this.datosFiltros.idPartidaPresupuestaria = this.datosFiltros.idPartidaPresupuestaria.toString();
			}
		}

		if (undefined != this.datosFiltros.idConcepto) {
			if (this.datosFiltros.idConcepto.length == 0) {
				this.datosFiltros.idConcepto = undefined;
			} else {
				this.datosFiltros.idConcepto = this.datosFiltros.idConcepto.toString();
			}
		}

		if (undefined != this.datosFiltros.idFacturacion) {
			if (this.datosFiltros.idFacturacion.length == 0) {
				this.datosFiltros.idFacturacion = undefined;
			} else {
				this.datosFiltros.idFacturacion = this.datosFiltros.idFacturacion.toString();
			}
		}

		if (this.filtroSeleccionado == "facturacion") {
			this.sigaServices.post("facturacionsjcs_buscarfacturaciones", this.datosFiltros).subscribe(
				data => {
					this.datos = JSON.parse(data.body).facturacionItem;
					this.buscar = true;
					let error = JSON.parse(data.body).error;

					if (error != undefined && error != null && error.description != null) {
						if (error.code == '200') {
							this.showMessage("info", this.translateService.instant("general.message.informacion"), this.translateService.instant(error.description));
						} else {
							this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
						}
					}

					if (this.datos != undefined) {
						this.datos.forEach(element => {
							if (element.importeTotal != undefined) {
								element.importeTotalFormat = element.importeTotal.replace(".", ",");

								if (element.importeTotalFormat[0] == '.' || element.importeTotalFormat[0] == ',') {
									element.importeTotalFormat = "0".concat(element.importeTotalFormat)
								}
							} else {
								element.importeTotalFormat = 0;
							}

							if (element.importePagado != undefined) {
								element.importePagadoFormat = element.importePagado.replace(".", ",");

								if (element.importePagadoFormat[0] == '.' || element.importePagadoFormat[0] == ',') {
									element.importePagadoFormat = "0".concat(element.importePagadoFormat)
								}
							} else {
								element.importePagadoFormat = 0;
							}

							if (element.importePendiente != undefined) {
								element.importePendienteFormat = element.importePendiente.replace(".", ",");

								if (element.importePendienteFormat[0] == '.' || element.importePendienteFormat[0] == ',') {
									element.importePendienteFormat = "0".concat(element.importePendienteFormat)
								}
							} else {
								element.importePendienteFormat = 0;
							}
						});
					}

					this.resetSelect();
					this.progressSpinner = false;
				},
				err => {
					if (err.status == '403' || err.status == 403) {
						sessionStorage.setItem("codError", "403");
						sessionStorage.setItem(
							"descError",
							this.translateService.instant("generico.error.permiso.denegado")
						);
						this.router.navigate(["/errorAcceso"]);
					} else {
						if (err != undefined && JSON.parse(err.error).error.description != "") {
							this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
						} else {
							this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
						}
					}
					this.progressSpinner = false;
				},
				() => {
					setTimeout(() => {
						this.tabla.tablaFoco.nativeElement.scrollIntoView();
					}, 5);
				}
			);
		} else if (this.filtroSeleccionado == "pagos") {
			this.sigaServices.post("pagosjcs_buscarPagos", this.datosFiltros).subscribe(
				data => {
					this.datos = JSON.parse(data.body).pagosjgItem;
					this.buscar = true;
					let error = JSON.parse(data.body).error;

					if (error != undefined && error != null && error.description != null) {
						if (error.code == '200') {
							this.showMessage("info", this.translateService.instant("general.message.informacion"), this.translateService.instant(error.description));
						} else {
							this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
						}
					}

					if (this.datos != undefined) {
						this.datos.forEach(element => {
							if (element.cantidad != undefined) {
								element.cantidadFormat = element.cantidad.replace(".", ",");

								if (element.cantidadFormat[0] == '.' || element.cantidadFormat[0] == ',') {
									element.cantidadFormat = "0".concat(element.cantidadFormat)
								}
							} else {
								element.cantidadFormat = 0;
							}
						});
					}

					this.resetSelect();
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
					setTimeout(() => {
						this.tabla.tablaFoco.nativeElement.scrollIntoView();
					}, 5);
				}
			);
		}
	}

	cambiaBuscar(event) {
		this.buscar = event;
	}

	resetSelect() {
		if (this.tabla != undefined) {
			this.tabla.selectedDatos = [];
			this.tabla.numSelected = 0;
			this.tabla.selectMultiple = false;
			this.tabla.selectAll = false;
			if (this.tabla.tabla != undefined) {
				this.tabla.tabla.sortOrder = 0;
				this.tabla.tabla.sortField = '';
				this.tabla.tabla.reset();
				this.tabla.buscadores = this.tabla.buscadores.map(it => it = "");
			}
		}
	}

	delete(event) {
		this.progressSpinner = true;

		if (this.filtroSeleccionado == "facturacion") {
			this.sigaServices.post("facturacionsjcs_eliminarFacturacion", event).subscribe(
				data => {

					const resp: FacturacionDeleteDTO = JSON.parse(data.body);
					const error = resp.error;

					if (resp.status == 'KO' && error != null && error.description != null) {
						this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(error.description.toString()));
					} else {
						this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("messages.deleted.success"));
						this.busqueda(this.filtroSeleccionado);
					}

					this.progressSpinner = false;
				},
				err => {
					this.progressSpinner = false;
					if (err.status == '403' || err.status == 403) {
						sessionStorage.setItem("codError", "403");
						sessionStorage.setItem(
							"descError",
							this.translateService.instant("generico.error.permiso.denegado")
						);
						this.router.navigate(["/errorAcceso"]);
					} else {
						this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("facturacionSJCS.facturacionesYPagos.buscarFacturacion.mensajeErrorEliminar"));
					}
				}
			);
		} else if (this.filtroSeleccionado == "pagos") {

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

	ngOnDestroy(): void {
		this.rutaMenu.unsubscribe();
	}
}
