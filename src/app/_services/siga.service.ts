import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
  HttpParams,
  HttpResponseBase
} from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { Router } from "@angular/router";
import "rxjs/add/operator/map";
import { environment } from "../../environments/environment";
import { MenuItem } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ConfirmationService } from "primeng/api";

@Injectable()
export class SigaServices {
  items: MenuItem[];
  endpoints = {
    testDb: "db",
    login: "login",
    menu: "menu",
    instituciones: "instituciones",
    perfiles: "perfiles",
    diccionarios: "diccionarios",
    usuarios_rol: "usuarios/rol",
    usuarios_perfil: "usuarios/perfil",
    usuarios_search: "usuarios/search",
    usuarios_delete: "usuarios/delete"
  };

  constructor(private http: HttpClient) {}

  get(service: string): Observable<any> {
    return this.http
      .get(environment.newSigaUrl + this.endpoints[service])
      .map(response => {
        return response;
      });
  }

  getNewSigaUrl() {
    return environment.newSigaUrl;
  }

  getPerfil(service: string, institucion: string): Observable<any> {
    return this.http
      .get(
        environment.newSigaUrl +
          this.endpoints[service] +
          "?institucion=" +
          institucion
      )
      .map(response => {
        return response;
      });
  }

  post(service: string, body: any): Observable<any> {
    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    return this.http
      .post(environment.newSigaUrl + this.endpoints[service], body, {
        headers: headers,
        observe: "response",
        responseType: "text"
      })
      .map(response => {
        return response;
      });
  }
  postPaginado(service: string, param: string, body: any): Observable<any> {
    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    return this.http
      .post(environment.newSigaUrl + this.endpoints[service] + param, body, {
        headers: headers,
        observe: "response",
        responseType: "text"
      })
      .map(response => {
        return response;
      });
  }
}
