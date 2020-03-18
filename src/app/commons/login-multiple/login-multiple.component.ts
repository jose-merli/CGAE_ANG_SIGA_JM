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
	tmpLoginPerfil: String[];
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
		//     console.log("ERROR", error);
		//     if (error.status == 403) {
		//       let codError = error.status;

		//       sessionStorage.setItem("codError", codError);
		//       sessionStorage.setItem("descError", "Usuario no válido o sin permisos");
		//       this.router.navigate(["/errorAcceso"]);
		//       this.progressSpinner = false;
		//     }
		//   }
		// );
		this.progressSpinner = false;
		this.ocultar = true;

		this.sigaServices.getBackend("institucionesUsuario").subscribe(n => {
			this.instituciones = n.combooItems;

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


		});
		this.ocultar = true;
		this.form = this.fb.group({
			tmpLoginInstitucion: new FormControl(""),
			tmpLoginPerfil: new FormControl(""),
			tmpLoginRol: new FormControl(""),
			user: new FormControl(),
			location: new FormControl(""),
			profile: new FormControl(""),
			rol: new FormControl(""),
			posMenu: new FormControl(0)
		});
		//this.onChange(this.form.controls['tmpLoginInstitucion'].value);
		this.form.controls["tmpLoginInstitucion"].valueChanges.subscribe(
			newValue => {
				this.form.controls["location"].setValue(newValue);
			}
		);

		this.form.controls["tmpLoginRol"].valueChanges.subscribe(n => {
			this.form.controls["rol"].setValue(n);
		});

		this.form.controls["tmpLoginPerfil"].valueChanges.subscribe(n => {
			this.form.controls["profile"].setValue(n);
		});


		// this.form.setValue({'location': this.form.value.tmpLoginInstitucion});
	}

	submit() {
		var ir = null;
		this.progressSpinner = true;
		this.service.autenticateDevelop(this.form.value).subscribe(
			(response) => {
				if (response) {
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

	onChangeInstitucion(newValue) {
		var ir = null;
		this.form.controls['location'].setValue(newValue.value);
		// this.form.controls["tmpLoginInstitucion"].setValue(newValue.value);
		this.sigaServices.getPerfil('rolesColegioUsuario', newValue.value).subscribe((n) => {
			this.roles = n.combooItems;
			if(this.roles.length == 1){
				this.onChangeRol(this.roles[0]);
			}
		});
	}
	onChangeRol(newValue) {
		var ir = null;
		this.form.controls['tmpLoginRol'].setValue(newValue.value);
		
		this.body = new LoginMultipleItem();
		this.body.idInstitucion = this.form.controls['location'].value;
		this.body.rol = newValue.value;
    

		// this.form.controls["tmpLoginInstitucion"].setValue(newValue.value);
		this.sigaServices.postBackend('perfilesColegioRol',this.body).subscribe((n) => {
			var respuesta = JSON.parse(n["body"]);
			this.perfiles = respuesta.combooItems;
			this.form.controls['tmpLoginPerfil'].setValue(this.perfiles[0].value);
			//this.tmpLoginPerfil = this.perfiles[0].value;
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


	isHabilitadoEntrar() {
		if (
			this.form.controls['tmpLoginPerfil'].value == '' ||
			this.form.controls['tmpLoginPerfil'].value == undefined ||
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
