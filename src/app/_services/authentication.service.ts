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
        sessionStorage.removeItem('authenticated')
        this.router.navigate(['/login']);
    }

    isAutenticated() {
        return sessionStorage.getItem('authenticated') === 'true';
    }

    isAutenticetedInOldSiga() {
        return sessionStorage.getItem('osAutenticated') === 'true';
    }

    newSigaLogin(formValues): Observable<any> {
        let params = '?';
        for (let key in formValues) {
            params = params + key + '=' + formValues[key] + '&';
        }

        return this.http.get(this.sigaServices.getNewSigaUrl() + this.sigaServices.endpoints["login"] + params, { observe: 'response' });
    }

    oldSigaLogin(formValues): Observable<any> {
        var formData: FormData = new FormData();
        for (let key in formValues) {
            formData.append(key, formValues[key]);
        }

        let params = new URLSearchParams();
        for (let key in formValues) {
            params.set(key, formValues[key]);
        }

        let headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
        })
        let options = { headers: headers, observe: 'response', responseType: 'text' }
        return this.http.post(this.oldSigaServices.getOldSigaUrl("login"), params.toString(), { headers: headers, observe: 'response', responseType: 'text' })
        // .map((response) => response.status)

    }

    autenticate(formValues): Observable<any> {
        let newSigaRquest = this.newSigaLogin(formValues);
        let oldSigaRquest = this.oldSigaLogin(formValues);


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
                // if (newSigaResponse) {
                //     sessionStorage.setItem('authenticated', 'true');
                //     sessionStorage.setItem('Authorization', newSigaResponse);
                //     return true;
                // }
            }
        )

    }
}