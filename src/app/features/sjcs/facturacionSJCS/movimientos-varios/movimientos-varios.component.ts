import { Component, OnInit, ViewChild } from '@angular/core';
import { MovimientosVariosFacturacionItem } from './MovimientosVariosFacturacionItem';
import { PersistenceService } from '../../../../_services/persistence.service';
import { Router } from '@angular/router';
import { SigaServices } from "../../../../_services/siga.service";
import { CommonsService } from '../../../../_services/commons.service';
import { TranslateService } from '../../../../commons/translate';
import { FiltrosMovimientosVariosComponent } from "./filtros-movimientos-varios/filtros-movimientos-varios.component";
import { TablaMovimientosVariosComponent } from "./tabla-movimientos-varios/tabla-movimientos-varios.component";
import { SigaStorageService } from '../../../../siga-storage.service';
import { MovimientosVariosService } from './movimientos-varios.service';
import { procesos_facturacionSJCS } from '../../../../permisos/procesos_facturacionSJCS';
import { Location } from '@angular/common';

@Component({
  selector: 'app-movimientos-varios',
  templateUrl: './movimientos-varios.component.html',
  styleUrls: ['./movimientos-varios.component.scss'],

})
export class MovimientosVariosComponent implements OnInit {

  url;
  filtrosValues = new MovimientosVariosFacturacionItem();
  datosFiltros: MovimientosVariosFacturacionItem;
  progressSpinner: boolean = false;
  msgs: any[] = [];
	filtroSeleccionado: String;
  datos;
  buscar: boolean = false;
  isLetrado : boolean = false;
  totalRegistros = 0;
  disabledLetradoFicha: boolean = false;

	@ViewChild(FiltrosMovimientosVariosComponent) filtros: FiltrosMovimientosVariosComponent;
  @ViewChild(TablaMovimientosVariosComponent) tabla: TablaMovimientosVariosComponent;
  permisoEscritura: any;
  datosColegiado: any;

  constructor(private translateService: TranslateService,
		private sigaServices: SigaServices,
		private commonsService: CommonsService,
		private router: Router, private sigaStorageService: SigaStorageService,
    private movimientosVariosService: MovimientosVariosService,
    private location: Location) {    
  }

  ngOnInit() {

    this.commonsService.checkAcceso(procesos_facturacionSJCS.busquedaMovimientosVarios).then(respuesta => {

			this.permisoEscritura = respuesta; //true, false, undefined

			if (this.permisoEscritura == undefined) {
				sessionStorage.setItem("codError", "403");
				sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
				this.router.navigate(["/errorAcceso"]);
			}
		}).catch(error => console.error(error));

    this.permisoEscritura = true;
    
    this.isLetrado = this.sigaStorageService.isLetrado;

    if (sessionStorage.getItem("datosColegiado") != null || sessionStorage.getItem("datosColegiado") != undefined) {
      this.datosColegiado = JSON.parse(sessionStorage.getItem("datosColegiado"));
      //this.movimientosVariosService.datosColegiadoFichaColegial = this.datosColegiado;
      const { numColegiado, nombre } = this.datosColegiado;
      this.filtros.usuarioBusquedaExpress.numColegiado = numColegiado;
      this.filtros.usuarioBusquedaExpress.nombreAp = nombre.replace(/,/g, "");
      this.disabledLetradoFicha = true;
      this.buscarDesdeEnlace();
      sessionStorage.removeItem("datosColegiado");

    }

    this.buscar = this.filtros.buscar;
    this.movimientosVariosService.modoEdicion = false;
    this.movimientosVariosService.datosColegiadoAux = null;
  }

