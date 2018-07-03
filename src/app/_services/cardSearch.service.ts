import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpResponse,
  HttpParams,
  HttpResponseBase,
  HttpHeaders,
  HttpBackend
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
import { RequestOptions, Headers } from "@angular/http";
import { Subject } from "rxjs/Subject";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Injectable()
export class cardService {
  items: MenuItem[];
  private menuToggled = new Subject<any>();
  menuToggled$ = this.menuToggled.asObservable();

  constructor(
    private http: HttpClient,
    handler: HttpBackend,
    private httpbackend: HttpClient
  ) {
    this.httpbackend = new HttpClient(handler);
  }

  searchNewAnnounce = new BehaviorSubject<String>(null);

  // Observable string streams
  searchNewAnnounce$ = this.searchNewAnnounce.asObservable();

  // Service message commands
  announceSearchResults(id: String) {
    this.searchNewAnnounce.next(id);
  }
}
