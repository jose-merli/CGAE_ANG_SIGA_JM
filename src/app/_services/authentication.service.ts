import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
  HttpParams,
  HttpResponseBase,
  HttpBackend
} from "@angular/common/http";
import { URLSearchParams } from "@angular/http";
import { Observable } from "rxjs";
import { forkJoin } from "rxjs/observable/forkJoin";
import { Router } from "@angular/router";
import "rxjs/add/operator/map";
import { SigaServices } from "./siga.service";
import { OldSigaServices } from "./oldSiga.service";
import { environment } from "../../environments/environment";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import * as jwt_decode from "jwt-decode";

@Injectable()
export class AuthenticationService {
  private http: HttpClient;
  private sigaServices: SigaServices;
  private oldSigaServices: OldSigaServices;

  constructor(
    private router: Router,
    handler: HttpBackend,
    sigaServices: SigaServices,
    oldSigaServices: OldSigaServices
  ) {
    this.http = new HttpClient(handler);
    this.sigaServices = sigaServices;
    this.oldSigaServices = oldSigaServices;
  }

  // url = this.globals.getBaseUrl() + "/SIGA/developmentLogin.do";
  // urlNewSiga = this.globals.getBaseUrl() + "/siga-web/login";

  logout() {
    sessionStorage.removeItem("authenticated");
    this.router.navigate(["/login"]);
  }

  isAutenticated() {
    return sessionStorage.getItem("authenticated") === "true";
  }

  isAutenticetedInOldSiga() {
    return sessionStorage.getItem("osAutenticated") === "true";
  }

  /**
   * Para obtener la institución del token
   */
  getInstitucionSession() {
    let institucion: number = null;
    if (this.isAutenticated()) {
      let jwtDecode = jwt_decode(sessionStorage.getItem("Authorization"));
      let institucion = jwtDecode["institucion"];
      return institucion;
    }
    return institucion;
  }

  newSigaLogin(): Observable<any> {
    return this.http.get(
      this.sigaServices.getNewSigaUrl() + this.sigaServices.endpoints["login"],
      { observe: "response" }
    );
  }
  newSigaLoginMultiple(formValues): Observable<any> {
    let params = "?";
    for (let key in formValues) {
      params = params + key + "=" + formValues[key] + "&";
    }
    return this.http.get(
      this.sigaServices.getNewSigaUrl() + this.sigaServices.endpoints["login"] +
      params,
      { observe: "response" }
    );
  }
  newSigaDevelopLogin(formValues): Observable<any> {
    let params = "?";
    for (let key in formValues) {
      params = params + key + "=" + formValues[key] + "&";
    }

    return this.http.get(
      this.sigaServices.getNewSigaUrl() +
      this.sigaServices.endpoints["loginDevelop"] +
      params,
      { observe: "response" }
    );
  }

  oldSigaDevelopLogin(formValues): Observable<any> {
    var formData: FormData = new FormData();
    for (let key in formValues) {
      formData.append(key, formValues[key]);
    }

    //let params = new URLSearchParams();
    let params = "?";
    for (let key in formValues) {
      //params.set(key, formValues[key]);
      params = params + key + "=" + formValues[key] + "&";
    }

    let headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded"
    });
    let options = {
      headers: headers,
      observe: "response",
      responseType: "text"
    };

    return this.http.get(
      this.oldSigaServices.getOldSigaUrl("loginDevelop") + params,
      { observe: "response", responseType: "text" }
    );
  }

  oldSigaLogin(): Observable<any> {
    let headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded"
    });
    let options = {
      headers: headers,
      observe: "response",
      responseType: "text"
    };
    return this.http.get(this.oldSigaServices.getOldSigaUrl("login"), {
      headers: headers,
      observe: "response",
      responseType: "text"
    });
  }

  autenticate(): Observable<any> {
    sessionStorage.removeItem("authenticated");
    let newSigaRquest = this.newSigaLogin();

    return forkJoin([newSigaRquest]).map(response => {
      let newSigaResponse = response[0].headers.get("Authorization");
      let newSigaResponseStatus = response[0].status;
      if (newSigaResponseStatus == 200) {
        sessionStorage.setItem("osAutenticated", "true");

        sessionStorage.setItem("authenticated", "true");
        sessionStorage.setItem("Authorization", newSigaResponse);

        return true;

      }
    });
  }

  autenticateMultiple(formValues): Observable<any> {
    sessionStorage.removeItem("authenticated");
    let newSigaRquest = this.newSigaLoginMultiple(formValues);

    return forkJoin([newSigaRquest]).map(response => {
      let newSigaResponse = response[0].headers.get("Authorization");
      let newSigaResponseStatus = response[0].status;
      if (newSigaResponseStatus == 200) {
        sessionStorage.setItem("osAutenticated", "true");

        sessionStorage.setItem("authenticated", "true");
        sessionStorage.setItem("Authorization", newSigaResponse);

        return true;

      }
    });
  }

  autenticateDevelop(formValues): Observable<any> {
    let newSigaRquest = this.newSigaDevelopLogin(formValues);

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
    );

  }

}
