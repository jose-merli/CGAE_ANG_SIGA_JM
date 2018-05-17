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
  tmpLoginPerfil: String;
  entorno: String;
  ocultar: boolean = false;
  // value=N selected="">NO, no soy Letrado</option>
  //                   <option value=S>SÍ, soy Letrado</option>

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


    this.service.autenticate().subscribe(response => {
      if (response) {
        this.router.navigate(["/home"]);
      } else {
        this.router.navigate(["/landpage"]);
      }
    });

  }

  submit() {

    var ir = null;
    this.service.autenticate().subscribe(response => {
      if (response) {
        this.router.navigate(["/home"]);
      } else {
        this.router.navigate(["/landpage"]);
      }
    });
  }

  onChange(newValue) {
    var ir = null;
    this.form.controls['location'].setValue(newValue.value);
    this.form.controls['tmpLoginInstitucion'].setValue(newValue.value);
    this.sigaServices.getPerfil("perfiles", newValue.value).subscribe(n => {
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

  isHabilitadoEntrar() {
    if ((this.form.controls['tmpLoginPerfil'].value == "" || this.form.controls['tmpLoginPerfil'].value == undefined) ||
      (this.form.controls['tmpLoginInstitucion'].value == "" || this.form.controls['tmpLoginInstitucion'].value == undefined)) {
      this.isEntrar = true;
      return this.isEntrar;
    } else {
      this.isEntrar = false;
      return this.isEntrar;
    }
  }
}
