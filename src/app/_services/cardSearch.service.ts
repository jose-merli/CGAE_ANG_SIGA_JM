import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpBackend
} from "@angular/common/http";
import "rxjs/add/operator/map";
import { MenuItem } from "primeng/api";
import { Subject } from "rxjs/Subject";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Injectable()
export class cardService {
  items: MenuItem[];
  private menuToggled = new Subject<any>();
  menuToggled$ = this.menuToggled.asObservable();
  camposObligatorios: any = [];
  newCardValidator: any;
  newCardValidator$: any;

  constructor(
    private http: HttpClient,
    handler: HttpBackend,
    private httpbackend: HttpClient
  ) {
    this.httpbackend = new HttpClient(handler);

    this.camposObligatorios = [
      {
        cardGeneral: false,
        cardRegistral: false,
        cardNotario: false,
        cardDirecciones: false,
        cardIntegrantes: false
      }
    ];
    this.newCardValidator = new BehaviorSubject<Array<any>>(
      this.camposObligatorios
    );
    this.newCardValidator$ = this.newCardValidator.asObservable();
  }

  searchNewAnnounce = new BehaviorSubject<String>(null);

  // Observable string streams
  searchNewAnnounce$ = this.searchNewAnnounce.asObservable();

  // Service message commands
  announceSearchResults(id: String) {
    this.searchNewAnnounce.next(id);
  }

  // Service message commands
  addToArray(validation: any) {
    this.newCardValidator.next(this.camposObligatorios);
  }
}