  getFiltrosValues(datosFiltros: MovimientosVariosFacturacionItem){
    this.datosFiltros = datosFiltros;
		this.progressSpinner = true;
    let datosFiltrosAux: MovimientosVariosFacturacionItem = Object.assign({}, this.datosFiltros);
		// Modificaciones para pasar de select a multiselect por usabilidad
		if (undefined != this.datosFiltros.idAplicadoEnPago) {
			if (this.datosFiltros.idAplicadoEnPago.length == 0) {
				datosFiltrosAux.idAplicadoEnPago = undefined;
			} else {
				datosFiltrosAux.idAplicadoEnPago = this.datosFiltros.idAplicadoEnPago.toString();
			}
		}else{
      datosFiltrosAux.idAplicadoEnPago=null;
    }

		if (undefined != this.datosFiltros.idPartidaPresupuestaria) {
			if (this.datosFiltros.idPartidaPresupuestaria.length == 0) {
        datosFiltrosAux.idPartidaPresupuestaria = undefined;
			} else {
				datosFiltrosAux.idPartidaPresupuestaria = this.datosFiltros.idPartidaPresupuestaria.toString();
			}
		}else{
      datosFiltrosAux.idPartidaPresupuestaria=null;
    }

		if (undefined != this.datosFiltros.idConcepto) {
			if (this.datosFiltros.idConcepto.length == 0) {
				datosFiltrosAux.idConcepto = undefined;
			} else {
				datosFiltrosAux.idConcepto = this.datosFiltros.idConcepto.toString();
			}
		}else{
      datosFiltrosAux.idConcepto=null;
    }

		if (undefined != this.datosFiltros.idFacturacion) {
			if (this.datosFiltros.idFacturacion.length == 0) {
				datosFiltrosAux.idFacturacion = undefined;
			} else {
				datosFiltrosAux.idFacturacion = this.datosFiltros.idFacturacion.toString();
			}
		}else{
      datosFiltrosAux.idFacturacion=null;
    }

    if (undefined != this.datosFiltros.idGrupoFacturacion) {
			if (this.datosFiltros.idGrupoFacturacion.length == 0) {
				datosFiltrosAux.idGrupoFacturacion = undefined;
			} else {
				datosFiltrosAux.idGrupoFacturacion = this.datosFiltros.idGrupoFacturacion.toString();
			}
		}else{
      datosFiltrosAux.idGrupoFacturacion=null;
    }

    if(this.datosFiltros.descripcion == undefined){
      datosFiltrosAux.descripcion=null;
    }

    if (undefined != this.datosFiltros.tipo) {
			if (this.datosFiltros.tipo.length == 0) {
				datosFiltrosAux.tipo = undefined;
			} else {
				datosFiltrosAux.tipo = this.datosFiltros.tipo.toString();
			}
		}else{
      datosFiltrosAux.tipo=null;
    }

    if(this.datosFiltros.letrado == undefined){
      datosFiltrosAux.letrado = null;
    }

    if(this.datosFiltros.ncolegiado == undefined){
      datosFiltrosAux.ncolegiado = null;
    }


    if (undefined != this.datosFiltros.certificacion) {
			if (this.datosFiltros.certificacion.length == 0) {
				datosFiltrosAux.certificacion = undefined;
			} else {
				datosFiltrosAux.certificacion = this.datosFiltros.certificacion.toString();
			}
		}else{
      datosFiltrosAux.certificacion=null;
    }

    if(this.datosFiltros.fechaApDesde == undefined){
      datosFiltrosAux.fechaApDesde = null;
    }
    
    if(this.datosFiltros.fechaApHasta == undefined){
      datosFiltrosAux.fechaApHasta = null;
    }

    datosFiltrosAux.idInstitucion=null; 
    datosFiltrosAux.idMovimiento=null;
    datosFiltrosAux.idPersona=null;
    datosFiltrosAux.motivo=null;
    datosFiltrosAux.fechaAlta=null;
    datosFiltrosAux.cantidad=null;
    datosFiltrosAux.fechaModificacion=null;
    datosFiltrosAux.usuModificacion=null;
    datosFiltrosAux.contabilizado=null;
    datosFiltrosAux.cantidadAplicada=null;
    datosFiltrosAux.cantidadRestante=null;
    datosFiltrosAux.nif=null;
    datosFiltrosAux.nombre=null;
    datosFiltrosAux.apellido1=null;
    datosFiltrosAux.apellido2=null;
    datosFiltrosAux.nombrefacturacion=null;
    datosFiltrosAux.nombretipo=null;
    datosFiltrosAux.nombrePago=null;
   
    this.sigaServices.post("movimientosVarios_busquedaMovimientosVarios", datosFiltrosAux).subscribe(
      data => {
        this.datos = JSON.parse(data.body).facturacionItem;
        this.buscar = true;
        let error = JSON.parse(data.body).error;
        this.totalRegistros = this.datos.length;

        if(this.totalRegistros == 200){
          this.showMessage('info', this.translateService.instant("general.message.informacion"), "La consulta devuelve más de 200 resultados.");
        }

        if (error != undefined && error != null && error.description != null) {
          if (error.code == '200') {
            this.showMessage("info", this.translateService.instant("general.message.informacion"), this.translateService.instant(error.description));
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          }
        }
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
        this.progressSpinner = false;
        setTimeout(() => {
          //this.tabla.tablaFoco.nativeElement.scrollIntoView();
        }, 5);
      }
    );
    
  }

