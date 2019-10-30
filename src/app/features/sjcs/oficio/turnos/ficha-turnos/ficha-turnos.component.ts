import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
	selector: 'app-ficha-turnos',
	templateUrl: './ficha-turnos.component.html',
	styleUrls: ['./ficha-turnos.component.scss']
})
export class FichaTurnosComponent implements OnInit {
	idModelo: string;
	fichasPosibles: any[];
	filtrosConsulta;

	constructor(private activatedRoute: ActivatedRoute, private location: Location) { }

	ngOnInit() {

		if (sessionStorage.getItem("filtrosConsulta")) {
			this.filtrosConsulta = JSON.parse(sessionStorage.getItem("filtrosConsulta"));
			sessionStorage.setItem("filtrosConsultaConsulta", JSON.stringify(this.filtrosConsulta));
			sessionStorage.removeItem("filtrosConsulta");
		}

		this.fichasPosibles = [
			{
				key: 'generales',
				activa: true
			},
			{
				key: 'consultas',
				activa: false
			},
			{
				key: 'modelos',
				activa: false
			},
			{
				key: 'plantillas',
				activa: false
			}
		];
	}

	backTo() {
		let filtros = JSON.parse(sessionStorage.getItem("filtrosConsultaConsulta"));
		sessionStorage.setItem("filtrosConsulta", JSON.stringify(filtros));
		sessionStorage.removeItem("filtrosConsultaConsulta");
		this.location.back();
	}
}
