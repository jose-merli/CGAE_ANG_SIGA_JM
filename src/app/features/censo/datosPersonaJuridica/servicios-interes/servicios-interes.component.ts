import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ControlAccesoDto } from '../../../../models/ControlAccesoDto';
import { SigaServices } from '../../../../_services/siga.service';
import { AuthenticationService } from '../../../../_services/authentication.service';

@Component({
	selector: 'app-servicios-interes',
	templateUrl: './servicios-interes.component.html',
	styleUrls: ['./servicios-interes.component.scss']
})
export class ServiciosInteresComponent implements OnInit {
	@ViewChild(ServiciosInteresComponent) serviciosInteresComponent: ServiciosInteresComponent;
	msgs: any[];
	idPersona: String;
	tipoSociedad: String;
	usuarioBody: any[];
	@ViewChild('table') table;
	@Input() userBody;
	@Input() openTarjeta;
	tarjeta: string;
	@Output() permisosEnlace = new EventEmitter<any>();

	constructor(
		private router: Router,
		private sigaServices: SigaServices,
		private authenticationService: AuthenticationService
	) { }

	ngOnInit() {
		this.checkAcceso();
	}

	irFacturacion() {
		let idInstitucion = this.authenticationService.getInstitucionSession();
		// let  us = this.sigaServices.getOldSigaUrl() +"SIGA/CEN_BusquedaClientes.do?noReset=true";

		// let  us = this.sigaServices.getOldSigaUrl() + "JGR_DefinirTurnosLetrado.do?granotmp="+new Date().getMilliseconds()+"&accion=ver&idInstitucionPestanha="+idInstitucion+"&idPersonaPestanha="+this.generalBody.idPersona+"";
		this.usuarioBody = JSON.parse(sessionStorage.getItem('usuarioBody'));
		if (this.usuarioBody[0] != undefined) {
			this.idPersona = this.usuarioBody[0].idPersona;
			this.tipoSociedad = this.usuarioBody[0].tipoSociedad;
		}

		let us =
			this.sigaServices.getOldSigaUrl() +
			'CEN_Facturacion.do?idInstitucion=' +
			idInstitucion +
			'&idPersona=' +
			this.idPersona +
			'&accion=editar&tipo=' +
			this.tipoSociedad +
			'&tipoAcceso=2';
		sessionStorage.setItem('url', JSON.stringify(us));
		sessionStorage.removeItem('reload');
		sessionStorage.setItem('reload', 'si');
		sessionStorage.setItem('idInstitucionFichaColegial', idInstitucion.toString());

		this.router.navigate(['/facturasSociedad']);
	}
	irAuditoria() {
		this.router.navigate(['/auditoriaUsuarios']);
		sessionStorage.setItem('tarjeta', '/fichaPersonaJuridica');
		if (sessionStorage.getItem("usuarioBody") != null) {
			let Real = JSON.parse(sessionStorage.getItem("usuarioBody"));
			sessionStorage.setItem("idPersonaReal", JSON.stringify(Real[0].idPersona));;
		}
	}
	irComunicaciones() {
		let idInstitucion = this.authenticationService.getInstitucionSession();
		// let  us = this.sigaServices.getOldSigaUrl() +"SIGA/CEN_BusquedaClientes.do?noReset=true";

		// let  us = this.sigaServices.getOldSigaUrl() + "JGR_DefinirTurnosLetrado.do?granotmp="+new Date().getMilliseconds()+"&accion=ver&idInstitucionPestanha="+idInstitucion+"&idPersonaPestanha="+this.generalBody.idPersona+"";
		this.usuarioBody = JSON.parse(sessionStorage.getItem('usuarioBody'));
		if (this.usuarioBody[0] != undefined) {
			this.idPersona = this.usuarioBody[0].idPersona;
			this.tipoSociedad = this.usuarioBody[0].tipoSociedad;
		}

		let us =
			this.sigaServices.getOldSigaUrl() +
			'CEN_Comunicaciones.do?idInstitucion=' +
			idInstitucion +
			'&idPersona=' +
			this.idPersona +
			'&accion=editar&tipo=' +
			this.tipoSociedad +
			'&tipoAcceso=2';
		sessionStorage.setItem('url', JSON.stringify(us));
		sessionStorage.removeItem('reload');
		sessionStorage.setItem('reload', 'si');
		sessionStorage.setItem('idInstitucionFichaColegial', idInstitucion.toString());

		this.router.navigate(['/comunicacionesSociedades']);
		//this.router.navigate([ '/informesGenericos' ]);
	}

	checkAcceso() {
		let controlAcceso = new ControlAccesoDto();
		controlAcceso.idProceso = '234';

		this.sigaServices.post('acces_control', controlAcceso).subscribe(
			(data) => {
				let permisos = JSON.parse(data.body);
				let permisosArray = permisos.permisoItems;
				this.tarjeta = permisosArray[0].derechoacceso;
			},
			(err) => {
				//console.log(err);
			},
			() => { 
				if(this.tarjeta == "3" || this.tarjeta == "2"){
					let permisos = "interes";
					this.permisosEnlace.emit(permisos);
				  }
			 }
		);
	}
}
