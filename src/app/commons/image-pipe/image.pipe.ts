import { Pipe, PipeTransform } from "@angular/core";
//import { Http, RequestOptions, Headers, ResponseContentType } from @angular/common/http';
import {
  HttpClient,
  HttpResponse,
  HttpParams,
  HttpResponseBase,
  HttpHeaders,
  HttpBackend
} from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/switchMap";

@Pipe({ name: "image" })
export class ImagePipe implements PipeTransform {
  constructor(private http: HttpClient) {}

  transform(url: string): Observable<Blob> {
    //const options = {
    //headers: new HttpHeaders({'Authorization': sessionStorage.getItem('Authorization'), 'Content-Type': 'image/*'}),
    //responseType: "blob",
    //};
    /* tell that XHR is going to receive an image as response, so it can be then converted to blob, and also provide your token in a way that your server expects */

    return (
      this.http
        .get(url, {
          headers: new HttpHeaders({
            Authorization: sessionStorage.getItem("Authorization"),
            "Content-Type": "image/jpg"
          }),
          responseType: "blob"
        }) // specify that response should be treated as blob data
        //.map(response => response) // take the blob
        .switchMap(blob => {
          //return new observable which emits a base64 string when blob is converted to base64
          return Observable.create(observer => {
            const reader = new FileReader();
            reader.readAsDataURL(blob); // convert blob to base64
            reader.onloadend = function() {
              observer.next(reader.result); // emit the base64 string result
            };
          });
        })
    );
  }
}
