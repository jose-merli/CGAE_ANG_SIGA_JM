import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { SigaServices } from "../../../../_services/siga.service";
import { CommonsService } from '../../../../_services/commons.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { TranslateService } from '../../../../commons/translate';
import { procesos_maestros } from '../../../../permisos/procesos_maestros';

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

	@ViewChild(FiltroBusquedaFacturacionComponent) filtros;
	@ViewChild(TablaBusquedaFacturacionComponent) tabla;

  	constructor(private translateService: TranslateService,
		private sigaServices: SigaServices,
		private commonsService: CommonsService,
		private persistenceService: PersistenceService,
		private router: Router) { }
  
  	ngOnInit() { 
		this.buscar = this.filtros.buscar;

		this.commonsService.checkAcceso(procesos_maestros.areasMaterias).then(respuesta => {
        	this.permisoEscritura = respuesta;

        	this.persistenceService.setPermisos(this.permisoEscritura);

			if (this.permisoEscritura == undefined) {
				sessionStorage.setItem("codError", "403");
				sessionStorage.setItem("descError",	this.translateService.instant("generico.error.permiso.denegado"));
				this.router.navigate(["/errorAcceso"]);
			}
		}).catch(error => console.error(error));
	}

  	buscarFacturaciones(event){
		this.datosFiltros=this.persistenceService.getFiltrosAux();
		this.persistenceService.setHistorico(event);
    	this.progressSpinner = true;

		this.sigaServices.post("facturacionsjcs_buscarfacturaciones",this.datosFiltros).subscribe(
			data => {
				this.datos = JSON.parse(data.body).facturacionItem;
				this.buscar = true;
				this.progressSpinner = false;
				
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
	
	resetSelect() {
		if (this.tabla != undefined) {
		  this.tabla.selectedDatos = [];
		  this.tabla.numSelected = 0;
		  this.tabla.selectMultiple = false;
		  this.tabla.selectAll = false;
		  if (this.tabla.tabla) {
			this.tabla.tabla.sortOrder = 0;
			this.tabla.tabla.sortField = '';
			this.tabla.tabla.reset();
			this.tabla.buscadores = this.tabla.buscadores.map(it => it = "");
		  }
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
