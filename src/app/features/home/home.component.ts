import { Component, NgZone, OnInit } from '@angular/core';
import { ComboItem } from '../administracion/parametros/parametros-generales/parametros-generales.component';
import { SigaServices } from '../../_services/siga.service';
import { OldSigaServices } from '../../_services/oldSiga.service';
import { FichaColegialGeneralesItem } from './../../../app/models/FichaColegialGeneralesItem';
import {
	HttpClient,
	HttpHeaders,
	HttpEvent,
	HttpInterceptor,
	HttpHandler,
	HttpRequest,
	HttpBackend
} from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { AuthenticationService } from '../../_services/authentication.service';
import { SigaStorageService } from '../../siga-storage.service';
import { ColegiadoItem } from '../../models/ColegiadoItem';
@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
	constructor(private sigaServices: SigaServices, private oldSigaServices: OldSigaServices,private authenticationService: AuthenticationService, handler: HttpBackend, 
		private localStorageService: SigaStorageService, private  ngZone:NgZone) {
		this.http = new HttpClient(handler);
		this.oldSigaServices = oldSigaServices;
	}
	generalBody: FichaColegialGeneralesItem = new FichaColegialGeneralesItem();
	private http: HttpClient;
	ngOnInit() {
		this.ngZone.runOutsideAngular(()=>{
		this.sigaServices.get('getLetrado').subscribe(
			(data) => {
			  if (data.value == 'S') {
				this.localStorageService.isLetrado = true;
			  } else {
				this.localStorageService.isLetrado = false;
			  }
			},
			(err) => {
			  //console.log(err);
			}
		  );
		});
		this.getLetrado();
		this.getColegiadoLogeado();
		//this.getMantenerSesion();
		//this.oldSigaLogin();
		this.getDataLoggedUser();
		this.getInstitucionActual();
	}

	oldSigaLogin() {
		
		this.sigaServices.get('getTokenOldSiga').subscribe(
			token => {
				sessionStorage.setItem('AuthOldSIGA', token.valor);
				this.authenticationService.oldSigaLogin().subscribe(
					response => {
						//console.log("Login en SIGA Classique correcto");
						},
						err => {
						//console.log(err);
						}
				);
			},
			(err) => {
				sessionStorage.setItem('isLetrado', 'true');
				//console.log(err);
			}
		);
		
	}

	getLetrado() {
		let isLetrado: ComboItem;
		this.sigaServices.get('getLetrado').subscribe(
			(data) => {
				isLetrado = data;
				if (isLetrado.value == 'S') {
					sessionStorage.setItem('isLetrado', 'true');
				} else {
					sessionStorage.setItem('isLetrado', 'false');
				}
			},
			(err) => {
				sessionStorage.setItem('isLetrado', 'true');
				//console.log(err);
			}
		);
	}

	getColegiadoLogeado() {
		this.generalBody.searchLoggedUser = true;

		this.sigaServices
			.postPaginado('busquedaColegiados_searchColegiadoFicha', '?numPagina=1', this.generalBody)
			.subscribe(
				(data) => {
					let busqueda = JSON.parse(data['body']);
					if (busqueda.colegiadoItem.length > 0) {
						sessionStorage.setItem('personaBody', JSON.stringify(busqueda.colegiadoItem[0]));
						sessionStorage.setItem('esNuevoNoColegiado', JSON.stringify(false));
						sessionStorage.setItem('esColegiado', 'true');
					} else {
						sessionStorage.setItem('personaBody', JSON.stringify(this.generalBody));
						sessionStorage.setItem('esNuevoNoColegiado', JSON.stringify(true));
						sessionStorage.setItem('emptyLoadFichaColegial', 'true');
						sessionStorage.setItem('esColegiado', 'false');
					}
				},
				(err) => {
					//console.log(err);
				}
			);
	}

	getMantenerSesion() {
		setInterval(() => {
			this.oldSigaMantener().subscribe((response) => { }, (error) => { });
		}, 300000);
	}

	oldSigaMantenerSesion(): Observable<any> {
		let headers = new HttpHeaders({
			'Content-Type': 'application/x-www-form-urlencoded'
		});
		let options = { headers: headers, observe: 'response', responseType: 'text' };
		return this.http.get(this.oldSigaServices.getOldSigaUrl('mantenerSesion'), {
			headers: headers,
			observe: 'response',
			responseType: 'text'
		});
	}

	oldSigaMantener(): Observable<any> {
		let oldSigaRquest = this.oldSigaMantenerSesion();

		return forkJoin([oldSigaRquest]).map((response) => {
			let oldSigaResponse = response[0].status;
			if (oldSigaResponse == 200) {
				return true;
			}
		});
	}

	getDataLoggedUser() {
		this.sigaServices.get("usuario_logeado").subscribe(n => {
			const usuario = n.usuarioLogeadoItem;
			const colegiadoItem = new ColegiadoItem();
			colegiadoItem.nif = usuario[0].dni;
			this.sigaServices.post("busquedaColegiados_searchColegiado", colegiadoItem).subscribe(
				usr => {
					let usuarioLogado = JSON.parse(usr.body).colegiadoItem[0];
					if(usuarioLogado) {
						this.localStorageService.idPersona = usuarioLogado.idPersona;
						this.localStorageService.numColegiado = usuarioLogado.numColegiado;
					}
				});
		});
	}

	getInstitucionActual() {
		this.sigaServices.get("institucionActual").subscribe(n => { this.localStorageService.institucionActual = n.value });
	}
}
