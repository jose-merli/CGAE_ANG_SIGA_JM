import { HttpBackend, HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { OldSigaServices } from '../_services/oldSiga.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
	
    constructor(private router: Router) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // Clone the request to add the new header.
        const authReq = req.clone({
            headers: req.headers.set('Authorization', sessionStorage.getItem('Authorization'))
            //headers: req.headers.set('Authorization', sessionStorage.getItem('Authorization'))
            //.set("CAS-username", "30964112V")
            //.set("CAS-displayName", "Francisco")
            //.set("CAS-roles", "AC0000 Personal::AC0000 SIGA-Admin")
            //.set("CAS-defaultRole", "AC0000 Personal")
        });

        return next.handle(authReq).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error != undefined && error.error != undefined && error.status === 401 && error.error) {
                    sessionStorage.setItem("codError", error.status + "");
                    sessionStorage.setItem("descError", "El token ha expirado");
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
}
