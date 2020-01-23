import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { SigaServices } from "../../../../_services/siga.service";
import { CommonsService } from '../../../../_services/commons.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { TranslateService } from '../../../../commons/translate';
import { procesos_facturacionSJCS} from '../../../../permisos/procesos_facturacion';
import { FiltroBusquedaFacturacionComponent } from "./filtro-busqueda-facturacion/filtro-busqueda-facturacion.component";
import { TablaBusquedaFacturacionComponent } from "./tabla-busqueda-facturacion/tabla-busqueda-facturacion.component";
import { FacturacionItem } from '../../../../models/sjcs/FacturacionItem';

@Component({
  selector: 'app-facturaciones-pagos',
  templateUrl: './facturaciones-pagos.component.html',
  styleUrls: ['./facturaciones-pagos.component.scss']
})

export class FacturacionesYPagosComponent implements OnInit {
	permisoEscritura: any;
	buscar: boolean = false;
	datos;
	datosFiltros: FacturacionItem;
	progressSpinner: boolean = false;
	msgs: any[] = [];
	filtroSeleccionado: String;

	@ViewChild(FiltroBusquedaFacturacionComponent) filtros;
	@ViewChild(TablaBusquedaFacturacionComponent) tabla;

  	constructor(private translateService: TranslateService,
		private sigaServices: SigaServices,
		private commonsService: CommonsService,
		private persistenceService: PersistenceService,
		private router: Router) { }
  
  	ngOnInit() { 
		this.buscar = this.filtros.buscar;

		this.commonsService.checkAcceso(procesos_facturacionSJCS.facturacionYpagos).then(respuesta => {
        	this.permisoEscritura = respuesta;

        	this.persistenceService.setPermisos(this.permisoEscritura);

			if (this.permisoEscritura == undefined) {
				sessionStorage.setItem("codError", "403");
				sessionStorage.setItem("descError",	this.translateService.instant("generico.error.permiso.denegado"));
				this.router.navigate(["/errorAcceso"]);
			}
		}).catch(error => console.error(error));
	}

  	busqueda(event){
		this.datosFiltros=this.persistenceService.getFiltrosAux();
    	this.progressSpinner = true;
		this.filtroSeleccionado=event;

		if(this.filtroSeleccionado=="facturacion"){
			this.sigaServices.post("facturacionsjcs_buscarfacturaciones",this.datosFiltros).subscribe(
				data => {
					this.datos = JSON.parse(data.body).facturacionItem;
					this.buscar = true;
					
					if (this.datos != undefined){
						this.datos.forEach(element => {
							if(element.importeTotal!=undefined){
								element.importeTotalFormat = element.importeTotal.replace(".", ",");
							
								if (element.importeTotalFormat[0] == '.' || element.importeTotalFormat[0] == ','){
									element.importeTotalFormat = "0".concat(element.importeTotalFormat)
								}
							}else{
								element.importeTotalFormat = 0;
							}	
							
							if(element.importePagado!=undefined){
								element.importePagadoFormat = element.importePagado.replace(".", ",");
								
								if (element.importePagadoFormat[0] == '.' || element.importePagadoFormat[0] == ','){
									element.importePagadoFormat = "0".concat(element.importePagadoFormat)
								}
							}else{
								element.importePagadoFormat = 0;
							}					

							if(element.importePendiente!=undefined){
								element.importePendienteFormat = element.importePendiente.replace(".", ",");
								
								if (element.importePendienteFormat[0] == '.' || element.importePendienteFormat[0] == ','){
									element.importePendienteFormat = "0".concat(element.importePendienteFormat)
								}
							}else{
								element.importePendienteFormat = 0;
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
				}
			);
		}else if(this.filtroSeleccionado=="pagos"){
			this.sigaServices.post("facturacionsjcs_buscarPagos",this.datosFiltros).subscribe(
				data => {
					this.datos = JSON.parse(data.body).pagosjgItem;
					this.buscar = true;
					
					if (this.datos != undefined){
						this.datos.forEach(element => {
							if(element.cantidad!=undefined){
								element.cantidadFormat = element.cantidad.replace(".", ",");
							
								if (element.cantidadFormat[0] == '.' || element.cantidadFormat[0] == ','){
									element.cantidadFormat = "0".concat(element.cantidadFormat)
								}
							}else{
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
				}
			);
		}
	}
	
	cambiaBuscar(event){
		this.buscar=event;
	}

	resetSelect() {
		if (this.tabla != undefined) {
		  this.tabla.selectedDatos = [];
		  this.tabla.numSelected = 0;
		  this.tabla.selectMultiple = false;
		  this.tabla.selectAll = false;
		  if (this.tabla.tabla!=undefined) {
			this.tabla.tabla.sortOrder = 0;
			this.tabla.tabla.sortField = '';
			this.tabla.tabla.reset();
			this.tabla.buscadores = this.tabla.buscadores.map(it => it = "");
		  }
		}
	}

	delete(event) {
		this.progressSpinner = true;

		if(this.filtroSeleccionado=="facturacion"){
			this.sigaServices.post("facturacionsjcs_eliminarFacturacion",event).subscribe(
				data => {
					console.log(data);
					this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("messages.deleted.success"));
					this.busqueda(this.filtroSeleccionado);
					this.progressSpinner = false;
				},
				err => {
					this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("facturacionSJCS.facturacionesYPagos.buscarFacturacion.mensajeErrorEliminar"));
					this.progressSpinner = false;
				}
			);
		}else if(this.filtroSeleccionado=="pagos"){

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
}
