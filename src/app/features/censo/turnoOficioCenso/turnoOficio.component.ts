import { Component, OnInit, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service';
import { SigaServices } from '../../../_services/siga.service';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/platform-browser';
import { Location } from '@angular/common';
@Component({
	selector: 'app-turnoOficio',
	templateUrl: './turnoOficio.component.html',
	styleUrls: [ './turnoOficio.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class TurnoOficioComponent implements OnInit {
	@ViewChild('con') con: HTMLTableCaptionElement;
	url;
	progressSpinner: boolean = false;
	constructor(
		private oldsigaServices: OldSigaServices,
		private sigaServices: SigaServices,
		private router: Router,
		private location: Location,
		@Inject(DOCUMENT) private document: Document
	) {
		this.progressSpinner = true;
		if (sessionStorage.getItem('reload') == 'si') {
			// let us =
			//  this.sigaServices.getOldSigaUrl() +
			// "CEN_BusquedaClientes.do?modo=Editar&seleccionarTodos=&colegiado=1&avanzada=&actionModal=&verFichaLetrado=&tablaDatosDinamicosD=" +
			// sessionStorage.getItem("idPersonaFichaColegial") +
			// "%2C" +
			// sessionStorage.getItem("idInstitucionFichaColegial")  +
			// "%2CNINGUNO%2C1&filaSelD=1";
 
 			if(sessionStorage.getItem("tipollamada") == "busquedaColegiados"){
				this.url = oldsigaServices.getOldSigaUrl('busquedaColegiados');
			 }else if(sessionStorage.getItem("tipollamada") == "busquedaNoColegiado"){
				this.url = oldsigaServices.getOldSigaUrl('busquedaNoColegiados');
			 }else if(sessionStorage.getItem("tipollamada") == "fichaColegial"){
				this.url = oldsigaServices.getOldSigaUrl('fichaColegial');
			 }

			//this.url =JSON.stringify(us)
			sessionStorage.removeItem('reload');
			sessionStorage.removeItem('idPersonaFichaColegial');
			sessionStorage.removeItem('idInstitucionFichaColegial');
			sessionStorage.setItem('reload', 'no');
			setTimeout(() => {
				this.url = JSON.parse(sessionStorage.getItem('url'));
				document.getElementById('noViewContent').className = 'mainFrameWrapper2';
				document.getElementById('noViewContent').className = 'mainFrameWrapper2';
				this.router.navigate([ '/turnoOficioCenso' ]);
			}, 2000);
		} else {
			this.url = JSON.parse(sessionStorage.getItem('url'));
			sessionStorage.removeItem('url');
			sessionStorage.removeItem('idPersonaFichaColegial');
			sessionStorage.removeItem('idInstitucionFichaColegial');
			setTimeout(() => {
				this.url = JSON.parse(sessionStorage.getItem('url'));
				document.getElementById('noViewContent').className = 'mainFrameWrapper';
				this.progressSpinner = false;
			}, 2000);
		}
	}

	ngOnInit() {}
	volver() {
		this.router.navigate([ '/fichaColegial' ]);
	}
}
