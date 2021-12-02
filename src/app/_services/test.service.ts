// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders, HttpResponse, HttpParams, HttpResponseBase } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { Router } from '@angular/router';
// import 'rxjs/add/operator/map';
// import { Globals } from './globals.service';


// @Injectable()
// export class TestService {

//     constructor(private http: HttpClient, private globals: Globals) {
//     }

//     getTestServlet(): Observable<any> {

//         return this.http.get(this.globals.getNewSigaUrl() + "/siga-web/db")
//             .map((response) => {
//                 // //console.log(response);
//                 return response;
//             })
//     }

//     getTestServletByName(name): Observable<any> {

//         return this.http.get("http://localhost:7001/siga-cargas/db/" + name)
//             .map((response: Response) => {
//                 //console.log(response);
//                 return response;
//             })
//     }

//     getTestServletByForm(name, lastName, address): Observable<any> {

//         return this.http.get("http://localhost:7001/siga-cargas/db/" + name + "/" + lastName + "/" + address)
//             .map((response: Response) => {
//                 //console.log(response);
//                 return response;
//             })
//     }

// }