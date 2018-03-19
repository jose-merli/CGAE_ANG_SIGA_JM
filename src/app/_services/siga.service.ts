import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams, HttpResponseBase, HttpBackend } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map'
import { environment } from '../../environments/environment'

@Injectable()
export class SigaServices {

    endpoints = {
        testDb: "db",
        login: "login",
        menu: "menu",
        instituciones: "instituciones",
        perfiles: "perfiles",
        perfilespost: "perfilespost"

    }

    constructor(private http: HttpClient, handler: HttpBackend) {
        this.http = new HttpClient(handler);
    }

    get(service: string): Observable<any> {

        return this.http.get(environment.newSigaUrlCertificate + this.endpoints[service])
            .map((response) => {
                return response;
            })
    }

    getNewSigaUrl() {
        return environment.newSigaUrl;
    }


    getPerfil(service: string, institucion: string): Observable<any> {

        return this.http.get(environment.newSigaUrlCertificate + this.endpoints[service] + "?institucion=" + institucion)
            .map((response) => {
                return response;
            })
    }

    post(service: string, body: any): Observable<any> {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        return this.http.post(environment.newSigaUrl + this.endpoints[service], body, { headers: headers, observe: 'response', responseType: 'text' }).map((response) => {
            return response;
        })

    }

}