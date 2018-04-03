import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { AuthenticationService } from '../../_services/authentication.service'
import { SigaServices } from '../../_services/siga.service';
import { Router } from '@angular/router'
import { LoginCombo } from './login.combo';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    form: FormGroup;

    instituciones: any[];
    perfiles: any[];

    constructor(private fb: FormBuilder, private service: AuthenticationService, private sigaServices: SigaServices, private router: Router) { }



    onSubmit() { }

    ngOnInit() {

        this.sigaServices.get("instituciones").subscribe(n => {
            this.instituciones = n.combooItems;
        });
        this.form = this.fb.group({
            tmpLoginInstitucion: new FormControl("2000"),
            tmpLoginPerfil: new FormControl("ADG"),
            sLetrado: new FormControl("N"),

            user: new FormControl(),
            letrado: new FormControl("N"),
            location: new FormControl("2000"),
            profile: new FormControl("ADG"),

            posMenu: new FormControl(0),

        });

        this.form.controls['tmpLoginInstitucion'].valueChanges.subscribe(newValue => {
            this.form.controls['location'].setValue(newValue);
        });

        this.form.controls.tmpLoginPerfil.valueChanges.subscribe(n => {
            this.form.controls['profile'].setValue(n);
        });

        this.form.controls.sLetrado.valueChanges.subscribe(n => {
            this.form.controls['letrado'].setValue(n);
        })


        // this.form.setValue({'location': this.form.value.tmpLoginInstitucion});
    }


    submit() {
        this.service.autenticate(this.form.value).subscribe(response => {
            if (response) {
                this.router.navigate(['/home'])
            } else {
                this.router.navigate(['/landpage'])
            }
        })
    }


    onChange(newValue) {
        this.sigaServices.getPerfil("perfiles", newValue.id).subscribe(n => {
            this.perfiles = n.combooItems;
        });
        //console.log(newValue);
        //let combo = new LoginCombo();
        //combo.setValue(newValue.id);
        //this.sigaServices.post("perfilespost", combo).subscribe(n => {
        //if (n) {
        //this.perfiles = JSON.parse(n['body']);;
        //}
        //});
    }


}