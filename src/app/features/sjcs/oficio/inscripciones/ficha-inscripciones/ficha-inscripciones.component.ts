import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { TurnosItems } from '../../../../../models/sjcs/TurnosItems';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { procesos_oficio } from '../../../../../permisos/procesos_oficio';
import { InscripcionesItems } from '../../../../../models/sjcs/InscripcionesItems';

@Component({
	selector: 'app-ficha-inscripciones',
	templateUrl: './ficha-inscripciones.component.html',
	styleUrls: ['./ficha-inscripciones.component.scss']
})
export class FichaInscripcionesComponent implements OnInit {
	idModelo: string;
	fichasPosibles: any[];
	filtrosConsulta;
	idPersona: string;
	turnosItem;
	progressSpinner: boolean = false;
	turnosItem2;
	modoEdicion: boolean;
	updateCombo: boolean;
	idProcedimiento;
	pesosSeleccionadosTarjeta: string;
	datos;
	datos2;
	messageShow: string;
	permisosTarjetaResumen: boolean = true;
	constructor(private route: ActivatedRoute, private sigaServices: SigaServices, private location: Location, private persistenceService: PersistenceService,private commonsService: CommonsService) { }

	ngOnInit() {
		this.commonsService.checkAcceso(procesos_oficio.tarjetaResumen)
		.then(respuesta => {
		  this.permisosTarjetaResumen = respuesta;
		  if (this.permisosTarjetaResumen != true) {
			this.permisosTarjetaResumen = false;
		  } else {
			this.permisosTarjetaResumen = true;
		  }
		}).catch(error => console.error(error));
		// this.route.queryParams
		// 	.subscribe(params => {
		// 		this.idPersona = params.idpersona
		// 		console.log(params);
		// 	});
			if (this.persistenceService.getDatos() != undefined) {
				this.datos = this.persistenceService.getDatos();
				this.modoEdicion = true;
			  } else {
				this.datos = new InscripcionesItems();
				this.modoEdicion = false;
			  }

		this.fichasPosibles = [
			{
				key: 'generales',
				activa: true
			},
			{
				key: 'inscripcion',
				activa: true
			},
			// {
			// 	key: 'configuracioncolaoficio',
			// 	activa: false
			// },
			// {
			// 	key: 'tablacolaoficio',
			// 	activa: false
			// },
			// {
			// 	key: 'tarjetaguardias',
			// 	activa: false
			// },
			// {
			// 	key: 'tablacolaguardias',
			// 	activa: false
			// },
			// {
			// 	key: 'tarjetainscripciones',
			// 	activa: true
			// },

		];
	}

	modoEdicionSend(event) {
		this.modoEdicion = event.modoEdicion;
		this.idPersona = event.idPersona
	}

	datosSend(event){
		this.datos2 = event;
	}

	backTo() {
		this.location.back();
	}
}
