import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
	selector: 'app-ficha-consulta',
	templateUrl: './ficha-consulta.component.html',
	styleUrls: [ './ficha-consulta.component.scss' ]
})
export class FichaConsultaComponent implements OnInit {
	idModelo: string;
	fichasPosibles: any[];

	constructor(private activatedRoute: ActivatedRoute, private location: Location) {}

	ngOnInit() {
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
		this.location.back();
	}
}
