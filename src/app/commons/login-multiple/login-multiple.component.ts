import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { AuthenticationService } from '../../_services/authentication.service';
import { SigaServices } from '../../_services/siga.service';
import { Router } from '@angular/router';
import { LoginCombo } from './login-multiple.combo';
import { ListboxModule } from 'primeng/listbox';
import { ButtonModule } from 'primeng/button';
import { LoginMultipleItem} from '../../models/LoginMultipleItem';

@Component({
	selector: 'app-login-multiple',
	templateUrl: './login-multiple.component.html',
	styleUrls: ['./login-multiple.component.scss']
})
export class LoginMultipleComponent implements OnInit {
	form: FormGroup;

	instituciones: any[];
	perfiles: any[];
	isEntrar: boolean = true;
	//tmpLoginMPerfil: String[];
	tmpLoginRol: String[];
	body : LoginMultipleItem = new LoginMultipleItem();
	bodySearch : LoginMultipleItem = new LoginMultipleItem();
	entorno: String;
	ocultar: boolean = false;
	progressSpinner: boolean = false;
	environment: string = "";
	sigaFrontVersion: string = "";
	sigaWebVersion: string = "";

	roles: any[];
	constructor(
		private fb: FormBuilder,
		private service: AuthenticationService,
		private sigaServices: SigaServices,
		private router: Router,


	) { }

	onSubmit() { }

	ngOnInit() {
		sessionStorage.removeItem("authenticated");
		this.ocultar = true;
		this.progressSpinner = true;
		// this.sigaServices.getBackend("validaInstitucion").subscribe(
		//   response => {
		//     this.progressSpinner = false;
		//     this.ocultar = true;
		//   },
		//   error => {
		//     //console.log("ERROR", error);
		//     if (error.status == 403) {
		//       let codError = error.status;

		//       sessionStorage.setItem("codError", codError);
		//       sessionStorage.setItem("descError", "Usuario no válido o sin permisos");
		//       this.router.navigate(["/errorAcceso"]);
		//       this.progressSpinner = false;
		//     }
		//   }
		// );
		
		this.ocultar = true;

		this.sigaServices.getBackend("institucionesUsuario").subscribe(n => {
			this.instituciones = n.combooItems;

			if (n.error) {
				console.log('ERROR', n.error.message);
				sessionStorage.setItem('codError', n.error.code);
				sessionStorage.setItem('descError', n.error.message);
				this.router.navigate(['/errorAcceso']);
			} else {
				/*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
					para poder filtrar el dato con o sin estos caracteres*/
					this.instituciones.map(e => {
						let accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
						let accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
						let i;
						let x;
						for (i = 0; i < e.label.length; i++) {
							if ((x = accents.indexOf(e.label[i])) != -1) {
								e.labelSinTilde = e.label.replace(e.label[i], accentsOut[x]);
								return e.labelSinTilde;
							}
						}
					});
					//this.progressSpinner = false;
					this.form.controls["location"].setValue(this.instituciones[0].value);
					this.form.controls['tmpLoginInstitucion'].setValue(this.instituciones[0].value);
					this.onChangeInstitucion(this.instituciones[0]);
			}
		});
		this.ocultar = true;
		this.form = this.fb.group({
			tmpLoginInstitucion: new FormControl(""),
			//tmpLoginMPerfil: new FormControl(""),
			tmpLoginRol: new FormControl(""),
			user: new FormControl(),
			location: new FormControl(""),
			//profile: new FormControl(""),
			rol: new FormControl(""),
			posMenu: new FormControl(0)
		});
		
		this.form.controls["tmpLoginInstitucion"].valueChanges.subscribe(
			newValue => {
				this.form.controls["location"].setValue(newValue);
			}
		);

		this.form.controls["tmpLoginRol"].valueChanges.subscribe(n => {
			this.form.controls["rol"].setValue(n);
		});

		/*this.form.controls["tmpLoginMPerfil"].valueChanges.subscribe(n => {
			this.form.controls["profile"].setValue(n);
			this.tmpLoginMPerfil = [n];
		});*/


		// this.form.setValue({'location': this.form.value.tmpLoginInstitucion});
	}

	submit() {
		var ir = null;
		this.progressSpinner = true;
		this.service.autenticateMultiple(this.form.value).subscribe(
			(response) => {
				if (response) {
					sessionStorage.setItem("tipoLogin", "login");
					this.router.navigate(['/home']);
				} else {
					this.router.navigate(['/landpage']);
				}
			},
			(error) => {
				//console.log('ERROR', error);
				if (error.status == 403) {
					let codError = error.status;

					sessionStorage.setItem('codError', codError);
					sessionStorage.setItem('descError', 'Usuario no válido o sin permisos');
					this.router.navigate(['/errorAcceso']);
				}
			}
		);
		
	}

	onChangeInstitucion(newValue) {
		var ir = null;
		this.form.controls['location'].setValue(newValue.value);
		// this.form.controls["tmpLoginInstitucion"].setValue(newValue.value);
		const reqParams = new Map();
		reqParams.set('institucion', newValue.value);
		this.sigaServices.getBackend('rolesColegioUsuario', reqParams).subscribe((n) => {
			this.roles = n.combooItems;
			if (n.error) {
				console.log('ERROR', n.error.message);
				sessionStorage.setItem('codError', n.error.code);
				sessionStorage.setItem('descError', n.error.message);
				this.router.navigate(['/errorAcceso']);
			} else {
				this.onChangeRol(this.roles[0]);
			}
		});
	}
	onChangeRol(newValue) {
		this.form.controls['tmpLoginRol'].setValue(newValue.value);
		if(this.instituciones.length==1 && this.roles.length==1){
			this.form.controls["rol"].setValue(newValue.value);
			this.submit();
		}else{
			this.progressSpinner = false;
		}
	}


	isHabilitadoEntrar() {
		if (
			(this.form.controls['tmpLoginInstitucion'].value == '' ||
				this.form.controls['tmpLoginInstitucion'].value == undefined) ||
			(this.form.controls['tmpLoginRol'].value == '' ||
				this.form.controls['tmpLoginRol'].value == undefined)
		) {
			this.isEntrar = true;
			return this.isEntrar;
		} else {
			this.isEntrar = false;
			return this.isEntrar;
		}
	}
}
