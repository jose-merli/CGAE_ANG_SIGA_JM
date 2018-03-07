import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams, HttpResponseBase } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map'
import { environment } from '../../environments/environment'

@Injectable()
export class SigaServices {

    endpoints = {
        testDb: "db",
        login: "login"
    }

    constructor(private http: HttpClient) {
    }

    get(service: string): Observable<any> {

        return this.http.get(environment.newSigaUrl + this.endpoints[service])
            .map((response) => {
                return response;
            })
    }

    getNewSigaUrl() {
        return environment.newSigaUrl;
    }

}