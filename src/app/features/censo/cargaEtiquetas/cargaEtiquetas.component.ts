import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service';

@Component({
	selector: 'app-cargaEtiquetas',
	templateUrl: './cargaEtiquetas.component.html',
	styleUrls: [ './cargaEtiquetas.component.scss' ]
})
export class CargaEtiquetasComponent2 {
	url;

	constructor(public sigaServices: OldSigaServices) {
		this.url = sigaServices.getOldSigaUrl('cargaEtiquetas');
	}

	ngOnInit() {}
}
