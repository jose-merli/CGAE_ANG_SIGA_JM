import { Component, OnInit, ViewChild } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'
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

	@ViewChild(FiltrosMovimientosVariosComponent) filtros: FiltrosMovimientosVariosComponent;
  @ViewChild(TablaMovimientosVariosComponent) tabla: TablaMovimientosVariosComponent;
  permisoEscritura: any;

  constructor(private translateService: TranslateService,
		private sigaServices: SigaServices,
		private commonsService: CommonsService,
		private persistenceService: PersistenceService,
		private router: Router, private sigaStorageService: SigaStorageService,
    private movimientosVariosService: MovimientosVariosService) {    
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
    
    this.isLetrado = this.sigaStorageService.isLetrado;
    this.buscar = this.filtros.buscar;
    this.movimientosVariosService.modoEdicion = false;
    this.movimientosVariosService.datosColegiadoAux = null;
  }

  getFiltrosValues(datosFiltros: MovimientosVariosFacturacionItem){
    this.datosFiltros = datosFiltros;
		this.progressSpinner = true;
		// Modificaciones para pasar de select a multiselect por usabilidad
		if (undefined != this.datosFiltros.idAplicadoEnPago) {
			if (this.datosFiltros.idAplicadoEnPago.length == 0) {
				this.datosFiltros.idAplicadoEnPago = undefined;
			} else {
				this.datosFiltros.idAplicadoEnPago = this.datosFiltros.idAplicadoEnPago.toString();
			}
		}else{
      this.datosFiltros.idAplicadoEnPago=null;
    }

		if (undefined != this.datosFiltros.idPartidaPresupuestaria) {
			if (this.datosFiltros.idPartidaPresupuestaria.length == 0) {
				this.datosFiltros.idPartidaPresupuestaria = undefined;
			} else {
				this.datosFiltros.idPartidaPresupuestaria = this.datosFiltros.idPartidaPresupuestaria.toString();
			}
		}else{
      this.datosFiltros.idPartidaPresupuestaria=null;
    }

		if (undefined != this.datosFiltros.idConcepto) {
			if (this.datosFiltros.idConcepto.length == 0) {
				this.datosFiltros.idConcepto = undefined;
			} else {
				this.datosFiltros.idConcepto = this.datosFiltros.idConcepto.toString();
			}
		}else{
      this.datosFiltros.idConcepto=null;
    }

		if (undefined != this.datosFiltros.idFacturacionApInicial) {
			if (this.datosFiltros.idFacturacionApInicial.length == 0) {
				this.datosFiltros.idFacturacionApInicial = undefined;
			} else {
				this.datosFiltros.idFacturacionApInicial = this.datosFiltros.idFacturacionApInicial.toString();
			}
		}else{
      this.datosFiltros.idFacturacionApInicial=null;
    }

    if (undefined != this.datosFiltros.idGrupoFacturacion) {
			if (this.datosFiltros.idGrupoFacturacion.length == 0) {
				this.datosFiltros.idGrupoFacturacion = undefined;
			} else {
				this.datosFiltros.idGrupoFacturacion = this.datosFiltros.idGrupoFacturacion.toString();
			}
		}else{
      this.datosFiltros.idGrupoFacturacion=null;
    }

    if(this.datosFiltros.descripcion == undefined){
      this.datosFiltros.descripcion=null;
    }

    if(this.datosFiltros.tipo == undefined){
      this.datosFiltros.tipo = null;
    }

    if(this.datosFiltros.letrado == undefined){
      this.datosFiltros.letrado = null;
    }

    if(this.datosFiltros.ncolegiado == undefined){
      this.datosFiltros.ncolegiado = null;
    }

    if(this.datosFiltros.idFacturacion == undefined){
      this.datosFiltros.idFacturacion = null;
    }

    if(this.datosFiltros.certificacion == undefined){
      this.datosFiltros.certificacion = null;
    }

    if(this.datosFiltros.fechaApDesde == undefined){
      this.datosFiltros.fechaApDesde = null;
    }
    
    if(this.datosFiltros.fechaApHasta == undefined){
      this.datosFiltros.fechaApHasta = null;
    }

    this.datosFiltros.idInstitucion=null; 
    this.datosFiltros.idMovimiento=null;
    this.datosFiltros.idPersona=null;
    this.datosFiltros.motivo=null;
    this.datosFiltros.fechaAlta=null;
    this.datosFiltros.cantidad=null;
    this.datosFiltros.fechaModificacion=null;
    this.datosFiltros.usuModificacion=null;
    this.datosFiltros.contabilizado=null;
    this.datosFiltros.cantidadAplicada=null;
    this.datosFiltros.cantidadRestante=null;
    this.datosFiltros.nif=null;
    this.datosFiltros.nombre=null;
    this.datosFiltros.apellido1=null;
    this.datosFiltros.apellido2=null;
    this.datosFiltros.nombrefacturacion=null;
    this.datosFiltros.nombretipo=null;
    this.datosFiltros.nombrePago=null;
   
    this.sigaServices.post("movimientosVarios_busquedaMovimientosVarios", this.datosFiltros).subscribe(
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
