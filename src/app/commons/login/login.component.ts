import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { AuthenticationService } from '../../_services/authentication.service'
import { Router } from '@angular/router'


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    form: FormGroup;

    constructor(private fb: FormBuilder, private service: AuthenticationService, private router: Router) { }



    onSubmit() { }

    ngOnInit() {
        this.form = this.fb.group({
            tmpLoginInstitucion: new FormControl(),
            tmpLoginPerfil: new FormControl(),
            sLetrado: new FormControl(),

            user: new FormControl(),
            letrado: new FormControl(),
            location: new FormControl(),
            profile: new FormControl(),

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
            if (response == 200) {
                this.router.navigate(['/home'])
            } else {
                this.router.navigate(['/landpage'])
            }
        })
    }




}