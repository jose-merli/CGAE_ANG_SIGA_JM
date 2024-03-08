import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { AuthenticationService } from "../../_services/authentication.service";
import { SigaServices } from "../../_services/siga.service";
import { Router } from "@angular/router";
import { LoginCombo } from "./login.combo";
import { ListboxModule } from "primeng/listbox";
import { ButtonModule } from "primeng/button";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  instituciones: any[];
  perfiles: any[];
  isLetrado: String;
  isEntrar: boolean = true;
  tmpLoginPerfil: String[];
  entorno: String;
  ocultar: boolean = false;
  progressSpinner: boolean = false;

  letrado: any[] = [
    { label: "No, no soy Letrado", value: "N" },
    { label: "Sí, soy Letrado", value: "S" }
  ];
  constructor(
    private fb: FormBuilder,
    private service: AuthenticationService,
    private sigaServices: SigaServices,
    private router: Router
  ) { }

  onSubmit() { }

  ngOnInit() {
        this.progressSpinner = true;
        this.service.autenticate().subscribe(
          response => {
            if (response) {
              this.progressSpinner = false;
              sessionStorage.setItem("tipoLogin", "loginDefault");
              this.router.navigate(["/home"]);
            } else {
              this.progressSpinner = false;
              this.router.navigate(["/landpage"]);
            }
          },
          err => {
            //console.log(err);
            if (err.status == 403) {
              let codError = err.status;
    
              sessionStorage.setItem("codError", codError);
              sessionStorage.setItem("descError", "Usuario no válido o sin permisos");
              this.router.navigate(["/errorAcceso"]);
              this.progressSpinner = false;
            }
             if (err.status == 500) {
              let codError = err.status;
    
              sessionStorage.setItem("codError", codError);
              sessionStorage.setItem("descError", "Usuario no válido o sin permisos");
              this.router.navigate(["/errorAcceso"]);
              this.progressSpinner = false;
            }
            this.progressSpinner = false;
          }
        );     
  }

  submit() {
    var ir = null;
    this.service.autenticate().subscribe(
      response => {
        if (response) {
          sessionStorage.setItem("tipoLogin", "loginDefault");
          this.router.navigate(["/home"]);
        } else {
          this.router.navigate(["/landpage"]);
        }
      },
      error => {
        if (error.status == 403) {
          let codError = error.status;

          sessionStorage.setItem("codError", codError);
          sessionStorage.setItem("descError", "Usuario no válido o sin permisos");
          this.router.navigate(["/errorAcceso"]);
          this.progressSpinner = false;
        }
         if (error.status == 500) {
          let codError = error.status;

          sessionStorage.setItem("codError", codError);
          sessionStorage.setItem("descError", "Se ha producido un error al procesar los datos del usuario");
          this.router.navigate(["/errorAcceso"]);
          this.progressSpinner = false;
        }
      }
    );
  }

  onChange(newValue) {
    this.tmpLoginPerfil = ["ADG"];
    var ir = null;
    this.form.controls["location"].setValue(newValue.value);
    this.form.controls["tmpLoginInstitucion"].setValue(newValue.value);
    
    const reqParams = new Map();
		reqParams.set('institucion', newValue.value);
    this.sigaServices.getBackend("perfiles", reqParams).subscribe(n => {
      this.perfiles = n.combooItems;
    });
  }

  isHabilitadoEntrar() {
    if (
      this.form.controls["tmpLoginPerfil"].value == "" ||
      this.form.controls["tmpLoginPerfil"].value == undefined ||
      (this.form.controls["tmpLoginInstitucion"].value == "" ||
        this.form.controls["tmpLoginInstitucion"].value == undefined)
    ) {
      this.isEntrar = true;
      return this.isEntrar;
    } else {
      this.isEntrar = false;
      return this.isEntrar;
    }
  }
}
