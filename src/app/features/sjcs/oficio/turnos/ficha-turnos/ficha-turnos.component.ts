import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { TurnosItems } from '../../../../../models/sjcs/TurnosItems';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';

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
	datos: TurnosItems = new TurnosItems();
	messageShow: string;
	constructor(private route: ActivatedRoute, private sigaServices: SigaServices, private location: Location, private persistenceService: PersistenceService) { }

	ngOnInit() {
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

	modoEdicionSend(event) {
		this.modoEdicion = event.modoEdicion;
		this.idTurno = event.idTurno
	}

	backTo() {
		this.location.back();
	}
}
