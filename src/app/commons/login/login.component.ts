import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { AuthenticationService } from "../../_services/authentication.service";
import { SigaServices } from "../../_services/siga.service";
import { Router } from "@angular/router";
import { LoginCombo } from "./login.combo";
import { ListboxModule } from "primeng/listbox";
import { ButtonModule } from "primeng/button";
import { ComboItem } from "../../../app/models/ComboItem";

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
    this.sigaServices.getBackend("entorno").subscribe(n => {
      this.entorno = n.entorno;

      if (this.entorno == "false") {
        this.sigaServices.getBackend("instituciones").subscribe(n => {
          this.instituciones = n.combooItems;
          this.isLetrado = "N";
        });
        this.ocultar = true;
        this.form = this.fb.group({
          tmpLoginInstitucion: new FormControl(""),
          tmpLoginPerfil: new FormControl("ADG"),
          sLetrado: new FormControl("N"),
          user: new FormControl(),
          letrado: new FormControl("N"),
          location: new FormControl("2000"),
          profile: new FormControl("ADG"),

          posMenu: new FormControl(0)
        });
        //this.onChange(this.form.controls['tmpLoginInstitucion'].value);
        this.form.controls[
          "tmpLoginInstitucion"
        ].valueChanges.subscribe(newValue => {
          this.form.controls["location"].setValue(newValue);
        });

        this.form.controls["tmpLoginPerfil"].valueChanges.subscribe(n => {
          this.form.controls["profile"].setValue(n);
        });
        this.form.controls["sLetrado"].valueChanges.subscribe(n => {
          this.form.controls["letrado"].setValue(n);
        });
      } else {
        this.ocultar = false;
        this.form = this.fb.group({
          tmpLoginInstitucion: new FormControl("2000"),
          tmpLoginPerfil: new FormControl("ADG"),
          sLetrado: new FormControl("N"),
          user: new FormControl(),
          letrado: new FormControl("N"),
          location: new FormControl("2000"),
          profile: new FormControl("ADG"),

          posMenu: new FormControl(0)
        });

        this.service.autenticate(this.form.value).subscribe(response => {
          if (response) {
            this.router.navigate(["/home"]);
          } else {
            this.router.navigate(["/landpage"]);
          }
        });
      }
    });

    // this.form.setValue({'location': this.form.value.tmpLoginInstitucion});
  }

  submit() {
    var ir = null;
    this.service.autenticate(this.form.value).subscribe(response => {
      if (response) {
        this.router.navigate(["/home"]);
      } else {
        this.router.navigate(["/landpage"]);
      }
    });
  }

  onChange(newValue) {
    var ir = null;
    this.form.controls["location"].setValue(newValue.value);
    this.form.controls["tmpLoginInstitucion"].setValue(newValue.value);
    this.sigaServices.getPerfil("perfiles", newValue.value).subscribe(n => {
      this.perfiles = n.combooItems;
      this.perfiles.forEach((value: ComboItem, key: number) => {
        if (value.label == "Administrador General") {
          this.form.value.tmpLoginPerfil = [];
          this.form.controls["tmpLoginPerfil"].setValue(value.value);
          // this.form.value.tmpLoginPerfil.push(value.value);
        }
      });
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
