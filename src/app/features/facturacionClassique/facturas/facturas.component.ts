import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service';

@Component({
	selector: 'app-facturas-classique',
	templateUrl: './facturas.component.html',
	styleUrls: [ './facturas.component.scss' ]
})
export class FacturasClassiqueComponent implements OnInit {
	url;

	constructor(public sigaServices: OldSigaServices) {
		this.url = sigaServices.getOldSigaUrl('facturas');
	}

	ngOnInit() {}
}
