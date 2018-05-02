import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'
import { Observable, Subscriber } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams, HttpResponseBase } from '@angular/common/http';

@Injectable()
export class OldSigaServices {

    oldServices = {
        //Censo
        busquedaSanciones: "Dispatcher.do?proceso=566",
        certificadosAca: "Dispatcher.do?proceso=130",
        comisionesCargos: "Dispatcher.do?proceso=48",
        documentacionSolicitudes: "Dispatcher.do?proceso=10",
        mantenimientoGruposFijos: "Dispatcher.do?proceso=993",
        mantenimientoMandatos: "Dispatcher.do?proceso=19",
        nuevaIncorporacion: "Dispatcher.do?proceso=47",
        busquedaColegiados: "Dispatcher.do?proceso=1",
        busquedaNoColegiados: "Dispatcher.do?proceso=2",
        solicitudesEspecificas: "Dispatcher.do?proceso=5",
        solicitudesGenericas: "Dispatcher.do?proceso=4",
        solicitudesIncorporacion: "Dispatcher.do?proceso=3",
        fichaColegial: "Dispatcher.do?proceso=12",
        busquedaLetrados: "Dispatcher.do?proceso=11",
        mantenimientoDuplicados: "Dispatcher.do?proceso=18",
        modificacionDatos: "Dispatcher.do?proceso=13",
        cargasPeriodicas: "Dispatcher.do?proceso=161",
        configurarPerfil: "Dispatcher.do?proceso=172",
        censoDocumentacion: "Dispatcher.do?proceso=10",
        gestionSubtiposCV: "Dispatcher.do?proceso=15E",

        //Certificados
        comunicacionInterprofesional: "Dispatcher.do?proceso=64",
        solicitarCompra: "Dispatcher.do?proceso=63",
        solicitudCertificados: "Dispatcher.do?proceso=60",
        gestionSolicitudes: "Dispatcher.do?proceso=61",
        mantenimientoCertificados: "Dispatcher.do?proceso=62",


        login: "developmentLogin.do"

    }

    constructor(private http: HttpClient) {
    }

    getOldSigaUrl(service: string) {
        return environment.oldSigaUrl + this.oldServices[service];
    }


    get(url: string): Observable<any> {
        let headers = new HttpHeaders({
            "X-UA-Compatible": "IE=EmulateIE7"
        });

        // let options = { headers: headers, responseType: 'blob' }
        // options.responseType = ResponseContentType.Blob;

        // return this.http.get(url, { headers: headers, responseType: 'blob' });

        return new Observable((observer: Subscriber<any>) => {
            let objectUrl: string = null;

            this.http
                .get(url, { headers: headers, responseType: 'blob' })
                .subscribe(m => {
                    objectUrl = URL.createObjectURL(m);
                    observer.next(objectUrl);
                });

            return () => {
                if (objectUrl) {
                    URL.revokeObjectURL(objectUrl);
                    objectUrl = null;
                }
            };
        });
    }

}