import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
	selector: 'app-ficha-consulta',
	templateUrl: './ficha-consulta.component.html',
	styleUrls: ['./ficha-consulta.component.scss']
})
export class FichaConsultaComponent implements OnInit {
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
			},
			{
				key: 'constructor',
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
