import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams, HttpResponseBase, HttpBackend } from '@angular/common/http';
import { URLSearchParams } from '@angular/http'
import { Observable } from 'rxjs';
import { forkJoin } from "rxjs/observable/forkJoin";
import { Router } from '@angular/router';
import 'rxjs/add/operator/map'
import { SigaServices } from './siga.service';
import { OldSigaServices } from './oldSiga.service';
import { environment } from '../../environments/environment'
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';


@Injectable()
export class AuthenticationService {

    private http: HttpClient;
    private sigaServices: SigaServices;
    private oldSigaServices: OldSigaServices;

    constructor(private router: Router, handler: HttpBackend, sigaServices: SigaServices, oldSigaServices: OldSigaServices) {
        this.http = new HttpClient(handler);
        this.sigaServices = sigaServices;
        this.oldSigaServices = oldSigaServices;
    }

    // url = this.globals.getBaseUrl() + "/SIGA/developmentLogin.do";
    // urlNewSiga = this.globals.getBaseUrl() + "/siga-web/login";

    logout() {
        sessionStorage.removeItem('authenticated');
        this.router.navigate(['/login']);

        //     if (sessionStorage.getItem('loginDevelop') === 'true' ) {
        //         this.router.navigate(["/loginDevelop"])
        //     }else{
        //         if (sessionStorage.getItem('loginDevelop') === '0' ) {
        //             sessionStorage.clear();
        //             this.router.navigate(["/loginDevelop"])
        //         }else{
        //         this.router.navigate(['/login']);
        //         }
        // }
    }

    isAutenticated() {
        return sessionStorage.getItem('authenticated') === 'true';
    }

    isAutenticetedInOldSiga() {
        return sessionStorage.getItem('osAutenticated') === 'true';
    }

    newSigaLogin(): Observable<any> {
        return this.http.get(this.sigaServices.getNewSigaUrl() + this.sigaServices.endpoints["login"], { observe: 'response' });
    }
    newSigaDevelopLogin(formValues): Observable<any> {
        let params = '?';
        for (let key in formValues) {
            params = params + key + '=' + formValues[key] + '&';
        }

        return this.http.get(this.sigaServices.getNewSigaUrl() + this.sigaServices.endpoints["loginDevelop"] + params, { observe: 'response' });
    }

    oldSigaDevelopLogin(formValues): Observable<any> {
        var formData: FormData = new FormData();
        for (let key in formValues) {
            formData.append(key, formValues[key]);
        }

        //let params = new URLSearchParams();
        let params = '?';
        for (let key in formValues) {
            //params.set(key, formValues[key]);
            params = params + key + '=' + formValues[key] + '&';
        }

        let headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
        })
        let options = { headers: headers, observe: 'response', responseType: 'text' }

        return this.http.get(this.oldSigaServices.getOldSigaUrl("loginDevelop") + params, { observe: 'response', responseType: "text" });

    }

    oldSigaLogin(): Observable<any> {

        let headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
        })
        let options = { headers: headers, observe: 'response', responseType: 'text' }
        return this.http.get(this.oldSigaServices.getOldSigaUrl("login"), { headers: headers, observe: 'response', responseType: 'text' })


    }


    autenticate(): Observable<any> {
        sessionStorage.removeItem("authenticated");
        let newSigaRquest = this.newSigaLogin();
        let oldSigaRquest = this.oldSigaLogin();


        return forkJoin([oldSigaRquest, newSigaRquest]).map(
            (response) => {
                let newSigaResponse = response[1].headers.get("Authorization");
                let oldSigaResponse = response[0].status;
                if (oldSigaResponse == 200) {
                    sessionStorage.setItem('osAutenticated', 'true');

                    sessionStorage.setItem('authenticated', 'true');
                    sessionStorage.setItem('Authorization', newSigaResponse);

                    return true;
                }

            }
        )
    }


    autenticateDevelop(formValues): Observable<any> {
        let newSigaRquest = this.newSigaDevelopLogin(formValues);
        //        let oldSigaRquest = this.oldSigaDevelopLogin(formValues);
        return forkJoin([newSigaRquest]).map(
            (response) => {
                let newSigaResponse = response[0].headers.get("Authorization");
                let newSigaResponseStatus = response[0].status;
                if (newSigaResponseStatus == 200) {
                    sessionStorage.setItem('osAutenticated', 'true');
                    sessionStorage.setItem('authenticated', 'true');
                    sessionStorage.setItem('Authorization', newSigaResponse);
                    return true;
                }
            }
        )

        /*return forkJoin([oldSigaRquest, newSigaRquest]).map(
            (response) => {
                let newSigaResponse = response[1].headers.get("Authorization");
                let oldSigaResponse = response[0].status;
                if (oldSigaResponse == 200) {
                    sessionStorage.setItem('osAutenticated', 'true');

                    sessionStorage.setItem('authenticated', 'true');
                    sessionStorage.setItem('Authorization', newSigaResponse);

                    return true;
                }

            }
        )*/

    }


}