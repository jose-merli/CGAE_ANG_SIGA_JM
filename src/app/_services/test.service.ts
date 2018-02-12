import { Injectable } from '@angular/core';
import { Http, Headers, Response, URLSearchParams, ResponseType, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map'


@Injectable()
export class TestService {

    constructor(private http: Http) {
    }

    getTestServlet(): Observable<string> {

        return this.http.get("http://localhost:7001/sspp-cargas/db")
            .map((response: Response) => {
                console.log(response);
                if (response.ok) {
                    let respuestaServidor = response.json();
                    // if (response.json()) {
                    //     return response.json()
                    // } else {
                    //     return response.text();

                    // }
                    return respuestaServidor;

                }
            })
    }

    getTestServletByName(name): Observable<string> {

        return this.http.get("http://localhost:7001/sspp-cargas/db/" + name)
            .map((response: Response) => {
                console.log(response);
                if (response.ok) {
                    let respuestaServidor = response.json();
                    // if (response.json()) {
                    //     return response.json()
                    // } else {
                    //     return response.text();

                    // }
                    return respuestaServidor;

                }
            })
    }

    getTestServletByForm(name, lastName, address): Observable<string> {

        return this.http.get("http://localhost:7001/sspp-cargas/db/" + name + "/" + lastName + "/" + address)
            .map((response: Response) => {
                console.log(response);
                if (response.ok) {
                    let respuestaServidor = response.json();
                    // if (response.json()) {
                    //     return response.json()
                    // } else {
                    //     return response.text();

                    // }
                    return respuestaServidor;

                }
            })
    }
}