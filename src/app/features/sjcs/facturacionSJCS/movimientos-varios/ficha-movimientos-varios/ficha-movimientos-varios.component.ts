import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, DatePipe } from '@angular/common';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { TranslateService } from '../../../../../commons/translate/translation.service';
import { ConfirmationService } from '../../../../../../../node_modules/primeng/primeng';
import { SigaStorageService } from '../../../../../siga-storage.service';
import { TarjetaDatosClienteComponent } from './tarjeta-datos-cliente/tarjeta-datos-cliente.component';
import { BusquedaFisicaItem } from '../../../../../models/BusquedaFisicaItem';
import { ColegiadosSJCSItem } from '../../../../../models/ColegiadosSJCSItem';
import { MovimientosVariosService } from '../movimientos-varios.service';
import { MovimientosVariosFacturacionItem } from '../MovimientosVariosFacturacionItem';
import { procesos_facturacionSJCS } from '../../../../../permisos/procesos_facturacionSJCS';

@Component({
  selector: 'app-ficha-movimientos-varios',
  templateUrl: './ficha-movimientos-varios.component.html',
  styleUrls: ['./ficha-movimientos-varios.component.scss']
})
export class FichaMovimientosVariosComponent implements OnInit {

  isLetrado: boolean = false;
  datos;
  datosAux;
  modoEdicion;
  datosTarjetaResumen;
  bodyFisica: BusquedaFisicaItem = new BusquedaFisicaItem();
  datosColegiado: ColegiadosSJCSItem = new ColegiadosSJCSItem();
  datosTarjetaClientes;
  datosClientes;
  iconoTarjetaResumen = 'fas fa-clipboard';
 
  msgs;
  datosListadoPagos;
  progressSpinner: boolean = false;
  permisoEscritura: any;

  enlacesTarjetaResumen: any[] = [];
	manuallyOpened:Boolean = false;
	openDatosCliente: Boolean = false;
	openDatosGen: Boolean = false;
	openCriterios: Boolean = false;
	openListadoPagos: Boolean = false;



  constructor(public datepipe: DatePipe, private translateService: TranslateService, private route: ActivatedRoute,
    private sigaServices: SigaServices, private location: Location, private persistenceService: PersistenceService,
    private router: Router, private commonsService: CommonsService, private confirmationService: ConfirmationService,
    private sigaStorageService: SigaStorageService,
    private movimientosVariosService: MovimientosVariosService) { }

  ngAfterViewInit(): void {
    this.enviarEnlacesTarjeta();
    //this.goTop();
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
    this.datosTarjetaResumen = [];
    this.datosTarjetaClientes = [];
    this.datos;

    if (this.movimientosVariosService.modoEdicion) {
      this.modoEdicion = true;
    } else {
      this.modoEdicion = false;
    }

    if(this.modoEdicion){
        this.datos = this.persistenceService.getDatos();
        this.getDatosTarjetaClientes(this.datos); 
        this.getDatosTarjetaResumen(this.datos);   
        this.getPagos(); 
    }else{
      this.getTarjetaResumen(this.datosColegiado);
      if (sessionStorage.getItem("showDatosClientes")) {
        this.getTarjetaClientes(this.bodyFisica);
      } else {
        this.getTarjetaClientes(this.datosColegiado);
      }
    }

  }

  getPagos() {
    this.progressSpinner = true;
    this.datos.fechaAlta = null;


    this.sigaServices.post("movimientosVarios_getListadoPagos", this.datos).subscribe(
      n => {
        this.datosListadoPagos = JSON.parse(n.body).facturacionItem;
        this.progressSpinner = false;
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      }, () => {
        this.progressSpinner = false;
      }
    );
  }

