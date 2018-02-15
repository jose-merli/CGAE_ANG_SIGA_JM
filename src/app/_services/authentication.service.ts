import { Injectable } from '@angular/core';
import { Http, Headers, Response, URLSearchParams, ResponseType, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Globals } from './globals.service';
import 'rxjs/add/operator/map'


@Injectable()
export class AuthenticationService {

    
    constructor(private http: Http, private router: Router, private globals: Globals) {
        
    }
    url = this.globals.getBaseUrl() + "/SIGA/developmentLogin.do";

    logout(){
        sessionStorage.removeItem('authenticated')
        this.router.navigate(['/login']);
    }

    isAutenticated(){
        return sessionStorage.getItem('authenticated') === 'true';
    }

    autenticate(formValues): Observable<any> {
        
        var formData: FormData = new FormData();
        for (let key in formValues){
            formData.append(key, formValues[key]);
        }

        let params = new URLSearchParams
        for (let key in formValues){
            params.set(key, formValues[key]);
        }

        let headers = new Headers({ 
            'Content-Type': 'application/x-www-form-urlencoded', 
            // 'Referer': 'https://sigademo.redabogacia.org/SIGA/html/jsp/developmentLogin/login.jsp'
        })
        let options = new RequestOptions({ headers: headers }); 
        return this.http.post(this.url, params, options)
            .map((response: Response) => {
                if (response.status == 200){
                    sessionStorage.setItem('authenticated', 'true'); 
                }
                return response.status;
                // if (response.status == 200) {

                //     let respuestaServidor = response.json();
                //     if (response.json()) {
                //         return response.json()
                //     } else {
                //         return response.text();

                //     }
                //     return respuestaServidor;

                // }
            })
    }
}