  buscarDesdeEnlace(){

		this.progressSpinner = true;
    let datosFiltrosAux: MovimientosVariosFacturacionItem = new MovimientosVariosFacturacionItem();
		// Modificaciones para pasar de select a multiselect por usabilidad    

    datosFiltrosAux.ncolegiado = this.datosColegiado.numColegiado.toString();
  
    datosFiltrosAux.letrado = null;
    datosFiltrosAux.idAplicadoEnPago=null;
    datosFiltrosAux.idPartidaPresupuestaria=null;
    datosFiltrosAux.idConcepto=null;
    datosFiltrosAux.idFacturacion=null;
    datosFiltrosAux.idGrupoFacturacion=null;
    datosFiltrosAux.descripcion=null;
    datosFiltrosAux.tipo=null;
    datosFiltrosAux.certificacion = null;
    datosFiltrosAux.fechaApDesde = null;
    datosFiltrosAux.fechaApHasta = null;
    datosFiltrosAux.idInstitucion=null; 
    datosFiltrosAux.idMovimiento=null;
    datosFiltrosAux.idPersona=null;
    datosFiltrosAux.motivo=null;
    datosFiltrosAux.fechaAlta=null;
    datosFiltrosAux.cantidad=null;
    datosFiltrosAux.fechaModificacion=null;
    datosFiltrosAux.usuModificacion=null;
    datosFiltrosAux.contabilizado=null;
    datosFiltrosAux.cantidadAplicada=null;
    datosFiltrosAux.cantidadRestante=null;
    datosFiltrosAux.nif=null;
    datosFiltrosAux.nombre=null;
    datosFiltrosAux.apellido1=null;
    datosFiltrosAux.apellido2=null;
    datosFiltrosAux.nombrefacturacion=null;
    datosFiltrosAux.nombretipo=null;
    datosFiltrosAux.nombrePago=null;
   
    this.sigaServices.post("movimientosVarios_busquedaMovimientosVarios", datosFiltrosAux).subscribe(
      data => {
        this.datos = JSON.parse(data.body).facturacionItem;
        this.buscar = true;
        let error = JSON.parse(data.body).error;
        this.totalRegistros = this.datos.length;

        if(this.totalRegistros == 200){
          this.showMessage('info', this.translateService.instant("general.message.informacion"), "La consulta devuelve más de 200 resultados.");
        }

        if (error != undefined && error != null && error.description != null) {
          if (error.code == '200') {
            this.showMessage("info", this.translateService.instant("general.message.informacion"), this.translateService.instant(error.description));
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          }
        }
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
        this.progressSpinner = false;
        setTimeout(() => {
          //this.tabla.tablaFoco.nativeElement.scrollIntoView();
        }, 5);
      }
    );
    
  }

  cambiaBuscar(event) {
		this.buscar = event;
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

  convertArraysToStrings() {

    const array = ['descripcion', 'tipo', 'certificacion', 'idAplicadoEnPago', 'fechaApDesde', 'fechaApHasta', 'idFacturacionApInicial', 'idGrupoFacturacion','idConcepto', 'idPartidaPresupuestaria','ncolegiado'];
    if (this.filtrosValues != undefined) {
      array.forEach(element => {
        if (this.filtrosValues[element] != undefined && this.filtrosValues[element] != null && this.filtrosValues[element].length > 0) {
          let aux = this.filtrosValues[element].toString();
          this.filtrosValues[element] = aux;
        }

        if (this.filtrosValues[element] != undefined && this.filtrosValues[element] != null && this.filtrosValues[element].length == 0) {
          delete this.filtrosValues[element];
        }

      });

    }
  }

  volver() {
    this.location.back();
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