  enviarEnlacesTarjeta() {

    this.enlacesTarjetaResumen = [];

    let tarjetaDatosCliente = {
      label: "facturacionSJCS.retenciones.ficha.colegiado",
      value: document.getElementById("tarjetaDatosCliente"),
      nombre: "tarjetaDatosCliente",
    };

    this.enlacesTarjetaResumen.push(tarjetaDatosCliente);

    let tarjetaDatosGenerales = {
      label: "facturacionSJCS.facturacionesYPagos.datosGenerales",
      value: document.getElementById("tarjetaDatosGenerales"),
      nombre: "tarjetaDatosGenerales",
    };

    this.enlacesTarjetaResumen.push(tarjetaDatosGenerales);

    let tarjetaCriteriosAplicacion = {
      label: "facturacionSJCS.movimientosVarios.criteriosAplicacion",
      value: document.getElementById("tarjetaCriteriosAplicacion"),
      nombre: "tarjetaCriteriosAplicacion",
    };

    this.enlacesTarjetaResumen.push(tarjetaCriteriosAplicacion);

    let tarjetaListadoPagos = {
      label: "facturacionSJCS.movimientosVarios.listadoPagos",
      value: document.getElementById("tarjetaListadoPagos"),
      nombre: "tarjetaListadoPagos",
    };

    this.enlacesTarjetaResumen.push(tarjetaListadoPagos);
  }

  isCloseReceive(event) {
		if (event != undefined) {
		  	switch (event) {
				case "tarjetaDatosCliente":
				this.openDatosCliente = this.manuallyOpened;
				break;
				case "tarjetaDatosGenerales":
				this.openDatosGen = this.manuallyOpened;
				break;
				case "tarjetaCriteriosAplicacion":
				this.openCriterios = this.manuallyOpened;
				break;
				case "tarjetaListadoPagos":
				this.openListadoPagos = this.manuallyOpened;
				break;
			}
		}
	  }
	
	  isOpenReceive(event) {
		
		if (event != undefined) {
		  switch (event) {
			case "tarjetaDatosCliente":
			  this.openDatosCliente = true;
			  break;
			case "tarjetaDatosGenerales":
			  this.openDatosGen = true;
			  break;
			case "tarjetaCriteriosAplicacion":
			  this.openCriterios = true;
			  break;
			case "tarjetaListadoPagos":
			  this.openListadoPagos = true;
			  break;
		  }
		}
	  }


  getDatosTarjetaClientes(movimiento: any) {

    let datosClientes = [];
    datosClientes[0] = { label: "Identificación: ", value: movimiento.nif };
    datosClientes[1] = { label: "Nombre: ", value: movimiento.nombre };
    datosClientes[2] = { label: "Apellidos: ", value: movimiento.apellido1 + " " + movimiento.apellido2 };
    datosClientes[3] = { label: "Nº Colegiado: ", value: movimiento.ncolegiado };
    this.datosTarjetaClientes = datosClientes;

    sessionStorage.removeItem("datosColegiado");

  }

  getDatosTarjetaResumen(movimiento: any) {
    let datosResumen = [];
    datosResumen[0] = { label: "Nº Colegiado: ", value: movimiento.ncolegiado };
    datosResumen[1] = { label: "Nombre: ", value: movimiento.letrado };
    datosResumen[2] = { label: "Descripción: ", value: movimiento.descripcion };
    datosResumen[3] = { label: "Importe: ", value: movimiento.cantidad };
    this.datosTarjetaResumen = datosResumen;
  }

  modoEdicionSend(event) {
    this.modoEdicion = event.modoEdicion;
  }



  getTarjetaClientes(movimiento: any) {

    let datosClientes = [];
    datosClientes[0] = { label: "Identificación: ", value: movimiento.nif };
    datosClientes[1] = { label: "Nombre: ", value: movimiento.nombre };
    datosClientes[2] = { label: "Apellidos: ", value: movimiento.apellidos };
    datosClientes[3] = { label: "Nº Colegiado: ", value: movimiento.nColegiado };
    this.datosTarjetaClientes = datosClientes;

  }

  getTarjetaResumen(movimiento: any) {
    let datosResumen = [];
    datosResumen[0] = { label: "Nº Colegiado: ", value: "" };
    datosResumen[1] = { label: "Nombre: ", value: "" };
    datosResumen[2] = { label: "Descripción: ", value: "" };
    datosResumen[3] = { label: "Importe: ", value: "" };
    this.datosTarjetaResumen = datosResumen;
  }



  clear() {
    this.msgs = [];
  }

  datosTarjetaResumenEvent(event) {
		if (event != undefined) {
		  this.datosTarjetaResumen = event;
		}
	}

  datosColegiadoEvent(event) {
    this.datosColegiado = event;
  }

  bodyFisicaEvent(event) {
    this.bodyFisica = event;
  }

  datosClienteEvent(event) {
    this.datosClientes = event;
  }

  volver() {
    this.location.back();
  }

}
