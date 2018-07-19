import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams, HttpResponseBase, HttpBackend } from '@angular/common/http';


@Component({
  selector: 'app-busqueda-colegiados',
  templateUrl: './busqueda-colegiados.component.html',
  styleUrls: ['./busqueda-colegiados.component.scss'],

})
export class BusquedaColegiadosComponent implements OnInit {
  private http: HttpClient;
  url;

  constructor(public sigaServices: OldSigaServices, handler: HttpBackend) {
    this.url = sigaServices.getOldSigaUrl("busquedaColegiados");
    this.http = new HttpClient(handler);

  }

  ngOnInit() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    })
    let options = { headers: headers, observe: 'response', responseType: 'text' }

    return this.http.get(this.sigaServices.getOldSigaUrl("loginDevelop"), { observe: 'response', responseType: "text" });
  }




}
