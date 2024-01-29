import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { Message } from 'primeng/api';
import { TranslateService } from "../translate";
import { SigaServices } from "./../../_services/siga.service";
import { CommonsService } from "../../_services/commons.service";
import { ComboItem } from "../../models/ComboItem";
import { SigaStorageService } from "../../siga-storage.service";
import { ColegiadoItem } from "../../models/ColegiadoItem";

@Component({
  selector: "app-buscador-colegiados-express",
  templateUrl: "./buscador-colegiados-express.component.html",
  styleUrls: ["./buscador-colegiados-express.component.scss"]
})
export class BuscadorColegiadosExpressComponent implements OnInit {

	msgs: Message[] = []; //Para mostrar los mensajes p-growl y dialogos de confirmacion
 
	comboColegios : ComboItem[] = [];

	clientForm = new FormGroup({
		colegioCliente: new FormControl(''),
		numeroColegiadoCliente: new FormControl(''),
		nifCifCliente: new FormControl(''),
		nombreApellidosCliente: new FormControl('')
	});
	
	idColegioCliente: string;
	idPersona: string = '';

	disableNumeroColegiado: boolean = false;
	disableNombreApellidos: boolean = true;
	isLetrado: boolean = false;

	constructor(private router: Router, private translateService: TranslateService, private sigaServices: SigaServices, private commonsService: CommonsService, private sigaStorageService: SigaStorageService) {}

	ngOnInit() {
	
		this.sigaServices.get("institucionActual").subscribe(n => {
			this.idColegioCliente = n.value;
			this.getColegios(n.value);

			if(this.sigaStorageService.isLetrado){
				this.isLetrado = true;
				this.sigaServices.get("usuario_logeado").subscribe(async n => {
					const usuario = n.usuarioLogeadoItem;
					this.searchClient(usuario[0].dni, false);
				});
			} else if (sessionStorage.getItem('abogado')) {
				let data = JSON.parse(sessionStorage.getItem('abogado'));
				if (data != undefined) {
					if(Array.isArray(data)){
						data = data[0];
						this.clientForm.get("numeroColegiadoCliente").setValue(data.numeroColegiado);
						this.clientForm.get("nombreApellidosCliente").setValue(data.apellidos + " " + data.nombre);
					} else{
						this.clientForm.get("numeroColegiadoCliente").setValue(data.numColegiado);
						this.clientForm.get("nombreApellidosCliente").setValue(data.nombre);
					}
					this.clientForm.get("nifCifCliente").setValue(data.nif);
					this.clientForm.get("nombreApellidosCliente").setValue(data.apellidos + " " + data.nombre);
					this.idPersona = data.idPersona;
				}
				sessionStorage.removeItem("abogado");
			}
		});
	}

	searchPersona(){
		if(!this.isLetrado){
			sessionStorage.setItem("origin", "newCliente");
			this.router.navigate(['/busquedaGeneral']);
		}
	}
	
	limpiarCliente(isCleanColegio: boolean) {
		if(!this.isLetrado){
			if(isCleanColegio){
				this.clientForm.get("colegioCliente").setValue(this.idColegioCliente);
			}
			this.clientForm.get("numeroColegiadoCliente").setValue('');
			this.clientForm.get("nifCifCliente").setValue('');
			this.clientForm.get("nombreApellidosCliente").setValue('');
			this.idPersona = '';
		}
	}

	onChangeColegio(colegio: ComboItem) {
		if(this.isLetrado){
			this.clientForm.get("colegioCliente").setValue(this.idColegioCliente);
		}else{
			if(colegio.value != null){
				this.disableNumeroColegiado = false;
			}else{
				this.disableNumeroColegiado = true;
				this.clientForm.get("numeroColegiadoCliente").setValue('');
			}
		}
	}

	onBlurNumeroColegiado(){
		if(!this.isLetrado){
			this.searchClient(this.clientForm.get('numeroColegiadoCliente').value, true);
		}
	}
	
	onBlurNifCif(){
		if(!this.isLetrado){
			this.searchClient(this.clientForm.get('nifCifCliente').value, false);
		}
	}

	setClienteSession(cliente: any){
		if(cliente != null && cliente != undefined){
			this.clientForm.get("colegioCliente").setValue(cliente.numeroInstitucion);
			this.clientForm.get("numeroColegiadoCliente").setValue(cliente.nColegiado);
			this.clientForm.get("nifCifCliente").setValue(cliente.nifcif);
			this.clientForm.get("nombreApellidosCliente").setValue(cliente.nombre);
			this.idPersona = cliente.idPersona;
		}
	}

	private getColegios(institucion: string) {
		this.sigaServices.getParam("busquedaCol_colegio", "?idInstitucion=2000").subscribe(
			n => {
				this.comboColegios = n.combooItems;
				this.commonsService.arregloTildesCombo(this.comboColegios);
				this.clientForm.get("colegioCliente").setValue(institucion);
			},
			err => {
				this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
			}
		);
	}
	
	private showMessage(severity, summary, msg) {
		this.msgs = [];
		this.msgs.push({
			severity: severity,
			summary: summary,
			detail: msg
		});
	}

	private searchClient(idclient: string, isNumColegiado: boolean) {

		if(idclient != ''){		

			let body = {};
			if(isNumColegiado){
				body = {
					idInstitucion: this.clientForm.get('colegioCliente').value,
					nColegiado: idclient
				};
			} else {
				body = {
					idInstitucion: this.clientForm.get('colegioCliente').value,
					nifcif: idclient
				};
			}

			this.limpiarCliente(false);

			this.sigaServices.post('busquedaColegiados_busquedaColegiadoExpress', body).subscribe(
				data => {
					let colegiados = JSON.parse(data.body);
					if (colegiados.colegiadoJGItem.length == 1) {
						this.clientForm.get("numeroColegiadoCliente").setValue(colegiados.colegiadoJGItem[0].nColegiado);
						this.clientForm.get("nifCifCliente").setValue(colegiados.colegiadoJGItem[0].nifcif);
						this.clientForm.get("nombreApellidosCliente").setValue(colegiados.colegiadoJGItem[0].nombre);
						this.idPersona = colegiados.colegiadoJGItem[0].idPersona;
					} else {
						this.showMessage("warn", this.translateService.instant("general.message.informacion"), this.translateService.instant("general.message.justificacionExpres.colegiadoNoEncontrado"));
					}
				},
				error => {
					this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
				}
			);
		} else {
			this.limpiarCliente(false);
		}
	}
}