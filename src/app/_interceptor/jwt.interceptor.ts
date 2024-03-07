import { HttpBackend, HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { OldSigaServices } from '../_services/oldSiga.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
	
    //private oldSigaServices: OldSigaServices;
    //private http: HttpClient;
    
    constructor(handler: HttpBackend, private router: Router) {
        //this.http = new HttpClient(handler);
        //this.oldSigaServices = oldSigaServices;
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // console.log("intercepted request ... ");

        // Clone the request to add the new header.
        const authReq = req.clone({
            headers: req.headers.set('Authorization', sessionStorage.getItem('Authorization'))
        });
        //const authReq = req.clone();
        // console.log("Sending request with new header now ...");
        //Llamamos al SigaClassique para mantener la sesión

        // this.oldSigaMantener().subscribe(
        //     response => {
        //         // console.log("salida del servicio para mantener la sesion de siga Classique");
        //     },
        //     error => {
        //         if (error.status == 403) {
        //             let codError = error.status;

        //             sessionStorage.setItem("codError", codError);
        //             sessionStorage.setItem("descError", "Usuario no válido o sin permisos");
        //             this.router.navigate(["/errorAcceso"]);
        //         }
        //     }
        // );

        return next.handle(authReq).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error != undefined && error.error != undefined && error.status === 401 && error.error) {
                    //sessionStorage.clear();
                } else if (error != undefined && error.error != undefined && error.status === 403) {
                    sessionStorage.setItem("codError", error.status + "");
                    sessionStorage.setItem("descError", "Usuario no válido o sin permisos");
                    this.router.navigate(["/errorAcceso"]);
                } else if (error != undefined && error.error != undefined) {
                    sessionStorage.setItem("codError", error.status + "");
                    sessionStorage.setItem("descError", error.error);
                }
                return Observable.throw(error);
            })
        ) as any;
    }

    /*oldSigaMantenerSesion(): Observable<any> {
        let headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded'
        });
        let options = { headers: headers, observe: 'response', responseType: 'text' };
        return this.http.get(this.oldSigaServices.getOldSigaUrl('mantenerSesion'), {
            headers: headers,
            observe: 'response',
            responseType: 'text'
        });
    }

    oldSigaMantener(): Observable<any> {
        let oldSigaRquest = this.oldSigaMantenerSesion();

        return forkJoin([ oldSigaRquest ]).map((response) => {
            let oldSigaResponse = response[0].status;
            if (oldSigaResponse == 200) {
                return true;
            }
        });
    }*/
}
