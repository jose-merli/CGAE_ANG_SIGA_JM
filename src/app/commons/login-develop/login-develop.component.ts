import { Component, OnInit, HostListener } from "@angular/core";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { AuthenticationService } from "../../_services/authentication.service";
import { SigaServices } from "../../_services/siga.service";
import { Router } from "@angular/router";
import { SigaStorageService } from "../../siga-storage.service";

export enum KEY_CODE {
  ENTER = 13
}

@Component({
	selector: 'app-login-develop',
	templateUrl: './login-develop.component.html',
	styleUrls: ['./login-develop.component.scss']
})
export class LoginDevelopComponent implements OnInit {
	form: FormGroup;

	instituciones: any[];
	perfiles: any[];
	isLetrado: String;
	isEntrar: boolean = true;
	tmpLoginPerfil: String[];
	entorno: String;
	ocultar: boolean = false;
	progressSpinner: boolean = false;
	// value=N selected="">NO, no soy Letrado</option>
	//                   <option value=S>SÍ, soy Letrado</option>
	environment: string = "";
	sigaFrontVersion: string = this.localStorageService.version;
	sigaWebVersion: string = "";

	letrado: any[] = [{ label: 'No, no soy Letrado', value: 'N' }, { label: 'Sí, soy Letrado', value: 'S' }];
	constructor(
		private fb: FormBuilder,
		private service: AuthenticationService,
		private sigaServices: SigaServices,
		private router: Router,
		private localStorageService: SigaStorageService

	) { }

	ngOnInit() {
		this.sigaServices.getBackend("environmentInfo").subscribe(n => {
			this.environment = n.environment;
			//this.sigaFrontVersion = n.sigaFrontVersion;
			this.sigaWebVersion = n.sigaWebVersion;
		});
		//Modificar la version de front en cada entrega
		//this.sigaFrontVersion = '1.0.71_17';
		sessionStorage.removeItem('authenticated');
		this.ocultar = true;
		this.progressSpinner = true;
		//Comentar esto para trabajar en local
		this.sigaServices.getBackend('validaInstitucion').subscribe(
			(response) => {
				this.progressSpinner = false;
				this.ocultar = true;
			},
			(error) => {
				console.log('ERROR', error);
				if (error.status == 403) {
					let codError = error.status;

					sessionStorage.setItem('codError', codError);
					sessionStorage.setItem('descError', 'Usuario no válido o sin permisos');
					this.router.navigate(['/errorAcceso']);
					this.progressSpinner = false;
				}
				if (error.status == 500) {
					let codError = error.status;

					sessionStorage.setItem('codError', codError);
					sessionStorage.setItem('descError', 'Usuario no válido o sin permisos');
					this.router.navigate(['/errorAcceso']);
					this.progressSpinner = false;
				}
			}
		);
		//Comentar esto para trabajar en local
		this.sigaServices.getBackend('validaUsuario').subscribe(
			(response) => {
				this.progressSpinner = false;
				this.ocultar = true;
			},
			(error) => {
				console.log('ERROR', error);
				if (error.status == 403) {
					let codError = error.status;

					sessionStorage.setItem('codError', codError);
					sessionStorage.setItem('descError', 'Usuario no válido');
					this.router.navigate(['/errorAcceso']);
					this.progressSpinner = false;
				}
				if (error.status == 500) {
					let codError = error.status;

					sessionStorage.setItem('codError', codError);
					sessionStorage.setItem('descError', 'Usuario no válido');
					this.router.navigate(['/errorAcceso']);
					this.progressSpinner = false;
				}
			}
		);

		this.sigaServices.getBackend('instituciones').subscribe((n) => {
			this.instituciones = n.combooItems;

			/*creamos un labelSinTilde que guarde los labels sin caracteres especiales, para poder filtrar el dato con o sin estos caracteres*/
			this.instituciones.map((e) => {
				let accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
				let accentsOut = 'AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz';
				let i;
				let x;
				for (i = 0; i < e.label.length; i++) {
					if ((x = accents.indexOf(e.label[i])) != -1) {
						e.labelSinTilde = e.label.replace(e.label[i], accentsOut[x]);
						return e.labelSinTilde;
					}
				}
			});

			this.isLetrado = 'N';
			//Descomentar para trabajar en local
			//this.progressSpinner = false;
		});
		this.ocultar = true;
		this.form = this.fb.group({
			tmpLoginInstitucion: new FormControl(''),
			tmpLoginPerfil: new FormControl('ADG'),
			sLetrado: new FormControl('N'),
			user: new FormControl(),
			letrado: new FormControl('N'),
			location: new FormControl('2000'),
			profile: new FormControl('ADG'),
			posMenu: new FormControl(0)
		});
		//this.onChange(this.form.controls['tmpLoginInstitucion'].value);
		this.form.controls['tmpLoginInstitucion'].valueChanges.subscribe((newValue) => {
			this.form.controls['location'].setValue(newValue);
		});

		this.form.controls['tmpLoginPerfil'].valueChanges.subscribe((n) => {
			this.form.controls['profile'].setValue(n);
		});
		this.form.controls['sLetrado'].valueChanges.subscribe((n) => {
			this.form.controls['letrado'].setValue(n);
		});

		// this.form.setValue({'location': this.form.value.tmpLoginInstitucion});
	}

	submit() {
		var ir = null;
		this.progressSpinner = true;
		this.service.autenticateDevelop(this.form.value).subscribe(
			(response) => {
				if (response) {
					sessionStorage.setItem("tipoLogin", "loginDevelop");
					this.router.navigate(['/home']);
				} else {
					this.router.navigate(['/landpage']);
				}
			},
			(error) => {
				console.log('ERROR', error);
				if (error.status == 403) {
					let codError = error.status;

					sessionStorage.setItem('codError', codError);
					sessionStorage.setItem('descError', 'Usuario no válido o sin permisos');
					this.router.navigate(['/errorAcceso']);
				}
			}
		);
	}

	onChange(newValue) {
		this.tmpLoginPerfil = ['ADG'];
		var ir = null;
		this.form.controls['location'].setValue(newValue.value);
		// this.form.controls["tmpLoginInstitucion"].setValue(newValue.value);
		const reqParams = new Map();
		reqParams.set('institucion', newValue.value);
		this.sigaServices.getBackend('perfiles', reqParams).subscribe((n) => {
			this.perfiles = n.combooItems;
		});
		// this.tmpLoginPerfil = "Administrador General";
		//console.log(newValue);
		//let combo = new LoginCombo();
		//combo.setValue(newValue.id);
		//this.sigaServices.post("perfilespost", combo).subscribe(n => {
		//if (n) {
		//this.perfiles = JSON.parse(n['body']);;
		//}
		//});
	}

	@HostListener("document:keypress", ["$event"])
  	onKeyPress(event: KeyboardEvent) {
    	if (event.keyCode === KEY_CODE.ENTER) {
      		this.submit();
    	}
  	}

	isHabilitadoEntrar() {
		if (
			this.form.controls['tmpLoginPerfil'].value == '' ||
			this.form.controls['tmpLoginPerfil'].value == undefined ||
			(this.form.controls['tmpLoginInstitucion'].value == '' ||
				this.form.controls['tmpLoginInstitucion'].value == undefined)
		) {
			this.isEntrar = true;
			return this.isEntrar;
		} else {
			this.isEntrar = false;
			return this.isEntrar;
		}
	}
}
