import { Injectable, Inject } from "@angular/core";
import { Observable } from "rxjs";
import {
  Http,
  Headers,
  Response,
  URLSearchParams,
  ResponseType,
  RequestOptions
} from "@angular/http";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";

@Injectable()
export class CommonsService {
  constructor(private http: Http) {}
}
