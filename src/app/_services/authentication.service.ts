import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { forkJoin } from "rxjs/observable/forkJoin";
import { Router } from "@angular/router";
import { SigaServices } from "./siga.service";
import { OldSigaServices } from "./oldSiga.service";
import * as jwt_decode from "jwt-decode";

@Injectable()
export class AuthenticationService {
  
  constructor(private router: Router, private sigaServices: SigaServices, private oldSigaServices: OldSigaServices) {}

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
    return this.sigaServices.getBackend("login", undefined, true);
  }

  newSigaLoginMultiple(formValues): Observable<any> {
    const reqParams = new Map();
    for (let key in formValues) {
		  reqParams.set(key, formValues[key]);
    }
    return this.sigaServices.getBackend("login", reqParams, true);
  }

  newSigaDevelopLogin(formValues): Observable<any> {
    const reqParams = new Map();
    for (let key in formValues) {
		  reqParams.set(key, formValues[key]);
    }
    return this.sigaServices.getBackend("loginDevelop", reqParams, true);
  }

  oldSigaLogin(): Observable<any> {
    return this.oldSigaServices.getBackend("login", undefined, true);
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