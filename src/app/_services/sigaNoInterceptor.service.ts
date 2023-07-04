import { HttpBackend, HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { endpoints_expedientes } from "../utils/endpoints_expedientes";

@Injectable()
export class SigaNoInterceptorServices {

  endpoints = {
    ...endpoints_expedientes
  };
  private httpClient: HttpClient;

  constructor(handler: HttpBackend) {
    this.httpClient = new HttpClient(handler);
  }

  getWithAuthHeader(service: string, token: string): Observable<any> {
    let headers = new HttpHeaders({
      'Authorization': token
    });
    return this.httpClient.get(service, { headers: headers }).map((response) => {
      return response;
    });
  }
  getWithAuthHeaderBLOB(service: string, token: string): Observable<any> {
    let headers = new HttpHeaders({
      'Authorization': token
    });
    return this.httpClient.get(service, { headers: headers, responseType: 'blob', observe: 'response' }).map((response) => {
      return response;
    });
  }

  getParam(service: string, body: any): Observable<any> {
    return this.httpClient.get(service + body).map((response) => {
      return response;
    });
  }
}