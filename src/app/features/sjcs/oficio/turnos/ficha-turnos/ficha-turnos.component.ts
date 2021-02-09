import { Component, OnInit , SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { TurnosItems } from '../../../../../models/sjcs/TurnosItems';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { procesos_oficio } from '../../../../../permisos/procesos_oficio';

@Component({
	selector: 'app-ficha-turnos',
	templateUrl: './ficha-turnos.component.html',
	styleUrls: ['./ficha-turnos.component.scss']
})
export class FichaTurnosComponent implements OnInit {
	idModelo: string;
	fichasPosibles: any[];
	filtrosConsulta;
	idTurno: string;
	turnosItem;
	progressSpinner: boolean = false;
	turnosItem2;
	modoEdicion: boolean;
	updateCombo: boolean;
	idProcedimiento;
	pesosSeleccionadosTarjeta: string;
	datos;
	messageShow: string;
	permisosTarjetaResumen: boolean = true;
	datosTarjetaResumen;
	iconoTarjetaResumen = "clipboard";

	enlacesTarjetaResumen: any[] = [];
	manuallyOpened:Boolean;
	openGen: Boolean = false;
	openConfigTurnos: Boolean = false;
	openConfigColaOficio: Boolean = false;
	openColaOficio: Boolean = false;
	openGuardias: Boolean = false;
	openColaGuardias: Boolean = false;
	openInscripciones: Boolean = false;

	tarjetaDatosGenerales: string;
	tarjetaConfiguracionTurnos: string;
	tarjetaConfiguracionColaOficio: string;
	tarjetaColaOficio : string;
	tarjetaGuardias: string;
	tarjetaColaGuardias: string;
	tarjetaInscripciones: string;

	constructor(private route: ActivatedRoute, private sigaServices: SigaServices, private location: Location, private persistenceService: PersistenceService,private commonsService: CommonsService) { }

	ngOnInit() {
		this.datosTarjetaResumen = [];
		this.commonsService.checkAcceso(procesos_oficio.tarjetaResumen)
		.then(respuesta => {
		  this.permisosTarjetaResumen = respuesta;
		  if (this.permisosTarjetaResumen != true) {
			this.permisosTarjetaResumen = false;
		  } else {
			this.permisosTarjetaResumen = true;
		  }
		}).catch(error => console.error(error));
		this.route.queryParams
			.subscribe(params => {
				this.idTurno = params.idturno
				console.log(params);
			});
		if (this.idTurno != undefined) {
			this.searchTurnos();
		}

		this.fichasPosibles = [
			{
				key: 'generales',
				activa: true
			},
			{
				key: 'configuracion',
				activa: false
			},
			{
				key: 'configuracioncolaoficio',
				activa: false
			},
			{
				key: 'tablacolaoficio',
				activa: false
			},
			{
				key: 'tarjetaguardias',
				activa: false
			},
			{
				key: 'tablacolaguardias',
				activa: false
			},
			{
				key: 'tarjetainscripciones',
				activa: true
			},

		];

		//
      	//PROVISIONAL
      	//cuando se vaya a seguir con el desarrollo de guardias, hay que cambiar esto y la carga de las tarjetas
      	//
      	setTimeout(() => {
        	this.enviarEnlacesTarjeta();
		  }, 2000);
		
	}

	ngOnChanges(changes: SimpleChanges) {
		this.enviarEnlacesTarjeta();
	}

	searchTurnos() {
		// this.filtros.filtros.historico = event;
		this.progressSpinner = true;
		let filtros: TurnosItems = new TurnosItems;
		filtros.idturno = this.idTurno;
		filtros.historico = false;
		if (this.persistenceService.getHistorico() != undefined) {
			filtros.historico = this.persistenceService.getHistorico();
		}
		this.sigaServices.post("turnos_busquedaFichaTurnos", filtros).subscribe(
			n => {
				this.turnosItem = JSON.parse(n.body).turnosItem[0];
				this.turnosItem2 = this.turnosItem;
				if (this.turnosItem.fechabaja != undefined || this.persistenceService.getPermisos() != true) {
					this.turnosItem.historico = true;
				}
			},
			err => {
				console.log(err);
			}, () => {
				this.persistenceService.setDatos(this.turnosItem2);
				this.progressSpinner = false;
			}
		);
	}

	datosTarjetaResumenEvent(event) {
		if (event != undefined) {
		  this.datosTarjetaResumen = event;
		}
	}

	modoEdicionSend(event) {
		this.modoEdicion = event.modoEdicion;
		this.idTurno = event.idTurno
	}

	datosSend(event){
		this.datos = event;
	}

	backTo() {
		this.location.back();
	}

	enviarEnlacesTarjeta() {
		this.enlacesTarjetaResumen = [];
	
		let pruebaTarjeta = {
			label: "general.message.datos.generales",
			value: document.getElementById("datosGenerales"),
			nombre: "datosGenerales",
		  };
	
		this.enlacesTarjetaResumen.push(pruebaTarjeta);
	
		pruebaTarjeta = {
			label: "menu.justiciaGratuita.guardia.gestion.configuracionTurnos",
			value: document.getElementById("configTurnos"),
			nombre: "configTurnos",
		  };
	
		this.enlacesTarjetaResumen.push(pruebaTarjeta);
	
		pruebaTarjeta = {
		  label: "justiciaGratuita.guardia.gestion.configuracionCola",
		  value: document.getElementById("configColaOficio"),
		  nombre: "configColaOficio",
		};
	
		this.enlacesTarjetaResumen.push(pruebaTarjeta);
	
		pruebaTarjeta = {
		  label: "justiciaGratuita.oficio.turnos.coladeguardias",
		  value: document.getElementById("colaGuardias"),
		  nombre: "colaGuardias",
		};
	
		this.enlacesTarjetaResumen.push(pruebaTarjeta);
	
		pruebaTarjeta = {
		  label: "menu.justiciaGratuita.oficio.turnos.colaoficio",
		  value: document.getElementById("colaOficio"),
		  nombre: "colaOficio",
		};
	
		this.enlacesTarjetaResumen.push(pruebaTarjeta);
	
		pruebaTarjeta = {
		  label: "menu.justiciaGratuita.oficio.turnos.guardias",
		  value: document.getElementById("guardias"),
		  nombre: "guardias",
		};
	
		this.enlacesTarjetaResumen.push(pruebaTarjeta);
	
		pruebaTarjeta = {
		  label: "menu.justiciaGratuita.oficio.inscripciones",
		  value: document.getElementById("inscripciones"),
		  nombre: "inscripciones",
		};
	
		this.enlacesTarjetaResumen.push(pruebaTarjeta);
	  }
	
	  isCloseReceive(event) {
		if (event != undefined) {
		  	switch (event) {
				case "generales":
				this.openGen = this.manuallyOpened;
				break;
				case "configTurnos":
				this.openConfigTurnos = this.manuallyOpened;
				break;
				case "configColaOficio":
				this.openConfigColaOficio = this.manuallyOpened;
				break;
				case "colaOficio":
				this.openColaOficio = this.manuallyOpened;
				break;
				case "guardias":
				this.openGuardias = this.manuallyOpened;
				break;
				case "colaGuardias":
				this.openColaGuardias = this.manuallyOpened;
				break;
				case "inscripciones":
				this.openInscripciones = this.manuallyOpened;
				break;
			}
		}
	  }
	
	  isOpenReceive(event) {
	
		if (event != undefined) {
		  switch (event) {
			case "generales":
			  this.openGen = true;
			  break;
			case "configTurnos":
			  this.openConfigTurnos = true;
			  break;
			case "configColaOficio":
			  this.openConfigColaOficio = true;
			  break;
			case "colaOficio":
			  this.openColaOficio = true;
			  break;
			case "guardias":
			  this.openGuardias = true;
			  break;
			case "colaGuardias":
			  this.openColaGuardias = true;
			  break;
			case "inscripciones":
			  this.openInscripciones = true;
			  break;
		  }
		}
	  }
}
